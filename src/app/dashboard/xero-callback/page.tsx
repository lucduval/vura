"use client";

import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function XeroCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const exchangeCode = useAction(api.xero_actions.exchangeCode);

    const [status, setStatus] = useState("Processing login...");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            setError("No authorization code found in URL");
            return;
        }

        const handleExchange = async () => {
            try {
                await exchangeCode({
                    code,
                    tokenIdentifier: "user"
                });
                setStatus("Success! Redirecting to dashboard...");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } catch (e: any) {
                setError(e.message || "Failed to exchange token");
            }
        };

        handleExchange();
    }, [searchParams, exchangeCode, router]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-blue-100">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-blue-900">Xero Connection</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-8">
                    {error ? (
                        <>
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <p className="text-red-700 font-medium text-center">{error}</p>
                        </>
                    ) : (
                        <>
                            {status.includes("Success") ? (
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            ) : (
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            )}
                            <p className="text-slate-600 font-medium">{status}</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
