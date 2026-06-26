import type { Project, ProjectsFilterState } from '../types';

export interface ProjectsStorageAdapter {
  loadProjects(): Project[] | null;
  saveProjects(projects: Project[]): void;
  loadFilters(): ProjectsFilterState | null;
  saveFilters(filters: ProjectsFilterState): void;
  clearProjects(): void;
}

export interface ProjectsStorageAdapterOptions {
  storageKey: string;
}
