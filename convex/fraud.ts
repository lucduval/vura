import { internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";

// ------------------------------------------------------------------
// INTERNAL QUERIES / MUTATIONS
// ------------------------------------------------------------------

export const checkDuplicates = internalQuery({
    args: {
        imageHash: v.string(),
        excludePaymentId: v.id("payments"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("payments")
            .withIndex("by_imageHash", (q) => q.eq("imageHash", args.imageHash))
            .first();

        if (existing && existing._id !== args.excludePaymentId) {
            return existing._id;
        }
        return null;
    },
});

function validateRules(aiExtraction: any): string[] {
    const flags: string[] = [];
    const { amount, date, reference, bankName } = aiExtraction;

    // 1. Missing Critical Fields
    if (!amount) flags.push("Missing Amount");
    if (!date) flags.push("Missing Date");
    if (!reference) flags.push("Missing Reference");

    // 2. Date Checks
    if (date) {
        const paymentDate = new Date(date);
        const now = new Date();

        // Future Date (allow small buffer for timezone)
        if (paymentDate > new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
            flags.push("Future Date Detected");
        }

        // Stale Date (> 60 days)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(now.getDate() - 60);
        if (paymentDate < sixtyDaysAgo) {
            flags.push("Date is older than 60 days");
        }
    }

    return flags;
}

export const updatePaymentWithOCR = mutation({
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
    },
    handler: async (ctx, args) => {
        const payment = await ctx.db.get(args.paymentId);
        if (!payment) return;

        // Run Rule Validation
        const ruleFlags = validateRules(args.aiExtraction);

        // Determine status update
        let newStatus = payment.verificationStatus;
        let finalRiskLevel = payment.fraudAnalysis?.riskLevel || "LOW";
        let finalFlaggedAttributes = payment.fraudAnalysis?.flaggedAttributes || [];

        if (ruleFlags.length > 0) {
            // If rules fail, we force review and bump risk
            newStatus = "Manual_Flag";
            finalRiskLevel = (["HIGH", "CRITICAL"].includes(finalRiskLevel)) ? finalRiskLevel : "MEDIUM";
            finalFlaggedAttributes = [...new Set([...finalFlaggedAttributes, ...ruleFlags])];
        } else if (newStatus === "Analyzing" || newStatus === "Pending") {
            // Logic if rules pass
            if ((args.aiExtraction.confidence ?? 0) > 80) {
                newStatus = "AI_Matched";
            } else {
                newStatus = "Manual_Flag";
            }
        }

        // Update Fraud Analysis with new Rule Flags
        const updatedFraudAnalysis = {
            ...payment.fraudAnalysis,
            riskLevel: finalRiskLevel,
            flaggedAttributes: finalFlaggedAttributes,
            explanation: payment.fraudAnalysis?.explanation + (ruleFlags.length ? ` Rules failed: ${ruleFlags.join(", ")}.` : "")
        };

        const patchData: any = {
            aiExtraction: args.aiExtraction,
            aiModel: args.aiModel,
            verificationStatus: newStatus as any,
        };

        // Only update fraudAnalysis if we actually changed something (to avoid overwriting complex overlapping types if unnecessary)
        if (ruleFlags.length > 0) {
            patchData.fraudAnalysis = {
                // Ensure we match schema shape. 
                // Note: Ideally we should strictly type this, but utilizing existing shape for safety
                riskScore: updatedFraudAnalysis.riskScore,
                riskLevel: updatedFraudAnalysis.riskLevel as any,
                flaggedAttributes: updatedFraudAnalysis.flaggedAttributes,
                explanation: updatedFraudAnalysis.explanation || "Rule validation updates.",
            };
        }

        await ctx.db.patch(args.paymentId, patchData);
    }
});

export const updatePaymentWithForensics = mutation({
    args: {
        paymentId: v.id("payments"),
        imageHash: v.string(),
        forensics: v.object({
            software: v.optional(v.string()),
            originalDate: v.optional(v.string()),
            digitizedDate: v.optional(v.string()),
            isEdited: v.boolean(),
            isScreenshot: v.boolean(),
        }),
        fraudAnalysis: v.object({
            riskScore: v.number(),
            riskLevel: v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("CRITICAL")),
            flaggedAttributes: v.array(v.string()),
            explanation: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        let status = "Analyzing";
        if (args.fraudAnalysis.riskLevel === "CRITICAL") {
            status = "Flagged_Duplicate"; // or Flagged_Fraud
        }

        await ctx.db.patch(args.paymentId, {
            imageHash: args.imageHash,
            forensics: args.forensics,
            fraudAnalysis: args.fraudAnalysis,
            verificationStatus: status as any,
        });
    },
});
