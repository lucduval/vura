'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardPreview from '@/components/landing/DashboardPreview';
import DemoAnimation from '@/components/landing/DemoAnimation';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-32 md:pt-32">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm font-medium text-foreground"
        >
          <span className="mr-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live in South Africa
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          Verify Customer Payments <br className="hidden md:block" />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Instantly via WhatsApp
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Stop chasing "Proof of Payment" screenshots. Vura uses AI to extract payment details from WhatsApp images and reconciles them automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <Button size="lg" className="h-12 px-8 text-base">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <DemoAnimation />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute -top-12 left-1/2 -ml-12 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl"></div>
          <DashboardPreview />
        </motion.div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Works with FNB, Capitec, Std Bank</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>POPIA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>99.9% Extraction Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
