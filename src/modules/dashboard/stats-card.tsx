import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    colorClassName?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    colorClassName,
}: StatsCardProps) {
    return (
        <Card className="overflow-hidden border border-[#e1dfdd] shadow-none rounded-none bg-white hover:bg-[#faf9f8] transition-colors h-full flex flex-col justify-center items-center text-center p-6">
            <div className="text-[11px] font-bold text-[#605e5c] uppercase tracking-wide mb-4">
                {title}
            </div>
            <div className="text-4xl font-black tracking-tight text-[#323130] mb-2">{value}</div>
            {(description || trend) && (
                <div className="flex items-center text-[11px] text-[#605e5c]">
                    {trend && (
                        <span className={cn("font-bold mr-1", trend.isUp ? "text-emerald-600" : "text-rose-600")}>
                            {trend.isUp ? "↑" : "↓"} {trend.value}
                        </span>
                    )}
                    {description}
                </div>
            )}
            <div className="absolute top-2 right-2 opacity-10">
                <Icon size={16} />
            </div>
        </Card>
    );
}
