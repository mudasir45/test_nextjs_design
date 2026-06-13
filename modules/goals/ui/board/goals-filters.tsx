'use client';

import { Search, X } from 'lucide-react';
import type { GoalsFilterState } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import {
  CATEGORY_LABELS,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '@/modules/goals/theme/goals-theme';

interface GoalsFiltersProps {
  filters: GoalsFilterState;
  onChange: (filters: GoalsFilterState) => void;
}

const CATEGORIES = ['all', 'professional', 'personal', 'financial', 'health', 'learning', 'other'] as const;
const STATUSES = ['all', 'draft', 'active', 'on_hold', 'completed', 'archived'] as const;
const PRIORITIES = ['all', 'low', 'medium', 'high'] as const;

export function GoalsFilters({ filters, onChange }: GoalsFiltersProps) {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.search.trim() !== '';

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search goals..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterPills
          label="Category"
          options={CATEGORIES.map((c) => ({
            value: c,
            label: c === 'all' ? 'All' : CATEGORY_LABELS[c],
          }))}
          value={filters.category}
          onChange={(v) => onChange({ ...filters, category: v as GoalsFilterState['category'] })}
        />
        <FilterPills
          label="Status"
          options={STATUSES.map((s) => ({
            value: s,
            label: s === 'all' ? 'All' : STATUS_STYLES[s]?.label ?? s,
          }))}
          value={filters.status}
          onChange={(v) => onChange({ ...filters, status: v as GoalsFilterState['status'] })}
        />
        <FilterPills
          label="Priority"
          options={PRIORITIES.map((p) => ({
            value: p,
            label: p === 'all' ? 'All' : PRIORITY_STYLES[p]?.label ?? p,
          }))}
          value={filters.priority}
          onChange={(v) => onChange({ ...filters, priority: v as GoalsFilterState['priority'] })}
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              onChange({
                category: 'all',
                status: 'all',
                priority: 'all',
                search: '',
              })
            }
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function FilterPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="hidden text-xs text-muted-foreground sm:inline">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200',
            value === opt.value
              ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
