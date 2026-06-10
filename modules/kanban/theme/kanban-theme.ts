/**
 * Theme tokens for the Kanban module.
 * Override via KanbanProvider `theme` prop or CSS variables in kanban.css.
 */
export interface KanbanTheme {
  /** Primary action buttons (Save, Add column header) */
  buttonPrimary: string;
  /** Scope navigator active / open state */
  scopeActive: string;
  scopeActiveHover: string;
  /** Selected scope row, checkmarks */
  accentText: string;
  accentSurface: string;
  accentSurfaceHover: string;
  /** Board header icon container */
  headerIcon: string;
  /** Loading spinner accent */
  spinner: string;
}

/** Uses shadcn semantic tokens — maps to your design system `primary` palette. */
export const defaultKanbanTheme: KanbanTheme = {
  buttonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  scopeActive: 'border-primary/40 bg-primary/5 ring-2 ring-primary/10',
  scopeActiveHover: 'border-primary/30 bg-primary/5 hover:border-primary/40',
  accentText: 'text-primary',
  accentSurface: 'bg-primary/10',
  accentSurfaceHover: 'hover:bg-primary/15',
  headerIcon: 'bg-primary/10 text-primary',
  spinner: 'border-border border-t-primary',
};

export function mergeKanbanTheme(partial?: Partial<KanbanTheme>): KanbanTheme {
  return { ...defaultKanbanTheme, ...partial };
}
