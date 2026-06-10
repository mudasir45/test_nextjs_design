import type {
  BoardScope,
  BoardScopeState,
  Column,
  KanbanEntities,
  KanbanFilters,
  Task,
  TaskEntityLink,
} from './types';
import { getTaskAssigneeId, getTaskEntityLink } from './entity-utils';

export const EMPTY_SCOPE: BoardScope = { view: 'all' };

export const EMPTY_SCOPE_STATE: BoardScopeState = {
  scope: EMPTY_SCOPE,
  assigneeId: null,
};

export function isScopeActive(state: BoardScopeState): boolean {
  return state.scope.view !== 'all' || !!state.assigneeId;
}

function milestoneGoalId(entities: KanbanEntities, milestoneId: string): string | undefined {
  return entities.milestones.find((m) => m.id === milestoneId)?.goalId;
}

/** Whether a task belongs to the current board scope. */
export function taskMatchesScope(
  task: Task,
  state: BoardScopeState,
  entities: KanbanEntities,
): boolean {
  const link = getTaskEntityLink(task);
  const assigneeId = getTaskAssigneeId(task);

  if (state.assigneeId && assigneeId !== state.assigneeId) return false;

  const { scope } = state;
  if (scope.view === 'all') return true;

  if (scope.view === 'project') {
    return link?.type === 'project' && link.id === scope.projectId;
  }

  if (scope.view === 'goal') {
    if (scope.milestoneId) {
      return link?.type === 'milestone' && link.id === scope.milestoneId;
    }
    if (link?.type === 'goal' && link.id === scope.goalId) return true;
    if (link?.type === 'milestone') {
      return milestoneGoalId(entities, link.id) === scope.goalId;
    }
    return false;
  }

  return true;
}

export function applyScope(
  columns: Column[],
  state: BoardScopeState,
  entities: KanbanEntities,
): Column[] {
  if (!isScopeActive(state)) return columns;
  return columns.map((col) => ({
    ...col,
    tasks: col.tasks.filter((task) => taskMatchesScope(task, state, entities)),
  }));
}

export function countTasks(columns: Column[]): number {
  return columns.reduce((sum, col) => sum + col.tasks.length, 0);
}

export function countTasksInScope(
  columns: Column[],
  state: BoardScopeState,
  entities: KanbanEntities,
): number {
  return countTasks(applyScope(columns, state, entities));
}

/** Task counts for scope panel rows. */
export function countTasksForProject(columns: Column[], projectId: string): number {
  return countTasksMatchingLink(columns, (link) => link?.type === 'project' && link.id === projectId);
}

export function countTasksForGoal(
  columns: Column[],
  goalId: string,
  entities: KanbanEntities,
): number {
  return countTasksMatchingLink(columns, (link) => {
    if (!link) return false;
    if (link.type === 'goal' && link.id === goalId) return true;
    if (link.type === 'milestone') return milestoneGoalId(entities, link.id) === goalId;
    return false;
  });
}

export function countTasksForMilestone(columns: Column[], milestoneId: string): number {
  return countTasksMatchingLink(
    columns,
    (link) => link?.type === 'milestone' && link.id === milestoneId,
  );
}

function countTasksMatchingLink(
  columns: Column[],
  match: (link: TaskEntityLink | undefined) => boolean,
): number {
  let n = 0;
  for (const col of columns) {
    for (const task of col.tasks) {
      if (match(getTaskEntityLink(task))) n++;
    }
  }
  return n;
}

/** New tasks inherit the active entity scope (not assignee). */
export function entityLinkFromScope(scope: BoardScope): TaskEntityLink | undefined {
  if (scope.view === 'project') return { type: 'project', id: scope.projectId };
  if (scope.view === 'goal') {
    if (scope.milestoneId) return { type: 'milestone', id: scope.milestoneId };
    return { type: 'goal', id: scope.goalId };
  }
  return undefined;
}

export function getScopeLabel(state: BoardScopeState, entities: KanbanEntities): string {
  const { scope } = state;
  if (scope.view === 'all') return 'All tasks';

  if (scope.view === 'project') {
    const p = entities.projects.find((x) => x.id === scope.projectId);
    return p?.label ?? 'Project';
  }

  if (scope.view === 'goal') {
    const g = entities.goals.find((x) => x.id === scope.goalId);
    if (scope.milestoneId) {
      const m = entities.milestones.find((x) => x.id === scope.milestoneId);
      return m ? `${g?.label ?? 'Goal'} · ${m.label}` : g?.label ?? 'Goal';
    }
    return g?.label ?? 'Goal';
  }

  return 'All tasks';
}

export function getScopeBreadcrumb(state: BoardScopeState, entities: KanbanEntities): string[] {
  const { scope } = state;
  if (scope.view === 'all') return ['All tasks'];

  if (scope.view === 'project') {
    const p = entities.projects.find((x) => x.id === scope.projectId);
    return ['Projects', p?.label ?? 'Project'];
  }

  if (scope.view === 'goal') {
    const g = entities.goals.find((x) => x.id === scope.goalId);
    if (scope.milestoneId) {
      const m = entities.milestones.find((x) => x.id === scope.milestoneId);
      return ['Goals', g?.label ?? 'Goal', m?.label ?? 'Milestone'];
    }
    return ['Goals', g?.label ?? 'Goal'];
  }

  return [];
}

export function migrateFiltersToScope(filters: KanbanFilters): BoardScopeState {
  if (filters.milestoneId && filters.goalId) {
    return {
      scope: { view: 'goal', goalId: filters.goalId, milestoneId: filters.milestoneId },
      assigneeId: filters.assigneeId,
    };
  }
  if (filters.goalId) {
    return { scope: { view: 'goal', goalId: filters.goalId }, assigneeId: filters.assigneeId };
  }
  if (filters.projectId) {
    return { scope: { view: 'project', projectId: filters.projectId }, assigneeId: filters.assigneeId };
  }
  return { scope: EMPTY_SCOPE, assigneeId: filters.assigneeId };
}

/** Resolve assignee display from entity catalog. */
export function resolveAssigneeFromFilter(
  entities: KanbanEntities,
  assigneeId?: string,
): Task['assignee'] | undefined {
  if (!assigneeId) return undefined;
  const user = entities.assignees.find((a) => a.id === assigneeId);
  if (!user) return undefined;

  const avatars: Record<string, string> = {
    'user-sarah':
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
    'user-alex':
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    'user-jordan':
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
    'user-maya':
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    'user-chris':
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
  };

  return {
    name: user.label,
    avatar: avatars[assigneeId] ?? '',
  };
}
