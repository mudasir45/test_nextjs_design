'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import {
  ArrowLeft,
  Calendar,
  Frown,
  Kanban,
  Meh,
  Smile,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useGoals } from '@/modules/goals/core/hooks/use-goals';
import { useGoalDetail } from '@/modules/goals/core/hooks/use-goal-detail';
import type { Goal, GoalCheckIn, GoalStatus, MilestoneDraft } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { getEffectiveProgress, daysUntil, formatDueDate } from '@/modules/goals/core/progress-utils';
import { getTodayCheckIn } from '@/modules/goals/core/check-in-utils';
import { useKanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { useSyncMilestoneTasksFromKanban } from '@/modules/goals/ui/milestones/milestone-tasks-section';
import {
  useGoalsContextOptional,
  useGoalsRoutes,
  useGoalsTheme,
} from '@/modules/goals/provider/GoalsProvider';
import { DEFAULT_GOALS } from '@/modules/goals/demo/default-goals';
import { createDefaultLocalStorageAdapter, DEFAULT_STORAGE_KEY } from '@/modules/goals/core/adapters';
import { CheckInPanel, MOMENTUM_STAGES } from '@/modules/goals/ui/reflect/check-in-panel';
import { MilestonesPanel } from '@/modules/goals/ui/milestones/milestones-panel';
import { isMilestoneComplete } from '@/modules/goals/core/milestone-utils';
import { ProgressRing } from '@/modules/goals/ui/shared/progress-ring';
import {
  CATEGORY_LABELS,
  MOOD_OPTIONS,
  STATUS_STYLES,
} from '@/modules/goals/theme/goals-theme';

const MOOD_ICONS = {
  struggling: Frown,
  ok: Meh,
  good: Smile,
  great: Sparkles,
};

interface GoalDetailPageProps {
  goalId: string;
}

export function GoalDetailPage({ goalId }: GoalDetailPageProps) {
  const router = useRouter();
  const ctx = useGoalsContextOptional();
  const theme = useGoalsTheme();
  const routes = useGoalsRoutes();

  const adapter =
    ctx?.adapter ?? createDefaultLocalStorageAdapter(ctx?.storageKey ?? DEFAULT_STORAGE_KEY);
  const seedGoals = ctx?.initialGoals ?? DEFAULT_GOALS;

  const {
    goals,
    hydrated,
    updateGoal,
    deleteGoal,
    addCheckIn,
    toggleMilestone: toggleMilestoneStore,
    updateMilestone: updateMilestoneStore,
    addMilestone: addMilestoneStore,
    removeMilestone: removeMilestoneStore,
  } = useGoals({
    storageKey: ctx?.storageKey ?? DEFAULT_STORAGE_KEY,
    initialGoals: seedGoals,
    adapter,
  });

  const goal = goals.find((g) => g.id === goalId) ?? null;
  const kanban = useKanbanBridge(goals);

  const syncTaskMilestone = useCallback(
    (milestoneId: string, updates: { taskTarget: number; taskCompleted: number }) => {
      updateMilestoneStore(goalId, milestoneId, updates);
    },
    [goalId, updateMilestoneStore],
  );

  useSyncMilestoneTasksFromKanban(
    goal?.milestones ?? [],
    kanban,
    syncTaskMilestone,
  );

  const todayCheckIn = goal ? getTodayCheckIn(goal.checkIns) : undefined;

  const handleAddMilestone = useCallback(
    (draft: MilestoneDraft) => {
      const created = addMilestoneStore(goalId, draft);
      if (!created || draft.targetType !== 'tasks') return;

      const hasTasks =
        (draft.newTaskTitles?.length ?? 0) + (draft.linkTaskIds?.length ?? 0) > 0;
      if (!hasTasks) return;

      const stats = kanban.applyMilestoneTaskDraft(created.id, goalId, draft);
      updateMilestoneStore(goalId, created.id, {
        taskTarget: stats.total,
        taskCompleted: stats.done,
      });
    },
    [goalId, addMilestoneStore, kanban, updateMilestoneStore],
  );

  const {
    progress,
    sortedMilestones,
    logCheckIn,
    toggleMilestone,
    updateMilestone,
    removeMilestone,
    updateField,
  } = useGoalDetail({
    goal,
    onUpdate: updateGoal,
    onAddCheckIn: addCheckIn,
    onToggleMilestone: toggleMilestoneStore,
    onUpdateMilestone: updateMilestoneStore,
    onAddMilestone: addMilestoneStore,
    onRemoveMilestone: removeMilestoneStore,
    onUpdateKeyResult: () => {},
  });

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-muted-foreground">This goal could not be found.</p>
        <Link
          href={routes.index}
          className="mt-4 inline-flex text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          Back to goals
        </Link>
      </div>
    );
  }

  const days = daysUntil(goal.targetDate);
  const statusStyle = STATUS_STYLES[goal.status];
  const why = goal.motivation || goal.description || goal.title;
  const effectiveProgress = getEffectiveProgress(goal);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {/* Hero — motivation first */}
      <section
        className="relative overflow-hidden border-b border-border/40 px-6 py-16 md:px-10 md:py-20 lg:px-16"
        style={{
          background: `linear-gradient(160deg, ${goal.color}22 0%, ${goal.color}08 40%, transparent 70%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: goal.color }}
        />

        <div className="relative mx-auto max-w-4xl">
          <Link
            href={routes.index}
            className="mb-8 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All goals
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusStyle.className)}>
              {statusStyle.label}
            </span>
            <span className="rounded-full bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground">
              {CATEGORY_LABELS[goal.category]}
            </span>
          </div>

          <blockquote className="text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl lg:leading-[1.15]">
            &ldquo;{why}&rdquo;
          </blockquote>

          <p className="mt-6 text-lg font-semibold text-muted-foreground md:text-xl">
            {goal.title}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8">
            <ProgressRing
              value={effectiveProgress}
              color={goal.color}
              size={88}
              strokeWidth={6}
            />
            <div className="space-y-2 text-sm text-muted-foreground">
              {goal.targetDate && (
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Target · {formatDueDate(goal.targetDate)}
                  {days !== null && days >= 0 && (
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {days} days left
                    </span>
                  )}
                </p>
              )}
              {goal.milestones.length > 0 && (
                <p>
                  {goal.milestones.filter((m) => isMilestoneComplete(m)).length} of{' '}
                  {goal.milestones.length} milestones on track
                </p>
              )}
              {goal.reviewFrequency && (
                <p className="capitalize">Review · {goal.reviewFrequency}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Linked content — reflect first when you open a goal */}
      <div className="mx-auto max-w-4xl space-y-12 px-6 py-12 md:px-10 lg:px-16">
        <Section title="Reflect" subtitle="A quick pulse on how this goal feels right now">
          <CheckInPanel
            key={`${goal.id}-${goal.checkIns.length}-${todayCheckIn?.id ?? 'new'}-${progress}`}
            currentProgress={progress}
            progressType={goal.progressType}
            existingTodayCheckIn={todayCheckIn}
            onSubmit={(data) =>
              logCheckIn({ ...data, date: new Date().toISOString() })
            }
          />
          {goal.checkIns.filter((ci) => ci.id !== todayCheckIn?.id).length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Past reflections
              </p>
              {goal.checkIns
                .filter((ci) => ci.id !== todayCheckIn?.id)
                .map((ci) => (
                  <ReflectionHistoryCard key={ci.id} checkIn={ci} />
                ))}
            </div>
          )}
        </Section>

        {goal.description && goal.motivation && (
          <Section title="About this goal">
            <p className="text-base leading-relaxed text-muted-foreground">{goal.description}</p>
          </Section>
        )}

        <Section title="Milestones" subtitle="Each milestone has its own way to measure progress">
          <MilestonesPanel
            goalId={goal.id}
            milestones={sortedMilestones}
            kanban={kanban}
            onToggle={toggleMilestone}
            onUpdate={updateMilestone}
            onRemove={removeMilestone}
            onAdd={handleAddMilestone}
            color={goal.color}
          />
        </Section>

        <Section title="Linked work" subtitle="Tasks connected to this goal">
          <Link
            href={routes.kanbanForGoal?.(goal.id) ?? `/kanban?scope=goal&goalId=${goal.id}`}
            className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-card px-6 py-4 transition-all hover:border-teal-500/30 hover:shadow-sm"
          >
            <div className="rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <Kanban className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Open task board</p>
              <p className="text-sm text-muted-foreground">
                View and manage tasks linked to this goal
              </p>
            </div>
          </Link>
        </Section>

        <Section title="Status">
          <div className="flex flex-wrap gap-2">
            {(['active', 'on_hold', 'completed', 'archived'] as GoalStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateField({ status: s })}
                className={cn(
                  'cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  goal.status === s
                    ? STATUS_STYLES[s].className
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {STATUS_STYLES[s].label}
              </button>
            ))}
          </div>
        </Section>

        <div className="border-t border-border/40 pt-8">
          <button
            type="button"
            onClick={() => {
              if (confirm('Remove this goal permanently?')) {
                deleteGoal(goal.id);
                router.push(routes.index);
              }
            }}
            className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete goal
          </button>
        </div>
      </div>
    </div>
  );
}

function ReflectionHistoryCard({ checkIn: ci }: { checkIn: GoalCheckIn }) {
  const MoodIcon = ci.mood ? MOOD_ICONS[ci.mood] : null;
  const moodLabel = MOOD_OPTIONS.find((m) => m.value === ci.mood)?.label;
  const momentumLabel = ci.momentum
    ? MOMENTUM_STAGES.find((m) => m.value === ci.momentum)?.label
    : null;

  return (
    <div className="rounded-xl border border-border/40 bg-muted/20 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {new Date(ci.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        {MoodIcon && moodLabel && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
            <MoodIcon className="h-3 w-3" />
            {moodLabel}
          </span>
        )}
        {momentumLabel && (
          <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:text-teal-400">
            {momentumLabel}
          </span>
        )}
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
        {ci.note}
      </p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
