"use client";

import { Breadcrumb } from "@/components/ui/TheBreadcrumb";
import { useUIPersistence } from "@/components/providers/ui-persistence-provider";

export function BreadcrumbBar() {
    const { showBreadcrumb } = useUIPersistence();

    if (!showBreadcrumb) return null;

    return (
        <div className="h-8 bg-white border-b border-[#e1dfdd] flex items-center px-4 animate-in slide-in-from-top-1 duration-200 shadow-sm z-30">
            <Breadcrumb />
        </div>
    );
}
