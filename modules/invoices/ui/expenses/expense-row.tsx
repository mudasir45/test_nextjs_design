'use client';

import { Trash2 } from 'lucide-react';
import type { Expense } from '@/modules/invoices/core/types';
import { formatDate } from '@/modules/invoices/core/invoice-utils';
import { formatExpenseAmount } from '@/modules/invoices/core/expense-utils';
import {
  EXPENSE_CATEGORY_STYLES,
} from '@/modules/invoices/theme/invoices-theme';
import { cn } from '@/modules/invoices/core/cn';

const ENTITY_BADGES: Record<string, { label: string; className: string }> = {
  project: { label: 'Project', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400' },
  goal: { label: 'Goal', className: 'bg-teal-500/10 text-teal-700 dark:text-teal-400' },
  milestone: { label: 'Milestone', className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' },
  task: { label: 'Task', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
  personal: { label: 'Personal', className: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' },
  general: { label: 'General', className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
};

interface ExpenseRowProps {
  expense: Expense;
  currency?: string;
  onDelete: (id: string) => void;
}

export function ExpenseRow({ expense, currency = 'USD', onDelete }: ExpenseRowProps) {
  const categoryStyle = EXPENSE_CATEGORY_STYLES[expense.category];
  const entityBadge = expense.entityType ? ENTITY_BADGES[expense.entityType] : null;

  return (
    <tr className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30">
      <td className="px-4 py-3">
        <p className="font-medium text-foreground">{expense.description}</p>
        {expense.entityName && (
          <p className="text-xs text-muted-foreground">{expense.entityName}</p>
        )}
        {expense.notes && (
          <p className="text-xs text-muted-foreground/70">{expense.notes}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-semibold', categoryStyle?.className)}>
            {categoryStyle?.label ?? expense.category}
          </span>
          {entityBadge && (
            <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', entityBadge.className)}>
              {entityBadge.label}
            </span>
          )}
        </div>
      </td>
      <td className="hidden px-4 py-3 tabular-nums text-muted-foreground md:table-cell">
        {formatDate(expense.date)}
      </td>
      <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
        {formatExpenseAmount(expense.amount, currency)}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onDelete(expense.id)}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100"
          aria-label="Delete expense"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}
