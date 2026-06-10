'use client';

import { useCallback, useEffect, useState } from 'react';
import type { KanbanStorageAdapter } from '../adapters';
import { migrateColumns } from '../entity-utils';
import type { Column } from '../types';

interface UseKanbanBoardOptions {
  storageKey: string;
  initialColumns: Column[];
  adapter: KanbanStorageAdapter;
  onColumnsChange?: (columns: Column[]) => void;
  enableLogging?: boolean;
}

function logBoard(label: string, columns: Column[], enableLogging: boolean) {
  if (!enableLogging) return;
  console.group(`[KanbanBoard] ${label}`);
  console.log('State:', columns);
  console.table(
    columns.map((col) => ({
      column: col.title,
      tasks: col.tasks.length,
      ids: col.tasks.map((t) => t.id).join(', ') || '—',
    })),
  );
  console.groupEnd();
}

export function useKanbanBoard({
  storageKey,
  initialColumns,
  adapter,
  onColumnsChange,
  enableLogging = process.env.NODE_ENV === 'development',
}: UseKanbanBoardOptions) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = adapter.loadColumns();
    if (stored?.length) {
      const migrated = migrateColumns(stored);
      setColumns(migrated);
      logBoard('Loaded from storage', migrated, enableLogging);
    } else {
      logBoard('Using default columns', initialColumns, enableLogging);
    }
    setHydrated(true);
  }, [storageKey, adapter, enableLogging, initialColumns]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveColumns(columns);
    onColumnsChange?.(columns);
  }, [columns, hydrated, adapter, onColumnsChange]);

  const updateColumns = useCallback(
    (updater: (prev: Column[]) => Column[], logLabel: string) => {
      setColumns((prev) => {
        const next = updater(prev);
        logBoard(logLabel, next, enableLogging);
        return next;
      });
    },
    [enableLogging],
  );

  const resetBoard = useCallback(() => {
    adapter.clearBoard();
    setColumns(initialColumns);
    logBoard('Board reset to defaults', initialColumns, enableLogging);
  }, [adapter, initialColumns, enableLogging]);

  return { columns, hydrated, updateColumns, resetBoard };
}
