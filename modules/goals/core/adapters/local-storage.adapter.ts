import type { GoalsFilterState } from '../types';
import type { GoalsStorageAdapter, GoalsStorageAdapterOptions } from './types';

export const DEFAULT_STORAGE_KEY = 'imergix-goals-v1';

const FILTERS_SUFFIX = '-filters';

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createLocalStorageAdapter({
  storageKey,
}: GoalsStorageAdapterOptions): GoalsStorageAdapter {
  return {
    loadGoals() {
      if (typeof window === 'undefined') return null;
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    },

    saveGoals(goals) {
      if (typeof window === 'undefined') return;
      localStorage.setItem(storageKey, JSON.stringify(goals));
    },

    loadFilters() {
      if (typeof window === 'undefined') return null;
      try {
        const raw = localStorage.getItem(`${storageKey}${FILTERS_SUFFIX}`);
        if (!raw) return null;
        return JSON.parse(raw) as GoalsFilterState;
      } catch {
        return null;
      }
    },

    saveFilters(filters) {
      if (typeof window === 'undefined') return;
      localStorage.setItem(`${storageKey}${FILTERS_SUFFIX}`, JSON.stringify(filters));
    },

    clearGoals() {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}${FILTERS_SUFFIX}`);
    },
  };
}

export function createDefaultLocalStorageAdapter(
  storageKey = DEFAULT_STORAGE_KEY,
): GoalsStorageAdapter {
  return createLocalStorageAdapter({ storageKey });
}
