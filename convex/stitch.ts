import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Generate Mock Transaction
// Call this from the dashboard to simulate money arriving in the bank
export const generateMockTransaction = mutation({
    args: {
        amount: v.number(),
        reference: v.string(),
        date: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const defaultDate = new Date().toISOString().split('T')[0]; // Today YYYY-MM-DD

        await ctx.db.insert("bank_transactions", {
            amount: args.amount,
            reference: args.reference,
            date: args.date || defaultDate,
            description: `INSTANT TRF FROM: ${args.reference} / 123456`,
            status: "Unreconciled",
        });
    },
});

// 2. Reconciliation Engine (Bank & Xero)
export const reconcile = mutation({
    args: {},
    handler: async (ctx) => {
        let matchesFound = 0;

        // --- PART 1: Bank Reconciliation (Existing) ---
        // Match "Unreconciled" Bank Txns -> "AI_Matched" Payments
        const bankTxns = await ctx.db
            .query("bank_transactions")
            .withIndex("by_status", (q) => q.eq("status", "Unreconciled"))
            .collect();

        const pendingPayments = await ctx.db
            .query("payments")
            .withIndex("by_status", (q) => q.eq("verificationStatus", "AI_Matched"))
            .collect();

        for (const bankTx of bankTxns) {
            const match = pendingPayments.find(p => {
                const amountMatch = Math.abs((p.aiExtraction?.amount || 0) - bankTx.amount) < 0.01;
                // Fuzzy ref match
                const refMatch = p.aiExtraction?.reference &&
                    (bankTx.reference.includes(p.aiExtraction.reference) ||
                        p.aiExtraction.reference.includes(bankTx.reference));

                return amountMatch && refMatch;
            });

            if (match) {
                await ctx.db.patch(bankTx._id, {
                    status: "Reconciled",
                    matchedPaymentId: match._id
                });
                await ctx.db.patch(match._id, {
                    verificationStatus: "Bank_Verified",
                    updatedAt: Date.now()
                });
                matchesFound++;
            }
        }

        // --- PART 2: Xero Invoice Matching ---
        // Match "AI_Matched" or "Bank_Verified" Payments -> "AUTHORISED" Xero Invoices
        // Only run this if we have synced invoices
        const openInvoices = await ctx.db
            .query("invoices")
            .withIndex("by_status", (q) => q.eq("status", "AUTHORISED"))
            .collect();

        // We re-fetch payments that might be matched now
        const readyPayments = await ctx.db
            .query("payments")
            .filter(q => q.or(
                q.eq(q.field("verificationStatus"), "AI_Matched"),
                q.eq(q.field("verificationStatus"), "Bank_Verified")
            ))
            .collect();

        for (const payment of readyPayments) {
            // Find an invoice with same Amount and Reference
            // Note: In real world, reference matching is tricky. We assume Payment Reference contains Invoice Number.
            const invoiceMatch = openInvoices.find(inv => {
                const amountMatch = Math.abs(inv.amountDue - (payment.aiExtraction?.amount || 0)) < 0.01;

                // Check if Invoice Number is in Payment Reference (e.g. "INV-001")
                const refMatch = payment.aiExtraction?.reference &&
                    payment.aiExtraction.reference.toUpperCase().includes(inv.invoiceNumber.toUpperCase());

                return amountMatch && refMatch;
            });

            if (invoiceMatch) {
                // Link them
                await ctx.db.patch(invoiceMatch._id, {
                    paymentId: payment._id
                });

                // TODO: Trigger Xero Payment creation action here (via scheduler)
                // For now, we just link it in our DB
                matchesFound++;
            }
        }

        return { matches: matchesFound };
    },
});

export const listTransactions = query({
    handler: async (ctx) => {
        return await ctx.db.query("bank_transactions").order("desc").take(20);
    }
});
