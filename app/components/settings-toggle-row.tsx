"use client";

import { cn } from "@/lib/utils";

export function ToggleRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={value}
        className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition hover:cursor-pointer"
        style={{ backgroundColor: value ? "#6944AE" : "#d4d4d4" }}
        onClick={onToggle}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
            value ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
