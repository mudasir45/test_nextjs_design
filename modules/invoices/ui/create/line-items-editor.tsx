'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { InvoiceDraft, LineItem } from '@/modules/invoices/core/types';
import {
  calculateLineSubtotal,
  calculateLineTax,
  createEmptyLineItem,
  formatCurrency,
} from '@/modules/invoices/core/invoice-utils';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';

interface LineItemsEditorProps {
  draft: InvoiceDraft;
  onChange: (draft: InvoiceDraft) => void;
  defaultTaxRate?: number;
}

export function LineItemsEditor({ draft, onChange, defaultTaxRate = 0 }: LineItemsEditorProps) {
  const theme = useInvoicesTheme();
  const today = new Date().toISOString().slice(0, 10);

  const updateItem = (index: number, updates: Partial<LineItem>) => {
    onChange({
      ...draft,
      lineItems: draft.lineItems.map((item, i) => i === index ? { ...item, ...updates } : item),
    });
  };

  const addItem = () => {
    const newItem = createEmptyLineItem(defaultTaxRate);
    onChange({ ...draft, lineItems: [...draft.lineItems, { ...newItem, date: today }] });
  };

  const removeItem = (index: number) => {
    if (draft.lineItems.length <= 1) return;
    onChange({ ...draft, lineItems: draft.lineItems.filter((_, i) => i !== index) });
  };

  const totals = draft.lineItems.reduce(
    (acc, item) => {
      const sub = calculateLineSubtotal(item);
      const tax = calculateLineTax(item);
      return { subtotal: acc.subtotal + sub, tax: acc.tax + tax, total: acc.total + sub + tax };
    },
    { subtotal: 0, tax: 0, total: 0 },
  );

  return (
    <div className="space-y-3">
      {/* Header row — desktop */}
      <div className="hidden grid-cols-[100px_1fr_70px_90px_70px_80px_36px] gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span>Date</span>
        <span>Description</span>
        <span>Qty</span>
        <span>Unit Price</span>
        <span>Tax %</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      {draft.lineItems.map((item, index) => {
        const lineTotal = calculateLineSubtotal(item) + calculateLineTax(item);
        return (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 md:grid-cols-[100px_1fr_70px_90px_70px_80px_36px] md:items-center md:border-0 md:bg-transparent md:p-0"
          >
            <input
              type="date"
              value={item.date ?? ''}
              onChange={(e) => updateItem(index, { date: e.target.value })}
              className="rounded-lg border border-border/60 bg-background px-2 py-2 text-xs focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            <input
              type="text"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(index, { description: e.target.value })}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(index, { quantity: Number(e.target.value) || 0 })}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm tabular-nums focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            <input
              type="number"
              min={0}
              step={0.01}
              value={item.unitPrice}
              onChange={(e) => updateItem(index, { unitPrice: Number(e.target.value) || 0 })}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm tabular-nums focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={item.taxRate}
              onChange={(e) => updateItem(index, { taxRate: Number(e.target.value) || 0 })}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm tabular-nums focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
            <span className="text-right text-sm font-semibold tabular-nums text-foreground">
              {formatCurrency(lineTotal, draft.currency)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={draft.lineItems.length <= 1}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Remove line item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={addItem}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
            theme.accentText,
            theme.accentSurfaceHover,
          )}
        >
          <Plus className="h-4 w-4" />
          Add line item
        </button>

        <div className="space-y-1 text-right text-sm">
          <div className="flex items-center justify-end gap-6">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="w-24 tabular-nums font-medium">{formatCurrency(totals.subtotal, draft.currency)}</span>
          </div>
          {totals.tax > 0 && (
            <div className="flex items-center justify-end gap-6">
              <span className="text-muted-foreground">Tax</span>
              <span className="w-24 tabular-nums text-muted-foreground">{formatCurrency(totals.tax, draft.currency)}</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-6 border-t border-border/60 pt-1">
            <span className="font-semibold">Total</span>
            <span className="w-24 tabular-nums text-base font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(totals.total, draft.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
