'use client';

import { useState } from 'react';
import {
  Calendar,
  Frown,
  Kanban,
  MapPin,
  Meh,
  Smile,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import type { Goal, GoalCheckIn, GoalStatus } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { useGoalDetail } from '@/modules/goals/core/hooks/use-goal-detail';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import { CheckInPanel } from '@/modules/goals/ui/reflect/check-in-panel';
import { KeyResultsEditor } from '@/modules/goals/ui/detail/key-results-editor';
import { MilestoneTracker } from '@/modules/goals/ui/detail/milestone-tracker';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import {
  CATEGORY_LABELS,
  MOOD_OPTIONS,
  STATUS_STYLES,
} from '@/modules/goals/theme/goals-theme';

type WorkspaceTab = 'overview' | 'path' | 'reflect';

const MOOD_ICONS = {
  struggling: Frown,
  ok: Meh,
  good: Smile,
  great: Sparkles,
};

interface GoalWorkspaceProps {
  goal: Goal;
  onClose?: () => void;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
  onDelete: (goalId: string) => void;
  onAddCheckIn: (goalId: string, checkIn: Omit<GoalCheckIn, 'id'>) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateKeyResult: (
    goalId: string,
    keyResultId: string,
    updates: Partial<Goal['keyResults'][0]>,
  ) => void;
}

export function GoalWorkspace({
  goal,
  onClose,
  onUpdate,
  onDelete,
  onAddCheckIn,
  onToggleMilestone,
  onUpdateKeyResult,
}: GoalWorkspaceProps) {
  const [tab, setTab] = useState<WorkspaceTab>('overview');

  const {
    progress,
    sortedMilestones,
    logCheckIn,
    toggleMilestone,
    updateKeyResult,
    updateField,
  } = useGoalDetail({
    goal,
    onUpdate,
    onAddCheckIn,
    onToggleMilestone,
    onUpdateMilestone: () => {},
    onAddMilestone: () => null,
    onRemoveMilestone: () => {},
    onUpdateKeyResult,
  });

  const days = daysUntil(goal.targetDate);
  const nextMilestone = sortedMilestones.find((m) => m.status === 'pending');
  const statusStyle = STATUS_STYLES[goal.status];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border/60 px-8 py-6">
        <div className="flex items-start gap-5">
          <ProgressRing value={progress} color={goal.color} size={72} strokeWidth={5} />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', statusStyle.className)}>
                {statusStyle.label}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {CATEGORY_LABELS[goal.category]}
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {goal.title}
            </h2>
            {goal.targetDate && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDueDate(goal.targetDate)}
                {days !== null && days >= 0 && ` · ${days} days left`}
              </p>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-6 flex gap-1.5 rounded-xl bg-muted/40 p-1.5">
          {(
            [
              { id: 'overview' as const, label: 'Overview' },
              { id: 'path' as const, label: 'Path' },
              { id: 'reflect' as const, label: 'Reflect' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 cursor-pointer rounded-lg py-2.5 text-sm font-medium transition-all duration-200',
                tab === t.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        {tab === 'overview' && (
          <div className="space-y-6">
            {goal.motivation && (
              <section className="rounded-2xl border border-teal-500/15 bg-teal-500/[0.04] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  Your why
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground">
                  &ldquo;{goal.motivation}&rdquo;
                </p>
              </section>
            )}

            {nextMilestone && (
              <section className="rounded-2xl border border-border/60 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Next checkpoint
                </div>
                <p className="mt-2 font-medium text-foreground">{nextMilestone.title}</p>
                {nextMilestone.dueDate && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Due {formatDueDate(nextMilestone.dueDate)}
                  </p>
                )}
              </section>
            )}

            {goal.description && (
              <section>
                <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {goal.description}
                </p>
              </section>
            )}

            <section>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Status</h3>
              <div className="flex flex-wrap gap-2">
                {(['active', 'on_hold', 'completed', 'archived'] as GoalStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateField({ status: s })}
                      className={cn(
                        'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                        goal.status === s
                          ? STATUS_STYLES[s].className
                          : 'bg-muted text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {STATUS_STYLES[s].label}
                    </button>
                  ),
                )}
              </div>
            </section>
          </div>
        )}

        {tab === 'path' && (
          <div className="space-y-8">
            <section>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Milestones</h3>
              <MilestoneTracker
                milestones={sortedMilestones}
                onToggle={toggleMilestone}
                color={goal.color}
              />
            </section>
            {goal.keyResults.length > 0 && (
              <section>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Key results</h3>
                <KeyResultsEditor
                  keyResults={goal.keyResults}
                  onUpdate={updateKeyResult}
                />
              </section>
            )}
          </div>
        )}

        {tab === 'reflect' && (
          <div className="space-y-6">
            <CheckInPanel
              key={`${goal.id}-${goal.checkIns.length}-${progress}`}
              currentProgress={progress}
              progressType={goal.progressType}
              onSubmit={(data) =>
                logCheckIn({ ...data, date: new Date().toISOString() })
              }
            />
            {goal.checkIns.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  Past reflections
                </h3>
                <div className="space-y-3">
                  {goal.checkIns.map((ci) => {
                    const MoodIcon = ci.mood ? MOOD_ICONS[ci.mood] : null;
                    const moodLabel = MOOD_OPTIONS.find((m) => m.value === ci.mood)?.label;
                    return (
                      <div
                        key={ci.id}
                        className="rounded-xl border border-border/40 bg-muted/20 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(ci.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            {MoodIcon && (
                              <span title={moodLabel}>
                                <MoodIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              </span>
                            )}
                            <span className="text-xs font-semibold tabular-nums text-teal-600 dark:text-teal-400">
                              {ci.progressSnapshot}%
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-foreground">{ci.note}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-border/60 px-8 py-5">
        <Link
          href={`/kanban?scope=goal&goalId=${goal.id}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-500/10 dark:text-teal-400"
        >
          <Kanban className="h-4 w-4" />
          Open tasks
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm('Remove this goal?')) onDelete(goal.id);
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
