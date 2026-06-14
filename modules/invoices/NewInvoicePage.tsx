'use client';

import { Suspense } from 'react';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';
import { InvoiceBuilder } from '@/modules/invoices/ui/create/invoice-builder';

interface NewInvoicePageProps {
  className?: string;
}

/** Invoice create/edit builder — supports `?edit=<invoiceId>` via search params. */
export function NewInvoicePage({ className }: NewInvoicePageProps) {
  const theme = useInvoicesTheme();

  return (
    <Suspense
      fallback={
        <div className={cn('flex flex-1 items-center justify-center', className)}>
          <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
        </div>
      }
    >
      <InvoiceBuilder className={className} />
    </Suspense>
  );
}
