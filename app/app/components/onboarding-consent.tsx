"use client";

export function OnboardingConsent({
  step,
  totalSteps,
  onChoice,
}: {
  step: number;
  totalSteps: number;
  onChoice: (shareTranscripts: boolean) => void;
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#edf1eb] px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-soft">
        <p className="mb-4 text-xs font-medium tracking-wide text-muted">
          Step {step} of {totalSteps}
        </p>

        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="assets/ghosty.png" alt="Ghosty" className="h-12 w-12" />
          <h1 className="text-xl font-semibold text-ink">
            Help improve GhostWriter?
          </h1>
        </div>

        <p className="mb-2 text-sm leading-relaxed text-muted">
          We&apos;d love to use your transcriptions to make GhostWriter more
          accurate over time. If you opt in, your raw and cleaned-up
          transcriptions will be stored securely in the cloud.
        </p>

        <p className="mb-6 text-sm leading-relaxed text-muted">
          Your transcriptions are always saved locally on your Mac regardless of
          this choice. You can change this at any time in{" "}
          <span className="font-medium text-ink">Settings</span>.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90"
            onClick={() => onChoice(true)}
          >
            Yes, share my transcriptions
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-sidebar"
            onClick={() => onChoice(false)}
          >
            No thanks
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted/70">
          We never share your data with third parties. Transcriptions are only
          used to improve speech recognition quality.
        </p>
      </div>
    </div>
  );
}
