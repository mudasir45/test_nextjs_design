'use client';

import { useCallback, useEffect, useState } from 'react';
import type { KanbanStorageAdapter } from '../adapters';
import type { BoardScope, BoardScopeState } from '../types';
import { EMPTY_SCOPE_STATE } from '../scope-utils';

interface UseBoardScopeOptions {
  adapter: KanbanStorageAdapter;
  onScopeChange?: (state: BoardScopeState) => void;
}

export function useBoardScope({ adapter, onScopeChange }: UseBoardScopeOptions) {
  const [state, setState] = useState<BoardScopeState>(EMPTY_SCOPE_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = adapter.loadScope();
    if (stored) setState(stored);
    setHydrated(true);
  }, [adapter]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveScope(state);
    onScopeChange?.(state);
  }, [state, hydrated, adapter, onScopeChange]);

  const setScope = useCallback((scope: BoardScope) => {
    setState((prev) => ({ ...prev, scope }));
  }, []);

  const setAssigneeId = useCallback((assigneeId: string | null) => {
    setState((prev) => ({ ...prev, assigneeId }));
  }, []);

  const clearScope = useCallback(() => setState(EMPTY_SCOPE_STATE), []);

  return { state, hydrated, setScope, setAssigneeId, clearScope, setState };
}
