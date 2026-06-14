'use client';

import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '../adapters';
import type { InvoicesStorageAdapter } from '../adapters/types';
import type { Client, Expense, Invoice } from '../types';
import { useInvoicesContextOptional } from '../../provider/InvoicesProvider';
import type { InvoicesCallbacks } from '../../provider/InvoicesProvider';

export interface InvoicesModuleConfigOverrides {
  storageKey?: string;
  initialInvoices?: Invoice[];
  initialExpenses?: Expense[];
  initialClients?: Client[];
  adapter?: InvoicesStorageAdapter;
}

export interface InvoicesModuleConfig {
  ctx: ReturnType<typeof useInvoicesContextOptional>;
  adapter: InvoicesStorageAdapter;
  storageKey: string;
  initialInvoices: Invoice[];
  initialExpenses: Expense[];
  initialClients: Client[];
  callbacks: InvoicesCallbacks;
}

/**
 * Resolves adapter, seed data, and callbacks from provider context with optional overrides.
 * Standalone components (no provider) require explicit `initialInvoices` via overrides.
 */
export function useInvoicesModuleConfig(
  overrides: InvoicesModuleConfigOverrides = {},
): InvoicesModuleConfig {
  const ctx = useInvoicesContextOptional();
  const storageKey = overrides.storageKey ?? ctx?.storageKey ?? DEFAULT_STORAGE_KEY;

  return {
    ctx,
    adapter: overrides.adapter ?? ctx?.adapter ?? createDefaultLocalStorageAdapter(storageKey),
    storageKey,
    initialInvoices: overrides.initialInvoices ?? ctx?.initialInvoices ?? [],
    initialExpenses: overrides.initialExpenses ?? ctx?.initialExpenses ?? [],
    initialClients: overrides.initialClients ?? ctx?.initialClients ?? [],
    callbacks: ctx?.callbacks ?? {},
  };
}
