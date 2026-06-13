'use client';

import { Calendar, ChevronRight, Kanban } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/modules/goals/core/cn';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import type { Goal } from '@/modules/goals/core/types';
import { Badge } from '@/modules/goals/ui/primitives/badge';
import {
  CATEGORY_LABELS,
  STATUS_STYLES,
} from '@/modules/goals/theme/goals-theme';

interface GoalListRowProps {
  goal: Goal & { effectiveProgress: number };
  onClick: (goal: Goal) => void;
}

export function GoalListRow({ goal, onClick }: GoalListRowProps) {
  const days = daysUntil(goal.targetDate);
  const statusStyle = STATUS_STYLES[goal.status];

  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-lg border border-border/60 bg-card px-4 py-3 transition-all duration-200 hover:border-border hover:shadow-sm"
      onClick={() => onClick(goal)}
    >
      <div
        className="h-10 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: goal.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {goal.title}
          </h3>
          <Badge className={cn('shrink-0 border-0 text-[10px]', statusStyle.className)}>
            {statusStyle.label}
          </Badge>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {CATEGORY_LABELS[goal.category]}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-700"
              style={{ width: `${goal.effectiveProgress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-teal-600 dark:text-teal-400">
            {goal.effectiveProgress}%
          </span>
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground md:flex">
        {goal.targetDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDueDate(goal.targetDate)}
            {days !== null && days >= 0 && ` (${days}d)`}
          </span>
        )}
        <Link
          href={`/kanban?scope=goal&goalId=${goal.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-teal-600 transition-colors hover:bg-teal-500/10 dark:text-teal-400"
        >
          <Kanban className="h-3 w-3" />
          Tasks
        </Link>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
