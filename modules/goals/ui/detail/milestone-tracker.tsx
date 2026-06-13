'use client';

import { Check, Circle } from 'lucide-react';
import { cn } from '@/modules/goals/core/cn';
import { normalizeMilestone } from '@/modules/goals/core/milestone-utils';
import {
  calculateSingleMilestoneProgress,
  formatDueDate,
  formatMilestoneProgressLabel,
} from '@/modules/goals/core/progress-utils';
import type { GoalMilestone } from '@/modules/goals/core/types';
import { getTargetTypeMeta } from '@/modules/goals/theme/milestone-target-types';

interface MilestoneTrackerProps {
  milestones: GoalMilestone[];
  onToggle: (milestoneId: string) => void;
  color?: string;
}

/** Compact milestone list — use MilestonesPanel for full add/edit experience. */
export function MilestoneTracker({
  milestones,
  onToggle,
  color = '#0D9488',
}: MilestoneTrackerProps) {
  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No milestones yet. Add one to track progress.</p>
    );
  }

  return (
    <div className="space-y-0">
      {sorted.map((milestone, index) => {
        const m = normalizeMilestone(milestone);
        const meta = getTargetTypeMeta(m.targetType);
        const Icon = meta.icon;
        const progress = calculateSingleMilestoneProgress(m);
        const isCompleted = progress >= 100 || m.status === 'completed';
        const isLast = index === sorted.length - 1;

        return (
          <div key={milestone.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onToggle(milestone.id)}
                className={cn(
                  'flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200',
                  isCompleted
                    ? 'border-transparent text-white'
                    : 'border-muted-foreground/30 bg-card hover:border-teal-500',
                )}
                style={isCompleted ? { backgroundColor: color } : undefined}
                aria-label={`Toggle ${milestone.title}`}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Icon className="h-3 w-3 text-muted-foreground/70" />
                )}
              </button>
              {!isLast && (
                <div
                  className={cn(
                    'my-1 min-h-[24px] w-0.5 flex-1 transition-colors duration-300',
                    isCompleted ? 'bg-teal-500' : 'bg-muted',
                  )}
                />
              )}
            </div>
            <div className={cn('pb-5', isLast && 'pb-0')}>
              <button
                type="button"
                onClick={() => onToggle(milestone.id)}
                className="cursor-pointer text-left"
              >
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    isCompleted
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground hover:text-teal-700 dark:hover:text-teal-400',
                  )}
                >
                  {milestone.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {meta.shortLabel}
                  {m.targetType !== 'boolean' && ` · ${formatMilestoneProgressLabel(m)}`}
                </p>
                {milestone.dueDate && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Due {formatDueDate(milestone.dueDate)}
                  </p>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
