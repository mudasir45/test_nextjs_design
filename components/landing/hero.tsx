import { ArrowRight } from "lucide-react";
import { WorkspacePreview } from "./workspace-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/30 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
              </span>
              MVP launching Q3 2026
            </div>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]">
              Your goals, work, and revenue.{" "}
              <span className="text-muted-foreground font-normal">Finally connected.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              iMergix replaces 4–6 scattered tools with one workspace built for
              self-motivated freelancers. Define your why, track milestones, run
              projects, and invoice clients — all in one flow.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#cta"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold tracking-wider uppercase text-background transition-all duration-300 hover:bg-foreground/90 hover:-translate-y-px shadow-sm"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#journey"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold tracking-wider uppercase text-foreground transition-all duration-300 hover:bg-card-hover hover:-translate-y-px"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground lg:justify-start">
              <span>Free tier available</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <span>5 min onboarding</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <span>Built for freelancers</span>
            </div>
          </div>

          <WorkspacePreview />
        </div>
      </div>
    </section>
  );
}
