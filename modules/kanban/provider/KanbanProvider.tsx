'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { KanbanStorageAdapter } from '../core/adapters';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '../core/adapters';
import type { BoardScopeState, Column, KanbanEntities, Task } from '../core/types';
import { resolveAssigneeFromFilter } from '../core/scope-utils';
import { defaultKanbanTheme, mergeKanbanTheme, type KanbanTheme } from '../theme/kanban-theme';

export interface KanbanCallbacks {
  onColumnsChange?: (columns: Column[]) => void;
  onScopeChange?: (state: BoardScopeState) => void;
  onTaskCreate?: (task: Task, columnId: string) => void | Promise<void>;
  onTaskUpdate?: (
    taskId: string,
    updates: Partial<Task>,
    columnId: string,
  ) => void | Promise<void>;
  onTaskDelete?: (taskId: string, columnId: string) => void | Promise<void>;
  onTaskMove?: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
  ) => void | Promise<void>;
}

export interface KanbanProviderProps extends KanbanCallbacks {
  children: ReactNode;
  entities: KanbanEntities;
  /** Persistence adapter — defaults to localStorage. */
  adapter?: KanbanStorageAdapter;
  storageKey?: string;
  theme?: Partial<KanbanTheme>;
  /** Map assignee id → display (avatar, name). Override for your user API. */
  resolveAssignee?: (
    assigneeId: string,
    entities: KanbanEntities,
  ) => Task['assignee'] | undefined;
}

interface KanbanContextValue {
  entities: KanbanEntities;
  adapter: KanbanStorageAdapter;
  storageKey: string;
  theme: KanbanTheme;
  resolveAssignee: (
    assigneeId: string,
    entities: KanbanEntities,
  ) => Task['assignee'] | undefined;
  callbacks: KanbanCallbacks;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

export function KanbanProvider({
  children,
  entities,
  adapter,
  storageKey = DEFAULT_STORAGE_KEY,
  theme,
  resolveAssignee = (assigneeId, entities) =>
    resolveAssigneeFromFilter(entities, assigneeId),
  onColumnsChange,
  onScopeChange,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove,
}: KanbanProviderProps) {
  const value = useMemo<KanbanContextValue>(
    () => ({
      entities,
      adapter: adapter ?? createDefaultLocalStorageAdapter(storageKey),
      storageKey,
      theme: mergeKanbanTheme(theme),
      resolveAssignee,
      callbacks: {
        onColumnsChange,
        onScopeChange,
        onTaskCreate,
        onTaskUpdate,
        onTaskDelete,
        onTaskMove,
      },
    }),
    [
      entities,
      adapter,
      storageKey,
      theme,
      resolveAssignee,
      onColumnsChange,
      onScopeChange,
      onTaskCreate,
      onTaskUpdate,
      onTaskDelete,
      onTaskMove,
    ],
  );

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
}

export function useKanbanContext(): KanbanContextValue {
  const ctx = useContext(KanbanContext);
  if (!ctx) {
    throw new Error('useKanbanContext must be used within KanbanProvider');
  }
  return ctx;
}

/** Optional context — returns null outside provider (KanbanBoard works standalone). */
export function useKanbanContextOptional(): KanbanContextValue | null {
  return useContext(KanbanContext);
}

export function useKanbanTheme(): KanbanTheme {
  return useKanbanContextOptional()?.theme ?? defaultKanbanTheme;
}
