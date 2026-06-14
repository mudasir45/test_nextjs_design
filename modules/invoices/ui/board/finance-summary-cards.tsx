'use client';

import { DollarSign, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import type { FinanceSummary } from '@/modules/invoices/core/types';
import { formatCurrency } from '@/modules/invoices/core/invoice-utils';
import { FINANCE_CARD_STYLES } from '@/modules/invoices/theme/invoices-theme';
import { cn } from '@/modules/invoices/core/cn';

interface FinanceSummaryCardsProps {
  summary: FinanceSummary;
  currency?: string;
}

const CARD_CONFIG = [
  { key: 'invoiced' as const, icon: DollarSign, valueKey: 'totalInvoiced' as const },
  { key: 'received' as const, icon: TrendingUp, valueKey: 'totalReceived' as const },
  { key: 'outstanding' as const, icon: Clock, valueKey: 'totalOutstanding' as const },
  { key: 'overdue' as const, icon: AlertTriangle, valueKey: 'totalOverdue' as const },
];

export function FinanceSummaryCards({ summary, currency = 'USD' }: FinanceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_CONFIG.map(({ key, icon: Icon, valueKey }) => {
        const style = FINANCE_CARD_STYLES[key];
        return (
          <div
            key={key}
            className={cn(
              'rounded-2xl border p-5 transition-colors duration-200',
              style.className,
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{style.label}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/60">
                <Icon className={cn('h-4 w-4', style.valueClass)} />
              </div>
            </div>
            <p className={cn('mt-2 text-2xl font-bold tabular-nums tracking-tight', style.valueClass)}>
              {formatCurrency(summary[valueKey], currency)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
