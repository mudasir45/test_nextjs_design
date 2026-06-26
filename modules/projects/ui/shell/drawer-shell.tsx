'use client';

import { X } from 'lucide-react';
import { cn } from '@/modules/projects/core/cn';

interface DrawerShellProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function DrawerShell({
  open,
  onClose,
  title,
  subtitle,
  accentColor,
  children,
  footer,
}: DrawerShellProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border/80 bg-card shadow-2xl',
          'animate-in slide-in-from-right duration-300',
          'sm:w-[min(100%,640px)] md:w-[min(100%,720px)] lg:w-[min(100%,62vw)] lg:max-w-[960px]',
        )}
      >
        {accentColor && <div className="h-1 shrink-0" style={{ backgroundColor: accentColor }} />}
        {(title || subtitle) && (
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/60 px-8 py-6">
            <div className="min-w-0">
              {title && (
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
        )}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        {footer && (
          <footer className="shrink-0 border-t border-border/60 bg-muted/20 px-8 py-5">{footer}</footer>
        )}
      </aside>
    </>
  );
}
