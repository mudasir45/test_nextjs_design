'use client';

import { Calendar, Kanban, Target } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/modules/goals/ui/primitives/card';
import { Badge } from '@/modules/goals/ui/primitives/badge';
import { cn } from '@/modules/goals/core/cn';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import type { Goal } from '@/modules/goals/core/types';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import {
  CATEGORY_LABELS,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '@/modules/goals/theme/goals-theme';

interface GoalCardProps {
  goal: Goal & { effectiveProgress: number };
  onClick: (goal: Goal) => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const days = daysUntil(goal.targetDate);
  const completedMs = goal.milestones.filter((m) => m.status === 'completed').length;
  const totalMs = goal.milestones.length;
  const statusStyle = STATUS_STYLES[goal.status];

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
      onClick={() => onClick(goal)}
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: goal.color }}
      />
      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge className={cn('border-0', statusStyle.className)}>
                {statusStyle.label}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-medium">
                {CATEGORY_LABELS[goal.category]}
              </Badge>
            </div>
            <h3 className="truncate text-base font-semibold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400">
              {goal.title}
            </h3>
            {goal.motivation && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground italic">
                &ldquo;{goal.motivation}&rdquo;
              </p>
            )}
          </div>
          <ProgressRing value={goal.effectiveProgress} color={goal.color} size={52} />
        </div>

        {totalMs > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Milestones
              </span>
              <span>
                {completedMs}/{totalMs}
              </span>
            </div>
            <div className="flex gap-1">
              {goal.milestones
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors duration-300',
                      m.status === 'completed' ? 'bg-teal-500' : 'bg-muted',
                    )}
                    title={m.title}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {goal.targetDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDueDate(goal.targetDate)}
                {days !== null && days >= 0 && (
                  <span className="text-teal-600 dark:text-teal-400">
                    · {days}d left
                  </span>
                )}
              </span>
            )}
            <Badge className={cn('border-0 text-[10px]', PRIORITY_STYLES[goal.priority].className)}>
              {PRIORITY_STYLES[goal.priority].label}
            </Badge>
          </div>
          <Link
            href={`/kanban?scope=goal&goalId=${goal.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-teal-600 transition-colors hover:bg-teal-500/10 dark:text-teal-400"
          >
            <Kanban className="h-3 w-3" />
            Tasks
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
