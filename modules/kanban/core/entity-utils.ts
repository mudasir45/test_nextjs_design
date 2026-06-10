import type { Column, KanbanEntities, Task, TaskEntityLink, TaskEntityType } from './types';

/** Read entity link — supports legacy `links` shape from older saves. */
export function getTaskEntityLink(task: Task): TaskEntityLink | undefined {
  if (task.entityLink) return task.entityLink;

  const links = task.links;
  if (!links) return undefined;
  if (links.milestoneId) return { type: 'milestone', id: links.milestoneId };
  if (links.goalId) return { type: 'goal', id: links.goalId };
  if (links.projectId) return { type: 'project', id: links.projectId };
  return undefined;
}

export function getTaskAssigneeId(task: Task): string | undefined {
  return task.assigneeId ?? task.links?.assigneeId;
}

export function resolveEntityDisplay(
  entities: KanbanEntities,
  link?: TaskEntityLink,
): { label: string; subtitle?: string; color?: string } | undefined {
  if (!link) return undefined;
  const list =
    link.type === 'project'
      ? entities.projects
      : link.type === 'goal'
        ? entities.goals
        : entities.milestones;
  const item = list.find((e) => e.id === link.id);
  if (!item) return undefined;
  return { label: item.label, subtitle: item.subtitle, color: item.color };
}

export function migrateTask(task: Task): Task {
  const entityLink = getTaskEntityLink(task);
  const assigneeId = getTaskAssigneeId(task);
  return {
    ...task,
    entityLink,
    assigneeId,
  };
}

export function migrateColumns(columns: Column[]) {
  return columns.map((col) => ({
    ...col,
    tasks: col.tasks.map(migrateTask),
  }));
}

export const ENTITY_TYPE_LABELS: Record<TaskEntityType, string> = {
  project: 'Project',
  goal: 'Goal',
  milestone: 'Milestone',
};

export function entityMatchesFilter(
  link: TaskEntityLink | undefined,
  type: TaskEntityType,
  id: string,
): boolean {
  return link?.type === type && link.id === id;
}
