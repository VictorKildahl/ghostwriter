"use client";

import { AuthShell } from "@/app/components/auth-shell";
import { Spinner } from "@/app/components/ui/spinner";
import { useState } from "react";

export function LoginView({
  email,
  onLogin,
  onBack,
}: {
  email: string;
  onLogin: (email: string, password: string) => Promise<unknown>;
  onBack: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 1) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Enter your password to log in."
      currentStep="signin"
    >
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Email</span>
            <input
              type="email"
              value={email}
              disabled
              className="rounded-lg border border-border bg-sidebar px-3 py-2 text-sm text-muted cursor-not-allowed"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus
              required
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-ember/10 px-3 py-2 text-xs text-ember">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
          >
            {loading && <Spinner className="size-4 text-white/70" />}
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-ink hover:underline"
        >
          Try a different email or login method
        </button>
      </div>
    </AuthShell>
  );
}
