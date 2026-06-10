'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';

interface PropertyChipProps {
  label: string;
  value?: string;
  accent?: string;
  emptyLabel?: string;
  children: React.ReactNode;
}

export function PropertyChip({
  label,
  value,
  accent,
  emptyLabel = 'Set',
  children,
}: PropertyChipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex max-w-[200px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-xs transition-all',
          value
            ? 'border-border/80 bg-background text-foreground shadow-sm hover:border-border'
            : 'border-dashed border-border/60 bg-transparent text-muted-foreground hover:border-border hover:bg-muted/30',
        )}
      >
        {accent && (
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
        )}
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="truncate font-medium">{value ?? emptyLabel}</span>
        <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-50 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[200px] rounded-xl border border-border bg-card p-2 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

export function ChipSelect({
  value,
  options,
  onChange,
  allowEmpty,
  emptyLabel = 'None',
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  return (
    <div className="max-h-48 space-y-0.5 overflow-y-auto scrollbar-thin">
      {allowEmpty && (
        <button
          type="button"
          onClick={() => onChange('')}
          className={cn(
            'w-full rounded-lg px-2.5 py-2 text-left text-xs hover:bg-muted',
            !value && 'bg-muted font-medium',
          )}
        >
          {emptyLabel}
        </button>
      )}
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'w-full rounded-lg px-2.5 py-2 text-left text-xs hover:bg-muted',
            value === opt.id && 'bg-muted font-medium',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ChipDateInput({
  value,
  onChange,
}: {
  value?: string;
  onChange: (date: string | undefined) => void;
}) {
  return (
    <div className="space-y-2 p-1">
      <input
        type="date"
        value={value?.slice(0, 10) ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          Clear date
        </button>
      )}
    </div>
  );
}
