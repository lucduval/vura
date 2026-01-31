
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, AlertCircle, ShieldAlert, Copy, Clock, Phone, Calendar, CreditCard } from "lucide-react";

interface CustomerDetailSheetProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any; // We can type this properly based on the query return type
}

export function CustomerDetailSheet({ isOpen, onClose, customer }: CustomerDetailSheetProps) {
    if (!customer) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
                <SheetHeader className="pb-6 border-b">
                    <SheetTitle className="text-2xl">{customer.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8 py-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">R {customer.totalPaid.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{customer.paymentCount}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transaction History */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-500" />
                            Transaction History
                        </h3>
                        <ScrollArea className="h-[400px] border rounded-md p-4">
                            <div className="space-y-4">
                                {customer.payments.map((payment: any) => (
                                    <div key={payment._id} className="flex flex-col border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-medium">
                                                    {payment.aiExtraction?.amount
                                                        ? `R ${payment.aiExtraction.amount.toFixed(2)}`
                                                        : "Pending Extraction"}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDistanceToNow(payment.whatsappMetadata.timestamp)} ago
                                                </div>
                                            </div>
                                            <StatusBadge status={payment.verificationStatus} />
                                        </div>

                                        {payment.aiExtraction?.reference && (
                                            <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                                Ref: {payment.aiExtraction.reference}
                                            </div>
                                        )}

                                        {payment.aiExtraction?.bankName && (
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" />
                                                {payment.aiExtraction.bankName}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "AI_Matched":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
        case "Manual_Flag":
            return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" /> Review</Badge>;
        case "Bank_Verified":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Synced</Badge>;
        case "Flagged_Fraud":
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><ShieldAlert className="w-3 h-3 mr-1" /> Fraud</Badge>;
        case "Flagged_Duplicate":
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"><Copy className="w-3 h-3 mr-1" /> Duplicate</Badge>;
        default:
            return <Badge variant="secondary" className="text-muted-foreground">Processing</Badge>;
    }
}
