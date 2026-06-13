/**
 * @imergix/goals — portable Goals management module for Next.js apps
 *
 * @see INTEGRATION.md for production setup, API wiring, and Kanban linking.
 * @see README.md for folder structure.
 */

// ── Pages ──────────────────────────────────────────────────────────────────
export { GoalsModule, default } from './GoalsModule';
export { GoalDetailPage } from './GoalDetailPage';

// ── Provider ───────────────────────────────────────────────────────────────
export {
  GoalsProvider,
  useGoalsContext,
  useGoalsContextOptional,
  useGoalsTheme,
  useGoalsRoutes,
} from './provider/GoalsProvider';
export type { GoalsProviderProps, GoalsCallbacks } from './provider/GoalsProvider';

// ── Hooks (custom UI) ──────────────────────────────────────────────────────
export { useGoals } from './core/hooks/use-goals';
export { useGoalDetail } from './core/hooks/use-goal-detail';
export { useKanbanBridge } from './core/hooks/use-kanban-bridge';
export type { KanbanBridge } from './core/hooks/use-kanban-bridge';

// ── Adapters ───────────────────────────────────────────────────────────────
export {
  createLocalStorageAdapter,
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
  generateId,
} from './core/adapters';
export type { GoalsStorageAdapter, GoalsStorageAdapterOptions } from './core/adapters/types';

// ── Routes ─────────────────────────────────────────────────────────────────
export { DEFAULT_GOALS_ROUTES } from './core/routes';
export type { GoalsRoutes } from './core/routes';

// ── Progress & milestones ──────────────────────────────────────────────────
export {
  clampProgress,
  calculateMilestoneProgress,
  calculateKeyResultsProgress,
  calculateGoalProgress,
  getEffectiveProgress,
  formatDueDate,
  daysUntil,
  getGoalStats,
  formatMilestoneProgressLabel,
} from './core/progress-utils';

export {
  normalizeMilestone,
  normalizeMilestones,
  normalizeGoal,
  isMilestoneComplete,
} from './core/milestone-utils';

export {
  getTodayCheckIn,
  hasCheckedInToday,
  toDayKey,
} from './core/check-in-utils';

export {
  countMilestoneTaskStats,
  applyMilestoneTaskDraft,
  persistMilestoneTaskDrafts,
  getLinkableTasksForDraft,
  loadKanbanColumns,
} from './core/kanban-task-bridge';

// ── Theme ──────────────────────────────────────────────────────────────────
export { TARGET_TYPE_OPTIONS, getTargetTypeMeta } from './theme/milestone-target-types';

export {
  defaultGoalsTheme,
  mergeGoalsTheme,
  GOAL_COLORS,
  STATUS_STYLES,
  CATEGORY_LABELS,
  PRIORITY_STYLES,
  MOOD_OPTIONS,
} from './theme/goals-theme';
export type { GoalsTheme } from './theme/goals-theme';

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  Goal,
  GoalStatus,
  GoalCategory,
  GoalPriority,
  ProgressType,
  ReviewFrequency,
  CheckInMood,
  ReflectionMomentum,
  MilestoneStatus,
  MilestoneTargetType,
  MilestoneDraft,
  GoalsViewMode,
  KeyResult,
  GoalMilestone,
  GoalCheckIn,
  GoalsFilterState,
  CreateGoalPayload,
  GoalsModuleProps,
} from './core/types';

export { DEFAULT_FILTERS } from './core/types';

// ── Demo (dev/sandbox only — do not use in production) ─────────────────────
export {
  DEFAULT_GOALS,
  goalsToKanbanEntities,
  milestonesToKanbanEntities,
} from './demo/default-goals';
