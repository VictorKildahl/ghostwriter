"use client";

import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: hook up to your backend / Convex / email service
    console.log("Waitlist signup:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      {/* Nav */}
      <nav className="w-full px-8 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <img src="/ghosty.png" alt="Ghosty" className="h-7 w-7" />
          <span className="text-base font-semibold text-ink tracking-tight">
            GhostWriter
          </span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-parchment">
          <div className="max-w-4xl mx-auto px-8 pt-20 pb-24 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-ink tracking-wide uppercase">
                Coming Soon for macOS
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight leading-[1.12] mb-4">
              You talk, <span className="text-accent">it writes.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base text-muted max-w-xl leading-relaxed mb-10">
              GhostWriter turns your voice into clean, ready-to-paste text —
              anywhere on your Mac. No switching apps, no copy-pasting. Just
              speak and it appears.
            </p>

            {/* Waitlist form */}
            <div id="waitlist" className="w-full max-w-md">
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
                    Join Waitlist
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
              <p className="text-xs text-muted mt-3">
                Free early access · No spam · macOS only
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            <img src="/ghosty.png" alt="Ghosty" className="h-4 w-4" />
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
