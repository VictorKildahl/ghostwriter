export type AIModelOption = {
  id: string;
  label: string;
  /** Approximate cost per 1 M input tokens (USD). */
  inputCostPer1M: number;
  /** Approximate cost per 1 M output tokens (USD). */
  outputCostPer1M: number;
};

/**
 * Single source of truth for every AI model available in the app.
 * Add / remove models here — pricing, labels and the default all derive from this list.
 */
export const AI_MODEL_OPTIONS: AIModelOption[] = [
  {
    id: "google/gemini-3-flash",
    label: "Gemini 3 Flash — latest, fast",
    inputCostPer1M: 0.5,
    outputCostPer1M: 3.0,
  },
  {
    id: "google/gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite — fast, cheap",
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
  },
  {
    id: "google/gemini-2.5-flash",
    label: "Gemini 2.5 Flash — balanced",
    inputCostPer1M: 0.3,
    outputCostPer1M: 2.5,
  },
  {
    id: "google/gemini-2.0-flash",
    label: "Gemini 2.0 Flash — fast, cheap",
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
  },
];

/** The model used when the user hasn't chosen one yet. */
export const DEFAULT_AI_MODEL = "google/gemini-2.5-flash-lite";

/** Look up pricing for a model id. Returns undefined if the model isn't in the list. */
export function getModelPricing(modelId: string) {
  const m = AI_MODEL_OPTIONS.find((o) => o.id === modelId);
  if (!m) return undefined;
  return { input: m.inputCostPer1M, output: m.outputCostPer1M };
}
