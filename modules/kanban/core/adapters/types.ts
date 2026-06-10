import type { BoardScopeState, Column } from '../types';

/** Persistence boundary — swap localStorage for API in production. */
export interface KanbanStorageAdapter {
  loadColumns(): Column[] | null;
  saveColumns(columns: Column[]): void;
  loadScope(): BoardScopeState | null;
  saveScope(state: BoardScopeState): void;
  clearBoard(): void;
}

export interface KanbanStorageAdapterOptions {
  /** Base key for columns; scope uses `${baseKey}-scope`. */
  storageKey: string;
}
