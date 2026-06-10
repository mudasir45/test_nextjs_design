'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, Flag, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/kanban/ui/primitives/avatar';
import { cn } from '@/modules/kanban/core/cn';
import { PRIORITY_LABELS, PRIORITY_STYLES } from '@/modules/kanban/demo/default-columns';
import { getTaskAssigneeId } from '@/modules/kanban/core/entity-utils';
import { resolveAssigneeFromFilter } from '@/modules/kanban/core/scope-utils';
import type { Column, KanbanEntities, Task, TaskPriority } from '@/modules/kanban/core/types';

interface TaskMetaBarProps {
  task: Task;
  column: Column;
  columns: Column[];
  entities: KanbanEntities;
  onUpdate: (updates: Partial<Task>) => void;
  onMoveToColumn: (columnId: string) => void;
}

type OpenField = 'status' | 'assignee' | 'due' | 'priority' | null;

export function TaskMetaBar({
  task,
  column,
  columns,
  entities,
  onUpdate,
  onMoveToColumn,
}: TaskMetaBarProps) {
  const [open, setOpen] = useState<OpenField>(null);
  const ref = useRef<HTMLDivElement>(null);
  const assigneeId = getTaskAssigneeId(task);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const formatDue = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Due date';

  return (
    <div ref={ref} className="relative flex flex-wrap gap-2">
      <MetaButton
        label="Status"
        active={open === 'status'}
        onClick={() => setOpen(open === 'status' ? null : 'status')}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        <span className="truncate">{column.title}</span>
      </MetaButton>

      <MetaButton
        label="Assignee"
        active={open === 'assignee'}
        onClick={() => setOpen(open === 'assignee' ? null : 'assignee')}
      >
        {task.assignee ? (
          <Avatar className="h-4 w-4">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="text-[7px]">
              {task.assignee.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="truncate">{task.assignee?.name ?? 'Assignee'}</span>
      </MetaButton>

      <MetaButton
        label="Due date"
        active={open === 'due'}
        onClick={() => setOpen(open === 'due' ? null : 'due')}
      >
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className={cn(!task.dueDate && 'text-muted-foreground')}>{formatDue(task.dueDate)}</span>
      </MetaButton>

      <MetaButton
        label="Priority"
        active={open === 'priority'}
        onClick={() => setOpen(open === 'priority' ? null : 'priority')}
      >
        <Flag className="h-3.5 w-3.5 text-muted-foreground" />
        <span className={cn(!task.priority && 'text-muted-foreground')}>
          {task.priority ? PRIORITY_LABELS[task.priority] : 'Priority'}
        </span>
      </MetaButton>

      {open === 'status' && (
        <PopoverPanel className="left-0">
          {columns.map((col) => (
            <PopoverOption
              key={col.id}
              selected={col.id === column.id}
              onClick={() => {
                onMoveToColumn(col.id);
                setOpen(null);
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
              {col.title}
            </PopoverOption>
          ))}
        </PopoverPanel>
      )}

      {open === 'assignee' && (
        <PopoverPanel className="left-[88px]">
          <PopoverOption
            selected={!assigneeId}
            onClick={() => {
              onUpdate({ assigneeId: undefined, assignee: undefined, updatedAt: new Date().toISOString() });
              setOpen(null);
            }}
          >
            Unassigned
          </PopoverOption>
          {entities.assignees.map((a) => (
            <PopoverOption
              key={a.id}
              selected={assigneeId === a.id}
              onClick={() => {
                onUpdate({
                  assigneeId: a.id,
                  assignee: resolveAssigneeFromFilter(entities, a.id),
                  updatedAt: new Date().toISOString(),
                });
                setOpen(null);
              }}
            >
              {a.label}
            </PopoverOption>
          ))}
        </PopoverPanel>
      )}

      {open === 'due' && (
        <PopoverPanel className="left-[176px]">
          <input
            type="date"
            value={task.dueDate?.slice(0, 10) ?? ''}
            onChange={(e) =>
              onUpdate({ dueDate: e.target.value || undefined, updatedAt: new Date().toISOString() })
            }
            className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/20"
          />
          {task.dueDate && (
            <button
              type="button"
              className="mt-2 text-[10px] text-muted-foreground hover:text-foreground"
              onClick={() => onUpdate({ dueDate: undefined, updatedAt: new Date().toISOString() })}
            >
              Clear date
            </button>
          )}
        </PopoverPanel>
      )}

      {open === 'priority' && (
        <PopoverPanel className="right-0 left-auto">
          <PopoverOption
            selected={!task.priority}
            onClick={() => {
              onUpdate({ priority: undefined, updatedAt: new Date().toISOString() });
              setOpen(null);
            }}
          >
            None
          </PopoverOption>
          {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
            <PopoverOption
              key={p}
              selected={task.priority === p}
              onClick={() => {
                onUpdate({ priority: p, updatedAt: new Date().toISOString() });
                setOpen(null);
              }}
            >
              <span className={cn('rounded px-1.5 py-0.5 text-[10px] capitalize', PRIORITY_STYLES[p])}>
                {PRIORITY_LABELS[p]}
              </span>
            </PopoverOption>
          ))}
        </PopoverPanel>
      )}
    </div>
  );
}

function MetaButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex max-w-[140px] items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-primary/40 bg-primary/5 text-foreground ring-2 ring-primary/10'
          : 'border-border/60 bg-background text-foreground hover:border-border hover:bg-muted/40',
      )}
    >
      {children}
      <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-40', active && 'rotate-180')} />
    </button>
  );
}

function PopoverPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-[calc(100%+6px)] z-30 min-w-[160px] rounded-xl border border-border bg-card p-1.5 shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

function PopoverOption({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-muted',
        selected && 'bg-muted font-medium',
      )}
    >
      {children}
    </button>
  );
}
