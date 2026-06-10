/**
 * @imergix/kanban — portable Kanban board module for Next.js apps
 *
 * Copy `modules/kanban/` into your project or add as a pnpm workspace package.
 * @see INTEGRATION.md for full setup guide.
 */

export { KanbanBoard, default } from './KanbanBoard';

export {
  KanbanProvider,
  useKanbanContext,
  useKanbanContextOptional,
  useKanbanTheme,
} from './provider/KanbanProvider';
export type { KanbanProviderProps, KanbanCallbacks } from './provider/KanbanProvider';

export {
  createLocalStorageAdapter,
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
  generateId,
} from './core/adapters';
export type { KanbanStorageAdapter, KanbanStorageAdapterOptions } from './core/adapters/types';

export {
  applyScope,
  countTasks,
  countTasksInScope,
  entityLinkFromScope,
  isScopeActive,
  getScopeLabel,
  getScopeBreadcrumb,
  resolveAssigneeFromFilter,
  migrateFiltersToScope,
  EMPTY_SCOPE,
  EMPTY_SCOPE_STATE,
} from './core/scope-utils';

export { migrateTask, migrateColumns, getTaskEntityLink, getTaskAssigneeId } from './core/entity-utils';

export type {
  Task,
  Column,
  TaskPriority,
  TaskActivity,
  TaskEntityType,
  TaskEntityLink,
  TaskLinks,
  KanbanEntity,
  KanbanEntities,
  BoardScope,
  BoardScopeState,
  KanbanBoardProps,
  KanbanFilters,
} from './core/types';

export {
  DEFAULT_COLUMNS,
  COLUMN_COLORS,
  PRIORITY_LABELS,
  PRIORITY_STYLES,
} from './demo/default-columns';
export { DEFAULT_ENTITIES } from './demo/default-entities';

export { defaultKanbanTheme, mergeKanbanTheme } from './theme/kanban-theme';
export type { KanbanTheme } from './theme/kanban-theme';
