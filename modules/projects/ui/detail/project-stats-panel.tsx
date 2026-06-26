'use client';

import { Kanban, ListTodo, Timer } from 'lucide-react';
import type { ProjectKanbanStats } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';

interface ProjectStatsPanelProps {
  stats: ProjectKanbanStats;
  color: string;
}

export function ProjectStatsPanel({ stats, color }: ProjectStatsPanelProps) {
  const items = [
    { label: 'Total tasks', value: stats.total, icon: ListTodo },
    { label: 'In progress', value: stats.inProgress, icon: Timer },
    { label: 'Completed', value: stats.done, icon: Kanban },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <Icon className="h-4 w-4 text-muted-foreground/60" />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
        </div>
      ))}
      <div className="rounded-xl border border-border/60 bg-card p-4 sm:col-span-3">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Task completion</span>
          <span className="font-semibold tabular-nums text-foreground">{stats.completionRate}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all duration-700')}
            style={{ width: `${stats.completionRate}%`, backgroundColor: color }}
          />
        </div>
        {stats.total === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            No tasks linked yet — open the board to add work items.
          </p>
        )}
      </div>
    </div>
  );
}
