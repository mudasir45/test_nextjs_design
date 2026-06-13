export type GoalStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'archived';
export type GoalCategory =
  | 'professional'
  | 'personal'
  | 'financial'
  | 'health'
  | 'learning'
  | 'other';
export type GoalPriority = 'low' | 'medium' | 'high';
export type ProgressType =
  | 'percentage'
  | 'numeric'
  | 'milestone'
  | 'task_completion'
  | 'binary';
export type ReviewFrequency = 'weekly' | 'biweekly' | 'monthly';
export type CheckInMood = 'struggling' | 'ok' | 'good' | 'great';
export type ReflectionMomentum =
  | 'starting'
  | 'steady'
  | 'progressing'
  | 'momentum'
  | 'breakthrough';
export type MilestoneStatus = 'pending' | 'completed';
export type GoalsViewMode = 'grid' | 'list';

/** How a milestone's progress is measured — inspired by target types, iMergix style. */
export type MilestoneTargetType = 'boolean' | 'number' | 'currency' | 'tasks';

export interface KeyResult {
  id: string;
  title: string;
  current: number;
  target: number;
  unit?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetType: MilestoneTargetType;
  dueDate?: string;
  completedAt?: string;
  status: MilestoneStatus;
  order: number;
  /** number & currency */
  startValue?: number;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  /** tasks type */
  taskTarget?: number;
  taskCompleted?: number;
}

/** Draft shape for creating milestones in forms. */
export interface MilestoneDraft {
  title: string;
  targetType: MilestoneTargetType;
  dueDate?: string;
  startValue?: number;
  targetValue?: number;
  unit?: string;
  /** Tasks to create when the milestone is saved (tasks type). */
  newTaskTitles?: string[];
  /** Existing board task ids to link when the milestone is saved. */
  linkTaskIds?: string[];
}

export interface GoalCheckIn {
  id: string;
  date: string;
  note: string;
  progressSnapshot: number;
  mood?: CheckInMood;
  momentum?: ReflectionMomentum;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  /** Emotional "why" — drives motivation and recall. */
  motivation?: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  color: string;
  icon?: string;
  progressType: ProgressType;
  progressValue: number;
  keyResults: KeyResult[];
  milestones: GoalMilestone[];
  startDate: string;
  targetDate?: string;
  completedAt?: string;
  reviewFrequency?: ReviewFrequency;
  assigneeIds?: string[];
  tags?: string[];
  checkIns: GoalCheckIn[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalsFilterState {
  category: GoalCategory | 'all';
  status: GoalStatus | 'all';
  priority: GoalPriority | 'all';
  search: string;
}

export const DEFAULT_FILTERS: GoalsFilterState = {
  category: 'all',
  status: 'all',
  priority: 'all',
  search: '',
};

export interface CreateGoalPayload {
  title: string;
  description?: string;
  motivation?: string;
  category: GoalCategory;
  priority: GoalPriority;
  color: string;
  progressType?: ProgressType;
  targetDate?: string;
  reviewFrequency?: ReviewFrequency;
  milestones?: MilestoneDraft[];
  tags?: string[];
}

export interface GoalsModuleProps {
  storageKey?: string;
  initialGoals?: Goal[];
  adapter?: import('./adapters/types').GoalsStorageAdapter;
  onGoalsChange?: (goals: Goal[]) => void;
  className?: string;
}
