"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
    {
        question: "How does the WhatsApp integration work?",
        answer: "It's simple! You forward any proof of payment or invoice directly to our verified WhatsApp number. Our AI instantly processes the document, extracts the data, and updates your dashboard."
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely. We use bank-grade encryption for all data transmission and storage. Your financial documents are processed securely and never shared with third parties."
    },
    {
        question: "Does it integrate with regular Xero?",
        answer: "Yes, we have seamless 2-way sync with Xero. Invoices and payments are automatically matched and reconciled, keeping your accounting software perfectly up to date."
    },
    {
        question: "Can I handle multiple businesses?",
        answer: "Yes, our platform supports multi-entity management. You can easily switch between different business profiles from a single dashboard."
    },
    {
        question: "What happens if a PoP is fake?",
        answer: "Our advanced AI algorithms analyze the digital footprint and metadata of each document. If a Proof of Payment shows signs of manipulation or doesn't match bank records, it's immediately flagged as suspicious."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Everything you need to know about Vura and how we help your business.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 bg-white"
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white hover:bg-slate-50 transition-colors"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="text-lg font-medium text-slate-900 pr-8">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
