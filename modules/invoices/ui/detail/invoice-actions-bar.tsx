'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Edit,
  Send,
  Trash2,
} from 'lucide-react';
import type { Invoice } from '@/modules/invoices/core/types';
import {
  copyInvoiceShareLink,
  formatDateTime,
  invoiceToDraft,
  resolveInvoiceStatus,
} from '@/modules/invoices/core/invoice-utils';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';

interface InvoiceActionsBarProps {
  invoice: Invoice;
  onEdit: () => void;
  onSend: () => void;
  onMarkPaid: () => void;
  onDelete: () => void;
}

export function InvoiceActionsBar({
  invoice,
  onEdit,
  onSend,
  onMarkPaid,
  onDelete,
}: InvoiceActionsBarProps) {
  const theme = useInvoicesTheme();
  const status = resolveInvoiceStatus(invoice);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyInvoiceShareLink(invoice.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === 'draft' && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>
      )}

      {(status === 'draft' || status === 'sent' || status === 'overdue') && (
        <button
          type="button"
          onClick={onSend}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
            theme.buttonPrimary,
          )}
        >
          <Send className="h-4 w-4" />
          {status === 'draft' ? 'Send Invoice' : 'Resend'}
        </button>
      )}

      {(status === 'sent' || status === 'overdue') && (
        <button
          type="button"
          onClick={onMarkPaid}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark Paid
        </button>
      )}

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
      >
        <Copy className="h-4 w-4" />
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}

interface InvoiceActivityTimelineProps {
  invoice: Invoice;
}

export function InvoiceActivityTimeline({ invoice }: InvoiceActivityTimelineProps) {
  const events = [
    { label: 'Created', date: invoice.createdAt },
    invoice.sentAt ? { label: 'Sent', date: invoice.sentAt } : null,
    invoice.paidAt ? { label: 'Paid', date: invoice.paidAt } : null,
  ].filter(Boolean) as { label: string; date: string }[];

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <div key={event.label} className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <div>
              <p className="text-sm font-medium text-foreground">{event.label}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(event.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { invoiceToDraft };
