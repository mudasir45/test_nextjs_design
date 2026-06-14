'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateId } from '../adapters';
import type { InvoicesStorageAdapter } from '../adapters/types';
import {
  calculateInvoiceTotals,
  generateInvoiceNumber,
  normalizeInvoice,
  resolveInvoiceStatus,
} from '../invoice-utils';
import type {
  CreateInvoicePayload,
  Invoice,
  InvoiceSortField,
  InvoicesFilterState,
  SortDirection,
  UpdateInvoicePayload,
  WorkspaceSettings,
} from '../types';
import { DEFAULT_FILTERS, DEFAULT_WORKSPACE_SETTINGS } from '../types';

interface UseInvoicesOptions {
  storageKey: string;
  initialInvoices: Invoice[];
  adapter: InvoicesStorageAdapter;
  onInvoicesChange?: (invoices: Invoice[]) => void;
}

function filterInvoices(invoices: Invoice[], filters: InvoicesFilterState): Invoice[] {
  return invoices.filter((invoice) => {
    const status = resolveInvoiceStatus(invoice);
    if (filters.status !== 'all' && status !== filters.status) return false;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const haystack = [
        invoice.number,
        invoice.clientName,
        invoice.clientEmail,
        invoice.projectName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function sortInvoices(
  invoices: Invoice[],
  field: InvoiceSortField,
  direction: SortDirection,
): Invoice[] {
  const sorted = [...invoices].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'number':
        cmp = a.number.localeCompare(b.number);
        break;
      case 'clientName':
        cmp = a.clientName.localeCompare(b.clientName);
        break;
      case 'total':
        cmp = a.total - b.total;
        break;
      case 'dueDate':
        cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'status':
        cmp = resolveInvoiceStatus(a).localeCompare(resolveInvoiceStatus(b));
        break;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

export function useInvoices({
  storageKey: _storageKey,
  initialInvoices,
  adapter,
  onInvoicesChange,
}: UseInvoicesOptions) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const seed = initialInvoices.map(normalizeInvoice);
    if (typeof window === 'undefined') return seed;
    const stored = adapter.loadInvoices();
    return stored?.length ? stored.map(normalizeInvoice) : seed;
  });

  const [filters, setFilters] = useState<InvoicesFilterState>(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTERS;
    return adapter.loadFilters() ?? DEFAULT_FILTERS;
  });

  const [settings, setSettings] = useState<WorkspaceSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_WORKSPACE_SETTINGS;
    return adapter.loadSettings() ?? DEFAULT_WORKSPACE_SETTINGS;
  });

  const [hydrated] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveInvoices(invoices);
    onInvoicesChange?.(invoices);
  }, [invoices, hydrated, adapter, onInvoicesChange]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveFilters(filters);
  }, [filters, hydrated, adapter]);

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveSettings(settings);
  }, [settings, hydrated, adapter]);

  const filteredInvoices = useMemo(() => {
    const filtered = filterInvoices(invoices, filters);
    return sortInvoices(filtered, filters.sortField, filters.sortDirection);
  }, [invoices, filters]);

  const createInvoice = useCallback(
    (payload: CreateInvoicePayload, status: 'draft' | 'sent' = 'draft') => {
      const now = new Date().toISOString();
      const lineItems = payload.lineItems.map((item) => ({
        ...item,
        id: generateId('li'),
      }));
      const totals = calculateInvoiceTotals(lineItems);
      const number = generateInvoiceNumber(invoices, settings);

      const invoice: Invoice = normalizeInvoice({
        id: generateId('inv'),
        number,
        clientId: payload.clientId,
        clientName: payload.clientName,
        clientEmail: payload.clientEmail,
        clientAddress: payload.clientAddress,
        clientPhone: payload.clientPhone,
        clientCompany: payload.clientCompany,
        clientChamberOfCommerce: payload.clientChamberOfCommerce,
        clientVatNumber: payload.clientVatNumber,
        projectName: payload.projectName,
        status,
        issueDate: payload.issueDate,
        dueDate: payload.dueDate,
        lineItems,
        notes: payload.notes,
        paymentInstructions: payload.paymentInstructions,
        termsAndConditions: payload.termsAndConditions,
        currency: payload.currency ?? settings.currency,
        ...totals,
        createdAt: now,
        updatedAt: now,
        sentAt: status === 'sent' ? now : undefined,
      });

      setInvoices((prev) => [invoice, ...prev]);
      return invoice;
    },
    [invoices, settings],
  );

  const updateInvoice = useCallback((invoiceId: string, updates: UpdateInvoicePayload) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const now = new Date().toISOString();
        let lineItems = inv.lineItems;
        if (updates.lineItems) {
          lineItems = updates.lineItems.map((item) => ({
            ...item,
            id: generateId('li'),
          }));
        }
        const totals = calculateInvoiceTotals(lineItems);
        const updated: Invoice = {
          ...inv,
          ...updates,
          lineItems,
          ...totals,
          updatedAt: now,
        };
        if (updates.status === 'sent' && !inv.sentAt) {
          updated.sentAt = now;
        }
        if (updates.status === 'paid' && !inv.paidAt) {
          updated.paidAt = now;
        }
        return normalizeInvoice(updated);
      }),
    );
  }, []);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
  }, []);

  const markAsSent = useCallback((invoiceId: string) => {
    updateInvoice(invoiceId, { status: 'sent' });
  }, [updateInvoice]);

  const markAsPaid = useCallback((invoiceId: string) => {
    updateInvoice(invoiceId, { status: 'paid' });
  }, [updateInvoice]);

  const getInvoiceById = useCallback(
    (invoiceId: string) => invoices.find((inv) => inv.id === invoiceId),
    [invoices],
  );

  const resetInvoices = useCallback(() => {
    adapter.clearAll();
    setInvoices(initialInvoices.map(normalizeInvoice));
    setFilters(DEFAULT_FILTERS);
    setSettings(DEFAULT_WORKSPACE_SETTINGS);
  }, [adapter, initialInvoices]);

  return {
    invoices,
    filteredInvoices,
    filters,
    setFilters,
    settings,
    setSettings,
    hydrated,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsSent,
    markAsPaid,
    getInvoiceById,
    resetInvoices,
  };
}
