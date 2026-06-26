'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ProjectWorkspaceTab } from '../types';
import { isValidWorkspaceTab, tabStorageKey } from '../workspace-utils';

export function useWorkspaceTab(projectId: string) {
  const [activeTab, setActiveTabState] = useState<ProjectWorkspaceTab>('overview');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const stored = localStorage.getItem(tabStorageKey(projectId));
    const initial = isValidWorkspaceTab(hash)
      ? hash
      : stored && isValidWorkspaceTab(stored)
        ? stored
        : 'overview';
    setActiveTabState(initial);
  }, [projectId]);

  const setActiveTab = useCallback(
    (tab: ProjectWorkspaceTab) => {
      setActiveTabState(tab);
      window.location.hash = tab;
      localStorage.setItem(tabStorageKey(projectId), tab);
    },
    [projectId],
  );

  return { activeTab, setActiveTab };
}
