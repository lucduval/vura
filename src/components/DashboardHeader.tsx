import { Bell, Grip, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export function DashboardHeader() {
    return (
        <div className="flex items-center justify-end gap-6 py-4 px-6 bg-white border-b border-slate-100">
            {/* Help Center */}
            <Button variant="ghost" className="text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900 gap-2">
                Help Center
            </Button>

            {/* Icons */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 rounded-full">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 rounded-full">
                    <Grip className="h-5 w-5" />
                </Button>
            </div>

            {/* User Profile */}
            <div className="flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}
