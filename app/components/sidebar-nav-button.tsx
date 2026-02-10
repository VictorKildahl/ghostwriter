"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function SidebarNavButton({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  collapsed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "flex w-full items-center justify-start gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-all hover:cursor-pointer",
        active
          ? "bg-white text-ink shadow-xs"
          : "text-ink hover:bg-white hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span
        className={cn(
          "truncate transition-opacity duration-200",
          collapsed ? "opacity-0" : "opacity-100",
        )}
      >
        {label}
      </span>
    </button>
  );
}
