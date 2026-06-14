'use client';

import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { InvoiceStatus, InvoicesFilterState, InvoicesViewTab } from '@/modules/invoices/core/types';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesRoutes, useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';

interface InvoicesToolbarProps {
  tab: InvoicesViewTab;
  onTabChange: (tab: InvoicesViewTab) => void;
  statusFilter: InvoiceStatus | 'all';
  onStatusChange: (status: InvoiceStatus | 'all') => void;
  filters: InvoicesFilterState;
  onFiltersChange: (filters: InvoicesFilterState) => void;
  statusCounts: Record<string, number>;
}

const VIEW_TABS: { id: InvoicesViewTab; label: string }[] = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'expenses', label: 'Expenses' },
];

const STATUS_TABS: { id: InvoiceStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
];

export function InvoicesToolbar({
  tab,
  onTabChange,
  statusFilter,
  onStatusChange,
  filters,
  onFiltersChange,
  statusCounts,
}: InvoicesToolbarProps) {
  const router = useRouter();
  const routes = useInvoicesRoutes();
  const theme = useInvoicesTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, send, and track payments from one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search invoices…"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full rounded-full border border-border/60 bg-muted/30 py-2 pl-9 pr-4 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 sm:w-48"
            />
          </div>

          <button
            type="button"
            onClick={() => router.push(routes.new)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
              theme.buttonPrimary,
            )}
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full border border-border/60 bg-muted/30 p-0.5">
          {VIEW_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                'cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200',
                tab === t.id ? theme.tabActive : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'invoices' && (
          <div className="flex flex-wrap gap-1 rounded-full border border-border/60 bg-muted/30 p-0.5">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onStatusChange(t.id)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  statusFilter === t.id
                    ? theme.tabActive
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
                {statusCounts[t.id] !== undefined && (
                  <span className="ml-1 tabular-nums opacity-60">({statusCounts[t.id]})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
