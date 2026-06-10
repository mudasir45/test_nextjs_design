import {
  CheckCircle2,
  CircleDollarSign,
  LayoutGrid,
  Target,
} from "lucide-react";

const stats = [
  { label: "Open tasks", value: "12", icon: LayoutGrid, color: "text-blue-500" },
  { label: "Goals done", value: "68%", icon: Target, color: "text-emerald-500" },
  { label: "Revenue", value: "$4.2k", icon: CircleDollarSign, color: "text-violet-500" },
];

const tasks = [
  { title: "Client proposal draft", project: "Acme Studio", priority: "High", done: false },
  { title: "Invoice #INV-2026-014", project: "Bright Labs", priority: "Urgent", done: false },
  { title: "Q2 milestone review", project: "Personal", priority: "Medium", done: true },
];

const priorityColors: Record<string, string> = {
  High: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Urgent: "bg-red-500/15 text-red-600 dark:text-red-400",
  Medium: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
};

export function DashboardPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-1 shadow-lg"
    >
      <div className="rounded-xl bg-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Good morning</p>
            <p className="text-sm font-semibold text-foreground">Your workspace</p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-3"
            >
              <stat.icon className={`mb-1 h-3.5 w-3.5 ${stat.color}`} />
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="mb-2 text-xs font-medium text-muted">Upcoming</p>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.title}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
            >
              <CheckCircle2
                className={`h-3.5 w-3.5 shrink-0 ${task.done ? "text-emerald-500" : "text-muted"}`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-xs font-medium ${task.done ? "text-muted line-through" : "text-foreground"}`}
                >
                  {task.title}
                </p>
                <p className="truncate text-[10px] text-muted">{task.project}</p>
              </div>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
