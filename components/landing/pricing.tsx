import { Check } from "lucide-react";

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
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-cta">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, accessible plans
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Pricing is being finalized — these are our recommended starting
            points. Significantly below competitors.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 transition-colors duration-200 ${
                plan.highlighted
                  ? "border-cta bg-card shadow-lg"
                  : "border-border bg-card hover:bg-card-hover"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cta px-3 py-0.5 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-secondary">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-secondary">{plan.period}</span>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-cta"
                      aria-hidden="true"
                    />
                    <span className="text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-8 block cursor-pointer rounded-lg py-3 text-center text-sm font-semibold transition-colors duration-200 ${
                  plan.highlighted
                    ? "bg-cta text-white hover:bg-cta-hover"
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
