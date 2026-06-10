import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Target,
  Users,
} from "lucide-react";

const modules = [
  {
    icon: Target,
    title: "Goals & Milestones",
    description:
      "Set yearly, quarterly, or monthly goals. Break them into milestones with progress tracking and monthly self-reviews.",
    highlights: ["Progress bars", "Streak counter", "On Track / At Risk status"],
  },
  {
    icon: ClipboardList,
    title: "Task Management",
    description:
      "Kanban boards, list views, priorities, due dates, and subtasks. Quick-add from anywhere with keyboard shortcuts.",
    highlights: ["Drag-and-drop Kanban", "Bulk actions", "Smart filters"],
  },
  {
    icon: Users,
    title: "Projects & Clients",
    description:
      "Link projects to clients, invite team members, and see project health at a glance with scoped task boards.",
    highlights: ["Team roles", "Timeline view", "Client profiles"],
  },
  {
    icon: BarChart3,
    title: "Invoicing & Finance",
    description:
      "Build branded invoices, export PDFs, track payment status, log expenses, and see your revenue in one chart.",
    highlights: ["PDF export", "Expense log", "Finance dashboard"],
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description:
      "One home screen: goal completion %, open tasks, this-month revenue, upcoming deadlines, and quick actions.",
    highlights: ["Activity feed", "Deadline alerts", "Quick-create strip"],
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-cta">
            Core modules
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Five modules. One connected workspace.
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Every module shares the same context — your clients, projects, and
            goals are always linked. No more copy-pasting between tools.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              className={`rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:bg-card-hover ${i === modules.length - 1 && modules.length % 3 !== 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft">
                <mod.icon className="h-5 w-5 text-cta" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {mod.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {mod.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {mod.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-secondary"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
