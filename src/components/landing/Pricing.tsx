import { Check } from 'lucide-react';

const TIERS = [
    {
        name: 'Starter',
        price: 'R250',
        description: 'Perfect for solopreneurs and small businesses just getting started.',
        features: [
            'Live Payments Dashboard',
            'Bank Reconciliation (Manual)',
            'Basic Email Support',
            'Up to 50 Transactions/mo',
            '1 User Account'
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Growth',
        price: 'R850',
        description: 'Ideal for growing teams that need automation and security.',
        features: [
            'All Starter features',
            'AI PoP Verification',
            'Fake PoP Detection',
            'Xero Integration',
            'Bank Statement Extraction',
            'Unlimited Transactions',
            'Priority Support'
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations requiring dedicated support and custom solutions.',
        features: [
            'All Growth features',
            'Dedicated Account Manager',
            'Custom API Access',
            'SLA Guarantees',
            'Custom Integrations',
            'On-premise Deployment Options',
            '24/7 Phone Support'
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Choose the plan that best fits your business needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative flex flex-col rounded-2xl border ${tier.popular
                                    ? 'border-primary shadow-lg scale-105 z-10'
                                    : 'border-slate-200 shadow-sm'
                                } p-8 bg-white`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-slate-900">{tier.name}</h3>
                                <p className="mt-2 text-slate-600 text-sm h-10">{tier.description}</p>
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                                    {tier.price !== 'Custom' && (
                                        <span className="ml-1 text-slate-600">/month</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="h-5 w-5 text-primary shrink-0 mr-3" />
                                            <span className="text-slate-600 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8">
                                <button
                                    className={`w-full rounded-md px-4 py-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${tier.popular
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                        }`}
                                >
                                    {tier.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
