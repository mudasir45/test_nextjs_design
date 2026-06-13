'use client';

import { Plus, Search } from 'lucide-react';
import type { GoalsFilterState } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';

type FocusTab = 'active' | 'completed' | 'all';

interface GoalsToolbarProps {
  activeCount: number;
  tab: FocusTab;
  onTabChange: (tab: FocusTab) => void;
  filters: GoalsFilterState;
  onFiltersChange: (filters: GoalsFilterState) => void;
  onCreateClick: () => void;
}

const TABS: { id: FocusTab; label: string }[] = [
  { id: 'active', label: 'In focus' },
  { id: 'completed', label: 'Done' },
  { id: 'all', label: 'All' },
];

export function GoalsToolbar({
  activeCount,
  tab,
  onTabChange,
  filters,
  onFiltersChange,
  onCreateClick,
}: GoalsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your focus
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeCount === 0
            ? 'Define what matters — then give it your attention.'
            : `${activeCount} active goal${activeCount === 1 ? '' : 's'} right now`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search…"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full rounded-full border border-border/60 bg-muted/30 py-2 pl-9 pr-4 text-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/10 sm:w-44"
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
                tab === t.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Define goal
        </button>
      </div>
    </div>
  );
}

export type { FocusTab };
