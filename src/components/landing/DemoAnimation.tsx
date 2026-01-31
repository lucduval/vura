'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Send, Smartphone, Loader2, ArrowRight } from 'lucide-react';

export default function DemoAnimation() {
    const [step, setStep] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            setStep(0);
            const sequence = [
                { time: 1000, step: 1 }, // Typing...
                { time: 2500, step: 2 }, // Message Sent
                { time: 3500, step: 3 }, // Dashboard Loading
                { time: 5500, step: 4 }, // Verified on Dashboard & WhatsApp Reply
            ];

            sequence.forEach(({ time, step: s }) => {
                setTimeout(() => setStep(s), time);
            });

            // Loop
            timer = setInterval(() => {
                setStep(0);
                sequence.forEach(({ time, step: s }) => {
                    setTimeout(() => setStep(s), time);
                });
            }, 9000);
        }
        return () => clearInterval(timer);
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Watch Demo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-slate-950 text-white border-slate-800 sm:rounded-2xl h-[600px] sm:max-w-7xl">
                <div className="sr-only">
                    <DialogTitle>Vura Product Demo</DialogTitle>
                </div>
                <div className="flex bg-slate-50 h-full">

                    {/* Left: Mobile (WhatsApp) */}
                    <div className="w-1/3 bg-slate-100 border-r border-slate-200 p-4 flex flex-col items-center justify-center relative">
                        <div className="absolute top-4 font-bold text-slate-400 text-xs">CUSTOMER VIEW</div>
                        <div className="w-[280px] h-[500px] bg-white rounded-[2rem] border-8 border-slate-800 shadow-xl overflow-hidden relative flex flex-col">
                            {/* Phone Header */}
                            <div className="bg-[#075E54] p-3 text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200/20 flex items-center justify-center">V</div>
                                <div className="text-sm font-medium">Vura Automated</div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 bg-[#ECE5DD] p-3 space-y-3 overflow-y-auto">
                                {/* Initial User Message (Image) */}
                                <AnimatePresence>
                                    {step >= 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            className="flex justify-end"
                                        >
                                            <div className="bg-[#DCF8C6] p-1 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
                                                <div className="w-32 h-20 bg-slate-200 rounded mb-1 flex items-center justify-center text-xs text-slate-400">
                                                    [POP Image]
                                                </div>
                                                <div className="flex justify-end gap-1 px-1">
                                                    <span className="text-[10px] text-slate-500">10:42</span>
                                                    <Check className="w-3 h-3 text-blue-500" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Bot Reply */}
                                <AnimatePresence>
                                    {step >= 4 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs text-slate-800">
                                                <p>✅ Payment Received!</p>
                                                <p className="mt-1 font-semibold">R 4,500.00</p>
                                                <p className="text-slate-500">Ref: INV-001</p>
                                                <span className="text-[10px] text-slate-400 block text-right mt-1">10:42</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area */}
                            <div className="bg-white p-2 border-t flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 h-8 rounded-full px-3 text-xs flex items-center text-slate-400">
                                    {step === 1 ? 'Sending...' : 'Message'}
                                </div>
                                <div className="w-8 h-8 bg-[#00897B] rounded-full flex items-center justify-center">
                                    <Send className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Dashboard (Vura) */}
                    <div className="flex-1 bg-slate-950 p-6 flex flex-col relative text-white">
                        <div className="absolute top-4 right-6 font-bold text-slate-500 text-xs">DASHBOARD VIEW</div>

                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Live Transactions
                        </h3>

                        <div className="border border-slate-800 rounded-lg overflow-hidden">
                            <div className="bg-slate-900/50 p-3 grid grid-cols-4 text-xs font-semibold text-slate-400">
                                <div>CUSTOMER</div>
                                <div>AMOUNT</div>
                                <div>REF</div>
                                <div>STATUS</div>
                            </div>

                            <div className="divide-y divide-slate-800">
                                {/* New Transaction */}
                                <AnimatePresence>
                                    {step >= 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                                backgroundColor: step >= 4 ? 'transparent' : 'rgba(59, 130, 246, 0.1)'
                                            }}
                                            className="grid grid-cols-4 p-4 text-sm items-center border-l-2 border-blue-500"
                                        >
                                            <div className="font-medium text-white">Sarah James</div>
                                            <div className="text-white">R 4,500.00</div>
                                            <div className="text-slate-400">INV-001</div>
                                            <div>
                                                {step === 3 ? (
                                                    <span className="inline-flex items-center gap-1 text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded">
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        Processing
                                                    </span>
                                                ) : (
                                                    <motion.span
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        className="inline-flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Verified
                                                    </motion.span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Old Transaction 1 */}
                                <div className="grid grid-cols-4 p-4 text-sm items-center opacity-50">
                                    <div className="font-medium text-white">Mike Smith</div>
                                    <div className="text-white">R 1,200.00</div>
                                    <div className="text-slate-400">Gym Fee</div>
                                    <div>
                                        <span className="inline-flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">
                                            <Check className="w-3 h-3" />
                                            Verified
                                        </span>
                                    </div>
                                </div>

                                {/* Old Transaction 2 */}
                                <div className="grid grid-cols-4 p-4 text-sm items-center opacity-50">
                                    <div className="font-medium text-white">Burger King</div>
                                    <div className="text-white">R 890.00</div>
                                    <div className="text-slate-400">Supplies</div>
                                    <div>
                                        <span className="inline-flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded">
                                            <Check className="w-3 h-3" />
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-slate-800">
                            <div className="text-xs text-slate-500 mb-2 font-mono">SYSTEM LOGS</div>
                            <div className="font-mono text-xs space-y-1 h-32 overflow-hidden">
                                <div className="text-slate-600">[10:41:00] System ready. Listening for webhooks...</div>
                                {step >= 2 && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-blue-400">[10:42:05] Webhook received: Image form +2782...</motion.div>}
                                {step >= 3 && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-yellow-400">[10:42:06] AI Processing: Extracting amount...</motion.div>}
                                {step >= 4 && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-green-400">[10:42:08] Match Found: R4,500.00 confirmed.</motion.div>}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
