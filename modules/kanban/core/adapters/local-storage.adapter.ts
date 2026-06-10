import type { BoardScopeState, KanbanFilters } from '../types';
import { EMPTY_SCOPE_STATE, migrateFiltersToScope } from '../scope-utils';
import type { KanbanStorageAdapter, KanbanStorageAdapterOptions } from './types';

export const DEFAULT_STORAGE_KEY = 'imergix-kanban-board-v3';

const SCOPE_SUFFIX = '-scope';
const LEGACY_FILTERS_SUFFIX = '-filters';

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createLocalStorageAdapter({
  storageKey,
}: KanbanStorageAdapterOptions): KanbanStorageAdapter {
  return {
    loadColumns() {
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

    saveColumns(columns) {
      if (typeof window === 'undefined') return;
      localStorage.setItem(storageKey, JSON.stringify(columns));
    },

    loadScope() {
      if (typeof window === 'undefined') return null;
      try {
        const raw = localStorage.getItem(`${storageKey}${SCOPE_SUFFIX}`);
        if (raw) return JSON.parse(raw) as BoardScopeState;

        const legacy = localStorage.getItem(`${storageKey}${LEGACY_FILTERS_SUFFIX}`);
        if (legacy) return migrateFiltersToScope(JSON.parse(legacy) as KanbanFilters);

        return null;
      } catch {
        return null;
      }
    },

    saveScope(state) {
      if (typeof window === 'undefined') return;
      localStorage.setItem(`${storageKey}${SCOPE_SUFFIX}`, JSON.stringify(state));
    },

    clearBoard() {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}${SCOPE_SUFFIX}`);
      localStorage.removeItem(`${storageKey}${LEGACY_FILTERS_SUFFIX}`);
    },
  };
}

/** Default adapter for demo / offline use. */
export function createDefaultLocalStorageAdapter(
  storageKey = DEFAULT_STORAGE_KEY,
): KanbanStorageAdapter {
  return createLocalStorageAdapter({ storageKey });
}
