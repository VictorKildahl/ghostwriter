"use client";

import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

async function joinWaitlist(email: string) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "waitlist:join",
      args: { email },
    }),
  });

  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setError("");
      await joinWaitlist(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-parchment px-8">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Logo */}
        <img src="/ghosty.png" alt="GhostWriter" className="h-20 w-20 mb-6" />

        {/* Name */}
        <span className="text-lg font-semibold text-ink tracking-tight mb-8">
          GhostWriter
        </span>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border mb-6">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold text-ink tracking-wide uppercase">
            Coming Soon for macOS
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-[1.12] mb-3">
          Just <span className="text-accent">ghost write</span> it.
        </h1>

        {/* Subheadline */}
        <p className="text-sm text-muted leading-relaxed mb-8">
          You talk, it writes. Voice-powered ghostwriting that turns speech into
          clean, ready-to-paste text - anywhere on your Mac.
        </p>

        {/* Waitlist form */}
        <div className="w-full">
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-white text-ink text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                Join waitlist
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-white border border-border">
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-sm font-medium text-accent">
                You&apos;re on the list! We&apos;ll be in touch.
              </p>
            </div>
          )}
          {error && <p className="text-xs text-ember mt-2">{error}</p>}
          <p className="text-xs text-muted mt-3 mb-20">
            Free early access · No spam · macOS only
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full px-8 py-6">
        <div className="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>© {new Date().getFullYear()} GhostWriter</span>
          </div>
          <p className="text-xs text-muted">
            Built with ☕ for people who think faster than they type.
          </p>
        </div>
      </footer>
    </div>
  );
}
