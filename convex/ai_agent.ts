import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const internalApi = internal as any;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// NOTE: PDF parsing temporarily disabled due to Convex runtime compatibility issues.
// The pdf-parse library relies on pdfjs-dist which uses structuredClone, 
// which is not supported in Convex's serverless environment.
// TODO: Implement PDF parsing via external API or image conversion.

export const processPop = action({
    args: {
        storageId: v.id("_storage"),
        paymentId: v.id("payments"),
    },
    handler: async (ctx, args) => {
        const imageUrl = await ctx.storage.getUrl(args.storageId);
        if (!imageUrl) throw new Error("Image not found");

        console.log(`Processing POP with AI: ${imageUrl}`);

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a specialized "Forensic Document Examiner" and "Accountant".
            Your job is to:
            1. Extract transaction details from Proof of Payment (POP) images.
            2. Analyze the image for potential fraud, digital manipulation, or anomalies.

            ## Extraction Rules
            Extract the following fields:
            - amount: Transaction amount in ZAR (number).
            - date: Transaction date (ISO 8601 YYYY-MM-DD).
            - reference: Payment reference.
            - bankName: Bank name (FNB, Capitec, etc).
            - payerName: Name of the account holder/payer if available (e.g. "John Doe" or "Company Pty Ltd").
            - confidence: 0.0 to 1.0 confidence score for the extraction.

            ## Forensic Analysis Rules
            Inspect the image for:
            - **Font Mismatches**: Different fonts or sizes in the amount/date/account fields.
            - **Alignment Issues**: Text that isn't perfectly aligned with the rest of the line (indicating copy-paste).
            - **Pixelation Artifacts**: Differences in background noise around key numbers.
            - **Logical Errors**: Dates in the future, invalid bank logos, or typos in standard bank text.

            ## Output Format
            Return ONLY raw JSON with the following structure:
            {
                "amount": number | null,
                "date": string | null,
                "reference": string | null,
                "bankName": string | null,
                "payerName": string | null,
                "confidence": number,
                "fraudAnalysis": {
                    "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                    "flaggedAttributes": string[], // [ "font_mismatch", "alignment_issue", "future_date", ... ]
                    "explanation": string // Brief reason for the risk level
                }
            }

            If it is clearly NOT a proof of payment, set confidence to 0 and riskLevel to "LOW" (unless it looks like an attempted fake).`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this image for fraud and extract details." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageUrl,
                                    detail: "high"
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1000,
                response_format: { type: "json_object" },
            });

            const content = response.choices[0].message.content;
            console.log("Raw OpenAI Response:", content);

            const aiData = JSON.parse(content || "{}");
            console.log("AI Extraction Result:", aiData);

            // Update the database
            await ctx.runMutation(internalApi.payments.updateExtraction, {
                paymentId: args.paymentId,
                aiExtraction: {
                    amount: aiData.amount || 0,
                    date: aiData.date || new Date().toISOString(),
                    reference: aiData.reference || "Unknown",
                    bankName: aiData.bankName || "Unknown",
                    payerName: aiData.payerName || null,
                    confidence: aiData.confidence || 0
                },
                fraudAnalysis: aiData.fraudAnalysis || {
                    riskLevel: "LOW",
                    flaggedAttributes: [],
                    explanation: "No analysis returned"
                }
            });

        } catch (error) {
            console.error("OpenAI Error:", error);
            // Fallback update to prevent getting stuck
            await ctx.runMutation(internalApi.payments.updateExtraction, {
                paymentId: args.paymentId,
                aiExtraction: {
                    amount: 0,
                    date: new Date().toISOString(),
                    reference: "Error",
                    bankName: "Processing Failed",
                    confidence: 0
                }
            });
        }
    },
});
