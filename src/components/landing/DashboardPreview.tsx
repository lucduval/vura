'use client';

import {
    Search,
    Bell,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    Download
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPreview() {
    return (
        <div className="w-full rounded-xl overflow-hidden border bg-white shadow-2xl">
            {/* Fake Browser Toolbar / Dashboard Header */}
            <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex h-8 w-1/3 items-center rounded-md border bg-white px-3 text-xs text-muted-foreground shadow-sm">
                    <Search className="mr-2 h-3 w-3" />
                    Search transactions...
                </div>
                <div className="flex items-center space-x-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div className="h-6 w-6 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold">JD</div>
                </div>
            </div>

            <div className="flex h-[400px] md:h-[500px]">
                {/* Sidebar */}
                <div className="hidden w-48 flex-col border-r bg-slate-50 p-4 md:flex">
                    <div className="mb-6 font-bold text-lg px-2 text-blue-800">Vura</div>
                    <div className="space-y-1">
                        <div className="rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700">Live Feed</div>
                        <div className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Payments</div>
                        <div className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Customers</div>
                        <div className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Bank Feeds</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white p-6 overflow-hidden">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Recent Payments</h2>
                            <p className="text-xs text-muted-foreground">Real-time WhatsApp submissions</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bank</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Reference</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {/* Validated Row */}
                                <tr className="group hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">Sarah James</div>
                                        <div className="text-xs text-muted-foreground">+27 82 555 1234</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold text-orange-600 bg-orange-50 border-orange-200">
                                            FNB
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">R 4,500.00</td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">INV-2024-001</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            AI Verified
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <FileText className="h-4 w-4 text-slate-400 hover:text-blue-600 cursor-pointer inline" />
                                    </td>
                                </tr>

                                {/* Pending Row */}
                                <tr className="group hover:bg-slate-50 bg-blue-50/10">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">Mike Smith</div>
                                        <div className="text-xs text-muted-foreground">+27 76 123 4567</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold text-blue-600 bg-blue-50 border-blue-200">
                                            Standard
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">R 1,250.00</td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Deposit Gym</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Processing
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="h-4 w-4 rounded-full border-2 border-t-blue-600 animate-spin border-slate-200 inline-block"></div>
                                    </td>
                                </tr>

                                {/* Recent Row */}
                                <tr className="group hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">Burger King CBD</div>
                                        <div className="text-xs text-muted-foreground">+27 61 999 8888</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold text-red-600 bg-red-50 border-red-200">
                                            Absa
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">R 890.00</td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">Weekly Supplies</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            AI Verified
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <FileText className="h-4 w-4 text-slate-400 hover:text-blue-600 cursor-pointer inline" />
                                    </td>
                                </tr>
                                {/* Manual Flag Row */}
                                <tr className="group hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">Unknown User</div>
                                        <div className="text-xs text-muted-foreground">+27 84 000 0000</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-50 border-slate-200">
                                            Capitec
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">R 150.00</td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">...</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                            <AlertCircle className="mr-1 h-3 w-3" />
                                            Manual Check
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <MoreHorizontal className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer inline" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
