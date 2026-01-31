import { cookies } from 'next/headers';
import { CookieTester } from './cookie-tester';

export default async function CookieTestPage() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    return (
        <div className="p-10 max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Cookie Implementation Test</h1>

            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <h2 className="text-xl font-semibold mb-4">Server-Side Read</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    These cookies are read directly from the request headers using <code>next/headers</code>.
                    Refreshes on page reload.
                </p>

                {allCookies.length === 0 ? (
                    <p className="italic text-gray-500">No cookies found.</p>
                ) : (
                    <ul className="space-y-2">
                        {allCookies.map((cookie) => (
                            <li key={cookie.name} className="flex flex-col text-sm border-b pb-2">
                                <span className="font-medium">{cookie.name}</span>
                                <span className="text-gray-600 truncate">{cookie.value}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Client-Side Controls</h2>
                <CookieTester />
            </div>
        </div>
    );
}
