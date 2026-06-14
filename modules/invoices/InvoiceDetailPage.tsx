'use client';

import { InvoiceDetailPanel } from '@/modules/invoices/ui/detail/invoice-detail-panel';

interface InvoiceDetailPageProps {
  invoiceId: string;
  className?: string;
}

/** Single-invoice detail view — use inside `InvoicesProvider`. */
export function InvoiceDetailPage({ invoiceId, className }: InvoiceDetailPageProps) {
  return <InvoiceDetailPanel invoiceId={invoiceId} className={className} />;
}
