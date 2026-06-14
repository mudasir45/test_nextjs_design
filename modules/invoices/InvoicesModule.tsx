'use client';

import { useCallback, useMemo, useState } from 'react';
import { Plus, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Invoice, InvoicesModuleProps, InvoicesViewTab } from '@/modules/invoices/core/types';
import { DEFAULT_FILTERS } from '@/modules/invoices/core/types';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesModuleConfig } from '@/modules/invoices/core/hooks/use-invoices-module-config';
import {
  useInvoicesRoutes,
  useInvoicesTheme,
} from '@/modules/invoices/provider/InvoicesProvider';
import { useInvoices } from '@/modules/invoices/core/hooks/use-invoices';
import { useExpenses } from '@/modules/invoices/core/hooks/use-expenses';
import { useClients } from '@/modules/invoices/core/hooks/use-clients';
import {
  computeFinanceSummary,
  computeMonthlyRevenue,
  countInvoicesByStatus,
} from '@/modules/invoices/core/finance-utils';
import { FinanceSummaryCards } from '@/modules/invoices/ui/board/finance-summary-cards';
import { FinanceBarChart } from '@/modules/invoices/ui/board/finance-bar-chart';
import { InvoicesToolbar } from '@/modules/invoices/ui/board/invoices-toolbar';
import { InvoiceListTable } from '@/modules/invoices/ui/board/invoice-list-table';
import { ExpenseLog } from '@/modules/invoices/ui/expenses/expense-log';
import { CompanySettingsPanel } from '@/modules/invoices/ui/settings/company-settings-panel';

export function InvoicesModule({
  storageKey,
  initialInvoices,
  initialExpenses,
  initialClients,
  adapter: adapterProp,
  onInvoicesChange,
  onExpensesChange,
  onClientsChange,
  className,
}: InvoicesModuleProps) {
  const router = useRouter();
  const theme = useInvoicesTheme();
  const routes = useInvoicesRoutes();

  const {
    adapter,
    storageKey: resolvedStorageKey,
    initialInvoices: seedInvoices,
    initialExpenses: seedExpenses,
    initialClients: seedClients,
    callbacks,
  } = useInvoicesModuleConfig({
    storageKey,
    initialInvoices,
    initialExpenses,
    initialClients,
    adapter: adapterProp,
  });

  const invoicesChangeCb = onInvoicesChange ?? callbacks.onInvoicesChange;
  const expensesChangeCb = onExpensesChange ?? callbacks.onExpensesChange;
  const clientsChangeCb = onClientsChange ?? callbacks.onClientsChange;

  const {
    invoices,
    filteredInvoices,
    filters,
    setFilters,
    settings,
    setSettings,
    hydrated,
    updateInvoice,
    deleteInvoice,
  } = useInvoices({
    storageKey: resolvedStorageKey,
    initialInvoices: seedInvoices,
    adapter,
    onInvoicesChange: invoicesChangeCb,
  });

  const { expenses, createExpense, deleteExpense } = useExpenses({
    initialExpenses: seedExpenses,
    adapter,
    onExpensesChange: expensesChangeCb,
    hydrated,
  });

  useClients({
    initialClients: seedClients,
    adapter,
    hydrated,
    onClientsChange: clientsChangeCb,
  });

  const [viewTab, setViewTab] = useState<InvoicesViewTab>('invoices');
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [showSettings, setShowSettings] = useState(false);

  const summary = useMemo(() => computeFinanceSummary(invoices), [invoices]);
  const monthlyRevenue = useMemo(() => computeMonthlyRevenue(invoices), [invoices]);
  const statusCounts = useMemo(() => countInvoicesByStatus(invoices), [invoices]);

  const handleStatusChange = useCallback(
    (status: typeof filters.status) => {
      setStatusFilter(status);
      setFilters({ ...filters, status });
    },
    [filters, setFilters],
  );

  const handleTabChange = useCallback(
    (tab: InvoicesViewTab) => {
      setViewTab(tab);
      if (tab === 'invoices') {
        setFilters({ ...DEFAULT_FILTERS, search: filters.search });
        setStatusFilter('all');
      }
    },
    [filters.search, setFilters],
  );

  const handleInvoiceClick = useCallback(
    (invoice: Invoice) => { router.push(routes.detail(invoice.id)); },
    [router, routes],
  );

  const handleCreateExpense = useCallback(
    (payload: Parameters<typeof createExpense>[0]) => {
      const expense = createExpense(payload);
      callbacks.onExpenseCreate?.(expense);
    },
    [createExpense, callbacks],
  );

  const handleDeleteExpense = useCallback(
    (expenseId: string) => {
      deleteExpense(expenseId);
      callbacks.onExpenseDelete?.(expenseId);
    },
    [deleteExpense, callbacks],
  );

  if (!hydrated) {
    return (
      <div className={cn('flex flex-1 items-center justify-center', className)}>
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage invoices, expenses &amp; payments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(routes.new)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
              theme.buttonPrimary,
            )}
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="w-full max-w-md overflow-y-auto bg-background shadow-2xl">
            <CompanySettingsPanel
              settings={settings}
              onSave={(s) => { setSettings(s); setShowSettings(false); }}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}

      <InvoicesToolbar
        tab={viewTab}
        onTabChange={handleTabChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        filters={filters}
        onFiltersChange={setFilters}
        statusCounts={statusCounts}
      />

      {viewTab === 'invoices' ? (
        <>
          <FinanceSummaryCards summary={summary} currency={settings.currency} />
          <FinanceBarChart data={monthlyRevenue} currency={settings.currency} />
          <InvoiceListTable
            invoices={filteredInvoices}
            filters={filters}
            onFiltersChange={setFilters}
            onInvoiceClick={handleInvoiceClick}
            onMarkPaid={(id) => updateInvoice(id, { status: 'paid' })}
            onMarkSent={(id) => updateInvoice(id, { status: 'sent' })}
            onDelete={deleteInvoice}
          />
        </>
      ) : (
        <ExpenseLog
          expenses={expenses}
          currency={settings.currency}
          onCreateExpense={handleCreateExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}
    </div>
  );
}

export default InvoicesModule;
