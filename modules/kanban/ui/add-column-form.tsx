'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';
import { COLUMN_COLORS } from '@/modules/kanban/demo/default-columns';

interface AddColumnFormProps {
  onAdd: (title: string, color: string) => void;
  onCancel: () => void;
}

export function AddColumnForm({ onAdd, onCancel }: AddColumnFormProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLUMN_COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
  };

  return (
    <div
      data-kanban-interactive
      className="flex h-full min-h-[420px] w-[300px] shrink-0 flex-col rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4 transition-all duration-200"
    >
      <h3 className="mb-3 text-sm font-semibold text-foreground">New column</h3>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') onCancel();
        }}
        placeholder="Column name…"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
      />

      <p className="mt-4 mb-2 text-xs font-medium text-muted-foreground">Color</p>
      <div className="flex flex-wrap gap-2">
        {COLUMN_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Select color ${c}`}
            onClick={() => setColor(c)}
            className={cn(
              'h-7 w-7 rounded-full transition-transform hover:scale-110',
              color === c && 'ring-2 ring-offset-2 ring-foreground ring-offset-background',
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors',
            title.trim()
              ? 'bg-primary text-white hover:hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed',
          )}
        >
          <Check className="h-3.5 w-3.5" />
          Add column
        </button>
      </div>
    </div>
  );
}
