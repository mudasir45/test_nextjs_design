import type { FinanceSummary, Invoice, MonthlyRevenue } from './types';
import { resolveInvoiceStatus } from './invoice-utils';

export function computeFinanceSummary(invoices: Invoice[]): FinanceSummary {
  const normalized = invoices.map((inv) => ({
    ...inv,
    status: resolveInvoiceStatus(inv),
  }));

  const totalInvoiced = normalized
    .filter((inv) => inv.status !== 'draft')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalReceived = normalized
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalOutstanding = normalized
    .filter((inv) => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalOverdue = normalized
    .filter((inv) => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  return { totalInvoiced, totalReceived, totalOutstanding, totalOverdue };
}

export function computeMonthlyRevenue(invoices: Invoice[], months = 6): MonthlyRevenue[] {
  const now = new Date();
  const result: MonthlyRevenue[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);

    const amount = invoices
      .filter((inv) => inv.status === 'paid' && inv.paidAt?.startsWith(monthKey))
      .reduce((sum, inv) => sum + inv.total, 0);

    result.push({ month: monthKey, label, amount });
  }

  return result;
}

export function countInvoicesByStatus(invoices: Invoice[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: invoices.length,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  };

  for (const inv of invoices) {
    const status = resolveInvoiceStatus(inv);
    counts[status] = (counts[status] ?? 0) + 1;
  }

  return counts;
}
