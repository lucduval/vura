import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new payment record (Called by Webhook)
export const create = mutation({
    args: {
        whatsappMetadata: v.object({
            messageId: v.string(),
            senderPhone: v.string(),
            timestamp: v.number(),
        }),
        popStorageId: v.id("_storage"),
        imageHash: v.optional(v.string()), // Passed from http action
    },
    handler: async (ctx, args) => {
        // Check for duplicates
        let status: "Pending" | "Flagged_Duplicate" = "Pending";

        if (args.imageHash) {
            const existing = await ctx.db
                .query("payments")
                .withIndex("by_imageHash", (q) => q.eq("imageHash", args.imageHash!))
                .first();

            if (existing) {
                console.warn(`Duplicate PoP detected! Hash: ${args.imageHash}`);
                status = "Flagged_Duplicate";
            }
        }

        const paymentId = await ctx.db.insert("payments", {
            popStorageId: args.popStorageId,
            whatsappMetadata: args.whatsappMetadata,
            imageHash: args.imageHash,
            verificationStatus: status,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return paymentId;
    },
});

// Update payment with AI extraction results (Called by AI Agent)
export const updateExtraction = mutation({
    args: {
        paymentId: v.id("payments"),
        aiExtraction: v.object({
            amount: v.optional(v.number()),
            date: v.optional(v.string()),
            reference: v.optional(v.string()),
            bankName: v.optional(v.string()),
            payerName: v.optional(v.string()), // Added
            confidence: v.optional(v.number()),
        }),
        aiModel: v.optional(v.object({
            fontMismatch: v.boolean(),
            layoutIssues: v.boolean(),
            digitalEdits: v.boolean(),
            visualConfidence: v.number(),
            detectedManips: v.array(v.string()),
        })),
        fraudAnalysis: v.optional(v.object({
            riskScore: v.optional(v.number()), // Made optional for backward compatibility
            riskLevel: v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("CRITICAL")),
            flaggedAttributes: v.array(v.string()),
            explanation: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const currentPayment = await ctx.db.get(args.paymentId);
        if (!currentPayment) throw new Error("Payment not found");

        let status = currentPayment.verificationStatus;

        // Only calculate new status if it's not already flagged as Duplicate (or Bank Verified)
        // We DO overwrite if it's currently Pending or Manual_Flag, or if we want to escalate to Flagged_Fraud
        if (status !== "Flagged_Duplicate" && status !== "Bank_Verified") {
            status = "Manual_Flag";
            if (args.fraudAnalysis) {
                if (args.fraudAnalysis.riskLevel === "CRITICAL" || args.fraudAnalysis.riskLevel === "HIGH") {
                    status = "Flagged_Fraud";
                } else if ((args.aiExtraction.confidence ?? 0) > 80 && args.fraudAnalysis.riskLevel === "LOW") {
                    status = "AI_Matched";
                }
            } else {
                status = (args.aiExtraction.confidence ?? 0) > 80 ? "AI_Matched" : "Manual_Flag";
            }
        }

        await ctx.db.patch(args.paymentId, {
            aiExtraction: args.aiExtraction,
            aiModel: args.aiModel,
            fraudAnalysis: args.fraudAnalysis,
            verificationStatus: status as any,
            updatedAt: Date.now(),
        });
    },
});

// List recent payments for the Dashboard
export const listRecent = query({
    args: {},
    handler: async (ctx) => {
        // In future, filter by orgId
        return await ctx.db
            .query("payments")
            .order("desc")
            .take(20);
    },
});

export const get = query({
    args: { id: v.id("payments") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const listByCustomer = query({
    args: {},
    handler: async (ctx) => {
        const payments = await ctx.db.query("payments").collect();

        const customerMap = new Map<string, {
            phone: string;
            name: string;
            totalPaid: number;
            lastPaymentDate: number;
            paymentCount: number;
            payments: any[];
        }>();

        for (const payment of payments) {
            const phone = payment.whatsappMetadata.senderPhone;
            if (!phone) continue;

            if (!customerMap.has(phone)) {
                customerMap.set(phone, {
                    phone,
                    name: payment.aiExtraction?.payerName || payment.aiExtraction?.reference || phone,
                    totalPaid: 0,
                    lastPaymentDate: 0,
                    paymentCount: 0,
                    payments: [],
                });
            }

            const customer = customerMap.get(phone)!;

            // Update stats
            if (payment.verificationStatus === "AI_Matched" || payment.verificationStatus === "Bank_Verified") {
                customer.totalPaid += payment.aiExtraction?.amount || 0;
            }

            customer.paymentCount++;
            customer.lastPaymentDate = Math.max(customer.lastPaymentDate, payment.whatsappMetadata.timestamp);

            // Add payment to list (only needed fields for preview, but we can pass full object for now)
            customer.payments.push(payment);

            // Update name if we find a better one (e.g. payerName is present)
            if (payment.aiExtraction?.payerName && customer.name === phone) {
                customer.name = payment.aiExtraction.payerName;
            } else if (payment.aiExtraction?.payerName && customer.name === payment.aiExtraction.reference) {
                customer.name = payment.aiExtraction.payerName;
            }
        }

        return Array.from(customerMap.values()).sort((a, b) => b.lastPaymentDate - a.lastPaymentDate);
    },
});
