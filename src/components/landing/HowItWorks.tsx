'use client';

import { Camera, MessageSquare, BrainCircuit, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        title: 'Customer Snaps Proof',
        description: 'Your customer takes a photo or screenshot of their bank payment notification.',
        icon: Camera,
        color: 'bg-blue-100 text-blue-600',
    },
    {
        title: 'Sends to WhatsApp',
        description: 'They simply send the image to your dedicated Vura WhatsApp Business number.',
        icon: MessageSquare,
        color: 'bg-green-100 text-green-600',
    },
    {
        title: 'AI Extracts Data',
        description: 'Our AI instantly reads the amount, reference, and date from any SA bank format.',
        icon: BrainCircuit,
        color: 'bg-purple-100 text-purple-600',
    },
    {
        title: 'Instant Verification',
        description: 'The payment is logged in your dashboard and marked for reconciliation.',
        icon: CheckCircle,
        color: 'bg-teal-100 text-teal-600',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        How Vura Works
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        A seamless experience for your customers and your finance team.
                    </p>
                </div>

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${step.color} mb-6`}
                            >
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>

                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-10 transform translate-x-1/2" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
