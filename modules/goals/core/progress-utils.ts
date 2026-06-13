import type { GoalMilestone, MilestoneTargetType } from './types';

export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Completion ratio 0–100 for a single milestone based on its target type. */
export function calculateSingleMilestoneProgress(milestone: GoalMilestone): number {
  switch (milestone.targetType) {
    case 'boolean':
      return milestone.status === 'completed' ? 100 : 0;
    case 'number':
    case 'currency': {
      const start = milestone.startValue ?? 0;
      const target = milestone.targetValue ?? 1;
      const current = milestone.currentValue ?? start;
      if (target === start) return milestone.status === 'completed' ? 100 : 0;
      const ratio = (current - start) / (target - start);
      return clampProgress(ratio * 100);
    }
    case 'tasks': {
      const target = milestone.taskTarget ?? 0;
      if (target <= 0) return 0;
      const done = milestone.taskCompleted ?? (milestone.status === 'completed' ? target : 0);
      return clampProgress((done / target) * 100);
    }
    default:
      return milestone.status === 'completed' ? 100 : 0;
  }
}

export function calculateMilestoneProgress(milestones: GoalMilestone[]): number {
  if (milestones.length === 0) return 0;
  const total = milestones.reduce(
    (sum, m) => sum + calculateSingleMilestoneProgress(m),
    0,
  );
  return clampProgress(total / milestones.length);
}

export function calculateKeyResultsProgress(
  keyResults: import('./types').KeyResult[],
): number {
  if (keyResults.length === 0) return 0;
  const ratios = keyResults.map((kr) => {
    if (kr.target <= 0) return 0;
    return Math.min(1, kr.current / kr.target);
  });
  const avg = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
  return clampProgress(avg * 100);
}

export function calculateGoalProgress(
  goal: import('./types').Goal,
  linkedTaskProgress?: number,
): number {
  if (goal.milestones.length > 0) {
    return calculateMilestoneProgress(goal.milestones);
  }
  switch (goal.progressType) {
    case 'numeric':
      return calculateKeyResultsProgress(goal.keyResults);
    case 'task_completion':
      return linkedTaskProgress ?? goal.progressValue;
    case 'binary':
      return goal.status === 'completed' ? 100 : 0;
    case 'percentage':
      return clampProgress(goal.progressValue);
    case 'milestone':
    default:
      return clampProgress(goal.progressValue);
  }
}

export function getEffectiveProgress(
  goal: import('./types').Goal,
  linkedTaskProgress?: number,
): number {
  if (goal.milestones.length > 0) {
    return calculateMilestoneProgress(goal.milestones);
  }
  if (goal.progressType === 'percentage') {
    return clampProgress(goal.progressValue);
  }
  return calculateGoalProgress(goal, linkedTaskProgress);
}

export function formatDueDate(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getGoalStats(goals: import('./types').Goal[]) {
  const active = goals.filter((g) => g.status === 'active').length;
  const completed = goals.filter((g) => g.status === 'completed').length;
  const onTrack = goals.filter(
    (g) => g.status === 'active' && getEffectiveProgress(g) >= 50,
  ).length;
  const avgProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, g) => sum + getEffectiveProgress(g), 0) / goals.length,
        )
      : 0;

  return { total: goals.length, active, completed, onTrack, avgProgress };
}

export function formatMilestoneProgressLabel(milestone: GoalMilestone): string {
  switch (milestone.targetType) {
    case 'boolean':
      return milestone.status === 'completed' ? 'Done' : 'Not yet';
    case 'number':
      return `${milestone.currentValue ?? milestone.startValue ?? 0}${milestone.unit ? ` ${milestone.unit}` : ''} → ${milestone.targetValue ?? 0}${milestone.unit ? ` ${milestone.unit}` : ''}`;
    case 'currency':
      return `$${(milestone.currentValue ?? milestone.startValue ?? 0).toLocaleString()} → $${(milestone.targetValue ?? 0).toLocaleString()}`;
    case 'tasks': {
      const target = milestone.taskTarget ?? 0;
      if (target <= 0) return 'Add tasks to track progress';
      return `${milestone.taskCompleted ?? 0} / ${target} tasks done`;
    }
    default:
      return '';
  }
}

export const TARGET_TYPE_DEFAULTS: Record<
  MilestoneTargetType,
  Pick<GoalMilestone, 'startValue' | 'targetValue' | 'currentValue' | 'taskTarget' | 'taskCompleted'>
> = {
  boolean: {},
  number: { startValue: 0, targetValue: 10, currentValue: 0 },
  currency: { startValue: 0, targetValue: 1000, currentValue: 0 },
  tasks: { taskTarget: 0, taskCompleted: 0 },
};
