import type { Goal, GoalsFilterState } from '../types';

/** Persistence boundary — swap localStorage for API in production. */
export interface GoalsStorageAdapter {
  loadGoals(): Goal[] | null;
  saveGoals(goals: Goal[]): void;
  loadFilters(): GoalsFilterState | null;
  saveFilters(filters: GoalsFilterState): void;
  clearGoals(): void;
}

export interface GoalsStorageAdapterOptions {
  storageKey: string;
}
