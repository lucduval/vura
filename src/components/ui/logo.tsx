import React from 'react';

export const Logo = ({ className = "h-8 w-auto" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Financial Security: The Shield/Base - Solid and Stable */}
        <path
            d="M50 95C50 95 85 80 90 40V15L50 5L10 15V40C15 80 50 95 50 95Z"
            fill="currentColor"
            className="text-slate-900 dark:text-white"
        />

        {/* Tech Innovation: The 'V' cut/circuit - Dynamic and Electric */}
        <path
            d="M35 15L50 25L65 15V45L50 60L35 45V15Z"
            className="text-blue-500"
            fill="currentColor"
        />
        <path
            d="M50 60L50 85"
            stroke="currentColor"
            strokeWidth="4"
            className="text-blue-500"
            strokeLinecap="round"
        />
    </svg>
);

export const LogoText = () => (
    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <Logo className="h-8 w-8 text-slate-900" />
        <span>Vura</span>
    </div>
);
