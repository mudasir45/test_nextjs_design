import { Heart, Rocket, Sparkles, Wallet } from "lucide-react";

const differentiators = [
  {
    icon: Heart,
    title: "Personal, not corporate",
    description:
      "Feels built for one person — not a 500-seat enterprise tool reskinned for freelancers.",
  },
  {
    icon: Sparkles,
    title: "Self-motivation layer",
    description:
      "Goal tracking tied to real project milestones. See your progress story, not just a task list.",
  },
  {
    icon: Wallet,
    title: "Accessible pricing",
    description:
      "Free tier with all core modules. Pro plans priced well below Plutio ($19/mo) and Bonsai ($25/mo).",
  },
  {
    icon: Rocket,
    title: "Startup-aware",
    description:
      "Works for non-technical founders managing both product development and day-to-day operations.",
  },
];

export function Differentiators() {
  return (
    <section id="why" className="border-y border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-cta">
            Why iMergix
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            What the market is missing
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Competing on simplicity, UX quality, and price — not feature bloat.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-border bg-background p-6 transition-colors duration-200 hover:bg-card-hover"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                <item.icon className="h-5 w-5 text-cta" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-border bg-background p-6 md:p-8">
          <p className="text-center text-sm font-medium text-muted">
            Built for
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">Solo freelancers</p>
              <p className="mt-1 text-sm text-secondary">
                Developers, designers, consultants with 3–15 clients
              </p>
            </div>
            <span className="hidden text-border sm:block" aria-hidden="true">
              |
            </span>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">Small agencies</p>
              <p className="mt-1 text-sm text-secondary">
                2–10 people with shared projects and multiple clients
              </p>
            </div>
            <span className="hidden text-border sm:block" aria-hidden="true">
              |
            </span>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">Early startups</p>
              <p className="mt-1 text-sm text-secondary">
                Non-technical founders managing ops and client work
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
