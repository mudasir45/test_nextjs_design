import type {
  CreateInvoicePayload,
  Invoice,
  InvoiceDraft,
  InvoiceStatus,
  LineItem,
  WorkspaceSettings,
} from './types';
import { DEFAULT_WORKSPACE_SETTINGS } from './types';

export function calculateLineSubtotal(item: Pick<LineItem, 'quantity' | 'unitPrice'>): number {
  return item.quantity * item.unitPrice;
}

export function calculateLineTax(item: LineItem): number {
  const subtotal = calculateLineSubtotal(item);
  return subtotal * (item.taxRate / 100);
}

export function calculateLineTotal(item: LineItem): number {
  return calculateLineSubtotal(item) + calculateLineTax(item);
}

export function calculateInvoiceTotals(lineItems: LineItem[]) {
  const subtotal = lineItems.reduce((sum, item) => sum + calculateLineSubtotal(item), 0);
  const taxTotal = lineItems.reduce((sum, item) => sum + calculateLineTax(item), 0);
  const total = subtotal + taxTotal;
  return { subtotal, taxTotal, total };
}

export function generateInvoiceNumber(
  existingInvoices: Invoice[],
  settings: WorkspaceSettings = DEFAULT_WORKSPACE_SETTINGS,
): string {
  const year = new Date().getFullYear();
  const prefix = `${settings.invoicePrefix}-${year}-`;
  const existingNumbers = existingInvoices
    .map((inv) => inv.number)
    .filter((num) => num.startsWith(prefix))
    .map((num) => parseInt(num.replace(prefix, ''), 10))
    .filter((n) => !Number.isNaN(n));

  const next = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

export function createEmptyLineItem(defaultTaxRate = 0): LineItem {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: crypto.randomUUID().slice(0, 8),
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: defaultTaxRate,
    date: today,
  };
}

export function createEmptyDraft(
  settings: WorkspaceSettings = DEFAULT_WORKSPACE_SETTINGS,
): InvoiceDraft {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  return {
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    clientCompany: '',
    clientChamberOfCommerce: '',
    clientVatNumber: '',
    projectName: '',
    issueDate: today.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
    lineItems: [createEmptyLineItem(settings.defaultTaxRate)],
    notes: '',
    paymentInstructions: '',
    termsAndConditions: '',
    currency: settings.currency,
  };
}

export function draftToPayload(draft: InvoiceDraft): CreateInvoicePayload {
  return {
    clientId: draft.clientId || undefined,
    clientName: draft.clientName.trim(),
    clientEmail: draft.clientEmail.trim(),
    clientAddress: draft.clientAddress.trim() || undefined,
    clientPhone: draft.clientPhone.trim() || undefined,
    clientCompany: draft.clientCompany.trim() || undefined,
    clientChamberOfCommerce: draft.clientChamberOfCommerce.trim() || undefined,
    clientVatNumber: draft.clientVatNumber.trim() || undefined,
    projectName: draft.projectName.trim() || undefined,
    issueDate: draft.issueDate,
    dueDate: draft.dueDate,
    lineItems: draft.lineItems.map(({ description, quantity, unitPrice, taxRate, date }) => ({
      description,
      quantity,
      unitPrice,
      taxRate,
      date,
    })),
    notes: draft.notes.trim() || undefined,
    paymentInstructions: draft.paymentInstructions.trim() || undefined,
    termsAndConditions: draft.termsAndConditions.trim() || undefined,
    currency: draft.currency,
  };
}

export function invoiceToDraft(invoice: Invoice): InvoiceDraft {
  return {
    clientId: invoice.clientId ?? '',
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    clientAddress: invoice.clientAddress ?? '',
    clientPhone: invoice.clientPhone ?? '',
    clientCompany: invoice.clientCompany ?? '',
    clientChamberOfCommerce: invoice.clientChamberOfCommerce ?? '',
    clientVatNumber: invoice.clientVatNumber ?? '',
    projectName: invoice.projectName ?? '',
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    lineItems: invoice.lineItems.map((item) => ({ ...item })),
    notes: invoice.notes ?? '',
    paymentInstructions: invoice.paymentInstructions ?? '',
    termsAndConditions: invoice.termsAndConditions ?? '',
    currency: invoice.currency,
  };
}

export function normalizeInvoice(invoice: Invoice): Invoice {
  const totals = calculateInvoiceTotals(invoice.lineItems);
  const status = resolveInvoiceStatus({ ...invoice, ...totals });
  return {
    ...invoice,
    ...totals,
    status,
  };
}

export function resolveInvoiceStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.status === 'paid') return 'paid';
  if (invoice.status === 'draft') return 'draft';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(invoice.dueDate);
  due.setHours(0, 0, 0, 0);

  if (invoice.status === 'sent' && due < today) return 'overdue';
  return invoice.status;
}

export function canTransitionStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
  const transitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    draft: ['sent', 'paid'],
    sent: ['paid', 'overdue'],
    overdue: ['paid'],
    paid: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function validateInvoiceDraft(draft: InvoiceDraft): string[] {
  const errors: string[] = [];
  if (!draft.clientName.trim()) errors.push('Client name is required');
  if (!draft.clientEmail.trim()) errors.push('Client email is required');
  if (!draft.issueDate) errors.push('Issue date is required');
  if (!draft.dueDate) errors.push('Due date is required');
  if (draft.lineItems.length === 0) errors.push('At least one line item is required');
  draft.lineItems.forEach((item, i) => {
    if (!item.description.trim()) errors.push(`Line item ${i + 1}: description is required`);
    if (item.quantity <= 0) errors.push(`Line item ${i + 1}: quantity must be greater than 0`);
    if (item.unitPrice < 0) errors.push(`Line item ${i + 1}: unit price cannot be negative`);
  });
  return errors;
}


export function getInvoiceShareUrl(invoiceId: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/invoices/${invoiceId}`;
}

export async function copyInvoiceShareLink(invoiceId: string): Promise<boolean> {
  const url = getInvoiceShareUrl(invoiceId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
