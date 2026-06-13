'use client';

import { ChevronRight } from 'lucide-react';
import type { Goal } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import { STATUS_STYLES } from '@/modules/goals/theme/goals-theme';

interface GoalRowCompactProps {
  goal: Goal & { effectiveProgress: number };
  selected?: boolean;
  onClick: (goal: Goal) => void;
}

export function GoalRowCompact({ goal, selected, onClick }: GoalRowCompactProps) {
  const statusStyle = STATUS_STYLES[goal.status];

  return (
    <button
      type="button"
      onClick={() => onClick(goal)}
      className={cn(
        'group flex w-full cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all duration-200',
        selected
          ? 'border-teal-500/30 bg-teal-500/[0.04]'
          : 'border-transparent hover:border-border/60 hover:bg-muted/30',
      )}
    >
      <div
        className="h-8 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: goal.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {goal.title}
          </span>
          <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold', statusStyle.className)}>
            {statusStyle.label}
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-500"
            style={{ width: `${goal.effectiveProgress}%` }}
          />
        </div>
      </div>
      <ProgressRing value={goal.effectiveProgress} color={goal.color} size={36} strokeWidth={3} />
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
