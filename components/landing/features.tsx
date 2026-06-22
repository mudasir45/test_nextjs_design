"use client";

import type { LucideIcon } from "lucide-react";
import {
  Target,
  ClipboardList,
  Users,
  Receipt,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";
import { SectionHeader } from "./section-header";

const modules: {
  icon: LucideIcon;
  title: string;
  tag: string;
  description: string;
  highlights: string[];
}[] = [
  {
    icon: Target,
    title: "Goals & Milestones",
    tag: "Why",
    description:
      "Set yearly, quarterly, or monthly goals. Break them into milestones with auto-calculated progress and streak tracking.",
    highlights: ["Progress bars", "Streak counter", "On Track status"],
  },
  {
    icon: ClipboardList,
    title: "Task Management",
    tag: "What",
    description:
      "Kanban boards, priorities, due dates, and subtasks — linked directly to your active milestones and projects.",
    highlights: ["Drag-and-drop", "Bulk actions", "Keyboard shortcuts"],
  },
  {
    icon: Users,
    title: "Projects & Clients",
    tag: "Who",
    description:
      "Link projects to clients, invite team members, and see project health with scoped boards and timeline views.",
    highlights: ["Team roles", "Timeline view", "Client profiles"],
  },
  {
    icon: Receipt,
    title: "Invoicing & Finance",
    tag: "How",
    description:
      "Build branded invoices, export PDFs, track payments, log expenses, and see revenue in one dashboard.",
    highlights: ["PDF export", "Expense log", "Finance chart"],
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    tag: "Clarity",
    description:
      "One home screen: goal completion %, open tasks, revenue snapshot, upcoming deadlines, and quick actions.",
    highlights: ["Activity feed", "Deadline alerts", "Quick-create"],
  },
  {
    icon: RefreshCw,
    title: "Monthly Self-Review",
    tag: "Growth",
    description:
      "Lightweight end-of-month reflection: review wins, analyze blockers, and set focus for the next month.",
    highlights: ["Wins log", "Blocker analysis", "Next-month focus"],
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-t border-border/40 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="Core modules"
          title={
            <>
              Everything you need.{" "}
              <span className="text-muted-foreground font-normal">Nothing you don&apos;t.</span>
            </>
          }
          description="Six connected modules that share the same context — your clients, projects, and goals are always linked."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/40 hover:shadow-sm"
              >
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {mod.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {mod.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-md bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
