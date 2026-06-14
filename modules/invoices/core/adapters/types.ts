import type { Client, Expense, Invoice, InvoicesFilterState, WorkspaceSettings } from '../types';

/** Persistence boundary — swap localStorage for API in production. */
export interface InvoicesStorageAdapter {
  loadInvoices(): Invoice[] | null;
  saveInvoices(invoices: Invoice[]): void;
  loadExpenses(): Expense[] | null;
  saveExpenses(expenses: Expense[]): void;
  loadClients(): Client[] | null;
  saveClients(clients: Client[]): void;
  loadFilters(): InvoicesFilterState | null;
  saveFilters(filters: InvoicesFilterState): void;
  loadSettings(): WorkspaceSettings | null;
  saveSettings(settings: WorkspaceSettings): void;
  clearAll(): void;
}

export interface InvoicesStorageAdapterOptions {
  storageKey: string;
}
