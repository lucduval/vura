"use strict";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const XERO_SCOPES = "offline_access accounting.transactions accounting.contacts.read";

// 1. Generate Auth URL
export const getAuthUrl = action({
    args: {},
    handler: async (ctx) => {
        const clientId = process.env.XERO_CLIENT_ID;
        const redirectUri = process.env.XERO_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            throw new Error("Missing Xero Environment Variables");
        }

        const params = new URLSearchParams({
            response_type: "code",
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: XERO_SCOPES,
            state: "123", // TODO: proper state generation
        });

        return `https://login.xero.com/identity/connect/authorize?${params.toString()}`;
    },
});

// 2. Exchange Code for Tokens
export const exchangeCode = action({
    args: {
        code: v.string(),
        tokenIdentifier: v.string(), // "user" identifier
    },
    handler: async (ctx, args) => {
        const clientId = process.env.XERO_CLIENT_ID;
        const clientSecret = process.env.XERO_CLIENT_SECRET;
        const redirectUri = process.env.XERO_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) throw new Error("Missing Env Vars");

        const tokenResponse = await fetch("https://identity.xero.com/connect/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: args.code,
                redirect_uri: redirectUri,
            }),
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Xero Token Error:", data);
            throw new Error("Failed to exchange token: " + (data.error || "Unknown"));
        }

        // Get Connections (Tenants)
        const connectionsRes = await fetch("https://api.xero.com/connections", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.access_token}`
            }
        });

        const connections = await connectionsRes.json();
        const tenantId = connections[0]?.tenantId;

        if (!tenantId) throw new Error("No Xero Organization connected");

        // Save to Database
        // @ts-ignore
        await ctx.runMutation(internal.xero.saveTokens, {
            tokenIdentifier: args.tokenIdentifier,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Date.now() + (data.expires_in * 1000),
            tenantId: tenantId,
        });

        return { success: true, tenantId };
    },
});

// 3. Fetch Invoices from Xero
export const syncInvoices = action({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args): Promise<{ count: number }> => {
        // @ts-ignore
        const tokens = await ctx.runQuery(internal.xero.getAccessToken, {
            tokenIdentifier: args.tokenIdentifier
        });

        if (!tokens || !tokens.accessToken) throw new Error("No Xero connection found");

        const res = await fetch(`https://api.xero.com/api.ro/2.0/Invoices?Statuses=AUTHORISED,PAID`, {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                "Xero-tenant-id": tokens.tenantId!,
                Accept: "application/json"
            }
        });

        if (!res.ok) {
            console.error("Xero Invoice Sync Failed", await res.text());
            throw new Error("Failed to fetch invoices");
        }

        const data: any = await res.json();
        interface XeroInvoice {
            InvoiceID: string;
            InvoiceNumber: string;
            Contact: { Name: string };
            AmountDue: number;
            AmountPaid: number;
            DateString: string;
            DueDateString: string;
            Status: string;
            CurrencyCode: string;
        }

        const invoices = (data.Invoices as XeroInvoice[]).map((inv) => ({
            xeroId: inv.InvoiceID,
            invoiceNumber: inv.InvoiceNumber,
            contactName: inv.Contact.Name,
            amountDue: inv.AmountDue,
            amountPaid: inv.AmountPaid,
            date: inv.DateString, // Format: /Date(12345678)/
            dueDate: inv.DueDateString,
            status: inv.Status,
            currencyCode: inv.CurrencyCode,
        }));

        // @ts-ignore
        await ctx.runMutation(internal.xero.saveInvoices, { invoices });

        return { count: invoices.length };
    },
});
