"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle, FileSpreadsheet, FileText, Sparkles } from "lucide-react";
import Papa from "papaparse";

// Helper function to call AI CSV parsing fallback
async function parseCSVWithAI(csvContent: string): Promise<{ transactions: any[], method: string }> {
    const response = await fetch("/api/parse-csv-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "AI parsing failed");
    }

    return response.json();
}

export function BankReconciliation() {
    const importTxns = useMutation(api.bank_import.importTransactions);
    const reconcile = useMutation(api.stitch.reconcile);

    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [previewTxns, setPreviewTxns] = useState<any[]>([]);
    const [fileType, setFileType] = useState<"csv" | "pdf" | null>(null);
    const [extractionMethod, setExtractionMethod] = useState<"text" | "vision" | "ai" | "rules" | null>(null);
    const [reconcileResult, setReconcileResult] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setLoading(true);
        setStatus("Processing file...");
        setPreviewTxns([]);
        setReconcileResult(null);

        try {
            if (file.type === "application/pdf") {
                setFileType("pdf");
                setExtractionMethod(null);
                setStatus("Extracting data from PDF...");

                // Send PDF to our Next.js API route
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/parse-pdf", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Failed to parse PDF");
                }

                const result = await response.json();
                setPreviewTxns(result.transactions);
                setExtractionMethod(result.method || "text");
                const methodLabel = result.method === "vision" ? "(AI Vision)" : "(Text)";
                setStatus(`Found ${result.count} transactions ${methodLabel}`);
                setLoading(false);

            } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
                setFileType("csv");
                setStatus("Parsing CSV...");

                Papa.parse(file, {
                    header: false, // Parse without headers first to detect format
                    skipEmptyLines: true,
                    complete: async (results) => {
                        const rows = results.data as string[][];
                        console.log("CSV raw rows:", rows.length);
                        console.log("First 3 rows:", rows.slice(0, 3));

                        let txns: any[] = [];

                        // Detect Standard Bank format: rows start with HIST/OPEN and have YYYYMMDD dates
                        const isStandardBank = rows.some((row: string[]) =>
                            row[0] === 'HIST' ||
                            (row.length >= 5 && /^\d{8}$/.test(String(row[1] || '')))
                        );

                        if (isStandardBank) {
                            console.log("Detected Standard Bank format");

                            txns = rows
                                .filter((row: string[]) => row[0] === 'HIST' && row.length >= 5)
                                .map((row: string[]) => {
                                    // Standard Bank format:
                                    // [0] Type (HIST)
                                    // [1] Date (YYYYMMDD)
                                    // [2] ?? (sometimes empty or branch code)
                                    // [3] Amount
                                    // [4] Description
                                    // [5] Additional info
                                    // [6] C/D indicator (Credit/Debit)

                                    const rawDate = String(row[1] || '');
                                    const date = rawDate.length === 8
                                        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
                                        : rawDate;

                                    const amount = parseFloat(String(row[3] || '0').replace(/[,\s]/g, '')) || 0;
                                    const description = String(row[4] || '') + (row[5] ? ` ${row[5]}` : '');
                                    const reference = description.slice(0, 30);

                                    return { date, description: description.trim(), amount, reference };
                                })
                                .filter((t: any) => !isNaN(t.amount) && t.amount !== 0);
                        } else {
                            // Re-parse with headers for other bank formats
                            Papa.parse(file, {
                                header: true,
                                skipEmptyLines: true,
                                complete: async (headerResults) => {
                                    const headers = headerResults.meta.fields || [];
                                    console.log("CSV Headers found:", headers);
                                    console.log("First row sample:", headerResults.data[0]);

                                    // Helper to find column value with multiple possible names
                                    const getCol = (row: any, names: string[]) => {
                                        for (const name of names) {
                                            if (row[name] !== undefined && row[name] !== '') return row[name];
                                            const key = Object.keys(row).find(k => k.toLowerCase() === name.toLowerCase());
                                            if (key && row[key] !== undefined && row[key] !== '') return row[key];
                                        }
                                        return null;
                                    };

                                    // Parse amount - handle debit/credit columns
                                    const parseAmount = (row: any): number => {
                                        const amountStr = getCol(row, ['Amount', 'amount', 'Value', 'value', 'Total', 'total']);
                                        if (amountStr) {
                                            const cleaned = String(amountStr).replace(/[R$€£,\s]/g, '').replace(/\((.+)\)/, '-$1');
                                            return parseFloat(cleaned) || 0;
                                        }

                                        const debit = getCol(row, ['Debit', 'debit', 'Debit Amount', 'DR', 'Money Out', 'Withdrawal']);
                                        const credit = getCol(row, ['Credit', 'credit', 'Credit Amount', 'CR', 'Money In', 'Deposit']);

                                        if (debit || credit) {
                                            const debitVal = parseFloat(String(debit || '0').replace(/[R$€£,\s]/g, '')) || 0;
                                            const creditVal = parseFloat(String(credit || '0').replace(/[R$€£,\s]/g, '')) || 0;
                                            return creditVal - debitVal;
                                        }

                                        return 0;
                                    };

                                    const parsedTxns = headerResults.data.map((row: any) => {
                                        const date = getCol(row, [
                                            'Date', 'date', 'Transaction Date', 'Trans Date', 'Posted Date',
                                            'Value Date', 'Posting Date', 'TxnDate', 'TransactionDate'
                                        ]) || new Date().toISOString().split('T')[0];

                                        const description = getCol(row, [
                                            'Description', 'description', 'Narration', 'narration', 'Details',
                                            'Transaction Description', 'Particulars', 'Reference', 'Memo', 'Payee'
                                        ]) || "Unknown";

                                        const amount = parseAmount(row);

                                        const reference = getCol(row, [
                                            'Reference', 'reference', 'Ref', 'Transaction Ref', 'Trans Ref', 'ID'
                                        ]) || String(description).slice(0, 20);

                                        return { date, description, amount, reference };
                                    }).filter((t: any) => !isNaN(t.amount) && t.amount !== 0);

                                    if (parsedTxns.length === 0 && headerResults.data.length > 0) {
                                        // Fallback to AI parsing
                                        console.log("Rule-based parsing found 0 transactions, trying AI...");
                                        setStatus("Trying AI parsing...");
                                        try {
                                            const csvText = Papa.unparse(headerResults.data);
                                            const aiResult = await parseCSVWithAI(csvText);
                                            setPreviewTxns(aiResult.transactions);
                                            setExtractionMethod("ai");
                                            setStatus(`Found ${aiResult.transactions.length} transactions (AI)`);
                                        } catch (aiErr: any) {
                                            console.error("AI fallback failed:", aiErr);
                                            setStatus(`Could not parse CSV. Check column format.`);
                                        }
                                        setLoading(false);
                                        return;
                                    } else {
                                        setExtractionMethod("rules");
                                        setStatus(`Found ${parsedTxns.length} transactions in CSV.`);
                                    }

                                    setPreviewTxns(parsedTxns);
                                    setLoading(false);
                                }
                            });
                            return;
                        }

                        if (txns.length === 0 && rows.length > 0) {
                            // Fallback to AI parsing for unknown format
                            console.log("Standard Bank detection found 0 HIST rows, trying AI...");
                            setStatus("Trying AI parsing...");
                            try {
                                const csvText = rows.map(r => r.join(',')).join('\n');
                                const aiResult = await parseCSVWithAI(csvText);
                                setPreviewTxns(aiResult.transactions);
                                setExtractionMethod("ai");
                                setStatus(`Found ${aiResult.transactions.length} transactions (AI)`);
                            } catch (aiErr: any) {
                                console.error("AI fallback failed:", aiErr);
                                setStatus(`Could not parse CSV. Check column format.`);
                            }
                            setLoading(false);
                            return;
                        } else {
                            setExtractionMethod("rules");
                            setStatus(`Found ${txns.length} transactions (Standard Bank).`);
                        }

                        setPreviewTxns(txns);
                        setLoading(false);
                    },
                    error: (err) => {
                        throw new Error("CSV Parse Failed: " + err.message);
                    }
                });
                return;
            } else {
                throw new Error("Unsupported file type. Please use CSV or PDF.");
            }
        } catch (e: any) {
            console.error(e);
            setStatus(`Error: ${e.message}`);
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!previewTxns.length) return;
        setLoading(true);
        try {
            await importTxns({
                transactions: previewTxns,
                batchId: crypto.randomUUID(),
                source: fileType === "pdf" ? "pdf_ai" : "csv_upload"
            });
            setStatus(`Successfully imported ${previewTxns.length} transactions!`);
            setPreviewTxns([]);
        } catch (e: any) {
            setStatus("Import failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReconcile = async () => {
        setLoading(true);
        setStatus("Running reconciliation...");
        try {
            const res = await reconcile();
            setReconcileResult(res.matches);
            setStatus(`Reconciliation Complete. Matches: ${res.matches}`);
        } catch (e: any) {
            setStatus("Reconciliation error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-full border-blue-100 bg-white shadow-sm">
            <CardHeader className="bg-blue-50/30 pb-4">
                <CardTitle className="text-blue-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    Bank Reconciliation
                </CardTitle>
                <CardDescription>
                    Upload your bank statement (CSV or PDF) to match payments.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* Drag & Drop Zone */}
                <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv,.pdf"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="text-sm text-slate-600 animate-pulse">{status}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Click to upload statement</h3>
                            <p className="text-sm text-slate-500">Drag and drop CSV or PDF</p>
                            <p className="text-xs text-slate-400 mt-2">Supports FNB, Standard Bank, Capitec</p>
                        </div>
                    )}
                </div>

                {/* Preview / Status */}
                {previewTxns.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                {fileType === 'pdf' ? <FileText className="w-4 h-4 text-red-500" /> : <FileSpreadsheet className="w-4 h-4 text-green-500" />}
                                <span className="font-medium text-sm">Preview: {previewTxns.length} transactions</span>
                            </div>
                            <Button size="sm" onClick={handleImport} className="bg-blue-600 hover:bg-blue-700">
                                Confirm Import
                            </Button>
                        </div>
                        <div className="max-h-40 overflow-y-auto text-xs border rounded bg-white">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 sticky top-0">
                                    <tr>
                                        <th className="p-2 font-medium">Date</th>
                                        <th className="p-2 font-medium">Desc</th>
                                        <th className="p-2 font-medium text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewTxns.slice(0, 10).map((t, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                                            <td className="p-2 truncate max-w-[80px]">{t.date}</td>
                                            <td className="p-2 truncate max-w-[150px]">{t.description}</td>
                                            <td className={`p-2 text-right font-mono ${t.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                                {t.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {previewTxns.length > 10 && (
                                        <tr>
                                            <td colSpan={3} className="p-2 text-center text-slate-400 italic">
                                                ... and {previewTxns.length - 10} more
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100">
                    <Button
                        onClick={handleReconcile}
                        disabled={loading || previewTxns.length > 0}
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    >
                        {loading ? "Working..." : "⚡ Run Auto-Reconciliation"}
                    </Button>

                    {reconcileResult !== null && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-2 text-green-700 animate-in fade-in slide-in-from-bottom-2">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Successfully matched {reconcileResult} payments!</span>
                        </div>
                    )}

                    {status && !loading && reconcileResult === null && !previewTxns.length && (
                        <div className="mt-3 text-center text-sm text-slate-500">
                            {status}
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
