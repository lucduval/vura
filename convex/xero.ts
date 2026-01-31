import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save or Update Xero OAuth Tokens
export const saveTokens = mutation({
    args: {
        tokenIdentifier: v.string(),
        accessToken: v.string(),
        refreshToken: v.string(),
        tenantId: v.optional(v.string()), // First tenant found
        expiresAt: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("xero_tokens")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                accessToken: args.accessToken,
                refreshToken: args.refreshToken,
                tenantId: args.tenantId || existing.tenantId,
                expiresAt: args.expiresAt,
            });
        } else {
            await ctx.db.insert("xero_tokens", {
                tokenIdentifier: args.tokenIdentifier,
                accessToken: args.accessToken,
                refreshToken: args.refreshToken,
                tenantId: args.tenantId,
                expiresAt: args.expiresAt,
            });
        }
    },
});

// Get Access Token (Internal use helper)
export const getAccessToken = query({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const tokenToken = await ctx.db
            .query("xero_tokens")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .first();

        return tokenToken;
    },
});

// Save Invoices from Xero
export const saveInvoices = mutation({
    args: {
        invoices: v.array(v.object({
            xeroId: v.string(),
            invoiceNumber: v.string(),
            contactName: v.string(),
            amountDue: v.number(),
            amountPaid: v.number(),
            date: v.string(),
            dueDate: v.string(),
            status: v.string(),
            currencyCode: v.string(),
        }))
    },
    handler: async (ctx, args) => {
        for (const inv of args.invoices) {
            const existing = await ctx.db
                .query("invoices")
                .withIndex("by_xeroId", (q) => q.eq("xeroId", inv.xeroId))
                .first();

            if (existing) {
                await ctx.db.patch(existing._id, inv);
            } else {
                await ctx.db.insert("invoices", inv);
            }
        }
    }
});
