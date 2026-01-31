import {
    ShieldCheck,
    Link2,
    Scale,
    LayoutDashboard,
    FileWarning,
    FileText
} from 'lucide-react';

const FEATURE_LIST = [
    {
        title: "AI PoP Verification",
        description: "Instantly verify proof of payments using advanced AI to ensure authenticity and reduce fraud risks.",
        icon: ShieldCheck,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Xero Integration",
        description: "Seamlessly sync your financial data with Xero for automated bookkeeping and streamlined accounting.",
        icon: Link2,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        title: "Bank Reconciliation",
        description: "Automatically match payments with bank transactions to keep your books balanced without the manual effort.",
        icon: Scale,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "Live Payments Dashboard",
        description: "Monitor incoming payments in real-time with a comprehensive dashboard that gives you full visibility.",
        icon: LayoutDashboard,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        title: "Fake PoP Detection",
        description: "Detect manipulated or fraudulent payment proofs instantly with our sophisticated fraud detection algorithms.",
        icon: FileWarning,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    {
        title: "Bank Statement Extraction",
        description: "Upload PDF or CSV bank statements and let our AI extract and categorize every transaction for you.",
        icon: FileText,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Everything You Need to Manage Payments
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Powerful tools designed to automate your financial workflow and secure your revenue.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURE_LIST.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
