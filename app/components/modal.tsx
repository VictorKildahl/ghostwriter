"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ModalProps = {
  /** Whether the modal is visible. When false the component renders nothing. */
  open: boolean;
  /** Called when the user presses Escape, clicks the backdrop, or clicks the
   *  close button. */
  onClose: () => void;
  children: ReactNode;
  /** Optional title rendered at the top of the panel with a close (×) button. */
  title?: string;
  /** Subtitle shown below the title. */
  subtitle?: string;
  /** Controls max-width of the content panel. Defaults to `"md"`.
   *  Pass `"custom"` to skip the built-in max-width and supply your own via
   *  `panelClassName`. */
  size?: "sm" | "md" | "lg" | "xl" | "full" | "custom";
  /** Extra classes merged onto the white content panel. */
  panelClassName?: string;
  /** Whether to render the close (×) button. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Stacking layer – use a higher value for modals that sit on top of other
   *  modals (e.g. the language picker inside settings). Defaults to `50`. */
  zIndex?: number;
};

const SIZE_CLASSES: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[min(1150px,96vw)]",
  custom: "",
};

export function Modal({
  open,
  onClose,
  children,
  title,
  subtitle,
  size = "md",
  panelClassName,
  showCloseButton = true,
  zIndex = 50,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[2px]"
      style={{ zIndex }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]",
          SIZE_CLASSES[size],
          panelClassName,
        )}
      >
        {/* Header row: title + close button */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            {title ? (
              <div>
                <h2 className="text-lg font-semibold text-ink">{title}</h2>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted">{subtitle}</p>
                )}
              </div>
            ) : (
              <div />
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-muted transition hover:bg-sidebar hover:text-ink hover:cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn("w-full h-full", title ? "px-6 pb-6 pt-2" : "")}>
          {children}
        </div>
      </div>
    </div>
  );
}
