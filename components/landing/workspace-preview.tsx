import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Target,
  TrendingUp,
} from "lucide-react";

const tasks = [
  { title: "Send proposal to Acme", done: false, tag: "High" },
  { title: "Q2 milestone review", done: true, tag: "Goal" },
  { title: "Invoice #INV-014", done: false, tag: "Urgent" },
];

export function WorkspacePreview() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-xl lg:max-w-none"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg dark:shadow-black/40">
        {/* Window controls */}
        <div className="flex items-center justify-between border-b border-border bg-background/50 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            iMergix Workspace
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:grid-rows-2">
          {/* Goal card */}
          <div className="rounded-xl border border-border bg-background p-5 sm:row-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                      Q2 Goal
                    </p>
                    <p className="text-xs font-bold text-foreground">
                      Grow studio revenue
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    68%
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    On track
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-foreground" />
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  4 of 6 milestones complete
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 border-t border-border/40 pt-4">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${task.done ? "text-foreground" : "text-muted-foreground/40"}`}
                  />
                  <span
                    className={`flex-1 truncate text-xs ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {task.title}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {task.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue */}
          <div className="rounded-xl border border-border bg-background p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                <CircleDollarSign className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                This month
              </p>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                $4,280
              </p>
              <p className="mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                +12% vs last month
              </p>
            </div>
          </div>

          {/* Clients */}
          <div className="rounded-xl border border-border bg-background p-5 flex flex-col justify-between">
            <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
              Active projects
            </p>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                5
              </p>
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((initial, i) => (
                  <span
                    key={initial}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-background bg-foreground text-[9px] font-bold text-background"
                    style={{ opacity: 1 - i * 0.15 }}
                  >
                    {initial}
                  </span>
                ))}
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-background bg-muted text-[9px] font-bold text-muted-foreground">
                  +2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
