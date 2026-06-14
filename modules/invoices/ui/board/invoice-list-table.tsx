'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import type { Invoice, InvoiceSortField, InvoicesFilterState } from '@/modules/invoices/core/types';
import { copyInvoiceShareLink, resolveInvoiceStatus } from '@/modules/invoices/core/invoice-utils';
import { InvoiceRow } from './invoice-row';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesRoutes } from '@/modules/invoices/provider/InvoicesProvider';

interface InvoiceListTableProps {
  invoices: Invoice[];
  filters: InvoicesFilterState;
  onFiltersChange: (filters: InvoicesFilterState) => void;
  onInvoiceClick: (invoice: Invoice) => void;
  onMarkPaid: (id: string) => void;
  onMarkSent: (id: string) => void;
  onDelete: (id: string) => void;
}

const COLUMNS: { field: InvoiceSortField; label: string; className?: string }[] = [
  { field: 'number', label: 'Invoice #', className: 'w-[130px]' },
  { field: 'clientName', label: 'Client' },
  { field: 'total', label: 'Amount', className: 'text-right' },
  { field: 'dueDate', label: 'Due Date', className: 'hidden md:table-cell' },
  { field: 'status', label: 'Status', className: 'w-[100px]' },
];

export function InvoiceListTable({
  invoices,
  filters,
  onFiltersChange,
  onInvoiceClick,
  onMarkPaid,
  onMarkSent,
  onDelete,
}: InvoiceListTableProps) {
  const router = useRouter();
  const routes = useInvoicesRoutes();

  const handleSort = (field: InvoiceSortField) => {
    const direction =
      filters.sortField === field && filters.sortDirection === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ ...filters, sortField: field, sortDirection: direction });
  };

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No invoices found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first invoice or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              {COLUMNS.map((col) => (
                <th
                  key={col.field}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                    col.className,
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.field)}
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground',
                      col.field === 'total' && 'ml-auto',
                    )}
                  >
                    {col.label}
                    <ArrowUpDown
                      className={cn(
                        'h-3 w-3',
                        filters.sortField === col.field ? 'opacity-100' : 'opacity-40',
                      )}
                    />
                  </button>
                </th>
              ))}
              <th className="w-24 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={{ ...invoice, status: resolveInvoiceStatus(invoice) }}
                onClick={() => onInvoiceClick(invoice)}
                onEdit={() => router.push(`${routes.new}?edit=${invoice.id}`)}
                onSend={() => onMarkSent(invoice.id)}
                onMarkPaid={() => onMarkPaid(invoice.id)}
                onDelete={() => {
                  if (window.confirm('Delete this invoice?')) onDelete(invoice.id);
                }}
                onCopyLink={() => copyInvoiceShareLink(invoice.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
