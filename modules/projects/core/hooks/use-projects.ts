'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateId } from '../adapters';
import { createDefaultLocalStorageAdapter, DEFAULT_STORAGE_KEY } from '../adapters';
import type { ProjectsStorageAdapter } from '../adapters/types';
import { filterProjects, mergeProjectsWithSeed, normalizeProject } from '../project-utils';
import type {
  CreateProjectPayload,
  Project,
  ProjectsFilterState,
} from '../types';
import { DEFAULT_FILTERS } from '../types';

interface UseProjectsOptions {
  storageKey: string;
  initialProjects: Project[];
  adapter: ProjectsStorageAdapter;
  onProjectsChange?: (projects: Project[]) => void;
}

export function useProjects({
  storageKey: _storageKey,
  initialProjects,
  adapter,
  onProjectsChange,
}: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>(() =>
    initialProjects.map(normalizeProject),
  );
  const [filters, setFilters] = useState<ProjectsFilterState>(DEFAULT_FILTERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const seed = initialProjects.map(normalizeProject);
    let stored = adapter.loadProjects();

    if (!stored?.length && _storageKey === DEFAULT_STORAGE_KEY) {
      const legacy = createDefaultLocalStorageAdapter('imergix-projects-v1').loadProjects();
      if (legacy?.length) stored = legacy;
    }

    if (stored?.length) {
      setProjects(mergeProjectsWithSeed(stored, seed));
    } else {
      setProjects(seed);
    }

    const saved = adapter.loadFilters();
    if (saved) {
      setFilters({ ...DEFAULT_FILTERS, search: saved.search ?? '' });
    }
    setHydrated(true);
  }, [adapter, initialProjects, _storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveProjects(projects);
    onProjectsChange?.(projects);
  }, [projects, hydrated, adapter, onProjectsChange]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveFilters(filters);
  }, [filters, hydrated, adapter]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters),
    [projects, filters],
  );

  const createProject = useCallback((payload: CreateProjectPayload) => {
    const now = new Date().toISOString();
    const project = normalizeProject({
      id: generateId('proj'),
      name: payload.name,
      description: payload.description,
      clientId: payload.clientId,
      goalId: payload.goalId,
      status: 'active',
      priority: payload.priority,
      color: payload.color,
      budget: payload.budget,
      currency: payload.currency ?? 'USD',
      startDate: now,
      deadline: payload.deadline,
      teamMemberIds: payload.teamMemberIds ?? [],
      tags: payload.tags ?? [],
      documents: [],
      folders: [],
      links: [],
      environments: [],
      infrastructure: [],
      createdAt: now,
      updatedAt: now,
    });
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
        if (updates.status === 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toISOString();
        }
        if (updates.status === 'active' && p.status === 'completed') {
          updated.completedAt = undefined;
        }
        return normalizeProject(updated);
      }),
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const resetProjects = useCallback(() => {
    adapter.clearProjects();
    setProjects(initialProjects.map(normalizeProject));
    setFilters(DEFAULT_FILTERS);
  }, [adapter, initialProjects]);

  return {
    projects,
    filteredProjects,
    filters,
    setFilters,
    hydrated,
    createProject,
    updateProject,
    deleteProject,
    resetProjects,
  };
}
