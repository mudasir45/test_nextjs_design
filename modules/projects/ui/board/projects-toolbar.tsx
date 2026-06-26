'use client';

import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import type { ProjectsFilterState, ProjectsFocusTab, ProjectsViewMode } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';

interface ProjectsToolbarProps {
  activeCount: number;
  tab: ProjectsFocusTab;
  onTabChange: (tab: ProjectsFocusTab) => void;
  viewMode: ProjectsViewMode;
  onViewModeChange: (mode: ProjectsViewMode) => void;
  filters: ProjectsFilterState;
  onFiltersChange: (filters: ProjectsFilterState) => void;
  onCreateClick: () => void;
}

const TABS: { id: ProjectsFocusTab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
];

export function ProjectsToolbar({
  activeCount,
  tab,
  onTabChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  onCreateClick,
}: ProjectsToolbarProps) {
  const theme = useProjectsTheme();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCount === 0
            ? 'Organize client work, track progress, and ship on time.'
            : `${activeCount} active project${activeCount === 1 ? '' : 's'} in flight`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search projects…"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full rounded-full border border-border/60 bg-muted/30 py-2 pl-9 pr-4 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10 sm:w-48"
          />
        </div>

        <div className="flex rounded-full border border-border/60 bg-muted/30 p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                tab === t.id ? theme.tabActive : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex rounded-lg border border-border/60 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'cursor-pointer rounded-md p-1.5 transition-colors',
              viewMode === 'grid' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={cn(
              'cursor-pointer rounded-md p-1.5 transition-colors',
              viewMode === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            theme.buttonPrimary,
          )}
        >
          <Plus className="h-4 w-4" />
          New project
        </button>
      </div>
    </div>
  );
}
