"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <section id="cta" className="border-t border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-background p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to simplify your workflow?
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Join the waitlist for early access. Onboarding takes under 5
            minutes — from signup to your first active project.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-lg border border-border bg-accent-soft px-6 py-4">
              <p className="font-semibold text-foreground">
                You&apos;re on the list!
              </p>
              <p className="mt-1 text-sm text-secondary">
                We&apos;ll reach out when iMergix launches in Q3 2026.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground transition-colors duration-200 placeholder:text-muted focus:border-cta focus:outline-none focus:ring-2 focus:ring-cta/20 sm:max-w-xs"
              />
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-cta-hover"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted">
            No spam. Unsubscribe anytime. Free tier available at launch.
          </p>
        </div>
      </div>
    </section>
  );
}
