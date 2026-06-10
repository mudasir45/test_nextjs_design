'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, CornerDownLeft, Flag, Tag, User, X } from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';
import { PRIORITY_LABELS } from '@/modules/kanban/demo/default-columns';
import type { KanbanEntities, TaskPriority } from '@/modules/kanban/core/types';

export interface QuickTaskFields {
  assigneeId?: string;
  dueDate?: string;
  priority?: TaskPriority;
  tags?: string[];
}

interface TaskQuickFieldsProps {
  entities: KanbanEntities;
  value: QuickTaskFields;
  onChange: (value: QuickTaskFields) => void;
  className?: string;
}

type OpenPicker = 'assignee' | 'dates' | 'priority' | 'tag' | null;

export function TaskQuickFields({ entities, value, onChange, className }: TaskQuickFieldsProps) {
  const [open, setOpen] = useState<OpenPicker>(null);
  const [tagInput, setTagInput] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const assigneeLabel = entities.assignees.find((a) => a.id === value.assigneeId)?.label;
  const dueLabel = value.dueDate
    ? new Date(value.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : undefined;

  return (
    <div ref={rootRef} className={cn('space-y-0.5', className)}>
      <QuickRow
        icon={<User className="h-3.5 w-3.5" />}
        label="Add assignee"
        value={assigneeLabel}
        isOpen={open === 'assignee'}
        onToggle={() => setOpen(open === 'assignee' ? null : 'assignee')}
      >
        <PickerPanel>
          <button
            type="button"
            className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
            onClick={() => {
              onChange({ ...value, assigneeId: undefined });
              setOpen(null);
            }}
          >
            Unassigned
          </button>
          {entities.assignees.map((a) => (
            <button
              key={a.id}
              type="button"
              className={cn(
                'w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted',
                value.assigneeId === a.id && 'bg-muted font-medium',
              )}
              onClick={() => {
                onChange({ ...value, assigneeId: a.id });
                setOpen(null);
              }}
            >
              {a.label}
            </button>
          ))}
        </PickerPanel>
      </QuickRow>

      <QuickRow
        icon={<Calendar className="h-3.5 w-3.5" />}
        label="Add dates"
        value={dueLabel}
        isOpen={open === 'dates'}
        onToggle={() => setOpen(open === 'dates' ? null : 'dates')}
      >
        <PickerPanel>
          <input
            type="date"
            value={value.dueDate?.slice(0, 10) ?? ''}
            onChange={(e) => onChange({ ...value, dueDate: e.target.value || undefined })}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-violet-500/30"
          />
          {value.dueDate && (
            <button
              type="button"
              className="mt-1 text-[10px] text-muted-foreground hover:text-foreground"
              onClick={() => onChange({ ...value, dueDate: undefined })}
            >
              Clear date
            </button>
          )}
        </PickerPanel>
      </QuickRow>

      <QuickRow
        icon={<Flag className="h-3.5 w-3.5" />}
        label="Add priority"
        value={value.priority ? PRIORITY_LABELS[value.priority] : undefined}
        isOpen={open === 'priority'}
        onToggle={() => setOpen(open === 'priority' ? null : 'priority')}
      >
        <PickerPanel>
          {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                'w-full rounded-md px-2 py-1.5 text-left text-xs capitalize hover:bg-muted',
                value.priority === p && 'bg-muted font-medium',
              )}
              onClick={() => {
                onChange({ ...value, priority: p });
                setOpen(null);
              }}
            >
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </PickerPanel>
      </QuickRow>

      <QuickRow
        icon={<Tag className="h-3.5 w-3.5" />}
        label="Add tag"
        value={value.tags?.length ? value.tags.join(', ') : undefined}
        isOpen={open === 'tag'}
        onToggle={() => setOpen(open === 'tag' ? null : 'tag')}
      >
        <PickerPanel>
          <div className="flex flex-wrap gap-1">
            {value.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...value, tags: value.tags?.filter((t) => t !== tag) })
                  }
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-1">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  const tag = tagInput.trim();
                  if (!value.tags?.includes(tag)) {
                    onChange({ ...value, tags: [...(value.tags ?? []), tag] });
                  }
                  setTagInput('');
                }
              }}
              placeholder="Tag name…"
              className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs outline-none"
            />
          </div>
        </PickerPanel>
      </QuickRow>
    </div>
  );
}

function QuickRow({
  icon,
  label,
  value,
  isOpen,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
          isOpen ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )}
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className={cn(value && 'text-foreground font-medium')}>{value ?? label}</span>
      </button>
      {isOpen && children}
    </div>
  );
}

function PickerPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-[200px] rounded-lg border border-border bg-card p-1.5 shadow-lg">
      {children}
    </div>
  );
}

export function QuickSaveButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors',
        disabled
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-violet-600 text-white hover:bg-violet-500',
      )}
    >
      Save
      <CornerDownLeft className="h-3 w-3 opacity-80" />
    </button>
  );
}
