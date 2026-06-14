'use client';

import type { MonthlyRevenue } from '@/modules/invoices/core/types';
import { formatCurrency } from '@/modules/invoices/core/invoice-utils';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';

interface FinanceBarChartProps {
  data: MonthlyRevenue[];
  currency?: string;
}

export function FinanceBarChart({ data, currency = 'USD' }: FinanceBarChartProps) {
  const theme = useInvoicesTheme();
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue</h3>
          <p className="text-xs text-muted-foreground">Last 6 months — paid invoices</p>
        </div>
      </div>

      <div className="flex h-40 items-end gap-3">
        {data.map((item) => {
          const heightPct = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
          return (
            <div key={item.month} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-32 w-full items-end justify-center">
                <div
                  className={cn(
                    'w-full max-w-10 rounded-t-md transition-all duration-300',
                    theme.accentSurface.replace('/10', '/30'),
                    'group-hover:opacity-80',
                  )}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                  title={formatCurrency(item.amount, currency)}
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
              <span className="text-[10px] tabular-nums text-muted-foreground/80">
                {item.amount > 0 ? formatCurrency(item.amount, currency) : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
