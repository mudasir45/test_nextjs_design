'use client';

import { useState } from 'react';
import {
  Calendar,
  Kanban,
  MessageSquare,
  PenLine,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import type { Goal, GoalCheckIn, GoalStatus } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { useGoalDetail } from '@/modules/goals/core/hooks/use-goal-detail';
import { daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import { useGoalsTheme } from '@/modules/goals/provider/GoalsProvider';
import { CheckInModal } from '@/modules/goals/ui/reflect/check-in-modal';
import { KeyResultsEditor } from '@/modules/goals/ui/detail/key-results-editor';
import { MilestoneTracker } from '@/modules/goals/ui/detail/milestone-tracker';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import { Badge } from '@/modules/goals/ui/primitives/badge';
import {
  CATEGORY_LABELS,
  MOOD_OPTIONS,
  STATUS_STYLES,
} from '@/modules/goals/theme/goals-theme';

interface GoalDetailPanelProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
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

export function GoalDetailPanel({
  goal,
  open,
  onClose,
  onUpdate,
  onDelete,
  onAddCheckIn,
  onToggleMilestone,
  onUpdateKeyResult,
}: GoalDetailPanelProps) {
  const theme = useGoalsTheme();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const showCelebration = goal?.status === 'completed' && open;

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

  if (!open || !goal) return null;

  const days = daysUntil(goal.targetDate);
  const statusStyle = STATUS_STYLES[goal.status];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {showCelebration && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center overflow-hidden py-4">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute animate-bounce text-lg"
                style={{
                  left: `${8 + i * 7}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.5s',
                }}
              >
                ✨
              </span>
            ))}
          </div>
        )}

        <div
          className="h-1.5 shrink-0"
          style={{ backgroundColor: goal.color }}
        />

        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge className={cn('border-0', statusStyle.className)}>
                {statusStyle.label}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {CATEGORY_LABELS[goal.category]}
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-foreground">{goal.title}</h2>
          </div>
          <div className="flex items-center gap-1">
            <ProgressRing value={progress} color={goal.color} size={48} />
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {goal.motivation && (
            <section className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                Why this matters
              </p>
              <p className="text-sm italic text-foreground">&ldquo;{goal.motivation}&rdquo;</p>
            </section>
          )}

          {goal.description && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </section>
          )}

          <section className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {goal.targetDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Due {formatDueDate(goal.targetDate)}
                {days !== null && days >= 0 && ` (${days}d left)`}
              </span>
            )}
            {goal.reviewFrequency && (
              <span className="capitalize">Review: {goal.reviewFrequency}</span>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Milestones</h3>
            </div>
            <MilestoneTracker
              milestones={sortedMilestones}
              onToggle={toggleMilestone}
              color={goal.color}
            />
          </section>

          {goal.keyResults.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Key Results</h3>
              <KeyResultsEditor
                keyResults={goal.keyResults}
                onUpdate={updateKeyResult}
              />
            </section>
          )}

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <MessageSquare className="h-4 w-4" />
                Check-ins
              </h3>
              <button
                type="button"
                onClick={() => setCheckInOpen(true)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  theme.buttonCta,
                )}
              >
                <PenLine className="h-3 w-3" />
                Log Progress
              </button>
            </div>
            {goal.checkIns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No check-ins yet. Log your first progress update!
              </p>
            ) : (
              <div className="space-y-3">
                {goal.checkIns.map((ci) => {
                  const moodOpt = MOOD_OPTIONS.find((m) => m.value === ci.mood);
                  return (
                    <div
                      key={ci.id}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(ci.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          {moodOpt && (
                            <span title={moodOpt.label}>{moodOpt.emoji}</span>
                          )}
                          <span className="text-xs font-semibold tabular-nums text-teal-600 dark:text-teal-400">
                            {ci.progressSnapshot}%
                          </span>
                        </div>
                      </div>
                      <p className="mt-1.5 text-sm text-foreground">{ci.note}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['draft', 'active', 'on_hold', 'completed', 'archived'] as GoalStatus[]).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateField({ status: s })}
                    className={cn(
                      'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
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

        <div className="flex items-center justify-between border-t border-border p-4">
          <Link
            href={`/kanban?scope=goal&goalId=${goal.id}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-500/10 dark:text-teal-400"
          >
            <Kanban className="h-4 w-4" />
            View Tasks
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm('Delete this goal? This cannot be undone.')) {
                onDelete(goal.id);
                onClose();
              }
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </aside>

      <CheckInModal
        open={checkInOpen}
        goalTitle={goal.title}
        currentProgress={progress}
        onClose={() => setCheckInOpen(false)}
        onSubmit={(data) => {
          logCheckIn({
            ...data,
            date: new Date().toISOString(),
          });
        }}
      />
    </>
  );
}
