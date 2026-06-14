'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { InvoiceDraft, WorkspaceSettings } from '@/modules/invoices/core/types';
import { downloadInvoicePdf } from '@/modules/invoices/core/pdf-utils';
import { cn } from '@/modules/invoices/core/cn';

interface PdfDownloadButtonProps {
  invoiceNumber: string;
  elementId?: string;
  variant?: 'button' | 'icon';
  className?: string;
}

export function PdfDownloadButton({
  invoiceNumber,
  elementId = 'invoice-preview-pdf',
  variant = 'button',
  className,
}: PdfDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(elementId, invoiceNumber);
    } catch {
      window.alert('Could not generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        title="Download PDF"
        className={cn(
          'inline-flex cursor-pointer items-center justify-center rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 disabled:opacity-50',
          className,
        )}
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 disabled:opacity-50',
        className,
      )}
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {downloading ? 'Generating…' : 'Download PDF'}
    </button>
  );
}
