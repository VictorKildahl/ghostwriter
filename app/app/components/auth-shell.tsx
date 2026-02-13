"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { FeatureCarousel } from "./feature-carousel";

type AuthStep = "signin" | "permissions" | "setup" | "learn";

const STEPS: { key: AuthStep; label: string }[] = [
  { key: "signin", label: "Sign in" },
  { key: "permissions", label: "Permissions" },
  { key: "setup", label: "Set up" },
  { key: "learn", label: "Learn" },
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  currentStep,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  currentStep?: AuthStep;
}) {
  return (
    <div className="flex min-h-screen w-screen bg-parchment">
      {/* ---- Left: Form side (fixed width) ---- */}
      <div className="flex shrink-0 flex-col items-stretch pt-16 pb-8 pl-6 pr-4 w-md">
        {/* Onboarding step indicator */}
        {currentStep && (
          <div className="flex items-center justify-center">
            {STEPS.map((step, i) => {
              const stepIndex = STEPS.findIndex((s) => s.key === currentStep);
              const isActive = i === stepIndex;
              const isDone = i < stepIndex;
              return (
                <div key={step.key} className="flex items-center">
                  {i > 0 && (
                    <ChevronRight className="mx-2 h-4 w-4 text-muted/40" />
                  )}
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isActive
                        ? "text-ink"
                        : isDone
                          ? "text-accent"
                          : "text-muted/50"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Logo — fixed position between steps and form */}
        <div className="mt-10 flex items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="assets/ghosty.png" alt="Ghosty" className="h-10 w-10" />
          <span className="text-base font-semibold text-ink">GhostWriter</span>
        </div>

        {/* Form content — vertically centered */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="w-full">
            <div className="mb-7">
              <h1 className="text-2xl font-semibold text-ink">{title}</h1>
              <p className="mt-2 text-sm text-muted">{subtitle}</p>
            </div>

            {children}

            {footer && (
              <div className="mt-6 text-center text-xs text-muted">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Right: Feature carousel (takes remaining space) ---- */}
      <div className="hidden flex-1 flex-col lg:flex">
        <div className="m-2 flex flex-1 overflow-hidden rounded-xl bg-ink">
          <div className="flex flex-1 flex-col">
            <FeatureCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
