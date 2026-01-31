
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, FileDown } from "lucide-react";
import { useState } from "react";
import { CustomerDetailSheet } from "./CustomerDetailSheet";
import { formatDistanceToNow } from "date-fns";
import { getAvatarColor, getInitials } from "../app/dashboard/helpers";

export function CustomersView() {
    const customers = useQuery(api.payments.listByCustomer);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const filteredCustomers = customers?.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your customer base and view payment history.</p>
                </div>
                <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Customers</CardTitle>
                            <CardDescription>
                                You have {customers?.length || 0} unique customers from WhatsApp.
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search name or phone..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {!customers ? (
                        <div className="text-center py-10 text-muted-foreground">Loading customers...</div>
                    ) : filteredCustomers?.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No customers found.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total Paid</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Transactions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers!.map((customer) => (
                                    <TableRow
                                        key={customer.phone}
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => setSelectedCustomer(customer)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center font-bold text-xs
                                                    ${getAvatarColor(customer.name)}`}>
                                                    {getInitials(customer.name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{customer.name}</div>
                                                    <div className="text-xs text-muted-foreground">{customer.phone}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">R {customer.totalPaid.toFixed(2)}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(customer.lastPaymentDate)} ago
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{customer.paymentCount} payments</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CustomerDetailSheet
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                customer={selectedCustomer}
            />
        </div>
    );
}
