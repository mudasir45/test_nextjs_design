'use client';

import type { KeyResult } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';

interface KeyResultsEditorProps {
  keyResults: KeyResult[];
  onUpdate: (keyResultId: string, updates: Partial<KeyResult>) => void;
  readOnly?: boolean;
}

export function KeyResultsEditor({
  keyResults,
  onUpdate,
  readOnly = false,
}: KeyResultsEditorProps) {
  if (keyResults.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No key results defined for this goal.</p>
    );
  }

  return (
    <div className="space-y-3">
      {keyResults.map((kr) => {
        const pct =
          kr.target > 0 ? Math.min(100, Math.round((kr.current / kr.target) * 100)) : 0;

        return (
          <div key={kr.id} className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{kr.title}</p>
              <span className="text-xs font-semibold tabular-nums text-teal-600 dark:text-teal-400">
                {pct}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-teal-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            {!readOnly && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={kr.target}
                  value={kr.current}
                  onChange={(e) =>
                    onUpdate(kr.id, { current: Number(e.target.value) })
                  }
                  className="w-20 rounded-md border border-border bg-card px-2 py-1 text-xs tabular-nums focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/20"
                />
                <span className="text-xs text-muted-foreground">
                  / {kr.target} {kr.unit ?? ''}
                </span>
              </div>
            )}
            {readOnly && (
              <p className={cn('mt-1 text-xs text-muted-foreground tabular-nums')}>
                {kr.current} / {kr.target} {kr.unit ?? ''}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
