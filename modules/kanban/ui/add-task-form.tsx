'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';
import { QuickSaveButton, TaskQuickFields, type QuickTaskFields } from './task-quick-fields';
import type { KanbanEntities, TaskPriority } from '@/modules/kanban/core/types';

export interface AddTaskPayload {
  title: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  assigneeId?: string;
}

interface AddTaskFormProps {
  entities: KanbanEntities;
  onAdd: (task: AddTaskPayload) => void;
  onCancel: () => void;
}

export function AddTaskForm({ entities, onAdd, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [focused, setFocused] = useState(true);
  const [fields, setFields] = useState<QuickTaskFields>({ priority: 'medium' });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({
      title: trimmed,
      priority: fields.priority,
      dueDate: fields.dueDate,
      tags: fields.tags?.length ? fields.tags : undefined,
      assigneeId: fields.assigneeId,
    });
  };

  return (
    <div
      data-kanban-interactive
      className={cn(
        'rounded-xl border-2 bg-card p-2.5 shadow-md transition-all duration-200',
        focused ? 'border-violet-500/70 shadow-violet-500/10' : 'border-border',
      )}
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === 'Escape') onCancel();
          }}
          placeholder="Task Name…"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <QuickSaveButton disabled={!title.trim()} onClick={handleSubmit} />
      </div>

      <TaskQuickFields
        entities={entities}
        value={fields}
        onChange={setFields}
        className="mt-2 border-t border-border/50 pt-2"
      />

      <button
        type="button"
        onClick={onCancel}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-md py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="h-3 w-3" />
        Cancel
      </button>
    </div>
  );
}
