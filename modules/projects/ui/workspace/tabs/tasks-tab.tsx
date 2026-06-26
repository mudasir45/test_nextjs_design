'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, Clock, Kanban } from 'lucide-react';
import type { Project, ProjectKanbanStats } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { useProjectTasks } from '@/modules/projects/core/hooks/use-project-tasks';
import { useProjectsRoutes, useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';
import { ProjectStatsPanel } from '@/modules/projects/ui/detail/project-stats-panel';
import { EmptyState } from '@/modules/projects/ui/shared/empty-state';

interface TasksTabProps {
  project: Project;
  kanbanStats: ProjectKanbanStats;
}

export function TasksTab({ project, kanbanStats }: TasksTabProps) {
  const routes = useProjectsRoutes();
  const theme = useProjectsTheme();
  const tasks = useProjectTasks(project.id);

  const bars = [
    { label: 'Done', value: kanbanStats.done, color: 'bg-emerald-500', total: kanbanStats.total },
    {
      label: 'In progress',
      value: kanbanStats.inProgress,
      color: 'bg-violet-500',
      total: kanbanStats.total,
    },
    { label: 'To do', value: kanbanStats.todo, color: 'bg-zinc-400', total: kanbanStats.total },
  ];

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Task breakdown</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {kanbanStats.total} tasks linked to this project
          </p>
        </div>
        <Link
          href={routes.kanbanForProject(project.id)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors',
            theme.buttonPrimary,
          )}
        >
          <Kanban className="h-4 w-4" />
          Open full board
        </Link>
      </div>

      <ProjectStatsPanel stats={kanbanStats} color={project.color} />

      {kanbanStats.total > 0 && (
        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Completion chart
          </h3>
          <div className="space-y-3 rounded-xl border border-border/60 bg-card p-5">
            {bars.map((bar) => {
              const pct = bar.total > 0 ? Math.round((bar.value / bar.total) * 100) : 0;
              return (
                <div key={bar.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{bar.label}</span>
                    <span className="text-muted-foreground">
                      {bar.value} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn('h-full rounded-full transition-all', bar.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Recent tasks
        </h3>
        {tasks.length === 0 ? (
          <EmptyState
            icon={Kanban}
            title="No tasks linked yet"
            description="Open the Kanban board and link tasks to this project to track progress here."
            action={
              <Link
                href={routes.kanbanForProject(project.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                  theme.buttonPrimary,
                )}
              >
                <Kanban className="h-4 w-4" />
                Open board
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-card">
            {tasks.map((task) => {
              const isDone = /done|complete/i.test(task.columnTitle);
              const isProgress = /progress|doing|active|review/i.test(task.columnTitle);
              const Icon = isDone ? CheckCircle2 : isProgress ? Clock : Circle;
              return (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isDone
                        ? 'text-emerald-500'
                        : isProgress
                          ? 'text-violet-500'
                          : 'text-muted-foreground',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {task.columnTitle}
                      {task.assignee && ` · ${task.assignee}`}
                    </p>
                  </div>
                  {task.priority && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                      {task.priority}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
