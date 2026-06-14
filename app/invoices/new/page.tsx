'use client';

import {
  DEFAULT_CLIENTS,
  DEFAULT_EXPENSES,
  DEFAULT_INVOICES,
  InvoicesProvider,
  NewInvoicePage,
} from '@/modules/invoices';

export default function NewInvoiceRoute() {
  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background">
      <InvoicesProvider
        initialInvoices={DEFAULT_INVOICES}
        initialExpenses={DEFAULT_EXPENSES}
        initialClients={DEFAULT_CLIENTS}
      >
        <NewInvoicePage />
      </InvoicesProvider>
    </main>
  );
}
