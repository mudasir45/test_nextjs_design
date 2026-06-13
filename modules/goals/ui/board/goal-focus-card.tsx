'use client';

import { ArrowUpRight, Kanban } from 'lucide-react';
import Link from 'next/link';
import type { Goal } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';

interface GoalFocusCardProps {
  goal: Goal & { effectiveProgress: number };
  selected?: boolean;
  onClick: (goal: Goal) => void;
  rank?: number;
}

export function GoalFocusCard({
  goal,
  selected,
  onClick,
  rank = 1,
}: GoalFocusCardProps) {
  const days = daysUntil(goal.targetDate);
  const nextMs = goal.milestones
    .filter((m) => m.status === 'pending')
    .sort((a, b) => a.order - b.order)[0];

  return (
    <button
      type="button"
      onClick={() => onClick(goal)}
      className={cn(
        'group relative flex w-full cursor-pointer flex-col rounded-2xl border p-6 text-left transition-all duration-300',
        selected
          ? 'border-teal-500/40 bg-teal-500/[0.03] shadow-md ring-1 ring-teal-500/20'
          : 'border-border/60 bg-card hover:border-teal-500/25 hover:shadow-sm',
      )}
    >
      <div
        className="absolute left-0 top-6 h-12 w-1 rounded-r-full"
        style={{ backgroundColor: goal.color }}
      />

      <div className="flex items-start justify-between gap-4 pl-3">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Focus {rank}
          </span>
          <h3 className="mt-1 text-lg font-semibold leading-snug text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400">
            {goal.title}
          </h3>
          {goal.motivation && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {goal.motivation}
            </p>
          )}
        </div>
        <ProgressRing value={goal.effectiveProgress} color={goal.color} size={56} />
      </div>

      <div className="mt-5 flex items-center justify-between pl-3">
        <div className="text-xs text-muted-foreground">
          {nextMs ? (
            <span>Next: {nextMs.title}</span>
          ) : goal.targetDate ? (
            <span>Due {formatDueDate(goal.targetDate)}</span>
          ) : null}
          {days !== null && days >= 0 && (
            <span className="ml-2 text-teal-600 dark:text-teal-400">
              {days}d left
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/kanban?scope=goal&goalId=${goal.id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-teal-600"
            aria-label="Open tasks"
          >
            <Kanban className="h-4 w-4" />
          </Link>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {goal.milestones.length > 0 && (
        <div className="mt-4 flex gap-1 pl-3">
          {goal.milestones
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((m) => (
              <div
                key={m.id}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  m.status === 'completed' ? 'bg-teal-500' : 'bg-muted',
                )}
              />
            ))}
        </div>
      )}
    </button>
  );
}
