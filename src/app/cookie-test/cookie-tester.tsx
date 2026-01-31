'use client';

import { useState, useEffect } from 'react';
import { setCookie, getCookie, removeCookie, getAllCookies } from '@/lib/cookie-utils';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn button, checking next
import { Input } from '@/components/ui/input'; // Assuming input

export function CookieTester() {
    const [cookieValue, setCookieValue] = useState('');
    const [currentCookies, setCurrentCookies] = useState<{ [key: string]: string }>({});

    const refreshCookies = () => {
        setCurrentCookies(getAllCookies());
    };

    useEffect(() => {
        refreshCookies();
    }, []);

    const handleSet = () => {
        setCookie('test-cookie', cookieValue || 'Hello World');
        refreshCookies();
        // Refresh the page to update server view
        window.location.reload();
    };

    const handleClear = () => {
        removeCookie('test-cookie');
        refreshCookies();
        window.location.reload();
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    placeholder="Value for 'test-cookie'"
                    value={cookieValue}
                    onChange={(e) => setCookieValue(e.target.value)}
                />
                <button
                    onClick={handleSet}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Set Cookie
                </button>
                <button
                    onClick={handleClear}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Clear Cookie
                </button>
            </div>

            <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Browser Cookie Store (JS Access)</h3>
                <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(currentCookies, null, 2)}
                </pre>
            </div>
        </div>
    );
}
