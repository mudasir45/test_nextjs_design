'use client';

import { ArrowUpRight, Calendar, Kanban, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Goal } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import { CATEGORY_LABELS, STATUS_STYLES } from '@/modules/goals/theme/goals-theme';

interface GoalTileCardProps {
  goal: Goal & { effectiveProgress: number };
  selected?: boolean;
  onClick: (goal: Goal) => void;
  /** hero = featured bento tile; featured = large; default = standard mosaic */
  variant?: 'hero' | 'featured' | 'default';
  rank?: number;
}

export function GoalTileCard({
  goal,
  selected,
  onClick,
  variant = 'default',
  rank,
}: GoalTileCardProps) {
  const days = daysUntil(goal.targetDate);
  const completedMs = goal.milestones.filter((m) => m.status === 'completed').length;
  const totalMs = goal.milestones.length;
  const statusStyle = STATUS_STYLES[goal.status];
  const isHero = variant === 'hero';
  const isFeatured = variant === 'featured' || isHero;

  const nextMs = goal.milestones
    .filter((m) => m.status === 'pending')
    .sort((a, b) => a.order - b.order)[0];

  return (
    <button
      type="button"
      onClick={() => onClick(goal)}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300',
        isHero ? 'min-h-[300px] p-8' : isFeatured ? 'min-h-[220px] p-6' : 'min-h-[180px] p-5',
        selected
          ? 'border-teal-500/50 shadow-lg ring-2 ring-teal-500/20'
          : 'border-border/50 hover:border-teal-500/30 hover:shadow-md',
      )}
      style={{
        background: `linear-gradient(145deg, ${goal.color}12 0%, transparent 55%), var(--card)`,
      }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: goal.color }}
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {rank !== undefined && isHero && (
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                <Sparkles className="h-3 w-3" />
                Top focus
              </span>
            )}
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  statusStyle.className,
                )}
              >
                {statusStyle.label}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {CATEGORY_LABELS[goal.category]}
              </span>
            </div>
            <h3
              className={cn(
                'font-semibold leading-snug text-foreground transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-400',
                isHero ? 'text-2xl' : isFeatured ? 'text-lg' : 'text-base',
              )}
            >
              {goal.title}
            </h3>
          </div>
          <ProgressRing
            value={goal.effectiveProgress}
            color={goal.color}
            size={isHero ? 72 : isFeatured ? 56 : 48}
            strokeWidth={isHero ? 5 : 4}
          />
        </div>

        {goal.motivation && isFeatured && (
          <p
            className={cn(
              'mt-3 line-clamp-2 leading-relaxed text-muted-foreground',
              isHero ? 'text-sm' : 'text-xs',
            )}
          >
            &ldquo;{goal.motivation}&rdquo;
          </p>
        )}

        {totalMs > 0 && (
          <div className={cn('mt-auto pt-4', !isFeatured && 'pt-3')}>
            <div className="mb-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {completedMs} of {totalMs} checkpoints
              </span>
              <span className="font-semibold tabular-nums text-teal-600 dark:text-teal-400">
                {goal.effectiveProgress}%
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
                      'h-1.5 flex-1 rounded-full transition-colors duration-500',
                      m.status === 'completed' ? 'bg-teal-500' : 'bg-muted/80',
                    )}
                    title={m.title}
                  />
                ))}
            </div>
          </div>
        )}

        <div
          className={cn(
            'mt-4 flex items-center justify-between border-t border-border/30 pt-3',
            !isFeatured && 'mt-3 pt-2',
          )}
        >
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {nextMs ? (
              <span className="line-clamp-1">Next: {nextMs.title}</span>
            ) : goal.targetDate ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 shrink-0" />
                {formatDueDate(goal.targetDate)}
              </span>
            ) : null}
            {days !== null && days >= 0 && (
              <span className="shrink-0 font-medium text-teal-600 dark:text-teal-400">
                {days}d
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Link
              href={`/kanban?scope=goal&goalId=${goal.id}`}
              onClick={(e) => e.stopPropagation()}
              className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-teal-600"
              aria-label="Open tasks"
            >
              <Kanban className="h-3.5 w-3.5" />
            </Link>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </button>
  );
}
