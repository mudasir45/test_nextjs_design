import type { Expense, ExpenseCategory } from './types';
import { formatCurrency } from './invoice-utils';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  equipment: 'Equipment',
  software: 'Software',
  travel: 'Travel',
  marketing: 'Marketing',
  other: 'Other',
};

export function groupExpensesByMonth(expenses: Expense[]): Map<string, Expense[]> {
  const groups = new Map<string, Expense[]>();
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const expense of sorted) {
    const monthKey = expense.date.slice(0, 7);
    const existing = groups.get(monthKey) ?? [];
    existing.push(expense);
    groups.set(monthKey, existing);
  }

  return groups;
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function formatExpenseAmount(amount: number, currency = 'USD'): string {
  return formatCurrency(amount, currency);
}
