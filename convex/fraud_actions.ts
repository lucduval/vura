"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import exif from "exif-reader";
import * as crypto from "crypto";
import OpenAI from "openai";

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

function computeHash(buffer: Buffer): string {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}

function checkSoftwareSignatures(exifData: any): string[] {
    const flags: string[] = [];
    const software = exifData?.image?.Software || exifData?.exif?.Software;

    if (!software) return flags;

    const suspicionList = ["photoshop", "gimp", "pixelmator", "paint.net", "canva"];
    const lowerSoftware = software.toLowerCase();

    if (suspicionList.some((s) => lowerSoftware.includes(s))) {
        flags.push(`Edited with software: ${software}`);
    }
    return flags;
}

function checkDateConsistency(exifData: any): string[] {
    const flags: string[] = [];
    const original = exifData?.exif?.DateTimeOriginal;

    if (!original) {
        flags.push("Missing DateTimeOriginal (possible screenshot/edit)");
        return flags;
    }

    return flags;
}

// ------------------------------------------------------------------
// ACTIONS
// ------------------------------------------------------------------

export const analyzeImageForensics = action({
    args: {
        popStorageId: v.id("_storage"),
        paymentId: v.id("payments"),
    },
    handler: async (ctx, args) => {
        // 1. Get Image from Storage
        const imageUrl = await ctx.storage.getUrl(args.popStorageId);
        if (!imageUrl) {
            throw new Error("Could not find image URL");
        }

        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Compute Hash
        const imageHash = computeHash(buffer);

        // 3. Check for Duplicates (Internal Query)
        const duplicate: any = await ctx.runQuery((internal as any).fraud.checkDuplicates, {
            imageHash,
            excludePaymentId: args.paymentId,
        });

        // 4. Extract Metadata
        let metadata: any = {};
        let forensicsFlags: string[] = [];
        let softwareName: string | undefined;

        try {
            metadata = exif(buffer);
            if (metadata) {
                forensicsFlags.push(...checkSoftwareSignatures(metadata));
                forensicsFlags.push(...checkDateConsistency(metadata));
                softwareName = metadata.image?.Software || metadata.exif?.Software;
            }
        } catch (e) {
            console.log("EXIF extraction skipped or failed", e);
        }

        // Logic for flags
        if (duplicate) {
            forensicsFlags.push(`Duplicate image detected (Payment ID: ${duplicate})`);
        }

        const riskScore: number = duplicate ? 100 : (forensicsFlags.length > 0 ? 30 : 0);
        const riskLevel = riskScore > 80 ? "CRITICAL" : (riskScore > 20 ? "MEDIUM" : "LOW");

        // 5. Update Payment Record
        await ctx.runMutation((internal as any).fraud.updatePaymentWithForensics, {
            paymentId: args.paymentId,
            imageHash,
            forensics: {
                isEdited: forensicsFlags.some(f => f.includes("Edited") || f.includes("Software")),
                isScreenshot: !metadata?.exif?.Make, // Rough heuristic
                software: softwareName,
                originalDate: metadata?.exif?.DateTimeOriginal?.toISOString?.() || metadata?.exif?.DateTimeOriginal?.toString(),
                digitizedDate: metadata?.exif?.DateTimeDigitized?.toISOString?.() || metadata?.exif?.DateTimeDigitized?.toString(),
            },
            fraudAnalysis: {
                riskScore,
                riskLevel,
                flaggedAttributes: forensicsFlags,
                explanation: duplicate ? "Duplicate submission detected." : (forensicsFlags.length > 0 ? "Forensic anomalies detected." : "No forensic anomalies detected."),
            },
        });

        return { riskScore, forensicsFlags };
    },
});

export const performOCR = action({
    args: {
        popStorageId: v.id("_storage"),
        paymentId: v.id("payments"),
    },
    handler: async (ctx, args) => {
        // 1. Get Image
        const imageUrl = await ctx.storage.getUrl(args.popStorageId);
        if (!imageUrl) throw new Error("Image not found");

        // 2. Setup OpenAI
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // 3. Call GPT-4o
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a specialized banking OCR & Forensics assistant. 
                        Your job is to extract transaction details AND detect visual manipulation in Proof of Payment images.
                        Return ONLY raw JSON. No markdown formatting.
                        
                        DATA EXTRACTION:
                        - amount (number)
                        - date (ISO string YYYY-MM-DD if possible)
                        - reference (string)
                        - bankName (string)
                        - payerName (string or null)
                        - confidence (number 0-100 based on text legibility)

                        VISUAL ANALYSIS (Look for fraud):
                        - fontMismatch (boolean): Are there different fonts used for numbers/names?
                        - layoutIssues (boolean): Is text misaligned or floating?
                        - digitalEdits (boolean): Are there artifacts around text suggesting copy-paste?
                        - visualConfidence (number 0-100): How authentic does the document look?
                        - detectedManips (string array): List specific visual anomalies (e.g. "Different font on amount", "Blurry background around date").`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this payment proof for data and fraud." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageUrl,
                                    detail: "high"
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error("No content from OpenAI");

            // Clean markdown if present
            const cleanJson = content.replace(/```json\n?|```/g, "").trim();
            const extractedData = JSON.parse(cleanJson);

            // 4. Update Payment
            // Split the single JSON into the two DB fields
            const aiExtraction = {
                amount: typeof extractedData.amount === 'number' ? extractedData.amount : undefined,
                date: extractedData.date || undefined,
                reference: extractedData.reference || undefined,
                bankName: extractedData.bankName || undefined,
                payerName: extractedData.payerName || undefined,
                confidence: typeof extractedData.confidence === 'number' ? extractedData.confidence : undefined
            };

            const aiModel = {
                fontMismatch: extractedData.fontMismatch || false,
                layoutIssues: extractedData.layoutIssues || false,
                digitalEdits: extractedData.digitalEdits || false,
                visualConfidence: extractedData.visualConfidence || extractedData.confidence,
                detectedManips: extractedData.detectedManips || []
            };

            await ctx.runMutation((internal as any).fraud.updatePaymentWithOCR, {
                paymentId: args.paymentId,
                aiExtraction: aiExtraction,
                aiModel: aiModel
            });

            return extractedData;

        } catch (e) {
            console.error("OpenAI OCR Failed:", e);
            return null;
        }
    }
});
