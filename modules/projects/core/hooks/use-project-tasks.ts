'use client';

import { useEffect, useState } from 'react';
import { getTaskEntityLink } from '@/modules/kanban/core/entity-utils';
import type { Task } from '@/modules/kanban/core/types';
import { loadKanbanColumns } from './use-project-kanban-stats';

export interface ProjectTaskPreview {
  id: string;
  title: string;
  columnTitle: string;
  priority?: Task['priority'];
  dueDate?: string;
  assignee?: string;
}

export function useProjectTasks(projectId?: string): ProjectTaskPreview[] {
  const [tasks, setTasks] = useState<ProjectTaskPreview[]>([]);

  useEffect(() => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    const columns = loadKanbanColumns();
    const next: ProjectTaskPreview[] = [];

    for (const col of columns) {
      for (const task of col.tasks) {
        const link = getTaskEntityLink(task);
        if (link?.type !== 'project' || link.id !== projectId) continue;
        next.push({
          id: task.id,
          title: task.title,
          columnTitle: col.title,
          priority: task.priority,
          dueDate: task.dueDate,
          assignee: task.assignee?.name,
        });
      }
    }

    setTasks(next.slice(0, 8));
  }, [projectId]);

  return tasks;
}
