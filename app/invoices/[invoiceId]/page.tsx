'use client';

import { use } from 'react';
import {
  DEFAULT_CLIENTS,
  DEFAULT_EXPENSES,
  DEFAULT_INVOICES,
  InvoiceDetailPage,
  InvoicesProvider,
} from '@/modules/invoices';

interface InvoiceDetailRouteProps {
  params: Promise<{ invoiceId: string }>;
}

export default function InvoiceDetailRoute({ params }: InvoiceDetailRouteProps) {
  const { invoiceId } = use(params);

  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background">
      <InvoicesProvider
        initialInvoices={DEFAULT_INVOICES}
        initialExpenses={DEFAULT_EXPENSES}
        initialClients={DEFAULT_CLIENTS}
      >
        <InvoiceDetailPage invoiceId={invoiceId} />
      </InvoicesProvider>
    </main>
  );
}
