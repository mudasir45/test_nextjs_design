"use client";

import type { LucideIcon } from "lucide-react";
import { Heart, Sparkles, EyeOff, ShieldCheck } from "lucide-react";
import { SectionHeader } from "./section-header";

const points: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Heart,
    title: "Personal, not corporate",
    description:
      "Built for one person running their craft — not a 500-seat enterprise tool reskinned for freelancers.",
  },
  {
    icon: Sparkles,
    title: "Self-motivation layer",
    description:
      "Goal tracking tied to real project milestones. See your progress story, not just a task list.",
  },
  {
    icon: EyeOff,
    title: "Calm by design",
    description:
      "Clean, distraction-free interface. No noisy widgets or unnecessary notifications — just focused flow.",
  },
  {
    icon: ShieldCheck,
    title: "Honest pricing",
    description:
      "Free tier with all core modules. Pro plans priced well below competitors.",
  },
];

const audiences = [
  {
    title: "Solo freelancers",
    description: "Developers, designers, consultants with 3–15 clients",
  },
  {
    title: "Small agencies",
    description: "2–10 people with shared projects and multiple clients",
  },
  {
    title: "Early startups",
    description: "Founders managing ops, goals, and client work",
  },
];

export function Differentiators() {
  return (
    <section id="why" className="relative border-t border-border/40 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="Why iMergix"
          title={
            <>
              What the market is{" "}
              <span className="text-muted-foreground font-normal">missing.</span>
            </>
          }
          description="Competing on simplicity, UX quality, and price — not feature bloat."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-foreground/40 hover:shadow-sm"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-background/50 px-6 py-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Built for
            </p>
          </div>
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {audiences.map((audience) => (
              <div key={audience.title} className="p-6 text-center sm:text-left">
                <p className="font-bold text-foreground">{audience.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
