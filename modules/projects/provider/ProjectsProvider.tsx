'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ProjectsStorageAdapter } from '../core/adapters';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '../core/adapters';
import type { Project, ProjectClientRef, ProjectGoalRef, ProjectTeamMemberRef } from '../core/types';
import type { ProjectsRoutes } from '../core/routes';
import { DEFAULT_PROJECTS_ROUTES } from '../core/routes';
import { defaultProjectsTheme, mergeProjectsTheme, type ProjectsTheme } from '../theme/projects-theme';

export interface ProjectsCallbacks {
  onProjectsChange?: (projects: Project[]) => void;
  onProjectCreate?: (project: Project) => void | Promise<void>;
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => void | Promise<void>;
  onProjectDelete?: (projectId: string) => void | Promise<void>;
}

export interface ProjectsProviderProps extends ProjectsCallbacks {
  children: ReactNode;
  initialProjects: Project[];
  adapter?: ProjectsStorageAdapter;
  storageKey?: string;
  theme?: Partial<ProjectsTheme>;
  routes?: Partial<ProjectsRoutes>;
  /** Optional refs for linked entities — map from Invoices, Goals, Kanban. */
  clients?: ProjectClientRef[];
  goals?: ProjectGoalRef[];
  teamMembers?: ProjectTeamMemberRef[];
}

interface ProjectsContextValue {
  initialProjects: Project[];
  adapter: ProjectsStorageAdapter;
  storageKey: string;
  theme: ProjectsTheme;
  routes: ProjectsRoutes;
  callbacks: ProjectsCallbacks;
  clients: ProjectClientRef[];
  goals: ProjectGoalRef[];
  teamMembers: ProjectTeamMemberRef[];
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({
  children,
  initialProjects,
  adapter,
  storageKey = DEFAULT_STORAGE_KEY,
  theme,
  routes: routesProp,
  clients = [],
  goals = [],
  teamMembers = [],
  onProjectsChange,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
}: ProjectsProviderProps) {
  const value = useMemo<ProjectsContextValue>(
    () => ({
      initialProjects,
      adapter: adapter ?? createDefaultLocalStorageAdapter(storageKey),
      storageKey,
      theme: mergeProjectsTheme(theme),
      routes: { ...DEFAULT_PROJECTS_ROUTES, ...routesProp },
      callbacks: {
        onProjectsChange,
        onProjectCreate,
        onProjectUpdate,
        onProjectDelete,
      },
      clients,
      goals,
      teamMembers,
    }),
    [
      initialProjects,
      adapter,
      storageKey,
      theme,
      routesProp,
      clients,
      goals,
      teamMembers,
      onProjectsChange,
      onProjectCreate,
      onProjectUpdate,
      onProjectDelete,
    ],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjectsContext(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error('useProjectsContext must be used within ProjectsProvider');
  }
  return ctx;
}

export function useProjectsContextOptional(): ProjectsContextValue | null {
  return useContext(ProjectsContext);
}

export function useProjectsTheme(): ProjectsTheme {
  return useProjectsContextOptional()?.theme ?? defaultProjectsTheme;
}

export function useProjectsRoutes(): ProjectsRoutes {
  return useProjectsContextOptional()?.routes ?? DEFAULT_PROJECTS_ROUTES;
}

export function useProjectsRefs() {
  const ctx = useProjectsContextOptional();
  return {
    clients: ctx?.clients ?? [],
    goals: ctx?.goals ?? [],
    teamMembers: ctx?.teamMembers ?? [],
  };
}
