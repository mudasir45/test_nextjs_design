'use client';

import { useMemo, useState } from 'react';
import {
  Briefcase,
  Building,
  CheckSquare,
  Flag,
  SlidersHorizontal,
  Target,
  User,
} from 'lucide-react';
import type { Expense, ExpenseCategory, ExpenseEntityType } from '@/modules/invoices/core/types';
import {
  formatMonthLabel,
  groupExpensesByMonth,
  sumExpenses,
} from '@/modules/invoices/core/expense-utils';
import { formatCurrency } from '@/modules/invoices/core/invoice-utils';
import { EXPENSE_CATEGORY_STYLES } from '@/modules/invoices/theme/invoices-theme';
import { cn } from '@/modules/invoices/core/cn';
import { ExpenseForm } from './expense-form';
import { ExpenseRow } from './expense-row';

interface ExpenseLogProps {
  expenses: Expense[];
  currency?: string;
  onCreateExpense: (payload: {
    amount: number;
    category: ExpenseCategory;
    entityType?: ExpenseEntityType;
    entityId?: string;
    entityName?: string;
    date: string;
    description: string;
    notes?: string;
  }) => void;
  onDeleteExpense: (id: string) => void;
}

const ENTITY_FILTER_OPTIONS: { id: ExpenseEntityType | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Building },
  { id: 'general', label: 'General', icon: Building },
  { id: 'project', label: 'Project', icon: Briefcase },
  { id: 'goal', label: 'Goal', icon: Target },
  { id: 'milestone', label: 'Milestone', icon: Flag },
  { id: 'task', label: 'Task', icon: CheckSquare },
  { id: 'personal', label: 'Personal', icon: User },
];

export function ExpenseLog({
  expenses,
  currency = 'USD',
  onCreateExpense,
  onDeleteExpense,
}: ExpenseLogProps) {
  const [entityFilter, setEntityFilter] = useState<ExpenseEntityType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (entityFilter !== 'all' && e.entityType !== entityFilter) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, entityFilter, categoryFilter]);

  const grouped = groupExpensesByMonth(filteredExpenses);
  const totalFiltered = sumExpenses(filteredExpenses);
  const totalAll = sumExpenses(expenses);

  const handleCreate = (payload: Parameters<typeof onCreateExpense>[0]) => {
    onCreateExpense(payload);
  };

  return (
    <div className="space-y-5">
      <ExpenseForm onSubmit={handleCreate} />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Expenses" value={formatCurrency(totalAll, currency)} />
        <StatCard
          label="Showing"
          value={formatCurrency(totalFiltered, currency)}
          dim={entityFilter !== 'all' || categoryFilter !== 'all'}
        />
        <StatCard label="Count" value={`${expenses.length} item${expenses.length !== 1 ? 's' : ''}`} />
        <StatCard
          label="Avg / Item"
          value={expenses.length ? formatCurrency(totalAll / expenses.length, currency) : '—'}
        />
      </div>

      {/* Filters */}
      {expenses.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Entity type filter */}
          <div className="flex flex-wrap gap-1">
            {ENTITY_FILTER_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setEntityFilter(id)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                  entityFilter === id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | 'all')}
              className="rounded-lg border border-border/60 bg-background px-2 py-1 text-xs focus:outline-none"
            >
              <option value="all">All categories</option>
              {Object.entries(EXPENSE_CATEGORY_STYLES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Empty state */}
      {expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No expenses logged yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Log expenses linked to projects, goals, or personal use.
          </p>
        </div>
      )}

      {/* Filtered empty */}
      {expenses.length > 0 && filteredExpenses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-10 text-center">
          <p className="text-sm text-muted-foreground">No expenses match the current filters.</p>
        </div>
      )}

      {/* Grouped by month */}
      {Array.from(grouped.entries()).map(([monthKey, monthExpenses]) => (
        <div key={monthKey} className="overflow-hidden rounded-2xl border border-border/60">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              {formatMonthLabel(monthKey)}
            </h3>
            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
              {formatCurrency(sumExpenses(monthExpenses), currency)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category / Type</th>
                  <th className="hidden px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Date</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="w-12 px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {monthExpenses.map((expense) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    currency={currency}
                    onDelete={onDeleteExpense}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 text-base font-bold tabular-nums', dim && 'text-indigo-600 dark:text-indigo-400')}>{value}</p>
    </div>
  );
}
