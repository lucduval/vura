'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, CheckCircle } from 'lucide-react';

export default function ProblemSolution() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        Why switching to Vura is a no-brainer
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                    {/* The Old Way */}
                    <Card className="border-red-100 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-red-700">
                                <XCircle className="mr-2 h-6 w-6" />
                                The Manual Way
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <XCircle className="mt-0.5 mr-2 h-5 w-5 text-red-400 shrink-0" />
                                    <span className="text-muted-foreground">Log in to 3 different banking portals daily.</span>
                                </li>
                                <li className="flex items-start">
                                    <XCircle className="mt-0.5 mr-2 h-5 w-5 text-red-400 shrink-0" />
                                    <span className="text-muted-foreground">Manually search for references in thousands of lines of statements.</span>
                                </li>
                                <li className="flex items-start">
                                    <XCircle className="mt-0.5 mr-2 h-5 w-5 text-red-400 shrink-0" />
                                    <span className="text-muted-foreground">Chase customers for clearer screenshots via email/WhatsApp.</span>
                                </li>
                                <li className="flex items-start">
                                    <XCircle className="mt-0.5 mr-2 h-5 w-5 text-red-400 shrink-0" />
                                    <span className="text-muted-foreground">Risk of fraud from fake PDF edits.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* The VCC Way */}
                    <Card className="border-green-100 bg-green-50/50 shadow-lg ring-1 ring-green-100">
                        <CardHeader>
                            <CardTitle className="flex items-center text-green-700">
                                <CheckCircle className="mr-2 h-6 w-6" />
                                The Vura Way
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="mt-0.5 mr-2 h-5 w-5 text-green-500 shrink-0" />
                                    <span className="text-foreground font-medium">One dashboard for all incoming payments.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="mt-0.5 mr-2 h-5 w-5 text-green-500 shrink-0" />
                                    <span className="text-foreground font-medium">AI instantly extracts amount, date, and reference.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="mt-0.5 mr-2 h-5 w-5 text-green-500 shrink-0" />
                                    <span className="text-foreground font-medium">Automatic reply to customer confirming receipt.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="mt-0.5 mr-2 h-5 w-5 text-green-500 shrink-0" />
                                    <span className="text-foreground font-medium">Bank-grade verification with audit trails.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
