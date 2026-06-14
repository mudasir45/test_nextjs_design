'use client';

import type { Invoice, InvoiceDraft, WorkspaceSettings } from '@/modules/invoices/core/types';
import {
  calculateInvoiceTotals,
  formatCurrency,
  formatDate,
} from '@/modules/invoices/core/invoice-utils';
import { cn } from '@/modules/invoices/core/cn';

interface InvoicePreviewProps {
  draft: InvoiceDraft;
  invoiceNumber?: string;
  status?: Invoice['status'];
  settings?: WorkspaceSettings;
  className?: string;
  id?: string;
}

export function InvoicePreview({
  draft,
  invoiceNumber,
  status = 'draft',
  settings,
  className,
  id = 'invoice-preview',
}: InvoicePreviewProps) {
  const totals = calculateInvoiceTotals(draft.lineItems);
  const s = settings;

  const hasBankDetails = s?.bankAccountTitle || s?.bankName || s?.bankAccountNumber || s?.iban;
  const hasPaymentInstructions = s?.paymentInstructions?.trim();
  const hasTC = s?.termsAndConditions?.trim();

  return (
    <div
      id={id}
      className={cn(
        'mx-auto w-full max-w-[660px] overflow-hidden rounded-xl bg-white text-zinc-900 shadow-xl dark:bg-zinc-50',
        className,
      )}
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* ── HEADER BAND ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 border-b-4 border-zinc-900 px-8 py-6 dark:border-zinc-800">
        {/* Logo / company */}
        <div className="flex flex-col gap-1">
          {s?.logoUrl ? (
            <img
              src={s.logoUrl}
              alt={s.companyName}
              className="mb-1 h-12 max-w-[140px] object-contain object-left"
            />
          ) : (
            <p className="text-xl font-extrabold tracking-tight text-zinc-900">
              {s?.companyName ?? 'Your Company'}
            </p>
          )}
        </div>

        {/* Contact cluster */}
        <div className="shrink-0 space-y-1 text-right">
          {s?.companyPhone && (
            <p className="flex items-center justify-end gap-1.5 text-xs text-zinc-600">
              <PhoneIcon />
              {s.companyPhone}
            </p>
          )}
          {s?.companyEmail && (
            <p className="flex items-center justify-end gap-1.5 text-xs text-zinc-600">
              <MailIcon />
              {s.companyEmail}
            </p>
          )}
          {s?.companyAddress && (
            <p className="flex items-center justify-end gap-1.5 text-xs text-zinc-600">
              <PinIcon />
              {s.companyAddress}
            </p>
          )}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ── TITLE ROW ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">INVOICE</h1>
            <div className="mt-2 space-y-0.5 text-sm text-zinc-600">
              <p>
                <span className="font-medium text-zinc-400">Invoice Number :</span>{' '}
                <span className="font-semibold tabular-nums text-zinc-700">
                  {invoiceNumber ?? '—'}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-1 shrink-0 space-y-1 text-sm">
            <p>
              <span className="font-medium text-zinc-400">Date Issued :</span>{' '}
              <span className="font-medium text-zinc-700">
                {draft.issueDate ? formatDate(draft.issueDate) : '—'}
              </span>
            </p>
            <p>
              <span className="font-medium text-zinc-400">Due Date :</span>{' '}
              <span className="font-medium text-zinc-700">
                {draft.dueDate ? formatDate(draft.dueDate) : '—'}
              </span>
            </p>
          </div>
        </div>

        {/* ── BUYER INFO ───────────────────────────────────────────── */}
        <BuyerInformation draft={draft} />

        {/* ── LINE ITEMS TABLE ──────────────────────────────────────── */}
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-zinc-900">Description of Services Provided</h2>
          <table className="w-full overflow-hidden rounded-lg text-sm">
            <thead>
              <tr className="bg-[#5BA4C7] text-white">
                <th className="px-3 py-2.5 text-left font-semibold">Date</th>
                <th className="px-3 py-2.5 text-left font-semibold">Description</th>
                <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
                <th className="px-3 py-2.5 text-right font-semibold">
                  Unit Price ({draft.currency === 'EUR' ? '€' : draft.currency === 'GBP' ? '£' : draft.currency})
                </th>
                <th className="px-3 py-2.5 text-right font-semibold">
                  Total ({draft.currency === 'EUR' ? '€' : draft.currency === 'GBP' ? '£' : draft.currency})
                </th>
              </tr>
            </thead>
            <tbody>
              {draft.lineItems.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                  <td className="border-b border-zinc-100 px-3 py-2.5 text-zinc-500">
                    {item.date ?? '—'}
                  </td>
                  <td className="border-b border-zinc-100 px-3 py-2.5 text-zinc-700">
                    {item.description || '—'}
                  </td>
                  <td className="border-b border-zinc-100 px-3 py-2.5 text-right tabular-nums text-zinc-600">
                    {item.quantity}
                  </td>
                  <td className="border-b border-zinc-100 px-3 py-2.5 text-right tabular-nums text-zinc-600">
                    {formatCurrency(item.unitPrice, draft.currency)}
                  </td>
                  <td className="border-b border-zinc-100 px-3 py-2.5 text-right font-medium tabular-nums text-zinc-900">
                    {formatCurrency(item.quantity * item.unitPrice, draft.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── TOTALS ───────────────────────────────────────────────── */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-[260px] space-y-1">
            <div className="flex justify-between py-1 text-sm">
              <span className="font-medium text-zinc-600">Subtotal</span>
              <span className="tabular-nums font-semibold text-zinc-800">
                {formatCurrency(totals.subtotal, draft.currency)}
              </span>
            </div>
            {totals.taxTotal > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="font-medium text-zinc-600">Tax</span>
                <span className="tabular-nums text-zinc-700">
                  {formatCurrency(totals.taxTotal, draft.currency)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between rounded-md bg-[#5BA4C7] px-3 py-2">
              <span className="text-sm font-bold text-white">Total Amount Due</span>
              <span className="text-sm font-black tabular-nums text-white">
                {formatCurrency(totals.total, draft.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* ── NOTES ───────────────────────────────────────────────── */}
        {draft.notes && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Notes</p>
            <p className="mt-1 text-sm text-zinc-600">{draft.notes}</p>
          </div>
        )}

        {/* ── PAYMENT INSTRUCTIONS ─────────────────────────────────── */}
        {(hasBankDetails || hasPaymentInstructions) && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold text-zinc-900">Payment Instructions:</h2>
            {hasPaymentInstructions && (
              <p className="mb-2 whitespace-pre-line text-sm text-zinc-600">
                {s!.paymentInstructions}
              </p>
            )}
            {hasBankDetails && (
              <div className="space-y-0.5 text-sm text-zinc-600">
                {s!.bankAccountTitle && <p>Account Title: <span className="font-medium text-zinc-800">{s!.bankAccountTitle}</span></p>}
                {s!.bankName && <p>Bank Name: <span className="font-medium text-zinc-800">{s!.bankName}</span></p>}
                {s!.bankAccountNumber && <p>Account Number: <span className="tabular-nums font-medium text-zinc-800">{s!.bankAccountNumber}</span></p>}
                {s!.iban && <p>IBAN: <span className="tabular-nums font-medium text-zinc-800">{s!.iban}</span></p>}
              </div>
            )}
          </div>
        )}

        {/* ── TERMS & CONDITIONS ─────────────────────────────────────── */}
        {hasTC && (
          <div className="mt-5 rounded-lg bg-[#5BA4C7]/10 p-4">
            <p className="mb-2 text-xs font-bold text-zinc-900">Terms &amp; Conditions</p>
            <ul className="list-inside list-disc space-y-1">
              {s!.termsAndConditions.split('\n').filter(Boolean).map((line, i) => (
                <li key={i} className="text-xs text-zinc-600">{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tiny inline SVG icons (no dependency) ─────────────────────────────── */
function PhoneIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="22,6 12,13 2,6" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg className="h-3 w-3 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx={12} cy={10} r={3} />
    </svg>
  );
}

function BuyerInformation({ draft }: { draft: InvoiceDraft }) {
  const fields: { label: string; value: string }[] = [
    draft.clientName && { label: 'Name', value: draft.clientName },
    draft.clientAddress && { label: 'Address', value: draft.clientAddress },
    draft.clientChamberOfCommerce && {
      label: 'Chamber of Commerce',
      value: draft.clientChamberOfCommerce,
    },
    draft.clientCompany && { label: 'Company', value: draft.clientCompany },
    draft.clientPhone && { label: 'Contact', value: draft.clientPhone },
    draft.clientEmail && { label: 'Email', value: draft.clientEmail },
    draft.clientVatNumber && { label: 'VAT Number', value: draft.clientVatNumber },
    draft.projectName && { label: 'Project', value: draft.projectName },
  ].filter(Boolean) as { label: string; value: string }[];

  if (fields.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-bold text-zinc-900">Buyer Information</h2>
      <dl className="max-w-xl space-y-2 text-sm">
        {fields.map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-[12rem_auto_1fr] items-start gap-x-1"
          >
            <dt className="whitespace-nowrap font-medium text-zinc-500">{label}</dt>
            <dt className="text-zinc-400" aria-hidden="true">
              :
            </dt>
            <dd className="min-w-0 break-words text-zinc-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
