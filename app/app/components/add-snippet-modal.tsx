"use client";

import { useEffect, useState } from "react";
import { Modal } from "./modal";

export function AddSnippetModal({
  open,
  onClose,
  onAdd,
  initialSnippet,
  initialExpansion,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: { snippet: string; expansion: string }) => void;
  initialSnippet?: string;
  initialExpansion?: string;
}) {
  const [snippet, setSnippet] = useState("");
  const [expansion, setExpansion] = useState("");

  const isEditing = initialSnippet !== undefined;

  // Reset / pre-fill form when modal opens
  useEffect(() => {
    if (open) {
      setSnippet(initialSnippet ?? "");
      setExpansion(initialExpansion ?? "");
    }
  }, [open, initialSnippet, initialExpansion]);

  function handleSubmit() {
    const trimmedSnippet = snippet.trim();
    const trimmedExpansion = expansion.trim();
    if (!trimmedSnippet || !trimmedExpansion) return;
    onAdd({ snippet: trimmedSnippet, expansion: trimmedExpansion });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit snippet" : "Add snippet"}
    >
      {/* Input fields */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Snippet"
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
          autoFocus
        />
        <textarea
          placeholder="Expansion"
          value={expansion}
          onChange={(e) => setExpansion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) handleSubmit();
          }}
          rows={6}
          className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />
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
          disabled={!snippet.trim() || !expansion.trim()}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-40"
        >
          {isEditing ? "Save changes" : "Add snippet"}
        </button>
      </div>
    </Modal>
  );
}
