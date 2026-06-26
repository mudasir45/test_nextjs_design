/**
 * @imergix/projects — portable Projects module for Next.js apps
 */

// ── Pages ──────────────────────────────────────────────────────────────────
export { ProjectsModule, default } from './ProjectsModule';
export { ProjectDetailPage } from './ProjectDetailPage';

// ── Provider ───────────────────────────────────────────────────────────────
export {
  ProjectsProvider,
  useProjectsContext,
  useProjectsContextOptional,
  useProjectsTheme,
  useProjectsRoutes,
  useProjectsRefs,
} from './provider/ProjectsProvider';
export type { ProjectsProviderProps, ProjectsCallbacks } from './provider/ProjectsProvider';

// ── Hooks ──────────────────────────────────────────────────────────────────
export { useProjects } from './core/hooks/use-projects';
export {
  useProjectKanbanStats,
  useAllProjectKanbanStats,
} from './core/hooks/use-project-kanban-stats';

// ── Adapters ───────────────────────────────────────────────────────────────
export {
  createLocalStorageAdapter,
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
  generateId,
} from './core/adapters';
export type { ProjectsStorageAdapter, ProjectsStorageAdapterOptions } from './core/adapters/types';

// ── Routes ─────────────────────────────────────────────────────────────────
export { DEFAULT_PROJECTS_ROUTES } from './core/routes';
export type { ProjectsRoutes } from './core/routes';

// ── Utils ──────────────────────────────────────────────────────────────────
export {
  normalizeProject,
  filterProjects,
  computeProjectHealth,
  getProjectsSummary,
  daysUntil,
  formatDueDate,
  formatBudget,
  getStatusLabel,
} from './core/project-utils';
export type { ProjectsSummary } from './core/project-utils';

// ── Theme ──────────────────────────────────────────────────────────────────
export {
  defaultProjectsTheme,
  mergeProjectsTheme,
  PROJECT_COLORS,
  STATUS_STYLES,
  PRIORITY_STYLES,
  HEALTH_STYLES,
  SUMMARY_CARD_STYLES,
} from './theme/projects-theme';
export type { ProjectsTheme } from './theme/projects-theme';

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  Project,
  ProjectStatus,
  ProjectPriority,
  ProjectHealth,
  ProjectsViewMode,
  ProjectsFocusTab,
  ProjectsFilterState,
  CreateProjectPayload,
  ProjectsModuleProps,
  ProjectClientRef,
  ProjectGoalRef,
  ProjectTeamMemberRef,
  ProjectKanbanStats,
} from './core/types';

export { DEFAULT_FILTERS } from './core/types';

// ── Demo ───────────────────────────────────────────────────────────────────
export { DEFAULT_PROJECTS, projectsToKanbanEntities } from './demo/default-projects';
