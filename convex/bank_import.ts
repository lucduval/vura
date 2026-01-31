import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Bulk import transactions from CSV or PDF
export const importTransactions = mutation({
    args: {
        transactions: v.array(v.object({
            date: v.string(),
            amount: v.number(),
            description: v.string(),
            reference: v.string(),
        })),
        source: v.string(), // e.g., 'csv_upload', 'pdf_ai'
        batchId: v.string(),
    },
    handler: async (ctx, args) => {
        let importedCount = 0;

        for (const txn of args.transactions) {
            // Simple deduplication check
            // We look for a transaction with the same date, amount, and reference
            // This isn't perfect but prevents accidental double-uploads of the same CSV
            const existing = await ctx.db
                .query("bank_transactions")
                .withIndex("by_status", (q) => q.eq("status", "Unreconciled"))
                .filter((q) =>
                    q.and(
                        q.eq(q.field("date"), txn.date),
                        q.eq(q.field("amount"), txn.amount),
                        q.eq(q.field("reference"), txn.reference)
                    )
                )
                .first();

            if (!existing) {
                await ctx.db.insert("bank_transactions", {
                    date: txn.date,
                    amount: txn.amount,
                    description: txn.description,
                    reference: txn.reference,
                    status: "Unreconciled",
                    source: args.source,
                    batchId: args.batchId,
                });
                importedCount++;
            }
        }

        return { count: importedCount };
    },
});

export const undoImport = mutation({
    args: {
        batchId: v.string(),
    },
    handler: async (ctx, args) => {
        const transactions = await ctx.db
            .query("bank_transactions")
            .withIndex("by_batch", (q) => q.eq("batchId", args.batchId))
            .collect();

        for (const txn of transactions) {
            await ctx.db.delete(txn._id);
        }

        return { count: transactions.length };
    },
});

// Generate upload URL for client-side uploads
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
