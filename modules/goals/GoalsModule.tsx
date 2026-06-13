'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoals } from '@/modules/goals/core/hooks/use-goals';
import type { Goal, GoalsModuleProps } from '@/modules/goals/core/types';
import { DEFAULT_FILTERS } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import {
  useGoalsContextOptional,
  useGoalsRoutes,
  useGoalsTheme,
} from '@/modules/goals/provider/GoalsProvider';
import { DEFAULT_GOALS } from '@/modules/goals/demo/default-goals';
import { GoalCreateDrawer } from '@/modules/goals/ui/create/goal-create-drawer';
import { GoalsVisionBoard } from '@/modules/goals/ui/board/goals-vision-board';
import {
  GoalsToolbar,
  type FocusTab,
} from '@/modules/goals/ui/board/goals-toolbar';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '@/modules/goals/core/adapters';

export function GoalsModule({
  storageKey = DEFAULT_STORAGE_KEY,
  initialGoals = DEFAULT_GOALS,
  adapter: adapterProp,
  onGoalsChange,
  className,
}: GoalsModuleProps) {
  const router = useRouter();
  const ctx = useGoalsContextOptional();
  const theme = useGoalsTheme();
  const routes = useGoalsRoutes();

  const adapter =
    adapterProp ?? ctx?.adapter ?? createDefaultLocalStorageAdapter(storageKey);
  const seedGoals = ctx?.initialGoals ?? initialGoals;
  const goalsChangeCb = onGoalsChange ?? ctx?.callbacks.onGoalsChange;

  const {
    goals,
    filteredGoals,
    filters,
    setFilters,
    hydrated,
    createGoal,
  } = useGoals({
    storageKey: ctx?.storageKey ?? storageKey,
    initialGoals: seedGoals,
    adapter,
    onGoalsChange: goalsChangeCb,
  });

  const [focusTab, setFocusTab] = useState<FocusTab>('active');
  const [createOpen, setCreateOpen] = useState(false);

  const displayGoals = useMemo(() => {
    let list = filteredGoals;
    if (focusTab === 'active') {
      list = list.filter((g) => g.status === 'active' || g.status === 'on_hold');
    } else if (focusTab === 'completed') {
      list = list.filter((g) => g.status === 'completed');
    }
    return [...list].sort((a, b) => b.effectiveProgress - a.effectiveProgress);
  }, [filteredGoals, focusTab]);

  const activeCount = goals.filter(
    (g) => g.status === 'active' || g.status === 'on_hold',
  ).length;

  const handleGoalClick = useCallback(
    (goal: Goal) => {
      router.push(routes.detail(goal.id));
    },
    [router, routes],
  );

  const handleCreate = useCallback(
    (payload: Parameters<typeof createGoal>[0]) => {
      const goal = createGoal(payload);
      ctx?.callbacks.onGoalCreate?.(goal);
      setCreateOpen(false);
      router.push(routes.detail(goal.id));
    },
    [createGoal, ctx, router, routes],
  );

  const handleTabChange = useCallback(
    (tab: FocusTab) => {
      setFocusTab(tab);
      setFilters({ ...DEFAULT_FILTERS, search: filters.search });
    },
    [filters.search, setFilters],
  );

  if (!hydrated) {
    return (
      <div className={cn('flex flex-1 items-center justify-center', className)}>
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  const isEmpty = goals.length === 0;
  const noResults = !isEmpty && displayGoals.length === 0;

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-5', className)}>
      <GoalsToolbar
        activeCount={activeCount}
        tab={focusTab}
        onTabChange={handleTabChange}
        filters={filters}
        onFiltersChange={setFilters}
        onCreateClick={() => setCreateOpen(true)}
      />

      {noResults ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No goals here. Try another tab or adjust your search.
          </p>
        </div>
      ) : (
        <GoalsVisionBoard
          goals={displayGoals}
          onGoalClick={handleGoalClick}
          onCreateClick={() => setCreateOpen(true)}
          empty={isEmpty}
        />
      )}

      <GoalCreateDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default GoalsModule;
