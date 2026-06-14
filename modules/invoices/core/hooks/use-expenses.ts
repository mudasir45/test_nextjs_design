'use client';

import { useCallback, useEffect, useState } from 'react';
import { generateId } from '../adapters';
import type { InvoicesStorageAdapter } from '../adapters/types';
import type { CreateExpensePayload, Expense, ExpenseEntityType } from '../types';

interface UseExpensesOptions {
  initialExpenses: Expense[];
  adapter: InvoicesStorageAdapter;
  onExpensesChange?: (expenses: Expense[]) => void;
  hydrated: boolean;
}

export function useExpenses({
  initialExpenses,
  adapter,
  onExpensesChange,
  hydrated,
}: UseExpensesOptions) {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window === 'undefined') return initialExpenses;
    const stored = adapter.loadExpenses();
    return stored?.length ? stored : initialExpenses;
  });

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveExpenses(expenses);
    onExpensesChange?.(expenses);
  }, [expenses, hydrated, adapter, onExpensesChange]);

  const createExpense = useCallback((payload: CreateExpensePayload) => {
    const now = new Date().toISOString();
    const expense: Expense = {
      id: generateId('exp'),
      ...payload,
      createdAt: now,
    };
    setExpenses((prev) => [expense, ...prev]);
    return expense;
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  }, []);

  return {
    expenses,
    createExpense,
    deleteExpense,
  };
}
