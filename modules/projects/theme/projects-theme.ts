/**
 * Theme tokens for the Projects module.
 * Override via ProjectsProvider `theme` prop.
 */
export interface ProjectsTheme {
  buttonPrimary: string;
  buttonCta: string;
  accentText: string;
  accentSurface: string;
  accentSurfaceHover: string;
  headerIcon: string;
  progressRing: string;
  spinner: string;
  tabActive: string;
}

export const defaultProjectsTheme: ProjectsTheme = {
  buttonPrimary: 'bg-violet-600 text-white hover:bg-violet-700',
  buttonCta: 'bg-violet-600 text-white hover:bg-violet-700',
  accentText: 'text-violet-600 dark:text-violet-400',
  accentSurface: 'bg-violet-500/10',
  accentSurfaceHover: 'hover:bg-violet-500/15',
  headerIcon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  progressRing: 'stroke-violet-500',
  spinner: 'border-border border-t-violet-500',
  tabActive: 'bg-card text-foreground shadow-sm ring-1 ring-violet-500/20',
};

export function mergeProjectsTheme(partial?: Partial<ProjectsTheme>): ProjectsTheme {
  return { ...defaultProjectsTheme, ...partial };
}

export const PROJECT_COLORS = [
  '#7C3AED',
  '#6366F1',
  '#2563EB',
  '#0891B2',
  '#16A34A',
  '#EA580C',
  '#DB2777',
  '#CA8A04',
];

export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  planning: {
    label: 'Planning',
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
  active: {
    label: 'Active',
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
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
    className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  },
};

export const PRIORITY_STYLES: Record<string, { label: string; className: string }> = {
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

export const HEALTH_STYLES: Record<string, { label: string; className: string }> = {
  on_track: {
    label: 'On track',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  at_risk: {
    label: 'At risk',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  behind: {
    label: 'Behind',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400',
  },
  completed: {
    label: 'Complete',
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  },
};

export const SUMMARY_CARD_STYLES = {
  active: {
    label: 'Active',
    className: 'border-violet-500/20 bg-violet-500/5',
    valueClass: 'text-violet-600 dark:text-violet-400',
  },
  atRisk: {
    label: 'At risk',
    className: 'border-amber-500/20 bg-amber-500/5',
    valueClass: 'text-amber-600 dark:text-amber-400',
  },
  onHold: {
    label: 'On hold',
    className: 'border-slate-500/20 bg-slate-500/5',
    valueClass: 'text-slate-600 dark:text-slate-400',
  },
  completed: {
    label: 'Done this month',
    className: 'border-emerald-500/20 bg-emerald-500/5',
    valueClass: 'text-emerald-600 dark:text-emerald-400',
  },
} as const;
