'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateId } from '../adapters';
import type { GoalsStorageAdapter } from '../adapters/types';
import { getTodayCheckIn } from '../check-in-utils';
import {
  countMilestoneTaskStats,
  persistMilestoneTaskDrafts,
} from '../kanban-task-bridge';
import {
  defaultMilestoneFields,
  normalizeGoal,
  syncMilestoneStatuses,
} from '../milestone-utils';
import { calculateMilestoneProgress, getEffectiveProgress } from '../progress-utils';
import type {
  CreateGoalPayload,
  Goal,
  GoalCheckIn,
  GoalMilestone,
  GoalsFilterState,
  KeyResult,
  MilestoneDraft,
} from '../types';
import { DEFAULT_FILTERS } from '../types';

interface UseGoalsOptions {
  storageKey: string;
  initialGoals: Goal[];
  adapter: GoalsStorageAdapter;
  onGoalsChange?: (goals: Goal[]) => void;
}

function filterGoals(goals: Goal[], filters: GoalsFilterState): Goal[] {
  return goals.filter((goal) => {
    if (filters.category !== 'all' && goal.category !== filters.category) return false;
    if (filters.status !== 'all' && goal.status !== filters.status) return false;
    if (filters.priority !== 'all' && goal.priority !== filters.priority) return false;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const haystack = [
        goal.title,
        goal.description,
        goal.motivation,
        ...(goal.tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function withSyncedMilestones(goal: Goal, milestones: GoalMilestone[]): Goal {
  const synced = syncMilestoneStatuses(milestones);
  const progressValue = calculateMilestoneProgress(synced);
  return {
    ...goal,
    milestones: synced,
    progressType: 'milestone',
    progressValue,
    updatedAt: new Date().toISOString(),
  };
}

function tasksDraftTotal(draft: MilestoneDraft): number {
  return (draft.newTaskTitles?.length ?? 0) + (draft.linkTaskIds?.length ?? 0);
}

function draftToMilestone(draft: MilestoneDraft, order: number): GoalMilestone {
  const targetType = draft.targetType ?? 'boolean';
  const taskTotal = targetType === 'tasks' ? tasksDraftTotal(draft) : 0;
  return {
    id: generateId('ms'),
    title: draft.title,
    targetType,
    dueDate: draft.dueDate,
    status: 'pending',
    order,
    ...defaultMilestoneFields(targetType),
    startValue: draft.startValue ?? defaultMilestoneFields(targetType).startValue,
    targetValue: draft.targetValue ?? defaultMilestoneFields(targetType).targetValue,
    currentValue: draft.startValue ?? defaultMilestoneFields(targetType).currentValue ?? 0,
    unit: draft.unit,
    taskTarget: taskTotal,
    taskCompleted: 0,
  };
}

export function useGoals({
  storageKey: _storageKey,
  initialGoals,
  adapter,
  onGoalsChange,
}: UseGoalsOptions) {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const seed = initialGoals.map(normalizeGoal);
    if (typeof window === 'undefined') return seed;
    const stored = adapter.loadGoals();
    const loaded = stored?.length ? stored.map(normalizeGoal) : seed;
    return loaded;
  });
  const [filters, setFilters] = useState<GoalsFilterState>(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTERS;
    return adapter.loadFilters() ?? DEFAULT_FILTERS;
  });
  const [hydrated] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveGoals(goals);
    onGoalsChange?.(goals);
  }, [goals, hydrated, adapter, onGoalsChange]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveFilters(filters);
  }, [filters, hydrated, adapter]);

  const filteredGoals = useMemo(
    () => filterGoals(goals, filters),
    [goals, filters],
  );

  const createGoal = useCallback((payload: CreateGoalPayload) => {
    const now = new Date().toISOString();
    const drafts = payload.milestones ?? [];
    let milestones = drafts.map((m, i) => draftToMilestone(m, i));
    const keyResults: KeyResult[] = [];

    const goalId = generateId('goal');
    let goal: Goal = normalizeGoal({
      id: goalId,
      title: payload.title,
      description: payload.description,
      motivation: payload.motivation,
      category: payload.category,
      status: 'active',
      priority: payload.priority,
      color: payload.color,
      progressType: 'milestone',
      progressValue: 0,
      keyResults,
      milestones,
      startDate: now,
      targetDate: payload.targetDate,
      reviewFrequency: payload.reviewFrequency,
      tags: payload.tags ?? [],
      checkIns: [],
      createdAt: now,
      updatedAt: now,
    });

    if (typeof window !== 'undefined' && drafts.some((d) => d.targetType === 'tasks')) {
      const columns = persistMilestoneTaskDrafts(goalId, drafts, goal.milestones);
      milestones = goal.milestones.map((m) => {
        if (m.targetType !== 'tasks') return m;
        const stats = countMilestoneTaskStats(columns, m.id);
        return { ...m, taskTarget: stats.total, taskCompleted: stats.done };
      });
      goal = normalizeGoal({ ...goal, milestones });
    }

    setGoals((prev) => [goal, ...prev]);
    return goal;
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updated = { ...g, ...updates, updatedAt: new Date().toISOString() };
        if (updates.status === 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toISOString();
          updated.progressValue = 100;
        }
        return normalizeGoal(updated);
      }),
    );
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  const addCheckIn = useCallback(
    (goalId: string, checkIn: Omit<GoalCheckIn, 'id'>) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          const existingToday = getTodayCheckIn(g.checkIns);
          const entry: GoalCheckIn = existingToday
            ? { ...existingToday, ...checkIn, date: existingToday.date }
            : { id: generateId('ci'), ...checkIn };

          const checkIns = existingToday
            ? g.checkIns.map((ci) => (ci.id === existingToday.id ? entry : ci))
            : [entry, ...g.checkIns];

          const updates: Partial<Goal> = {
            checkIns,
            updatedAt: new Date().toISOString(),
          };
          if (g.progressType === 'percentage' && g.milestones.length === 0) {
            updates.progressValue = checkIn.progressSnapshot;
          }
          const progress = getEffectiveProgress({ ...g, ...updates });
          if (progress >= 100 && g.status === 'active') {
            updates.status = 'completed';
            updates.completedAt = new Date().toISOString();
          }
          return normalizeGoal({ ...g, ...updates });
        }),
      );
    },
    [],
  );

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const completed = m.status === 'completed';
          if (m.targetType === 'boolean' || !m.targetType) {
            return {
              ...m,
              status: completed ? ('pending' as const) : ('completed' as const),
              completedAt: completed ? undefined : new Date().toISOString(),
            };
          }
          if (completed) {
            return {
              ...m,
              status: 'pending' as const,
              completedAt: undefined,
              currentValue: m.startValue ?? 0,
              taskCompleted: 0,
            };
          }
          return {
            ...m,
            status: 'completed' as const,
            completedAt: new Date().toISOString(),
            currentValue: m.targetValue ?? m.currentValue,
            taskCompleted: m.taskTarget ?? m.taskCompleted,
          };
        });
        return withSyncedMilestones(g, milestones);
      }),
    );
  }, []);

  const updateMilestone = useCallback(
    (goalId: string, milestoneId: string, updates: Partial<GoalMilestone>) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          const milestones = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, ...updates } : m,
          );
          return withSyncedMilestones(g, milestones);
        }),
      );
    },
    [],
  );

  const addMilestone = useCallback((goalId: string, draft: MilestoneDraft): GoalMilestone | null => {
    let created: GoalMilestone | null = null;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestone = draftToMilestone(draft, g.milestones.length);
        created = milestone;
        return withSyncedMilestones(g, [...g.milestones, milestone]);
      }),
    );
    return created;
  }, []);

  const removeMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones
          .filter((m) => m.id !== milestoneId)
          .map((m, i) => ({ ...m, order: i }));
        return withSyncedMilestones(g, milestones);
      }),
    );
  }, []);

  const updateKeyResult = useCallback(
    (goalId: string, keyResultId: string, updates: Partial<KeyResult>) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          const keyResults = g.keyResults.map((kr) =>
            kr.id === keyResultId ? { ...kr, ...updates } : kr,
          );
          return { ...g, keyResults, updatedAt: new Date().toISOString() };
        }),
      );
    },
    [],
  );

  const resetGoals = useCallback(() => {
    adapter.clearGoals();
    setGoals(initialGoals.map(normalizeGoal));
    setFilters(DEFAULT_FILTERS);
  }, [adapter, initialGoals]);

  const goalsWithProgress = useMemo(
    () =>
      filteredGoals.map((g) => ({
        ...g,
        effectiveProgress: getEffectiveProgress(g),
      })),
    [filteredGoals],
  );

  return {
    goals,
    filteredGoals: goalsWithProgress,
    filters,
    setFilters,
    hydrated,
    createGoal,
    updateGoal,
    deleteGoal,
    addCheckIn,
    toggleMilestone,
    updateMilestone,
    addMilestone,
    removeMilestone,
    updateKeyResult,
    resetGoals,
  };
}
