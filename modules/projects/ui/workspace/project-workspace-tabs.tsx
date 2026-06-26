'use client';

import type { ProjectWorkspaceTab } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { WORKSPACE_TABS } from '@/modules/projects/core/workspace-utils';

interface ProjectWorkspaceTabsProps {
  activeTab: ProjectWorkspaceTab;
  onTabChange: (tab: ProjectWorkspaceTab) => void;
  accentColor?: string;
  counts?: Partial<Record<ProjectWorkspaceTab, number>>;
}

export function ProjectWorkspaceTabs({
  activeTab,
  onTabChange,
  accentColor = '#7C3AED',
  counts,
}: ProjectWorkspaceTabsProps) {
  return (
    <div className="shrink-0 border-b border-border/60 bg-background">
      <nav
        className="no-scrollbar -mb-px flex gap-1 overflow-x-auto px-1 py-2"
        role="tablist"
        aria-label="Project workspace sections"
      >
        {WORKSPACE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts?.[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )}
              style={
                isActive
                  ? { boxShadow: `inset 0 -2px 0 0 ${accentColor}` }
                  : undefined
              }
            >
              {tab.label}
              {count != null && count > 0 && (
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    isActive ? 'bg-muted text-foreground' : 'bg-muted/60 text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
