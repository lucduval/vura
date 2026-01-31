import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for transaction extraction
const EXTRACTION_PROMPT = `You are a specialized banking assistant for South African accountants.
Extract bank transactions from the provided content.

IMPORTANT: Return a compact JSON object. Keep descriptions SHORT (max 50 chars).

Return format:
{"transactions":[{"date":"YYYY-MM-DD","description":"short desc","amount":123.45,"reference":"ref"}]}

Rules:
- date: ISO 8601 format (YYYY-MM-DD). If year missing, assume 2026.
- amount: Positive for credits/deposits, negative for debits/payments.
- description: Keep SHORT, max 50 characters.
- reference: Transaction reference or first 20 chars of description.
- Skip opening/closing balances, headers, and summary rows.
- Return ONLY the JSON object, no markdown, no explanation.`;

/**
 * Clean and parse JSON response from GPT
 * Handles truncated responses and markdown code fences
 */
function safeParseJSON(content: string): { transactions: any[] } {
    if (!content) return { transactions: [] };

    // Remove markdown code fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    try {
        return JSON.parse(cleaned);
    } catch (firstError) {
        console.log("Initial JSON parse failed, attempting recovery...");

        // Try to find and extract valid transaction array
        // Look for the transactions array start
        const txnStart = cleaned.indexOf('"transactions"');
        if (txnStart === -1) {
            console.log("No transactions key found");
            return { transactions: [] };
        }

        // Find the array start
        const arrayStart = cleaned.indexOf('[', txnStart);
        if (arrayStart === -1) {
            return { transactions: [] };
        }

        // Extract transactions one by one
        const transactions: any[] = [];
        let pos = arrayStart + 1;
        let depth = 0;
        let objStart = -1;

        while (pos < cleaned.length) {
            const char = cleaned[pos];

            if (char === '{') {
                if (depth === 0) objStart = pos;
                depth++;
            } else if (char === '}') {
                depth--;
                if (depth === 0 && objStart !== -1) {
                    // Found complete object
                    const objStr = cleaned.slice(objStart, pos + 1);
                    try {
                        const txn = JSON.parse(objStr);
                        if (txn.date && txn.amount !== undefined) {
                            transactions.push(txn);
                        }
                    } catch {
                        // Skip malformed object
                    }
                    objStart = -1;
                }
            } else if (char === ']' && depth === 0) {
                break; // End of array
            }
            pos++;
        }

        console.log(`Recovered ${transactions.length} transactions from truncated response`);
        return { transactions };
    }
}

/**
 * Use GPT-4o with the PDF sent as a file
 */
async function extractWithVision(file: File): Promise<any[]> {
    try {
        // Convert file to base64 for vision API
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUrl = `data:application/pdf;base64,${base64}`;

        console.log("Sending PDF to GPT-4o Vision...");

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: EXTRACTION_PROMPT,
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract all bank transactions from this bank statement. Return compact JSON only.",
                        },
                        {
                            type: "file",
                            file: {
                                filename: file.name,
                                file_data: dataUrl,
                            },
                        } as any,
                    ],
                },
            ],
            max_tokens: 8000, // Increased for larger statements
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content || "";
        console.log("Vision extraction response length:", content.length);
        console.log("Vision extraction result:", content.slice(0, 300) + "...");

        const result = safeParseJSON(content);
        return result.transactions || [];
    } catch (error: any) {
        console.error("Vision extraction error:", error);
        throw error;
    }
}

/**
 * Extract text from PDF using pdf-parse or fallback
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // Use the PDFParse class from pdf-parse v2.x
        // Types are incomplete so we use any to work around
        const pdfParseModule = await import("pdf-parse") as any;
        const PDFParse = pdfParseModule.PDFParse;
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        const result = await parser.text();
        return (result.text || "").slice(0, 40000); // Limit to prevent token overflow
    } catch (error) {
        console.error("pdf-parse failed:", error);
        return "";
    }
}

/**
 * Extract transactions using text-based approach with GPT-4o
 */
async function extractWithText(pdfText: string): Promise<any[]> {
    // Truncate to prevent token issues
    const truncatedText = pdfText.slice(0, 30000);

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: EXTRACTION_PROMPT,
            },
            {
                role: "user",
                content: `Extract transactions from this bank statement:\n\n${truncatedText}`,
            },
        ],
        max_tokens: 8000,
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "";
    console.log("Text extraction response length:", content.length);
    console.log("Text extraction result:", content.slice(0, 300) + "...");

    const result = safeParseJSON(content);
    return result.transactions || [];
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
        }

        console.log(`Processing PDF: ${file.name}, size: ${file.size} bytes`);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let transactions: any[] = [];
        let method = "text";

        // Strategy 1: Try text extraction first
        try {
            const pdfText = await extractTextFromPDF(buffer);
            console.log(`Extracted ${pdfText.length} characters from PDF.`);

            if (pdfText.length >= 100) {
                transactions = await extractWithText(pdfText);
                method = "text";

                if (transactions.length > 0) {
                    console.log(`Text extraction successful: ${transactions.length} transactions`);
                    return NextResponse.json({
                        transactions,
                        count: transactions.length,
                        method: "text"
                    });
                }
            }
        } catch (textError) {
            console.log("Text extraction failed, will try vision:", textError);
        }

        // Strategy 2: Fall back to GPT-4o Vision for scanned/image PDFs
        console.log("Falling back to GPT-4o Vision for PDF extraction...");
        try {
            const newFile = new File([buffer], file.name, { type: "application/pdf" });
            transactions = await extractWithVision(newFile);
            method = "vision";

            if (transactions.length > 0) {
                console.log(`Vision extraction successful: ${transactions.length} transactions`);
                return NextResponse.json({
                    transactions,
                    count: transactions.length,
                    method: "vision"
                });
            }
        } catch (visionError: any) {
            console.error("Vision extraction also failed:", visionError);

            if (visionError.message?.includes("file")) {
                return NextResponse.json({
                    error: "PDF vision extraction not available. Please try a text-based PDF.",
                    details: visionError.message
                }, { status: 400 });
            }

            throw visionError;
        }

        return NextResponse.json({
            error: "Could not extract transactions from this PDF. It may be password-protected or not a bank statement.",
            transactions: [],
            count: 0
        }, { status: 400 });

    } catch (error: any) {
        console.error("PDF Parse API Error:", error);
        return NextResponse.json({
            error: error.message || "Internal server error"
        }, { status: 500 });
    }
}
