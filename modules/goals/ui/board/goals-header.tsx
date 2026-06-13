'use client';

import { LayoutGrid, List, Plus, Target, TrendingUp, Trophy } from 'lucide-react';
import { getGoalStats } from '@/modules/goals/core/progress-utils';
import type { Goal, GoalsViewMode } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { useGoalsTheme } from '@/modules/goals/provider/GoalsProvider';

interface GoalsHeaderProps {
  goals: Goal[];
  viewMode: GoalsViewMode;
  onViewModeChange: (mode: GoalsViewMode) => void;
  onCreateClick: () => void;
}

export function GoalsHeader({
  goals,
  viewMode,
  onViewModeChange,
  onCreateClick,
}: GoalsHeaderProps) {
  const theme = useGoalsTheme();
  const stats = getGoalStats(goals);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('rounded-xl p-2.5', theme.headerIcon)}>
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Goals</h1>
            <p className="text-sm text-muted-foreground">
              Set intentions, track progress, stay motivated
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'cursor-pointer rounded-md p-2 transition-colors duration-200',
                viewMode === 'grid'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={cn(
                'cursor-pointer rounded-md p-2 transition-colors duration-200',
                viewMode === 'list'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
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
              'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200',
              theme.buttonCta,
            )}
          >
            <Plus className="h-4 w-4" />
            New Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Target} label="Total Goals" value={stats.total} />
        <StatCard icon={TrendingUp} label="Active" value={stats.active} accent="teal" />
        <StatCard icon={Trophy} label="Completed" value={stats.completed} accent="emerald" />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          value={`${stats.avgProgress}%`}
          accent="orange"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Target;
  label: string;
  value: string | number;
  accent?: 'teal' | 'emerald' | 'orange';
}) {
  const accentClass =
    accent === 'teal'
      ? 'text-teal-600 dark:text-teal-400'
      : accent === 'emerald'
        ? 'text-emerald-600 dark:text-emerald-400'
        : accent === 'orange'
          ? 'text-orange-500'
          : 'text-foreground';

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={cn('mt-1 text-2xl font-bold tabular-nums', accentClass)}>{value}</p>
    </div>
  );
}
