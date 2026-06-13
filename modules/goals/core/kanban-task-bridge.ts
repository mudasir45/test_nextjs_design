import {
  createDefaultLocalStorageAdapter,
  DEFAULT_COLUMNS,
  DEFAULT_STORAGE_KEY,
  generateId,
} from '@/modules/kanban';
import { getTaskEntityLink } from '@/modules/kanban/core/entity-utils';
import type { Column, Task, TaskEntityLink } from '@/modules/kanban/core/types';
import type { MilestoneDraft } from './types';

const TODO_COLUMN_ID = 'todo';
const DONE_COLUMN_ID = 'done';

export interface MilestoneTaskStats {
  total: number;
  done: number;
}

export function countMilestoneTaskStats(
  columns: Column[],
  milestoneId: string,
): MilestoneTaskStats {
  let total = 0;
  let done = 0;
  for (const column of columns) {
    for (const task of column.tasks) {
      const link = getTaskEntityLink(task);
      if (link?.type === 'milestone' && link.id === milestoneId) {
        total++;
        if (column.id === DONE_COLUMN_ID) done++;
      }
    }
  }
  return { total, done };
}

function taskLinksMilestone(task: Task, milestoneId: string): boolean {
  const link = getTaskEntityLink(task);
  return link?.type === 'milestone' && link.id === milestoneId;
}

export function applyMilestoneTaskDraft(
  columns: Column[],
  milestoneId: string,
  goalId: string,
  draft: Pick<MilestoneDraft, 'newTaskTitles' | 'linkTaskIds'>,
): Column[] {
  let next = columns;

  for (const title of draft.newTaskTitles ?? []) {
    const trimmed = title.trim();
    if (!trimmed) continue;
    const entityLink: TaskEntityLink = { type: 'milestone', id: milestoneId };
    const newTask: Task = {
      id: generateId('task'),
      title: trimmed,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      entityLink,
    };
    next = next.map((col) =>
      col.id === TODO_COLUMN_ID ? { ...col, tasks: [...col.tasks, newTask] } : col,
    );
  }

  for (const taskId of draft.linkTaskIds ?? []) {
    next = next.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              entityLink: { type: 'milestone', id: milestoneId },
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    }));
  }

  return next;
}

export function persistMilestoneTaskDrafts(
  goalId: string,
  drafts: MilestoneDraft[],
  milestones: { id: string; targetType: string }[],
): Column[] {
  if (typeof window === 'undefined') return DEFAULT_COLUMNS;

  const adapter = createDefaultLocalStorageAdapter(DEFAULT_STORAGE_KEY);
  let columns = adapter.loadColumns() ?? DEFAULT_COLUMNS;

  milestones.forEach((milestone, index) => {
    if (milestone.targetType !== 'tasks') return;
    const draft = drafts[index];
    if (!draft?.newTaskTitles?.length && !draft?.linkTaskIds?.length) return;
    columns = applyMilestoneTaskDraft(columns, milestone.id, goalId, draft);
  });

  adapter.saveColumns(columns);
  return columns;
}

export function getLinkableTasksForDraft(
  columns: Column[],
  options?: { goalId?: string; excludeMilestoneId?: string },
): { task: Task; columnId: string }[] {
  const result: { task: Task; columnId: string }[] = [];
  for (const column of columns) {
    for (const task of column.tasks) {
      const link = getTaskEntityLink(task);
      if (options?.excludeMilestoneId && taskLinksMilestone(task, options.excludeMilestoneId)) {
        continue;
      }
      if (link?.type === 'milestone') continue;
      if (options?.goalId && link?.type === 'goal' && link.id !== options.goalId) continue;
      result.push({ task, columnId: column.id });
    }
  }
  return result;
}

export function loadKanbanColumns(): Column[] {
  if (typeof window === 'undefined') return DEFAULT_COLUMNS;
  const adapter = createDefaultLocalStorageAdapter(DEFAULT_STORAGE_KEY);
  return adapter.loadColumns() ?? DEFAULT_COLUMNS;
}
