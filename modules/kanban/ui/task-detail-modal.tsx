'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MessageSquare, Send, Trash2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/kanban/ui/primitives/avatar';
import { cn } from '@/modules/kanban/core/cn';
import { isEmptyDescription } from '@/modules/kanban/core/description-utils';
import { generateId } from '@/modules/kanban/core/adapters';
import { EntityLinkSelector } from './entity-link-selector';
import { RichDescriptionEditor } from './rich-description-editor';
import { TaskMetaBar } from './task-meta-bar';
import type { Column, KanbanEntities, Task, TaskEntityLink } from '@/modules/kanban/core/types';

interface TaskDetailModalProps {
  task: Task;
  column: Column;
  columns: Column[];
  entities: KanbanEntities;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onMoveToColumn: (columnId: string) => void;
  onDelete: () => void;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getCommentCount(task: Task) {
  return task.activity?.length ?? task.comments ?? 0;
}

export function TaskDetailModal({
  task,
  column,
  columns,
  entities,
  onClose,
  onUpdate,
  onMoveToColumn,
  onDelete,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [activityOpen, setActivityOpen] = useState(getCommentCount(task) > 0);
  const [commentInput, setCommentInput] = useState('');
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    setTitle(task.title);
  }, [task.id, task.title]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleAddComment = () => {
    const text = commentInput.trim();
    if (!text) return;
    const entry = { id: generateId('act'), text, createdAt: new Date().toISOString() };
    const activity = [...(task.activity ?? []), entry];
    onUpdate({ activity, comments: activity.length });
    setCommentInput('');
    setActivityOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this task permanently?')) {
      onDelete();
      onClose();
    }
  };

  const handleEntityChange = (entityLink: TaskEntityLink | undefined) => {
    onUpdate({ entityLink, updatedAt: new Date().toISOString() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[6vh] sm:p-6 sm:pt-[8vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <button
        type="button"
        aria-label="Close task details"
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        data-kanban-interactive
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative mb-10 w-full max-w-[580px] overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out',
          'max-h-[88vh] overflow-y-auto scrollbar-thin',
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.97] opacity-0',
        )}
      >
        <div
          className="px-6 pb-6 pt-5"
          style={{
            background: `linear-gradient(180deg, ${column.color}10 0%, transparent 100%)`,
          }}
        >
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: `${column.color}18`, color: column.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: column.color }} />
              {column.title}
            </span>
            <div className="flex gap-0.5">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <input
            id="task-detail-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              const trimmed = title.trim();
              if (trimmed && trimmed !== task.title) {
                onUpdate({ title: trimmed, updatedAt: new Date().toISOString() });
              }
            }}
            className="mb-5 w-full border-0 bg-transparent text-2xl font-semibold tracking-tight text-foreground outline-none"
            placeholder="Untitled task"
          />

          {/* Single entity link */}
          <EntityLinkSelector
            task={task}
            entities={entities}
            onChange={handleEntityChange}
            className="mb-4"
          />

          {/* Compact meta controls */}
          <TaskMetaBar
            task={task}
            column={column}
            columns={columns}
            entities={entities}
            onUpdate={onUpdate}
            onMoveToColumn={onMoveToColumn}
          />
        </div>

        <div className="border-t border-border/50 px-6 py-5">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Description
          </p>
          <RichDescriptionEditor
            key={task.id}
            value={task.description}
            onChange={(html) => {
              const description = isEmptyDescription(html) ? undefined : html;
              if (description !== task.description) {
                onUpdate({ description, updatedAt: new Date().toISOString() });
              }
            }}
          />
        </div>

        {/* Collapsible activity */}
        <div className="border-t border-border/50 px-6 pb-5">
          <button
            type="button"
            onClick={() => setActivityOpen((v) => !v)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Activity
              {getCommentCount(task) > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0 text-[10px] text-muted-foreground">
                  {getCommentCount(task)}
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform',
                activityOpen && 'rotate-180',
              )}
            />
          </button>

          {activityOpen && (
            <div className="space-y-4 pb-2">
              {(task.activity ?? []).length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-2">No comments yet</p>
              ) : (
                [...(task.activity ?? [])].reverse().map((entry) => (
                  <div key={entry.id} className="flex gap-3 rounded-lg bg-muted/20 px-3 py-2.5">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                    <div>
                      <p className="text-sm text-foreground">{entry.text}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              <div className="flex gap-2 rounded-xl border border-border bg-muted/10 p-2">
                {task.assignee && (
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback className="text-[9px]">
                      {task.assignee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  placeholder="Add a comment…"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!commentInput.trim()}
                  className={cn(
                    'rounded-lg p-2 transition-colors',
                    commentInput.trim()
                      ? 'bg-primary text-white hover:hover:bg-primary/90'
                      : 'text-muted-foreground',
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
