"use client";

import { Check } from "lucide-react";
import { SectionHeader } from "./section-header";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Everything you need to get started",
    features: [
      "3 projects",
      "5 clients",
      "5 invoices per month",
      "Unlimited tasks",
      "All core modules",
      "1 seat",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "~$9",
    period: "/mo",
    description: "For growing freelancers who need more",
    features: [
      "Unlimited projects & clients",
      "Unlimited invoices",
      "Custom invoice branding",
      "PDF export",
      "Priority support",
      "Up to 3 seats",
    ],
    cta: "Join waitlist",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "~$19",
    period: "/mo",
    description: "For small teams running multiple clients",
    features: [
      "Everything in Pro",
      "Team analytics",
      "Client portal (v2)",
      "Onboarding call",
      "Up to 10 seats",
    ],
    cta: "Join waitlist",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-border/40 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="Pricing"
          title={
            <>
              Simple plans.{" "}
              <span className="text-muted-foreground font-normal">Honest pricing.</span>
            </>
          }
          description="Significantly below competitors. Free tier includes all core modules."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 md:p-8 ${
                plan.highlighted
                  ? "border-foreground bg-card shadow-md"
                  : "border-border bg-card hover:border-foreground/40 hover:shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground text-background px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-8 block cursor-pointer rounded-xl py-3 text-center text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-foreground text-background shadow-sm hover:bg-foreground/90"
                    : "border border-border text-foreground hover:bg-card-hover"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
