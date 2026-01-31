
"use client";

import { useState } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function FraudDetectionPage() {
    const generateUploadUrl = useMutation(api.bank_import.generateUploadUrl);
    const createPayment = useMutation(api.payments.create);
    const analyzeForensics = useAction(api.fraud_actions.analyzeImageForensics);
    const performOCR = useAction(api.fraud_actions.performOCR);

    // State
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [paymentId, setPaymentId] = useState<Id<"payments"> | null>(null);

    // Live Query (Reactive)
    const payment = useQuery(api.payments.get, paymentId ? { id: paymentId } : "skip");

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        // Reset old payment if any, though usually user refreshes or we want to clear
        setPaymentId(null);

        try {
            // 1. Get Upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload File to Convex Storage
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();

            // 3. Create Payment Record (Mocking WhatsApp Data)
            const pid = await createPayment({
                popStorageId: storageId,
                whatsappMetadata: {
                    messageId: "MANUAL_" + Date.now(),
                    senderPhone: "Manual User Upload",
                    timestamp: Date.now(),
                },
            });
            setPaymentId(pid);

            // 4. Trigger Analysis (Parallel)
            // We don't need to store the return values anymore, 
            // as we are listening to the DB via useQuery
            await Promise.all([
                analyzeForensics({ popStorageId: storageId, paymentId: pid }),
                performOCR({ popStorageId: storageId, paymentId: pid })
            ]);

        } catch (e) {
            console.error("Upload failed:", e);
            alert("Upload failed. See console.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Fraud Detection & Analysis</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Manual Document Upload</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Upload a proof of payment (image) to run forensic analysis, OCR, and business rule checks.
                    </p>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
                >
                    {uploading ? "Analyzing Docs..." : "Analyze Payment Proof"}
                </button>
            </div>

            {payment && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* FORENSICS CARD */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h2 className="font-semibold text-lg mb-4">Layer 1: Forensics</h2>
                        {payment.fraudAnalysis ? (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Risk Score:</span>
                                    <span className={`font-bold ${payment.fraudAnalysis.riskScore! > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                        {payment.fraudAnalysis.riskScore}/100
                                    </span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Detailed Flags</h3>
                                    {payment.fraudAnalysis.explanation === "No forensic anomalies detected." ? (
                                        <p className="text-sm text-green-600 italic">No anomalies detected.</p>
                                    ) : (
                                        <div className="text-sm text-gray-700">
                                            {payment.fraudAnalysis.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Waiting for results...</p>
                        )}
                    </div>

                    {/* OCR CARD */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h2 className="font-semibold text-lg mb-4">Layer 2: OCR Extraction</h2>
                        {payment.aiExtraction ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-medium">{payment.aiExtraction.bankName || "N/A"}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-bold text-lg">R{payment.aiExtraction.amount}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">{payment.aiExtraction.date}</span>
                                </div>
                                <div className="flex justify-between border-b py-2">
                                    <span className="text-gray-600">Ref:</span>
                                    <span className="font-medium">{payment.aiExtraction.reference}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-600">Confidence:</span>
                                    {payment.aiExtraction.confidence !== undefined ? (
                                        <span className={`font-bold ${payment.aiExtraction.confidence > 80 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {payment.aiExtraction.confidence}%
                                        </span>
                                    ) : <span className="text-gray-400">N/A</span>}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Processing OCR...</p>
                        )}
                    </div>

                    {/* VISUAL ANALYSIS CARD (Layer 3) */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h2 className="font-semibold text-lg mb-4">Layer 3: AI Visual Analysis</h2>
                        {payment.aiModel ? (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Visual Authenticity:</span>
                                    <span className={`font-bold ${payment.aiModel.visualConfidence > 80 ? 'text-green-600' : 'text-red-600'}`}>
                                        {payment.aiModel.visualConfidence}%
                                    </span>
                                </div>

                                <div className="space-y-2 mt-2">
                                    <FlagItem label="Font Mismatch" isFlagged={payment.aiModel.fontMismatch} />
                                    <FlagItem label="Layout Issues" isFlagged={payment.aiModel.layoutIssues} />
                                    <FlagItem label="Digital Edits" isFlagged={payment.aiModel.digitalEdits} />
                                </div>

                                {payment.aiModel.detectedManips && payment.aiModel.detectedManips.length > 0 && (
                                    <div className="mt-2 pt-2 border-t text-xs text-red-600">
                                        <strong>Detected:</strong>
                                        <ul className="list-disc list-inside">
                                            {payment.aiModel.detectedManips.map((m: string, i: number) => <li key={i}>{m}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Analyzing visuals...</p>
                        )}
                    </div>

                    {/* RULE CHECK CARD (Layer 4) - Using Fraud Analysis Fields */}
                    {payment.fraudAnalysis && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h2 className="font-semibold text-lg mb-4">Layer 4: Business Rules</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-medium text-gray-900">{payment.verificationStatus}</span>
                                </div>

                                <h3 className="font-medium text-gray-700 mt-2">Active Flags:</h3>
                                {payment.fraudAnalysis.flaggedAttributes && payment.fraudAnalysis.flaggedAttributes.length > 0 ? (
                                    <ul className="list-disc list-inside text-red-600">
                                        {payment.fraudAnalysis.flaggedAttributes.map((flag: string, i: number) => (
                                            <li key={i}>{flag}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-green-600 italic">No rule violations detected.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function FlagItem({ label, isFlagged }: { label: string, isFlagged: boolean }) {
    return (
        <div className="flex justify-between items-center bg-white p-2 rounded border">
            <span className="text-gray-700">{label}</span>
            {isFlagged ? (
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">DETECTED</span>
            ) : (
                <span className="text-green-600 text-xs font-medium">Clear</span>
            )}
        </div>
    );
}
