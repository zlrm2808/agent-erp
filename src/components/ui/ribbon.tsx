"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus, ArrowDown, ArrowUp, Package, List } from "lucide-react";

// Icon mapping
const iconMap = {
  Plus,
  ArrowDown,
  ArrowUp,
  Package,
  List,
};

type IconName = keyof typeof iconMap;

interface RibbonButtonProps {
  icon: IconName;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "primary";
  size?: "small" | "large";
}

function RibbonButton({ icon, label, href, onClick, variant = "default", size = "large" }: RibbonButtonProps) {
  const Icon = iconMap[icon];

  const buttonContent = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded hover:bg-[#f3f2f1] transition-colors cursor-pointer group",
      variant === "primary" && "bg-primary/5 hover:bg-primary/10"
    )}>
      <Icon className={cn(
        "h-6 w-6 text-[#605e5c] group-hover:text-[#323130]",
        variant === "primary" && "text-primary",
        size === "small" && "h-4 w-4"
      )} />
      <span className={cn(
        "text-[10px] text-[#605e5c] group-hover:text-[#323130] font-medium",
        variant === "primary" && "text-primary"
      )}>
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick}>
      {buttonContent}
    </button>
  );
}

interface RibbonGroupProps {
  title: string;
  children: React.ReactNode;
}

function RibbonGroup({ title, children }: RibbonGroupProps) {
  return (
    <div className="flex flex-col border-r border-[#e1dfdd] pr-4 last:border-r-0">
      <div className="flex items-center gap-1 mb-2">
        {children}
      </div>
      <span className="text-[9px] text-[#605e5c] text-center font-medium uppercase tracking-wide">
        {title}
      </span>
    </div>
  );
}

interface RibbonProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Ribbon({ title, description, children }: RibbonProps) {
  return (
    <div className="bg-background border-b border-[#e1dfdd] shadow-sm flex">
      {/* Title Section */}
      <div className="px-6 py-3 border-r border-[#e1dfdd]/50 w-5/24 bg-primary text-primary-foreground">
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-primary-foreground/50 mt-0.5">{description}</p>
        )}
      </div>

      {/* Ribbon Actions */}
      <div className="px-6 py-2 flex items-start gap-4 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

export { RibbonGroup, RibbonButton };
