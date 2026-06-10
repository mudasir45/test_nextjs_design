import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-soft opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-secondary">
              <Sparkles className="h-3.5 w-3.5 text-cta" aria-hidden="true" />
              MVP launching Q3 2026 — join the waitlist
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
              Your entire freelance life,{" "}
              <span className="text-cta">in one place</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-secondary">
              Stop juggling Notion, Trello, spreadsheets, and invoice tools.
              iMergix replaces 4–6 disconnected apps with a single workspace
              that feels personal — not corporate.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#cta"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-cta-hover"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#features"
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-card-hover"
              >
                See how it works
              </a>
            </div>

            <p className="mt-6 text-sm text-muted">
              Built for freelancers, by a freelancer. Free tier available.
            </p>
          </div>

          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
