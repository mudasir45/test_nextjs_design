/**
 * Example API-backed adapter for production.
 *
 * Copy to your app (e.g. `lib/goals-api-adapter.ts`) and wire with React Query.
 * The module's hooks call load/save synchronously — keep a client cache in memory
 * that React Query hydrates and mutates via your REST/GraphQL endpoints.
 *
 * @see INTEGRATION.md § "Production wiring with React Query"
 */

import type { GoalsStorageAdapter } from './types';
import type { Goal, GoalsFilterState } from '../types';

export interface GoalsApiClient {
  fetchGoals(): Promise<Goal[]>;
  saveGoals(goals: Goal[]): Promise<void>;
  fetchFilters?(): Promise<GoalsFilterState | null>;
  saveFilters?(filters: GoalsFilterState): Promise<void>;
}

/** Extended adapter with explicit hydrate — use in host app only. */
export type ApiGoalsAdapter = GoalsStorageAdapter & {
  hydrate: (goals: Goal[], filters?: GoalsFilterState | null) => void;
};

/**
 * In-memory cache synced by your data layer (React Query onSuccess, etc.).
 */
export function createApiGoalsAdapter(client: GoalsApiClient): ApiGoalsAdapter {
  let goalsCache: Goal[] | null = null;
  let filtersCache: GoalsFilterState | null = null;

  const adapter: ApiGoalsAdapter = {
    loadGoals() {
      return goalsCache;
    },

    saveGoals(goals) {
      goalsCache = goals;
      void client.saveGoals(goals).catch(console.error);
    },

    loadFilters() {
      return filtersCache;
    },

    saveFilters(filters) {
      filtersCache = filters;
      client.saveFilters?.(filters)?.catch(console.error);
    },

    clearGoals() {
      goalsCache = null;
      filtersCache = null;
    },

    hydrate(goals: Goal[], filters?: GoalsFilterState | null) {
      goalsCache = goals;
      if (filters !== undefined) filtersCache = filters;
    },
  };

  return adapter;
}
