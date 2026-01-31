import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users synced from Clerk
    users: defineTable({
        tokenIdentifier: v.string(), // Clerk User ID
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        currentOrgId: v.optional(v.id("organizations")),
    }).index("by_token", ["tokenIdentifier"]),

    // Organizations for multi-tenancy
    organizations: defineTable({
        name: v.string(),
        subscriptionStatus: v.string(), // 'trial', 'active', 'past_due'
        createdBy: v.string(), // Clerk User ID
    }),

    // Core Payments Table
    payments: defineTable({
        // Link to organization (optional for initial onboarding flow)
        organizationId: v.optional(v.id("organizations")),

        // Reference to file in Convex Storage
        popStorageId: v.id("_storage"),

        // Metadata from WhatsApp Webhook
        whatsappMetadata: v.object({
            messageId: v.string(),
            senderPhone: v.string(), // The customer's number
            timestamp: v.number(),
        }),

        // Data extracted by AI Agent
        // Layer 2: OCR Extraction
        aiExtraction: v.optional(v.object({
            amount: v.optional(v.number()),
            date: v.optional(v.string()),
            reference: v.optional(v.string()),
            bankName: v.optional(v.string()),
            payerName: v.optional(v.string()),
            confidence: v.optional(v.number()), // 0-100 score
        })),

        // Layer 3: Visual Analysis
        aiModel: v.optional(v.object({
            fontMismatch: v.boolean(),
            layoutIssues: v.boolean(),
            digitalEdits: v.boolean(),
            visualConfidence: v.number(), // 0-100 specifically on visual authenticity
            detectedManips: v.array(v.string()), // Specific findings e.g. "different font on amount"
        })),

        // Fraud & Forensic Data
        imageHash: v.optional(v.string()), // SHA-256 for duplicate detection

        // Layer 1: Image Forensics
        forensics: v.optional(v.object({
            software: v.optional(v.string()), // e.g. "Adobe Photoshop"
            originalDate: v.optional(v.string()), // EXIF Original Date
            digitizedDate: v.optional(v.string()), // EXIF Digitized Date
            // Flags
            isEdited: v.boolean(),
            isScreenshot: v.boolean(),
        })),

        fraudAnalysis: v.optional(v.object({
            riskScore: v.optional(v.number()), // Made optional for backward compatibility
            riskLevel: v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"), v.literal("CRITICAL")),
            flaggedAttributes: v.array(v.string()), // e.g., ["font_mismatch", "future_date", "software_edited"]
            explanation: v.string(),
        })),

        // Verification Workflow Status
        verificationStatus: v.union(
            v.literal("Pending"),       // Received, waiting for analysis
            v.literal("Analyzing"),     // currently processing
            v.literal("AI_Matched"),    // AI extracted, looks good
            v.literal("Manual_Flag"),   // AI unsure, needs human review
            v.literal("Bank_Verified"), // Matched with Bank Feed (Future)
            v.literal("Flagged_Fraud"), // High risk of fraud
            v.literal("Flagged_Duplicate") // Duplicate submission
        ),

        // Audit Fields
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_org", ["organizationId"])
        .index("by_status", ["verificationStatus"])
        .index("by_imageHash", ["imageHash"]),
    // Mock Bank Transactions (Stitch)
    bank_transactions: defineTable({
        // Source of the transaction
        source: v.optional(v.string()), // 'manual', 'csv', 'pdf', 'stitch'
        batchId: v.optional(v.string()), // For grouping uploads

        // Existing fields
        amount: v.number(), // Positive for credit (incoming)
        date: v.string(), // ISO date
        reference: v.string(),
        description: v.string(), // Raw bank statement line
        status: v.union(
            v.literal("Unreconciled"),
            v.literal("Reconciled")
        ),
        matchedPaymentId: v.optional(v.id("payments")), // Link to our system's payment
    })
        .index("by_status", ["status"])
        .index("by_batch", ["batchId"]),

    // Xero OAuth Tokens
    xero_tokens: defineTable({
        tokenIdentifier: v.string(), // Clerk User ID or Org ID
        accessToken: v.string(),
        refreshToken: v.string(),
        tenantId: v.optional(v.string()), // Xero Tenant ID (Organization)
        expiresAt: v.number(),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),

    // Xero Invoices for Reconciliation
    invoices: defineTable({
        xeroId: v.string(), // ID from Xero
        invoiceNumber: v.string(),
        contactName: v.string(),
        amountDue: v.number(),
        amountPaid: v.number(),
        date: v.string(),
        dueDate: v.string(),
        status: v.string(), // AUTHORISED, PAID, VOIDED
        currencyCode: v.string(),

        // Link to our payment if matched
        paymentId: v.optional(v.id("payments")),
    })
        .index("by_status", ["status"])
        .index("by_xeroId", ["xeroId"]),
});

