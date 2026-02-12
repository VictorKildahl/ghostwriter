"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";

type BillingCycle = "monthly" | "yearly";

export type SettingsBillingViewProps = {
  userId: Id<"users">;
};

export function SettingsBillingView({ userId }: SettingsBillingViewProps) {
  const plans = useQuery(api.users.getBillingPlans, {}) ?? [];
  const billingState = useQuery(api.users.getBillingState, { userId });
  const updateBillingPlanMutation = useMutation(api.users.updateBillingPlan);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);

  useEffect(() => {
    if (!billingState) return;
    if (
      billingState.billingCycle === "monthly" ||
      billingState.billingCycle === "yearly"
    ) {
      setBillingCycle(billingState.billingCycle);
    }
  }, [billingState]);

  const currentPlanId = billingState?.planId ?? "free";

  const nextBillingText = useMemo(() => {
    if (!billingState?.nextBillingDate) return "No upcoming charge";
    return new Date(billingState.nextBillingDate).toLocaleDateString();
  }, [billingState?.nextBillingDate]);

  const billingStatus = billingState?.billingStatus ?? "active";

  async function changePlan(planId: string) {
    setUpdatingPlanId(planId);
    setBillingError(null);
    try {
      await updateBillingPlanMutation({ userId, planId, billingCycle });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update plan.";
      setBillingError(message);
    } finally {
      setUpdatingPlanId(null);
    }
  }
  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Current plan */}
      <div className="py-5">
        <p className="text-sm font-medium text-ink">Current plan</p>
        <p className="mt-1 text-xs text-muted">
          {plans.find((plan) => plan.id === currentPlanId)?.name ?? "Free"} •{" "}
          Status: {billingStatus} • Next billing: {nextBillingText}
        </p>
      </div>

      {/* Billing cycle */}
      <div className="py-5">
        <p className="mb-3 text-sm font-medium text-ink">Billing cycle</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition hover:cursor-pointer",
              billingCycle === "monthly"
                ? "bg-accent text-white"
                : "bg-sidebar text-muted hover:text-ink",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition hover:cursor-pointer",
              billingCycle === "yearly"
                ? "bg-accent text-white"
                : "bg-sidebar text-muted hover:text-ink",
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="py-5">
        <p className="mb-4 text-sm font-medium text-ink">Available plans</p>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {plans.map((plan) => {
            const priceCents =
              billingCycle === "yearly"
                ? plan.yearlyPriceCents
                : plan.monthlyPriceCents;
            const price =
              priceCents === 0
                ? "Free"
                : `$${(priceCents / 100).toFixed(0)}/${billingCycle === "yearly" ? "yr" : "mo"}`;
            const isCurrent = plan.id === currentPlanId;
            const isUpdating = updatingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={cn(
                  "rounded-2xl border p-5",
                  isCurrent
                    ? "border-accent/40 bg-accent/5"
                    : "border-border bg-white",
                )}
              >
                <p className="text-sm font-semibold text-ink">{plan.name}</p>
                <p className="mt-1 text-xs text-muted">{plan.description}</p>
                <p className="mt-3 text-2xl font-semibold text-ink">{price}</p>

                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => changePlan(plan.id)}
                  disabled={isCurrent || isUpdating}
                  className={cn(
                    "mt-4 w-full rounded-lg px-3 py-2 text-xs font-medium transition",
                    isCurrent
                      ? "bg-border text-muted"
                      : "bg-accent text-white hover:bg-accent/90 hover:cursor-pointer",
                  )}
                >
                  {isCurrent
                    ? "Current plan"
                    : isUpdating
                      ? "Updating..."
                      : "Choose plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {billingError && (
        <div className="py-5">
          <p className="text-xs text-ember">{billingError}</p>
        </div>
      )}
    </div>
  );
}
