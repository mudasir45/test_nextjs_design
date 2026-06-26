'use client';

import { useEffect, useState } from 'react';
import { migrateColumns } from '@/modules/kanban/core/entity-utils';
import { getTaskEntityLink } from '@/modules/kanban/core/entity-utils';
import { DEFAULT_STORAGE_KEY as KANBAN_STORAGE_KEY } from '@/modules/kanban/core/adapters';
import type { Column } from '@/modules/kanban/core/types';
import type { ProjectKanbanStats } from '../types';

const EMPTY_STATS: ProjectKanbanStats = {
  total: 0,
  done: 0,
  inProgress: 0,
  todo: 0,
  completionRate: 0,
};

function loadKanbanColumns(): Column[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KANBAN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? migrateColumns(parsed) : [];
  } catch {
    return [];
  }
}

function computeStatsForProject(columns: Column[], projectId: string): ProjectKanbanStats {
  let total = 0;
  let done = 0;
  let inProgress = 0;
  let todo = 0;

  for (const col of columns) {
    const isDone = /done|complete/i.test(col.title);
    const isProgress = /progress|doing|active|review/i.test(col.title);

    for (const task of col.tasks) {
      const link = getTaskEntityLink(task);
      if (link?.type !== 'project' || link.id !== projectId) continue;

      total += 1;
      if (isDone) done += 1;
      else if (isProgress) inProgress += 1;
      else todo += 1;
    }
  }

  return {
    total,
    done,
    inProgress,
    todo,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export function useProjectKanbanStats(projectId?: string): ProjectKanbanStats {
  const [stats, setStats] = useState<ProjectKanbanStats>(EMPTY_STATS);

  useEffect(() => {
    if (!projectId) {
      setStats(EMPTY_STATS);
      return;
    }
    const columns = loadKanbanColumns();
    setStats(computeStatsForProject(columns, projectId));
  }, [projectId]);

  return stats;
}

export function useAllProjectKanbanStats(
  projectIds: string[],
): Record<string, ProjectKanbanStats> {
  const [statsMap, setStatsMap] = useState<Record<string, ProjectKanbanStats>>({});

  useEffect(() => {
    const columns = loadKanbanColumns();
    const map: Record<string, ProjectKanbanStats> = {};
    for (const id of projectIds) {
      map[id] = computeStatsForProject(columns, id);
    }
    setStatsMap(map);
  }, [projectIds]);

  return statsMap;
}

export { computeStatsForProject, loadKanbanColumns };
