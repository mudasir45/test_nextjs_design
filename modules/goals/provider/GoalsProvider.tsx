'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { GoalsStorageAdapter } from '../core/adapters';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '../core/adapters';
import type { Goal } from '../core/types';
import type { GoalsRoutes } from '../core/routes';
import { DEFAULT_GOALS_ROUTES } from '../core/routes';
import { defaultGoalsTheme, mergeGoalsTheme, type GoalsTheme } from '../theme/goals-theme';

export interface GoalsCallbacks {
  onGoalsChange?: (goals: Goal[]) => void;
  onGoalCreate?: (goal: Goal) => void | Promise<void>;
  onGoalUpdate?: (goalId: string, updates: Partial<Goal>) => void | Promise<void>;
  onGoalDelete?: (goalId: string) => void | Promise<void>;
}

export interface GoalsProviderProps extends GoalsCallbacks {
  children: ReactNode;
  initialGoals: Goal[];
  adapter?: GoalsStorageAdapter;
  storageKey?: string;
  theme?: Partial<GoalsTheme>;
  routes?: Partial<GoalsRoutes>;
}

interface GoalsContextValue {
  initialGoals: Goal[];
  adapter: GoalsStorageAdapter;
  storageKey: string;
  theme: GoalsTheme;
  routes: GoalsRoutes;
  callbacks: GoalsCallbacks;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({
  children,
  initialGoals,
  adapter,
  storageKey = DEFAULT_STORAGE_KEY,
  theme,
  routes: routesProp,
  onGoalsChange,
  onGoalCreate,
  onGoalUpdate,
  onGoalDelete,
}: GoalsProviderProps) {
  const value = useMemo<GoalsContextValue>(
    () => ({
      initialGoals,
      adapter: adapter ?? createDefaultLocalStorageAdapter(storageKey),
      storageKey,
      theme: mergeGoalsTheme(theme),
      routes: { ...DEFAULT_GOALS_ROUTES, ...routesProp },
      callbacks: {
        onGoalsChange,
        onGoalCreate,
        onGoalUpdate,
        onGoalDelete,
      },
    }),
    [
      initialGoals,
      adapter,
      storageKey,
      theme,
      routesProp,
      onGoalsChange,
      onGoalCreate,
      onGoalUpdate,
      onGoalDelete,
    ],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoalsContext(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) {
    throw new Error('useGoalsContext must be used within GoalsProvider');
  }
  return ctx;
}

export function useGoalsContextOptional(): GoalsContextValue | null {
  return useContext(GoalsContext);
}

export function useGoalsTheme(): GoalsTheme {
  return useGoalsContextOptional()?.theme ?? defaultGoalsTheme;
}

export function useGoalsRoutes(): GoalsRoutes {
  return useGoalsContextOptional()?.routes ?? DEFAULT_GOALS_ROUTES;
}
