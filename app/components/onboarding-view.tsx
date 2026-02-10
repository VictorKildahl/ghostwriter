"use client";

import { OnboardingConsent } from "@/app/components/onboarding-consent";
import { OnboardingStyle } from "@/app/components/onboarding-style";
import type { StylePreferences } from "@/types/ghosttype";
import { useState } from "react";

type Step = "consent" | "style";

export function OnboardingView({
  onComplete,
}: {
  onComplete: (
    shareTranscripts: boolean,
    stylePreferences: StylePreferences,
  ) => void;
}) {
  const [step, setStep] = useState<Step>("consent");
  const [shareTranscripts, setShareTranscripts] = useState(false);

  if (step === "consent") {
    return (
      <OnboardingConsent
        onChoice={(share) => {
          setShareTranscripts(share);
          setStep("style");
        }}
      />
    );
  }

  return (
    <OnboardingStyle
      onChoice={(stylePreferences) =>
        onComplete(shareTranscripts, stylePreferences)
      }
    />
  );
}
