import type { GoalMilestone, MilestoneTargetType } from './types';
import { TARGET_TYPE_DEFAULTS, calculateMilestoneProgress } from './progress-utils';
import type { Goal } from './types';

/** Ensure legacy milestones without targetType still work. */
export function normalizeMilestone(m: GoalMilestone): GoalMilestone {
  const targetType = m.targetType ?? 'boolean';
  const defaults = TARGET_TYPE_DEFAULTS[targetType];
  return {
    ...defaults,
    ...m,
    targetType,
    currentValue: m.currentValue ?? defaults.currentValue ?? m.startValue ?? 0,
  };
}

export function normalizeMilestones(milestones: GoalMilestone[]): GoalMilestone[] {
  return milestones.map(normalizeMilestone);
}

export function isMilestoneComplete(m: GoalMilestone): boolean {
  const normalized = normalizeMilestone(m);
  switch (normalized.targetType) {
    case 'boolean':
      return normalized.status === 'completed';
    case 'number':
    case 'currency': {
      const target = normalized.targetValue ?? 0;
      const current = normalized.currentValue ?? 0;
      return current >= target || normalized.status === 'completed';
    }
    case 'tasks': {
      const target = normalized.taskTarget ?? 0;
      if (target <= 0) return false;
      const done = normalized.taskCompleted ?? 0;
      return done >= target;
    }
    default:
      return normalized.status === 'completed';
  }
}

export function defaultMilestoneFields(
  targetType: MilestoneTargetType,
): Partial<GoalMilestone> {
  return {
    targetType,
    ...TARGET_TYPE_DEFAULTS[targetType],
    status: 'pending',
  };
}

export function normalizeGoal(goal: Goal): Goal {
  const milestones = normalizeMilestones(goal.milestones ?? []);
  const hasMilestones = milestones.length > 0;
  return {
    ...goal,
    milestones,
    keyResults: goal.keyResults ?? [],
    progressType: hasMilestones ? 'milestone' : goal.progressType,
    progressValue: hasMilestones
      ? calculateMilestoneProgress(milestones)
      : goal.progressValue,
  };
}

export function syncMilestoneStatuses(milestones: GoalMilestone[]): GoalMilestone[] {
  return milestones.map((m) => {
    const normalized = normalizeMilestone(m);
    const complete = isMilestoneComplete(normalized);
    return {
      ...normalized,
      status: complete ? ('completed' as const) : ('pending' as const),
      completedAt: complete
        ? normalized.completedAt ?? new Date().toISOString()
        : undefined,
    };
  });
}
