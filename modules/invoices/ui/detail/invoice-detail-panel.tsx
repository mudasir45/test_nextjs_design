'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesModuleConfig } from '@/modules/invoices/core/hooks/use-invoices-module-config';
import {
  useInvoicesRoutes,
  useInvoicesTheme,
} from '@/modules/invoices/provider/InvoicesProvider';
import { useInvoices } from '@/modules/invoices/core/hooks/use-invoices';
import { invoiceToDraft, resolveInvoiceStatus } from '@/modules/invoices/core/invoice-utils';
import { InvoicePreview } from '@/modules/invoices/ui/create/invoice-preview';
import { PdfDownloadButton } from '@/modules/invoices/ui/pdf/pdf-download-button';
import { EmailTemplatePreview } from '@/modules/invoices/ui/email/email-template-preview';
import {
  InvoiceActionsBar,
  InvoiceActivityTimeline,
} from './invoice-actions-bar';

interface InvoiceDetailPanelProps {
  invoiceId: string;
  className?: string;
}

export function InvoiceDetailPanel({ invoiceId, className }: InvoiceDetailPanelProps) {
  const router = useRouter();
  const theme = useInvoicesTheme();
  const routes = useInvoicesRoutes();
  const [showEmail, setShowEmail] = useState(false);

  const { adapter, storageKey, initialInvoices, callbacks } = useInvoicesModuleConfig();

  const {
    getInvoiceById,
    markAsSent,
    markAsPaid,
    deleteInvoice,
    settings,
    hydrated,
  } = useInvoices({
    storageKey,
    initialInvoices,
    adapter,
  });

  const invoice = useMemo(() => getInvoiceById(invoiceId), [getInvoiceById, invoiceId]);

  const handleEdit = useCallback(() => {
    router.push(`${routes.new}?edit=${invoiceId}`);
  }, [router, routes, invoiceId]);

  const handleSend = useCallback(() => {
    markAsSent(invoiceId);
    callbacks.onInvoiceUpdate?.(invoiceId, { status: 'sent' });
    setShowEmail(true);
  }, [markAsSent, invoiceId, callbacks]);

  const handleMarkPaid = useCallback(() => {
    markAsPaid(invoiceId);
    callbacks.onInvoiceUpdate?.(invoiceId, { status: 'paid' });
  }, [markAsPaid, invoiceId, callbacks]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(invoiceId);
      callbacks.onInvoiceDelete?.(invoiceId);
      router.push(routes.index);
    }
  }, [deleteInvoice, invoiceId, callbacks, router, routes]);

  if (!hydrated) {
    return (
      <div className={cn('flex flex-1 items-center justify-center', className)}>
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className={cn('flex flex-1 flex-col items-center justify-center gap-4', className)}>
        <p className="text-sm text-muted-foreground">Invoice not found.</p>
        <button
          type="button"
          onClick={() => router.push(routes.index)}
          className="cursor-pointer text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  const resolved = { ...invoice, status: resolveInvoiceStatus(invoice) };
  const draft = invoiceToDraft(resolved);
  const mergedDraft = {
    ...draft,
    paymentInstructions: draft.paymentInstructions || settings.paymentInstructions,
    termsAndConditions: draft.termsAndConditions || settings.termsAndConditions,
  };

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      {/* Header */}
      <div className="border-b border-border/60 px-4 py-4 md:px-6">
        <button
          type="button"
          onClick={() => router.push(routes.index)}
          className="mb-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </button>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {resolved.number}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {resolved.clientName}
              {resolved.clientCompany ? ` · ${resolved.clientCompany}` : ''}
              {resolved.projectName && ` · ${resolved.projectName}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PdfDownloadButton invoiceNumber={resolved.number} />
            <button
              type="button"
              onClick={() => setShowEmail(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Mail className="h-4 w-4" />
              Email Preview
            </button>
            <InvoiceActionsBar
              invoice={resolved}
              onEdit={handleEdit}
              onSend={handleSend}
              onMarkPaid={handleMarkPaid}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Email template slide-over */}
      {showEmail && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowEmail(false)} />
          <div className="flex w-full max-w-xl flex-col bg-background shadow-2xl">
            <EmailTemplatePreview
              draft={mergedDraft}
              invoiceNumber={resolved.number}
              settings={settings}
              onClose={() => setShowEmail(false)}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6 lg:flex-row">
        <div className="flex-1">
          <div id="invoice-preview-pdf">
            <InvoicePreview
              draft={mergedDraft}
              invoiceNumber={resolved.number}
              status={resolved.status}
              settings={settings}
              className="shadow-none"
            />
          </div>
        </div>
        <div className="w-full lg:w-72 lg:shrink-0">
          <InvoiceActivityTimeline invoice={resolved} />
        </div>
      </div>
    </div>
  );
}
