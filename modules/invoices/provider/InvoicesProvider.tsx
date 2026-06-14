'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { InvoicesStorageAdapter } from '../core/adapters';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '../core/adapters';
import type { LinkableEntityGroups } from '../core/entity-utils';
import type { Client, Expense, Invoice, UpdateInvoicePayload } from '../core/types';
import type { InvoicesRoutes } from '../core/routes';
import { DEFAULT_INVOICES_ROUTES } from '../core/routes';
import {
  defaultInvoicesTheme,
  mergeInvoicesTheme,
  type InvoicesTheme,
} from '../theme/invoices-theme';

export interface InvoicesCallbacks {
  onInvoicesChange?: (invoices: Invoice[]) => void;
  onExpensesChange?: (expenses: Expense[]) => void;
  onClientsChange?: (clients: Client[]) => void;
  onInvoiceCreate?: (invoice: Invoice) => void | Promise<void>;
  onInvoiceUpdate?: (invoiceId: string, updates: UpdateInvoicePayload) => void | Promise<void>;
  onInvoiceDelete?: (invoiceId: string) => void | Promise<void>;
  onExpenseCreate?: (expense: Expense) => void | Promise<void>;
  onExpenseDelete?: (expenseId: string) => void | Promise<void>;
  onClientCreate?: (client: Client) => void | Promise<void>;
  onClientUpdate?: (clientId: string, updates: Partial<Client>) => void | Promise<void>;
  onClientDelete?: (clientId: string) => void | Promise<void>;
}

export interface InvoicesProviderProps extends InvoicesCallbacks {
  children: ReactNode;
  initialInvoices: Invoice[];
  initialExpenses?: Expense[];
  initialClients?: Client[];
  /** Optional entities for expense linking (projects, goals, milestones, tasks). */
  linkableEntities?: LinkableEntityGroups;
  adapter?: InvoicesStorageAdapter;
  storageKey?: string;
  theme?: Partial<InvoicesTheme>;
  routes?: Partial<InvoicesRoutes>;
}

interface InvoicesContextValue {
  initialInvoices: Invoice[];
  initialExpenses: Expense[];
  initialClients: Client[];
  linkableEntities: LinkableEntityGroups;
  adapter: InvoicesStorageAdapter;
  storageKey: string;
  theme: InvoicesTheme;
  routes: InvoicesRoutes;
  callbacks: InvoicesCallbacks;
}

const InvoicesContext = createContext<InvoicesContextValue | null>(null);

export function InvoicesProvider({
  children,
  initialInvoices,
  initialExpenses = [],
  initialClients = [],
  linkableEntities = {},
  adapter,
  storageKey = DEFAULT_STORAGE_KEY,
  theme,
  routes: routesProp,
  onInvoicesChange,
  onExpensesChange,
  onClientsChange,
  onInvoiceCreate,
  onInvoiceUpdate,
  onInvoiceDelete,
  onExpenseCreate,
  onExpenseDelete,
  onClientCreate,
  onClientUpdate,
  onClientDelete,
}: InvoicesProviderProps) {
  const value = useMemo<InvoicesContextValue>(
    () => ({
      initialInvoices,
      initialExpenses,
      initialClients,
      linkableEntities,
      adapter: adapter ?? createDefaultLocalStorageAdapter(storageKey),
      storageKey,
      theme: mergeInvoicesTheme(theme),
      routes: { ...DEFAULT_INVOICES_ROUTES, ...routesProp },
      callbacks: {
        onInvoicesChange,
        onExpensesChange,
        onClientsChange,
        onInvoiceCreate,
        onInvoiceUpdate,
        onInvoiceDelete,
        onExpenseCreate,
        onExpenseDelete,
        onClientCreate,
        onClientUpdate,
        onClientDelete,
      },
    }),
    [
      initialInvoices,
      initialExpenses,
      initialClients,
      linkableEntities,
      adapter,
      storageKey,
      theme,
      routesProp,
      onInvoicesChange,
      onExpensesChange,
      onClientsChange,
      onInvoiceCreate,
      onInvoiceUpdate,
      onInvoiceDelete,
      onExpenseCreate,
      onExpenseDelete,
      onClientCreate,
      onClientUpdate,
      onClientDelete,
    ],
  );

  return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
}

export function useInvoicesContext(): InvoicesContextValue {
  const ctx = useContext(InvoicesContext);
  if (!ctx) {
    throw new Error('useInvoicesContext must be used within InvoicesProvider');
  }
  return ctx;
}

export function useInvoicesContextOptional(): InvoicesContextValue | null {
  return useContext(InvoicesContext);
}

export function useInvoicesTheme(): InvoicesTheme {
  return useInvoicesContextOptional()?.theme ?? defaultInvoicesTheme;
}

export function useInvoicesRoutes(): InvoicesRoutes {
  return useInvoicesContextOptional()?.routes ?? DEFAULT_INVOICES_ROUTES;
}

export function useLinkableEntities(): LinkableEntityGroups {
  return useInvoicesContextOptional()?.linkableEntities ?? {};
}
