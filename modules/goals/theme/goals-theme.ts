/**
 * Theme tokens for the Goals module.
 * Override via GoalsProvider `theme` prop.
 */
export interface GoalsTheme {
  buttonPrimary: string;
  buttonCta: string;
  accentText: string;
  accentSurface: string;
  accentSurfaceHover: string;
  headerIcon: string;
  progressRing: string;
  spinner: string;
}

export const defaultGoalsTheme: GoalsTheme = {
  buttonPrimary: 'bg-teal-600 text-white hover:bg-teal-700',
  buttonCta: 'bg-teal-600 text-white hover:bg-teal-700',
  accentText: 'text-teal-600 dark:text-teal-400',
  accentSurface: 'bg-teal-500/10',
  accentSurfaceHover: 'hover:bg-teal-500/15',
  headerIcon: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  progressRing: 'stroke-teal-500',
  spinner: 'border-border border-t-teal-500',
};

export function mergeGoalsTheme(partial?: Partial<GoalsTheme>): GoalsTheme {
  return { ...defaultGoalsTheme, ...partial };
}

export const GOAL_COLORS = [
  '#0D9488',
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#EA580C',
  '#0891B2',
  '#16A34A',
  '#CA8A04',
];

export const STATUS_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  active: {
    label: 'Active',
    className: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
  },
  on_hold: {
    label: 'On Hold',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  archived: {
    label: 'Archived',
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  professional: 'Professional',
  personal: 'Personal',
  financial: 'Financial',
  health: 'Health',
  learning: 'Learning',
  other: 'Other',
};

export const PRIORITY_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  low: {
    label: 'Low',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  high: {
    label: 'High',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400',
  },
};

export const MOOD_OPTIONS = [
  { value: 'struggling' as const, label: 'Struggling', emoji: '😓' },
  { value: 'ok' as const, label: 'OK', emoji: '😐' },
  { value: 'good' as const, label: 'Good', emoji: '🙂' },
  { value: 'great' as const, label: 'Great', emoji: '🚀' },
];
