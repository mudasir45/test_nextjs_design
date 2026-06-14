'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Send,
  Trash2,
} from 'lucide-react';
import type { Invoice } from '@/modules/invoices/core/types';
import { formatCurrency, formatDate, resolveInvoiceStatus } from '@/modules/invoices/core/invoice-utils';
import { INVOICE_STATUS_STYLES } from '@/modules/invoices/theme/invoices-theme';
import { cn } from '@/modules/invoices/core/cn';

interface InvoiceRowProps {
  invoice: Invoice;
  onClick: () => void;
  onEdit: () => void;
  onSend: () => void;
  onMarkPaid: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
}

export function InvoiceRow({
  invoice,
  onClick,
  onEdit,
  onSend,
  onMarkPaid,
  onDelete,
  onCopyLink,
}: InvoiceRowProps) {
  const status = resolveInvoiceStatus(invoice);
  const statusStyle = INVOICE_STATUS_STYLES[status];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  return (
    <tr className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30">
      <td
        className="cursor-pointer px-4 py-3 font-medium tabular-nums text-foreground"
        onClick={onClick}
      >
        {invoice.number}
      </td>
      <td className="cursor-pointer px-4 py-3" onClick={onClick}>
        <div>
          <p className="font-medium text-foreground">{invoice.clientName}</p>
          {invoice.clientCompany && (
            <p className="text-xs text-muted-foreground">{invoice.clientCompany}</p>
          )}
          {!invoice.clientCompany && invoice.projectName && (
            <p className="text-xs text-muted-foreground">{invoice.projectName}</p>
          )}
        </div>
      </td>
      <td className="cursor-pointer px-4 py-3 text-right font-semibold tabular-nums text-foreground" onClick={onClick}>
        {formatCurrency(invoice.total, invoice.currency)}
      </td>
      <td className="hidden cursor-pointer px-4 py-3 tabular-nums text-muted-foreground md:table-cell" onClick={onClick}>
        {formatDate(invoice.dueDate)}
      </td>
      <td className="px-4 py-3" onClick={onClick}>
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
            statusStyle?.className,
          )}
        >
          {statusStyle?.label ?? status}
        </span>
      </td>

      {/* Quick Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Inline quick-action buttons */}
          {status === 'draft' && (
            <QuickBtn title="Send" onClick={onSend}>
              <Send className="h-3.5 w-3.5" />
            </QuickBtn>
          )}
          {(status === 'sent' || status === 'overdue') && (
            <QuickBtn title="Mark Paid" onClick={onMarkPaid} variant="success">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </QuickBtn>
          )}
          {(status === 'sent' || status === 'overdue') && (
            <QuickBtn title="Resend" onClick={onSend}>
              <Send className="h-3.5 w-3.5" />
            </QuickBtn>
          )}

          {/* Overflow menu */}
          <div ref={menuRef} className="relative">
            <QuickBtn title="More actions" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreHorizontal className="h-3.5 w-3.5" />
            </QuickBtn>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl">
                <MenuItem
                  icon={<Eye className="h-3.5 w-3.5" />}
                  label="View Invoice"
                  onClick={() => { onClick(); setMenuOpen(false); }}
                />
                {status === 'draft' && (
                  <MenuItem
                    icon={<Edit className="h-3.5 w-3.5" />}
                    label="Edit"
                    onClick={() => { onEdit(); setMenuOpen(false); }}
                  />
                )}
                <MenuItem
                  icon={<Copy className="h-3.5 w-3.5" />}
                  label="Copy Link"
                  onClick={() => { onCopyLink(); setMenuOpen(false); }}
                />
                <div className="my-1 h-px bg-border/60" />
                <MenuItem
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  label="Delete"
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  danger
                />
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function QuickBtn({
  title, onClick, children, variant,
}: {
  title: string; onClick: () => void; children: React.ReactNode; variant?: 'success';
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        'flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors',
        variant === 'success'
          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function MenuItem({
  icon, label, onClick, danger,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-500/10 dark:text-red-400'
          : 'text-foreground hover:bg-muted/50',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
