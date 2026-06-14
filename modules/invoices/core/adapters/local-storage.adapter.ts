import type { Client, Expense, Invoice, InvoicesFilterState, WorkspaceSettings } from '../types';
import type { InvoicesStorageAdapter, InvoicesStorageAdapterOptions } from './types';

export const DEFAULT_STORAGE_KEY = 'imergix-invoices-v1';

const FILTERS_SUFFIX = '-filters';
const EXPENSES_SUFFIX = '-expenses';
const CLIENTS_SUFFIX = '-clients';
const SETTINGS_SUFFIX = '-settings';

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createLocalStorageAdapter({
  storageKey,
}: InvoicesStorageAdapterOptions): InvoicesStorageAdapter {
  function loadJson<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  function saveJson(key: string, value: unknown) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  return {
    loadInvoices() {
      const parsed = loadJson<Invoice[]>(storageKey);
      return Array.isArray(parsed) ? (parsed as Invoice[]) : null;
    },
    saveInvoices(invoices) {
      saveJson(storageKey, invoices);
    },
    loadExpenses() {
      const parsed = loadJson<Expense[]>(`${storageKey}${EXPENSES_SUFFIX}`);
      return Array.isArray(parsed) ? (parsed as Expense[]) : null;
    },
    saveExpenses(expenses) {
      saveJson(`${storageKey}${EXPENSES_SUFFIX}`, expenses);
    },
    loadClients() {
      const parsed = loadJson<Client[]>(`${storageKey}${CLIENTS_SUFFIX}`);
      return Array.isArray(parsed) ? parsed : null;
    },
    saveClients(clients) {
      saveJson(`${storageKey}${CLIENTS_SUFFIX}`, clients);
    },
    loadFilters() {
      return loadJson<InvoicesFilterState>(`${storageKey}${FILTERS_SUFFIX}`);
    },
    saveFilters(filters) {
      saveJson(`${storageKey}${FILTERS_SUFFIX}`, filters);
    },
    loadSettings() {
      return loadJson<WorkspaceSettings>(`${storageKey}${SETTINGS_SUFFIX}`);
    },
    saveSettings(settings) {
      saveJson(`${storageKey}${SETTINGS_SUFFIX}`, settings);
    },
    clearAll() {
      if (typeof window === 'undefined') return;
      [
        storageKey,
        `${storageKey}${EXPENSES_SUFFIX}`,
        `${storageKey}${CLIENTS_SUFFIX}`,
        `${storageKey}${FILTERS_SUFFIX}`,
        `${storageKey}${SETTINGS_SUFFIX}`,
      ].forEach((k) => localStorage.removeItem(k));
    },
  };
}

export function createDefaultLocalStorageAdapter(
  storageKey = DEFAULT_STORAGE_KEY,
): InvoicesStorageAdapter {
  return createLocalStorageAdapter({ storageKey });
}
