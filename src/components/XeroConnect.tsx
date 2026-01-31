"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogIn, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export function XeroConnect() {
    const getAuthUrl = useAction(api.xero_actions.getAuthUrl);
    const syncInvoices = useAction(api.xero_actions.syncInvoices);

    // Check if we have a token (assuming single user/tenant for now)
    const token = useQuery(api.xero.getAccessToken, { tokenIdentifier: "user" });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const url = await getAuthUrl({});
            window.location.href = url;
        } catch (e: any) {
            setStatus("Error: " + e.message);
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!token) return;
        setLoading(true);
        setStatus("Syncing invoices...");
        try {
            const result = await syncInvoices({ tokenIdentifier: "user" });
            setStatus(`Synced ${result.count} invoices!`);
        } catch (e: any) {
            setStatus("Sync Failed: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const isConnected = !!token;

    return (
        <Card className="border-blue-100 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-gray-50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-6 w-auto" />
                        Xero Integration
                    </CardTitle>
                    {isConnected ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Connected
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                            Not Connected
                        </Badge>
                    )}
                </div>
                <CardDescription>
                    Connect Xero to reconcile invoices automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">

                {!isConnected ? (
                    <Button
                        onClick={handleConnect}
                        disabled={loading}
                        className="w-full bg-[#13b5ea] hover:bg-[#0e8eb8] text-white font-medium"
                    >
                        {loading ? "Redirecting..." : <><LogIn className="w-4 h-4 mr-2" /> Connect to Xero</>}
                    </Button>
                ) : (
                    <div className="space-y-3">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                            <p><strong>Tenant ID:</strong> {token?.tenantId || "Loading..."}</p>
                            <p className="text-xs text-gray-400 mt-1">Expires: {new Date(token?.expiresAt || 0).toLocaleString()}</p>
                        </div>

                        <Button
                            onClick={handleSync}
                            disabled={loading}
                            variant="outline"
                            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Sync Invoices Now
                        </Button>
                    </div>
                )}

                {status && (
                    <div className={`text-sm p-2 rounded flex items-center gap-2 ${status.includes("Error") || status.includes("Failed") ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"}`}>
                        {status.includes("Error") ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {status}
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
