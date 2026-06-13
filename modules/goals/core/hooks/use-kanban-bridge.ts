'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_COLUMNS,
  DEFAULT_STORAGE_KEY,
  generateId,
} from '@/modules/kanban';
import { getTaskEntityLink } from '@/modules/kanban/core/entity-utils';
import type { Column, KanbanEntities, Task, TaskEntityLink } from '@/modules/kanban/core/types';
import { DEFAULT_ENTITIES } from '@/modules/kanban/demo/default-entities';
import type { Goal } from '@/modules/goals/core/types';
import {
  applyMilestoneTaskDraft as applyTaskDraftToColumns,
  countMilestoneTaskStats,
} from '@/modules/goals/core/kanban-task-bridge';
import type { MilestoneDraft } from '@/modules/goals/core/types';
import {
  goalsToKanbanEntities,
  milestonesToKanbanEntities,
} from '@/modules/goals/demo/default-goals';

const DONE_COLUMN_ID = 'done';
const TODO_COLUMN_ID = 'todo';

export interface MilestoneTaskStats {
  total: number;
  done: number;
}

export interface TaskWithColumn {
  task: Task;
  columnId: string;
}

function findTaskContext(
  columns: Column[],
  taskId: string,
): { task: Task; column: Column } | null {
  for (const column of columns) {
    const task = column.tasks.find((t) => t.id === taskId);
    if (task) return { task, column };
  }
  return null;
}

function taskLinksMilestone(task: Task, milestoneId: string): boolean {
  const link = getTaskEntityLink(task);
  return link?.type === 'milestone' && link.id === milestoneId;
}

function taskLinksGoal(task: Task, goalId: string): boolean {
  const link = getTaskEntityLink(task);
  return link?.type === 'goal' && link.id === goalId;
}

export function buildKanbanEntitiesFromGoals(goals: Goal[]): KanbanEntities {
  return {
    projects: DEFAULT_ENTITIES.projects,
    assignees: DEFAULT_ENTITIES.assignees,
    goals: goalsToKanbanEntities(goals),
    milestones: milestonesToKanbanEntities(goals),
  };
}

export function useKanbanBridge(goals: Goal[]) {
  const adapter = useMemo(() => createDefaultLocalStorageAdapter(DEFAULT_STORAGE_KEY), []);
  const [columns, setColumns] = useState<Column[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS;
    return adapter.loadColumns() ?? DEFAULT_COLUMNS;
  });
  const [hydrated] = useState(() => typeof window !== 'undefined');

  const entities = useMemo(() => buildKanbanEntitiesFromGoals(goals), [goals]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveColumns(columns);
  }, [columns, hydrated, adapter]);

  const persistColumns = useCallback((updater: (prev: Column[]) => Column[]) => {
    setColumns((prev) => updater(prev));
  }, []);

  const getMilestoneTasks = useCallback(
    (milestoneId: string): TaskWithColumn[] => {
      const result: TaskWithColumn[] = [];
      for (const column of columns) {
        for (const task of column.tasks) {
          if (taskLinksMilestone(task, milestoneId)) {
            result.push({ task, columnId: column.id });
          }
        }
      }
      return result;
    },
    [columns],
  );

  const getMilestoneTaskStats = useCallback(
    (milestoneId: string): MilestoneTaskStats => {
      const linked = getMilestoneTasks(milestoneId);
      const done = linked.filter(({ columnId }) => columnId === DONE_COLUMN_ID).length;
      return { total: linked.length, done };
    },
    [getMilestoneTasks],
  );

  const getLinkableTasksForGoal = useCallback(
    (goalId: string, milestoneId: string): TaskWithColumn[] => {
      const result: TaskWithColumn[] = [];
      for (const column of columns) {
        for (const task of column.tasks) {
          if (taskLinksMilestone(task, milestoneId)) continue;
          const link = getTaskEntityLink(task);
          if (!link || taskLinksGoal(task, goalId)) {
            result.push({ task, columnId: column.id });
          }
        }
      }
      return result;
    },
    [columns],
  );

  const createTaskForMilestone = useCallback(
    (milestoneId: string, title: string): Task => {
      const trimmed = title.trim();
      if (!trimmed) throw new Error('Task title required');

      const entityLink: TaskEntityLink = { type: 'milestone', id: milestoneId };
      const newTask: Task = {
        id: generateId('task'),
        title: trimmed,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        entityLink,
      };

      persistColumns((prev) =>
        prev.map((col) =>
          col.id === TODO_COLUMN_ID
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col,
        ),
      );

      return newTask;
    },
    [persistColumns],
  );

  const linkTaskToMilestone = useCallback(
    (taskId: string, milestoneId: string) => {
      persistColumns((prev) =>
        prev.map((col) => ({
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
        })),
      );
    },
    [persistColumns],
  );

  const unlinkTaskFromMilestone = useCallback(
    (taskId: string, goalId: string) => {
      persistColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  entityLink: { type: 'goal', id: goalId },
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        })),
      );
    },
    [persistColumns],
  );

  const updateTask = useCallback(
    (columnId: string, taskId: string, updates: Partial<Task>) => {
      persistColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((t) =>
                  t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
                ),
              }
            : col,
        ),
      );
    },
    [persistColumns],
  );

  const deleteTask = useCallback(
    (columnId: string, taskId: string) => {
      persistColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
            : col,
        ),
      );
    },
    [persistColumns],
  );

  const moveTaskToColumn = useCallback(
    (taskId: string, fromColumnId: string, toColumnId: string) => {
      persistColumns((prev) => {
        let moved: Task | undefined;
        const without = prev.map((col) => {
          if (col.id !== fromColumnId) return col;
          moved = col.tasks.find((t) => t.id === taskId);
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        });
        if (!moved) return prev;
        return without.map((col) =>
          col.id === toColumnId ? { ...col, tasks: [...col.tasks, moved!] } : col,
        );
      });
    },
    [persistColumns],
  );

  const getTaskContext = useCallback(
    (taskId: string) => findTaskContext(columns, taskId),
    [columns],
  );

  /** Apply draft tasks to board state — keeps React state in sync (not just localStorage). */
  const applyMilestoneTaskDraft = useCallback(
    (
      milestoneId: string,
      goalId: string,
      draft: Pick<MilestoneDraft, 'newTaskTitles' | 'linkTaskIds'>,
    ): MilestoneTaskStats => {
      let stats: MilestoneTaskStats = { total: 0, done: 0 };
      persistColumns((prev) => {
        const next = applyTaskDraftToColumns(prev, milestoneId, goalId, draft);
        stats = countMilestoneTaskStats(next, milestoneId);
        return next;
      });
      return stats;
    },
    [persistColumns],
  );

  const reloadColumnsFromStorage = useCallback(() => {
    setColumns(adapter.loadColumns() ?? DEFAULT_COLUMNS);
  }, [adapter]);

  return {
    columns,
    entities,
    hydrated,
    getMilestoneTasks,
    getMilestoneTaskStats,
    getLinkableTasksForGoal,
    createTaskForMilestone,
    linkTaskToMilestone,
    unlinkTaskFromMilestone,
    updateTask,
    deleteTask,
    moveTaskToColumn,
    getTaskContext,
    applyMilestoneTaskDraft,
    reloadColumnsFromStorage,
    doneColumnId: DONE_COLUMN_ID,
  };
}

export type KanbanBridge = ReturnType<typeof useKanbanBridge>;
