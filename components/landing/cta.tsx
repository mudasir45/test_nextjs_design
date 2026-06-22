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
    <section id="cta" className="relative py-24 md:py-32 bg-background border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center md:p-16">
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to work with{" "}
              <span className="text-muted-foreground font-normal">clarity?</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Join the waitlist for early access. Onboarding takes under 5
              minutes — from signup to your first active project.
            </p>

            {submitted ? (
              <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-background px-6 py-5">
                <p className="font-bold text-foreground">
                  You&apos;re on the list!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll reach out when iMergix launches in Q3 2026.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
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
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-xs font-bold tracking-wider uppercase text-background transition-all duration-300 hover:bg-foreground/90"
                >
                  Get Early Access
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              No spam. Unsubscribe anytime. Free tier available at launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
