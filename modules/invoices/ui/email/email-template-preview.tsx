'use client';

import { Mail, X } from 'lucide-react';
import type { Invoice, InvoiceDraft, WorkspaceSettings } from '@/modules/invoices/core/types';
import { formatCurrency, formatDate, calculateInvoiceTotals } from '@/modules/invoices/core/invoice-utils';
import { cn } from '@/modules/invoices/core/cn';

interface EmailTemplatePreviewProps {
  draft: InvoiceDraft;
  invoiceNumber: string;
  settings?: WorkspaceSettings;
  onClose?: () => void;
  /** Future: pass to real email handler */
  onSend?: (recipientEmail: string) => void;
}

/**
 * Email template preview — shows what the client will receive.
 * Actual sending is wired via the `onSend` callback when email integration is added.
 */
export function EmailTemplatePreview({
  draft,
  invoiceNumber,
  settings,
  onClose,
  onSend,
}: EmailTemplatePreviewProps) {
  const totals = calculateInvoiceTotals(draft.lineItems);
  const companyName = settings?.companyName ?? 'iMergix Studio';
  const companyEmail = settings?.companyEmail ?? '';

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-semibold text-foreground">Email Preview</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Email metadata */}
      <div className="border-b border-border/60 bg-muted/20 px-5 py-3 text-sm">
        <div className="space-y-1">
          <EmailMeta label="From" value={`${companyName} <${companyEmail}>`} />
          <EmailMeta label="To" value={`${draft.clientName} <${draft.clientEmail}>`} />
          <EmailMeta label="Subject" value={`Invoice ${invoiceNumber} from ${companyName}`} />
        </div>
      </div>

      {/* Email body preview */}
      <div className="flex-1 overflow-y-auto bg-zinc-50 p-4 dark:bg-zinc-900">
        <div className="mx-auto max-w-[600px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          {/* Brand header */}
          <div className="bg-indigo-600 px-8 py-6 text-white">
            <p className="text-lg font-bold">{companyName}</p>
            <p className="mt-0.5 text-sm text-indigo-200">Invoice {invoiceNumber}</p>
          </div>

          <div className="px-8 py-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Hi <span className="font-medium text-zinc-900 dark:text-zinc-100">{draft.clientName || 'there'}</span>,
            </p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              Please find your invoice{draft.projectName ? ` for <strong>${draft.projectName}</strong>` : ''} attached below.
            </p>

            {/* Summary card */}
            <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-600">
              <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-600">
                <div className="p-4">
                  <p className="text-xs font-medium text-zinc-400">Invoice Number</p>
                  <p className="mt-1 font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{invoiceNumber}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-zinc-400">Amount Due</p>
                  <p className="mt-1 font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(totals.total, draft.currency)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-zinc-400">Issue Date</p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {draft.issueDate ? formatDate(draft.issueDate) : '—'}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-zinc-400">Due Date</p>
                  <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {draft.dueDate ? formatDate(draft.dueDate) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 text-center">
              <div className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white">
                View &amp; Pay Invoice
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                Or copy this link: {typeof window !== 'undefined' ? `${window.location.origin}/invoices/...` : 'https://app.imergix.com/invoices/...'}
              </p>
            </div>

            {/* Notes */}
            {draft.notes && (
              <div className="mt-5 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-700">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Message</p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{draft.notes}</p>
              </div>
            )}

            <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
              If you have any questions, reply to this email or reach us at{' '}
              <span className="text-indigo-500">{companyEmail}</span>.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 bg-zinc-50 px-8 py-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-center text-xs text-zinc-400">
              Sent via iMergix · {companyName}
            </p>
          </div>
        </div>
      </div>

      {/* Send action (ready for integration) */}
      {onSend && (
        <div className="border-t border-border/60 p-4">
          <button
            type="button"
            onClick={() => onSend(draft.clientEmail)}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <Mail className="h-4 w-4" />
            Send to {draft.clientEmail || 'client'}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Email integration coming soon — template is ready.
          </p>
        </div>
      )}
    </div>
  );
}

function EmailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">{label}:</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}
