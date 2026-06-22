"use client";

import { Brain, Layers, AlertCircle, X, Check } from "lucide-react";
import { SectionHeader } from "./section-header";

const painPoints = [
  {
    icon: Brain,
    title: "Attention residue",
    description:
      "Switching between Notion, Trello, and spreadsheets forces your brain to reload context every time — stealing deep focus.",
  },
  {
    icon: Layers,
    title: "Motivation gap",
    description:
      "When yearly goals live in a doc you never open, daily tasks feel like empty chores with no visible progress story.",
  },
  {
    icon: AlertCircle,
    title: "Operational anxiety",
    description:
      "Without one source of truth, you're always wondering: am I on track? Did I invoice that client? What's my revenue?",
  },
];

const fragmentedTools = ["Notion", "Trello", "Sheets", "Gmail", "Wave"];

export function Problem() {
  return (
    <section id="philosophy" className="relative py-24 md:py-32 bg-background border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="The problem"
          title={
            <>
              Scattered tools create a{" "}
              <span className="text-muted-foreground font-normal">scattered mind.</span>
            </>
          }
          description="Most freelancers run on 4–6 disconnected apps. It's not just messy — it's a constant drain on focus, motivation, and creative energy."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/40 hover:shadow-sm"
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Before / After */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                <X className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">
                Before — 6 disconnected tools
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fragmentedTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Broken context · Constant switching · No progress story
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">
                After — One iMergix workspace
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Goals", "Tasks", "Projects", "Clients", "Invoices"].map(
                (mod) => (
                  <span
                    key={mod}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  >
                    {mod}
                  </span>
                ),
              )}
            </div>
            <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              Shared context · Visible progress · Calm productivity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
