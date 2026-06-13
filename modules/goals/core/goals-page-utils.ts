import type { Goal } from './types';

export type GoalsSortOption =
  | 'progress-desc'
  | 'progress-asc'
  | 'due-date'
  | 'updated'
  | 'title';

export type GoalsPageView = 'vision' | 'compact';

export function sortGoals(
  goals: (Goal & { effectiveProgress: number })[],
  sort: GoalsSortOption,
): (Goal & { effectiveProgress: number })[] {
  const list = [...goals];
  switch (sort) {
    case 'progress-asc':
      return list.sort((a, b) => a.effectiveProgress - b.effectiveProgress);
    case 'due-date':
      return list.sort((a, b) => {
        if (!a.targetDate && !b.targetDate) return 0;
        if (!a.targetDate) return 1;
        if (!b.targetDate) return -1;
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      });
    case 'updated':
      return list.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'progress-desc':
    default:
      return list.sort((a, b) => b.effectiveProgress - a.effectiveProgress);
  }
}

export function countDueSoon(goals: Goal[], withinDays = 30): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const limit = now.getTime() + withinDays * 86400000;
  return goals.filter((g) => {
    if (!g.targetDate || g.status === 'completed' || g.status === 'archived') return false;
    const d = new Date(g.targetDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() >= now.getTime() && d.getTime() <= limit;
  }).length;
}

export function hasActiveFilters(
  filters: import('./types').GoalsFilterState,
  tab: 'active' | 'completed' | 'all',
): boolean {
  return (
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.search.trim() !== '' ||
    tab !== 'active'
  );
}
