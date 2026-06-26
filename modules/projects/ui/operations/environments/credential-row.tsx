'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Edit3, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/modules/projects/core/cn';
import { getCredentialRoleMeta, MASKED_VALUE } from '@/modules/projects/core/workspace-utils';
import { Badge } from '@/modules/projects/ui/primitives/badge';

interface CredentialRowProps {
  label: string;
  value: string;
  username?: string;
  role?: string;
  note?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CredentialRow({
  label,
  value,
  username,
  role,
  note,
  onEdit,
  onDelete,
}: CredentialRowProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roleMeta = getCredentialRoleMeta(role);

  const handleReveal = useCallback(() => {
    setRevealed((prev) => {
      const next = !prev;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (next) {
        timerRef.current = setTimeout(() => setRevealed(false), 30000);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [value]);

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <Badge className={cn('border-0 text-[10px]', roleMeta.className)}>{roleMeta.label}</Badge>
        </div>
        {username && (
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium">User:</span> {username}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <code className="rounded-md bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
            {revealed ? value : MASKED_VALUE}
          </code>
          <button
            type="button"
            onClick={handleReveal}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={revealed ? 'Hide credential' : 'Reveal credential'}
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copy credential"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        {note && <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>}
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Edit ${label}`}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="cursor-pointer rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-500/10 dark:text-red-400"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
