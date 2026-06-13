'use client';

import { useCallback, useMemo } from 'react';
import {
  calculateSingleMilestoneProgress,
  getEffectiveProgress,
} from '../progress-utils';
import { isMilestoneComplete } from '../milestone-utils';
import type { Goal, GoalCheckIn, GoalMilestone, KeyResult, MilestoneDraft } from '../types';

interface UseGoalDetailOptions {
  goal: Goal | null;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
  onAddCheckIn: (goalId: string, checkIn: Omit<GoalCheckIn, 'id'>) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateMilestone: (
    goalId: string,
    milestoneId: string,
    updates: Partial<GoalMilestone>,
  ) => void;
  onAddMilestone: (goalId: string, draft: MilestoneDraft) => GoalMilestone | null;
  onRemoveMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateKeyResult: (
    goalId: string,
    keyResultId: string,
    updates: Partial<KeyResult>,
  ) => void;
}

export function useGoalDetail({
  goal,
  onUpdate,
  onAddCheckIn,
  onToggleMilestone,
  onUpdateMilestone,
  onAddMilestone,
  onRemoveMilestone,
  onUpdateKeyResult,
}: UseGoalDetailOptions) {
  const progress = useMemo(
    () => (goal ? getEffectiveProgress(goal) : 0),
    [goal],
  );

  const completedMilestones = useMemo(
    () =>
      goal?.milestones.filter((m) => isMilestoneComplete(m)).length ?? 0,
    [goal],
  );

  const sortedMilestones = useMemo(() => {
    if (!goal) return [];
    return [...goal.milestones].sort((a, b) => a.order - b.order);
  }, [goal]);

  const updateField = useCallback(
    (updates: Partial<Goal>) => {
      if (!goal) return;
      onUpdate(goal.id, updates);
    },
    [goal, onUpdate],
  );

  const logCheckIn = useCallback(
    (checkIn: Omit<GoalCheckIn, 'id'>) => {
      if (!goal) return;
      onAddCheckIn(goal.id, checkIn);
    },
    [goal, onAddCheckIn],
  );

  const toggleMilestone = useCallback(
    (milestoneId: string) => {
      if (!goal) return;
      onToggleMilestone(goal.id, milestoneId);
    },
    [goal, onToggleMilestone],
  );

  const updateMilestone = useCallback(
    (milestoneId: string, updates: Partial<GoalMilestone>) => {
      if (!goal) return;
      onUpdateMilestone(goal.id, milestoneId, updates);
    },
    [goal, onUpdateMilestone],
  );

  const addMilestone = useCallback(
    (draft: MilestoneDraft) => {
      if (!goal) return null;
      return onAddMilestone(goal.id, draft);
    },
    [goal, onAddMilestone],
  );

  const removeMilestone = useCallback(
    (milestoneId: string) => {
      if (!goal) return;
      onRemoveMilestone(goal.id, milestoneId);
    },
    [goal, onRemoveMilestone],
  );

  const updateKeyResult = useCallback(
    (keyResultId: string, updates: Partial<KeyResult>) => {
      if (!goal) return;
      onUpdateKeyResult(goal.id, keyResultId, updates);
    },
    [goal, onUpdateKeyResult],
  );

  const milestoneProgress = useMemo(() => {
    if (!goal) return [];
    return sortedMilestones.map((m) => ({
      id: m.id,
      progress: calculateSingleMilestoneProgress(m),
    }));
  }, [goal, sortedMilestones]);

  return {
    progress,
    completedMilestones,
    sortedMilestones,
    milestoneProgress,
    updateField,
    logCheckIn,
    toggleMilestone,
    updateMilestone,
    addMilestone,
    removeMilestone,
    updateKeyResult,
  };
}
