'use client';

import { ArrowRight, Compass, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Goal } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import { CATEGORY_LABELS, STATUS_STYLES } from '@/modules/goals/theme/goals-theme';

interface GoalsVisionBoardProps {
  goals: (Goal & { effectiveProgress: number })[];
  onGoalClick: (goal: Goal) => void;
  onCreateClick: () => void;
  empty?: boolean;
}

export function GoalsVisionBoard({
  goals,
  onGoalClick,
  onCreateClick,
  empty,
}: GoalsVisionBoardProps) {
  if (empty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-gradient-to-br from-teal-500/[0.04] via-transparent to-violet-500/[0.03] px-8 py-24 text-center">
        <div className="rounded-2xl bg-teal-500/10 p-5 text-teal-600 dark:text-teal-400">
          <Compass className="h-12 w-12" />
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
          What are you working toward?
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Start with your &ldquo;why&rdquo; — the reason that keeps you going.
          Everything else follows from that intention.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-10 cursor-pointer rounded-full bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700"
        >
          Define your first goal
        </button>
      </div>
    );
  }

  const [featured, ...rest] = goals;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {featured && (
          <FeaturedIntention goal={featured} onClick={() => onGoalClick(featured)} />
        )}

        {rest.length > 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              More intentions
            </p>
            {rest.map((goal, i) => (
              <IntentionPanel
                key={goal.id}
                goal={goal}
                index={i}
                onClick={() => onGoalClick(goal)}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onCreateClick}
          className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/70 py-8 transition-all hover:border-teal-500/40 hover:bg-teal-500/[0.03]"
        >
          <div className="rounded-full bg-muted/60 p-2.5 transition-colors group-hover:bg-teal-500/15">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-teal-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400">
            Add another intention
          </span>
        </button>
      </div>
    </div>
  );
}

function FeaturedIntention({
  goal,
  onClick,
}: {
  goal: Goal & { effectiveProgress: number };
  onClick: () => void;
}) {
  const days = daysUntil(goal.targetDate);
  const statusStyle = STATUS_STYLES[goal.status];
  const why = goal.motivation || goal.description || goal.title;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-border/50 p-10 text-left transition-all duration-300 hover:border-teal-500/30 hover:shadow-xl md:p-12"
      style={{
        background: `linear-gradient(135deg, ${goal.color}18 0%, transparent 50%), var(--card)`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: goal.color }}
      />

      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-400">
            Primary focus
          </span>
          <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', statusStyle.className)}>
            {statusStyle.label}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {CATEGORY_LABELS[goal.category]}
          </span>
        </div>

        <blockquote className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl md:leading-tight">
          &ldquo;{why}&rdquo;
        </blockquote>

        <p className="mt-5 text-base font-semibold text-muted-foreground">
          {goal.title}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border/40 pt-6">
          <ProgressRing value={goal.effectiveProgress} color={goal.color} size={64} strokeWidth={5} />
          <div className="flex-1 space-y-1 text-sm text-muted-foreground">
            {goal.targetDate && (
              <p>
                Target · {formatDueDate(goal.targetDate)}
                {days !== null && days >= 0 && (
                  <span className="ml-2 font-medium text-teal-600 dark:text-teal-400">
                    {days} days left
                  </span>
                )}
              </p>
            )}
            {goal.milestones.length > 0 && (
              <p>
                {goal.milestones.filter((m) => m.status === 'completed').length} of{' '}
                {goal.milestones.length} checkpoints complete
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-teal-400">
            Open goal
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
}

function IntentionPanel({
  goal,
  index,
  onClick,
}: {
  goal: Goal & { effectiveProgress: number };
  index: number;
  onClick: () => void;
}) {
  const days = daysUntil(goal.targetDate);
  const statusStyle = STATUS_STYLES[goal.status];
  const why = goal.motivation || goal.description || goal.title;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full cursor-pointer gap-5 rounded-2xl border border-border/50 p-6 text-left transition-all duration-200',
        'hover:border-teal-500/25 hover:shadow-md md:gap-8 md:p-8',
        index % 2 === 1 && 'md:flex-row-reverse md:text-right',
      )}
      style={{
        background: `linear-gradient(${index % 2 === 0 ? '90deg' : '270deg'}, ${goal.color}0a 0%, transparent 40%), var(--card)`,
      }}
    >
      <div className="hidden shrink-0 md:block">
        <ProgressRing value={goal.effectiveProgress} color={goal.color} size={56} />
      </div>

      <div className="min-w-0 flex-1">
        <div className={cn('mb-3 flex flex-wrap items-center gap-2', index % 2 === 1 && 'md:justify-end')}>
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusStyle.className)}>
            {statusStyle.label}
          </span>
          <span className="text-[10px] text-muted-foreground">{CATEGORY_LABELS[goal.category]}</span>
        </div>

        <blockquote className="text-lg font-medium leading-relaxed text-foreground md:text-xl">
          &ldquo;{why}&rdquo;
        </blockquote>

        <p className="mt-3 text-sm font-semibold text-muted-foreground">{goal.title}</p>

        <div className={cn('mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground', index % 2 === 1 && 'md:justify-end')}>
          <span className="font-semibold tabular-nums text-teal-600 md:hidden dark:text-teal-400">
            {goal.effectiveProgress}%
          </span>
          {goal.targetDate && (
            <span>
              {formatDueDate(goal.targetDate)}
              {days !== null && days >= 0 && ` · ${days}d`}
            </span>
          )}
          <Link
            href={`/kanban?scope=goal&goalId=${goal.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Tasks
          </Link>
          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </button>
  );
}
