'use client';

import {
  DEFAULT_CLIENTS,
  DEFAULT_EXPENSES,
  DEFAULT_INVOICES,
  InvoicesModule,
  InvoicesProvider,
} from '@/modules/invoices';

export default function InvoicesPage() {
  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background px-4 py-5 md:px-6 lg:px-8">
      <InvoicesProvider
        initialInvoices={DEFAULT_INVOICES}
        initialExpenses={DEFAULT_EXPENSES}
        initialClients={DEFAULT_CLIENTS}
      >
        <InvoicesModule />
      </InvoicesProvider>
    </main>
  );
}
