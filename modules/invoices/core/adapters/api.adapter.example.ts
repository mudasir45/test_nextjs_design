/**
 * Example API-backed adapter for production.
 *
 * Copy to your app (e.g. `lib/invoices-api-adapter.ts`) and wire with React Query.
 * Hooks call load/save synchronously — keep an in-memory cache that your data layer hydrates.
 *
 * @see INTEGRATION.md § "Production wiring with React Query"
 */

import type { InvoicesStorageAdapter } from './types';
import type {
  Client,
  Expense,
  Invoice,
  InvoicesFilterState,
  WorkspaceSettings,
} from '../types';
import { DEFAULT_FILTERS, DEFAULT_WORKSPACE_SETTINGS } from '../types';

export interface InvoicesApiClient {
  fetchInvoices(): Promise<Invoice[]>;
  saveInvoices(invoices: Invoice[]): Promise<void>;
  fetchExpenses(): Promise<Expense[]>;
  saveExpenses(expenses: Expense[]): Promise<void>;
  fetchClients(): Promise<Client[]>;
  saveClients(clients: Client[]): Promise<void>;
  fetchFilters?(): Promise<InvoicesFilterState | null>;
  saveFilters?(filters: InvoicesFilterState): Promise<void>;
  fetchSettings?(): Promise<WorkspaceSettings | null>;
  saveSettings?(settings: WorkspaceSettings): Promise<void>;
}

/** Extended adapter with explicit hydrate — use in host app only. */
export type ApiInvoicesAdapter = InvoicesStorageAdapter & {
  hydrate: (data: {
    invoices?: Invoice[];
    expenses?: Expense[];
    clients?: Client[];
    filters?: InvoicesFilterState | null;
    settings?: WorkspaceSettings | null;
  }) => void;
};

/**
 * In-memory cache synced by your data layer (React Query onSuccess, SSR props, etc.).
 */
export function createApiInvoicesAdapter(client: InvoicesApiClient): ApiInvoicesAdapter {
  let invoicesCache: Invoice[] | null = null;
  let expensesCache: Expense[] | null = null;
  let clientsCache: Client[] | null = null;
  let filtersCache: InvoicesFilterState | null = null;
  let settingsCache: WorkspaceSettings | null = null;

  const adapter: ApiInvoicesAdapter = {
    loadInvoices() {
      return invoicesCache;
    },
    saveInvoices(invoices) {
      invoicesCache = invoices;
      void client.saveInvoices(invoices).catch(console.error);
    },
    loadExpenses() {
      return expensesCache;
    },
    saveExpenses(expenses) {
      expensesCache = expenses;
      void client.saveExpenses(expenses).catch(console.error);
    },
    loadClients() {
      return clientsCache;
    },
    saveClients(clients) {
      clientsCache = clients;
      void client.saveClients(clients).catch(console.error);
    },
    loadFilters() {
      return filtersCache;
    },
    saveFilters(filters) {
      filtersCache = filters;
      client.saveFilters?.(filters)?.catch(console.error);
    },
    loadSettings() {
      return settingsCache ?? DEFAULT_WORKSPACE_SETTINGS;
    },
    saveSettings(settings) {
      settingsCache = settings;
      client.saveSettings?.(settings)?.catch(console.error);
    },
    clearAll() {
      invoicesCache = null;
      expensesCache = null;
      clientsCache = null;
      filtersCache = null;
      settingsCache = null;
    },
    hydrate({ invoices, expenses, clients, filters, settings }) {
      if (invoices !== undefined) invoicesCache = invoices;
      if (expenses !== undefined) expensesCache = expenses;
      if (clients !== undefined) clientsCache = clients;
      if (filters !== undefined) filtersCache = filters ?? DEFAULT_FILTERS;
      if (settings !== undefined) settingsCache = settings ?? DEFAULT_WORKSPACE_SETTINGS;
    },
  };

  return adapter;
}
