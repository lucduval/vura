import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const CSV_PARSE_PROMPT = `You are a CSV parsing assistant. Analyze the provided CSV data and extract bank transactions.

Return a JSON object with:
{
  "transactions": [
    {"date": "YYYY-MM-DD", "description": "...", "amount": 123.45, "reference": "..."},
    ...
  ]
}

Rules:
- date: Convert to ISO format (YYYY-MM-DD). Handle formats like DD/MM/YYYY, YYYYMMDD, etc.
- amount: Positive for deposits/credits, negative for withdrawals/debits.
- description: The transaction narrative or payee.
- reference: Transaction reference if available, otherwise use first 20 chars of description.
- Skip header rows, totals, balances, and non-transaction rows.
- Return ONLY valid JSON, no markdown.`;

export async function POST(request: NextRequest) {
    try {
        const { csvContent, rowCount } = await request.json();

        if (!csvContent) {
            return NextResponse.json({ error: "No CSV content provided" }, { status: 400 });
        }

        console.log(`AI CSV parsing: ${rowCount || 'unknown'} rows, ${csvContent.length} chars`);

        // Limit content to prevent token overflow
        const truncatedContent = csvContent.slice(0, 15000);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective for CSV parsing
            messages: [
                {
                    role: "system",
                    content: CSV_PARSE_PROMPT,
                },
                {
                    role: "user",
                    content: `Parse this bank statement CSV and extract transactions:\n\n${truncatedContent}`,
                },
            ],
            max_tokens: 4000,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content || "{}";
        console.log("AI CSV parse result length:", content.length);

        // Safe JSON parsing
        let result;
        try {
            result = JSON.parse(content);
        } catch {
            console.error("Failed to parse AI response:", content.slice(0, 200));
            return NextResponse.json({
                error: "AI returned invalid JSON",
                transactions: [],
                count: 0
            }, { status: 400 });
        }

        const transactions = (result.transactions || []).filter(
            (t: any) => t.date && t.amount !== undefined && !isNaN(Number(t.amount))
        );

        console.log(`AI extracted ${transactions.length} transactions`);

        return NextResponse.json({
            transactions,
            count: transactions.length,
            method: "ai"
        });

    } catch (error: any) {
        console.error("AI CSV Parse Error:", error);
        return NextResponse.json({
            error: error.message || "AI parsing failed"
        }, { status: 500 });
    }
}
