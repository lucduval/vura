"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, AlertCircle, Clock, LayoutDashboard, Landmark, Menu, Users, FileBarChart, FileText, Settings, ShieldAlert, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BankReconciliation } from "@/components/BankReconciliation";
import { XeroConnect } from "@/components/XeroConnect";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogoText } from "@/components/ui/logo";
import { DashboardHeader } from "@/components/DashboardHeader";
import { getAvatarColor, getInitials } from "./helpers";
import FraudDetectionPage from "./upload/page";
import { CustomersView } from "@/components/CustomersView";

export default function DashboardPage() {
    const [activeView, setActiveView] = useState<"overview" | "reconciliation" | "customers" | "reports" | "documents" | "settings" | "fraud">("overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-slate-50/50">
            {/* Sidebar Navigation */}
            <aside className="hidden w-64 flex-col border-r bg-white md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <LogoText />
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    <NavButton
                        active={activeView === "overview"}
                        onClick={() => setActiveView("overview")}
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        label="Live Overview"
                    />
                    <div className="pt-2 pb-1">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Finance</p>
                    </div>
                    <NavButton
                        active={activeView === "fraud"}
                        onClick={() => setActiveView("fraud")}
                        icon={<ShieldAlert className="w-4 h-4" />}
                        label="Fraud Detection"
                    />
                    <NavButton
                        active={activeView === "reconciliation"}
                        onClick={() => setActiveView("reconciliation")}
                        icon={<Landmark className="w-4 h-4" />}
                        label="Bank Reconciliation"
                    />
                    <NavButton
                        active={activeView === "customers"}
                        onClick={() => setActiveView("customers")}
                        icon={<Users className="w-4 h-4" />}
                        label="Customers"
                    />
                    <NavButton
                        active={activeView === "reports"}
                        onClick={() => setActiveView("reports")}
                        icon={<FileBarChart className="w-4 h-4" />}
                        label="Reports"
                    />
                    <div className="pt-2 pb-1">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</p>
                    </div>
                    <NavButton
                        active={activeView === "documents"}
                        onClick={() => setActiveView("documents")}
                        icon={<FileText className="w-4 h-4" />}
                        label="Documents"
                    />
                    <NavButton
                        active={activeView === "settings"}
                        onClick={() => setActiveView("settings")}
                        icon={<Settings className="w-4 h-4" />}
                        label="Settings"
                    />
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 w-full">
                        <UserButton showName userProfileProps={{ additionalOAuthScopes: { google: ['email', 'profile'] } }} />
                        <div className="flex-1 min-w-0">
                            {/* UserButton handles the UI, we can add extra info if needed, but it's cleaner to just let UserButton handle it or put it next to it */}
                            {/* To match the previous design, we can hide the default user button text via css or props if needed, but showName usually does a good job */}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (Only visible on small screens) */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 items-center gap-4 border-b bg-white px-6 md:hidden justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <span className="font-bold">Vura Dashboard</span>
                    </div>
                </header>

                <div className="hidden md:block">
                    <DashboardHeader />
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="flex h-16 items-center px-2 mb-4">
                                <span className="font-bold text-lg">Vura</span>
                            </div>
                            <nav className="space-y-1">
                                <NavButton
                                    active={activeView === "overview"}
                                    onClick={() => { setActiveView("overview"); setIsMobileMenuOpen(false); }}
                                    icon={<LayoutDashboard className="w-4 h-4" />}
                                    label="Live Overview"
                                />
                                <div className="pt-2 pb-1">
                                    <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Finance</p>
                                </div>
                                <NavButton
                                    active={activeView === "fraud"}
                                    onClick={() => { setActiveView("fraud"); setIsMobileMenuOpen(false); }}
                                    icon={<ShieldAlert className="w-4 h-4" />}
                                    label="Fraud Detection"
                                />
                                <NavButton
                                    active={activeView === "reconciliation"}
                                    onClick={() => { setActiveView("reconciliation"); setIsMobileMenuOpen(false); }}
                                    icon={<Landmark className="w-4 h-4" />}
                                    label="Bank Reconciliation"
                                />
                                <NavButton
                                    active={activeView === "customers"}
                                    onClick={() => { setActiveView("customers"); setIsMobileMenuOpen(false); }}
                                    icon={<Users className="w-4 h-4" />}
                                    label="Customers"
                                />
                                <NavButton
                                    active={activeView === "reports"}
                                    onClick={() => { setActiveView("reports"); setIsMobileMenuOpen(false); }}
                                    icon={<FileBarChart className="w-4 h-4" />}
                                    label="Reports"
                                />
                                <div className="pt-2 pb-1">
                                    <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</p>
                                </div>
                                <NavButton
                                    active={activeView === "documents"}
                                    onClick={() => { setActiveView("documents"); setIsMobileMenuOpen(false); }}
                                    icon={<FileText className="w-4 h-4" />}
                                    label="Documents"
                                />
                                <NavButton
                                    active={activeView === "settings"}
                                    onClick={() => { setActiveView("settings"); setIsMobileMenuOpen(false); }}
                                    icon={<Settings className="w-4 h-4" />}
                                    label="Settings"
                                />
                            </nav>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="mx-auto max-w-6xl space-y-6">

                        {activeView === "overview" && <OverviewView />}
                        {activeView === "fraud" && <FraudDetectionPage />}
                        {activeView === "reconciliation" && <ReconciliationView />}
                        {activeView === "customers" && <CustomersView />}
                        {activeView === "reports" && <PlaceholderView title="Reports" icon={<FileBarChart className="w-12 h-12 mb-4 text-blue-100" />} />}
                        {activeView === "documents" && <PlaceholderView title="Documents" icon={<FileText className="w-12 h-12 mb-4 text-blue-100" />} />}
                        {activeView === "settings" && <PlaceholderView title="Settings" icon={<Settings className="w-12 h-12 mb-4 text-blue-100" />} />}

                    </div>
                </main>
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${active
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function OverviewView() {
    const payments = useQuery(api.payments.listRecent);

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = payments?.reduce(
        (acc, payment) => {
            // Volume
            const paymentDate = new Date(payment.whatsappMetadata.timestamp);
            if (paymentDate >= today) {
                acc.todayVolume += payment.aiExtraction?.amount || 0;
            }

            // Status counts
            if (payment.verificationStatus === "AI_Matched" || payment.verificationStatus === "Bank_Verified") {
                acc.verifiedCount++;
            } else {
                // All other statuses (Pending, Manual_Flag, Flagged_Duplicate, Flagged_Fraud) count as pending
                acc.pendingCount++;
            }

            return acc;
        },
        { todayVolume: 0, pendingCount: 0, verifiedCount: 0 }
    ) || { todayVolume: 0, pendingCount: 0, verifiedCount: 0 };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Live Payments</h2>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        WhatsApp Live
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {payments ? `R ${stats.todayVolume.toFixed(2)}` : "..."}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Processed today
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {payments ? stats.pendingCount : "..."}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Verified Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {payments ? stats.verifiedCount : "..."}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Successfully matched
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payments List */}
            <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-white border-b">
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Real-time feed from verified WhatsApp numbers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                        {!payments ? (
                            <div className="flex items-center justify-center p-10">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        ) : payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-10 text-muted-foreground gap-2">
                                <p>No payments received yet.</p>
                                <p className="text-sm">Send an image to the WhatsApp bot to start!</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {payments.map((payment) => (
                                    <div key={payment._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm
                                                ${getAvatarColor(payment.aiExtraction?.payerName || payment.aiExtraction?.reference || payment.whatsappMetadata.senderPhone)}`}>
                                                {getInitials(payment.aiExtraction?.payerName || payment.aiExtraction?.reference || payment.whatsappMetadata.senderPhone)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {payment.aiExtraction?.payerName || payment.aiExtraction?.reference || "Unknown Payer"}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {payment.aiExtraction?.reference ? (
                                                        <span className="font-medium text-slate-600">{payment.aiExtraction.reference} • </span>
                                                    ) : null}
                                                    {payment.whatsappMetadata.senderPhone} • {formatDistanceToNow(payment.whatsappMetadata.timestamp)} ago
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-right w-32">
                                                <p className="font-bold tabular-nums">
                                                    {payment.aiExtraction?.amount
                                                        ? `R ${payment.aiExtraction.amount.toFixed(2)}`
                                                        : "---"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {payment.aiExtraction?.bankName || "Unknown Bank"}
                                                </p>
                                            </div>
                                            <div className="w-32 flex justify-end">
                                                <StatusBadge status={payment.verificationStatus} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

function ReconciliationView() {
    const bankTxns = useQuery(api.stitch.listTransactions);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Bank Reconciliation</h2>
                <p className="text-muted-foreground">Upload statements and verify payments.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Upload Widget (Takes up 2 cols on large screens) */}
                <div className="md:col-span-2 space-y-6">
                    <XeroConnect />
                    <BankReconciliation />
                </div>

                {/* Bank History (Takes up 1 col) */}
                <div className="space-y-6">
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-sm">Bank Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 min-h-0">
                            <ScrollArea className="h-full">
                                {!bankTxns ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">Loading bank feed...</div>
                                ) : bankTxns.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">No bank transactions yet.</div>
                                ) : (
                                    <div className="divide-y border-t">
                                        {bankTxns.map((tx) => (
                                            <div key={tx._id} className="p-3 text-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold">R {tx.amount.toFixed(2)}</span>
                                                    <Badge variant={tx.status === "Reconciled" ? "default" : "secondary"} className="text-[10px] h-5">
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate" title={tx.description}>
                                                    {tx.description}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground mt-1">
                                                    {tx.date} • {tx.reference}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "AI_Matched":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> AI Verified</Badge>;
        case "Manual_Flag":
            return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" /> Review Needed</Badge>;
        case "Bank_Verified":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Bank Synced</Badge>;
        case "Flagged_Fraud":
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><ShieldAlert className="w-3 h-3 mr-1" /> Potential Fraud</Badge>;
        case "Flagged_Duplicate":
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"><Copy className="w-3 h-3 mr-1" /> Duplicate</Badge>;
        default:
            return <Badge variant="secondary" className="text-muted-foreground"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>;
    }
}

function PlaceholderView({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] md:h-[70vh] text-center space-y-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            {icon}
            <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
            <p className="text-slate-500 max-w-sm">
                This feature matches the "Live Payments" system but is currently under development.
            </p>
            <Badge variant="secondary" className="mt-4">Coming Soon</Badge>
        </div>
    );
}
