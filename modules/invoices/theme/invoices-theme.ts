/**
 * Theme tokens for the Invoices module.
 * Override via InvoicesProvider `theme` prop.
 */
export interface InvoicesTheme {
  buttonPrimary: string;
  buttonCta: string;
  accentText: string;
  accentSurface: string;
  accentSurfaceHover: string;
  headerIcon: string;
  spinner: string;
  tabActive: string;
}

export const defaultInvoicesTheme: InvoicesTheme = {
  buttonPrimary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  buttonCta: 'bg-indigo-600 text-white hover:bg-indigo-700',
  accentText: 'text-indigo-600 dark:text-indigo-400',
  accentSurface: 'bg-indigo-500/10',
  accentSurfaceHover: 'hover:bg-indigo-500/15',
  headerIcon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  spinner: 'border-border border-t-indigo-500',
  tabActive: 'bg-card text-foreground shadow-sm ring-1 ring-indigo-500/20',
};

export function mergeInvoicesTheme(partial?: Partial<InvoicesTheme>): InvoicesTheme {
  return { ...defaultInvoicesTheme, ...partial };
}

export const INVOICE_STATUS_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
  sent: {
    label: 'Sent',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400',
  },
};

export const EXPENSE_CATEGORY_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  equipment: {
    label: 'Equipment',
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  },
  software: {
    label: 'Software',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  travel: {
    label: 'Travel',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  marketing: {
    label: 'Marketing',
    className: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  },
  other: {
    label: 'Other',
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
};

export const FINANCE_CARD_STYLES = {
  invoiced: {
    label: 'Total Invoiced',
    className: 'border-indigo-500/20 bg-indigo-500/5',
    valueClass: 'text-indigo-600 dark:text-indigo-400',
  },
  received: {
    label: 'Total Received',
    className: 'border-emerald-500/20 bg-emerald-500/5',
    valueClass: 'text-emerald-600 dark:text-emerald-400',
  },
  outstanding: {
    label: 'Outstanding',
    className: 'border-amber-500/20 bg-amber-500/5',
    valueClass: 'text-amber-600 dark:text-amber-400',
  },
  overdue: {
    label: 'Overdue',
    className: 'border-red-500/20 bg-red-500/5',
    valueClass: 'text-red-600 dark:text-red-400',
  },
} as const;
