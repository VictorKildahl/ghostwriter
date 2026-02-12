"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "./modal";

export function AddWordModal({
  open,
  onClose,
  onAdd,
  /** Pre-fill for editing an existing entry */
  initialWord,
  initialMisspelling,
  initialIsCorrection,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: {
    word: string;
    isCorrection: boolean;
    misspelling?: string;
  }) => void;
  initialWord?: string;
  initialMisspelling?: string;
  initialIsCorrection?: boolean;
}) {
  const [word, setWord] = useState("");
  const [misspelling, setMisspelling] = useState("");
  const [isCorrection, setIsCorrection] = useState(false);

  const isEditing = initialWord !== undefined;

  // Reset / pre-fill form when modal opens
  useEffect(() => {
    if (open) {
      setWord(initialWord ?? "");
      setMisspelling(initialMisspelling ?? "");
      setIsCorrection(initialIsCorrection ?? false);
    }
  }, [open, initialWord, initialMisspelling, initialIsCorrection]);

  function handleSubmit() {
    const trimmedWord = word.trim();
    if (!trimmedWord) return;

    if (isCorrection) {
      const trimmedMisspelling = misspelling.trim();
      if (!trimmedMisspelling) return;
      onAdd({
        word: trimmedWord,
        isCorrection: true,
        misspelling: trimmedMisspelling,
      });
    } else {
      onAdd({ word: trimmedWord, isCorrection: false });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit vocabulary" : "Add to vocabulary"}
    >
      {/* Correct a misspelling toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-ink">Correct a misspelling</span>
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px] text-muted"
            title="When enabled, the AI will automatically correct this misspelling in your transcriptions."
          >
            i
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isCorrection}
          onClick={() => setIsCorrection((c) => !c)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
            isCorrection ? "bg-accent" : "bg-gray-200",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform",
              isCorrection ? "translate-x-5.5" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      {/* Input fields */}
      <div className="mt-5">
        {isCorrection ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Misspelling"
              value={misspelling}
              onChange={(e) => setMisspelling(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
              autoFocus
            />
            <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
            <input
              type="text"
              placeholder="Correct spelling"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            />
          </div>
        ) : (
          <input
            type="text"
            placeholder="Add a new word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            autoFocus
          />
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!word.trim() || (isCorrection && !misspelling.trim())}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isEditing ? "Save" : "Add word"}
        </button>
      </div>
    </Modal>
  );
}
