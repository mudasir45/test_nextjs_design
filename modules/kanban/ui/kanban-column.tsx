'use client';

import { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Badge } from '@/modules/kanban/ui/primitives/badge';
import { AddTaskForm, type AddTaskPayload } from './add-task-form';
import { KanbanTaskCard } from './kanban-task-card';
import type { Column, KanbanEntities, Task } from '@/modules/kanban/core/types';

interface KanbanColumnProps {
  column: Column;
  entities: KanbanEntities;
  hasActiveScope: boolean;
  onDragStart: (e: React.DragEvent, task: Task, columnId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onAddTask: (columnId: string, task: AddTaskPayload) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onTaskOpen: (task: Task, columnId: string) => void;
}

export function KanbanColumn({
  column,
  entities,
  hasActiveScope,
  onDragStart,
  onDrop,
  onDragOver,
  onAddTask,
  onDeleteTask,
  onTaskOpen,
}: KanbanColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);

  return (
    <div
      className="flex h-full max-h-[calc(100vh-11rem)] w-[300px] shrink-0 flex-col rounded-2xl border border-border/60 bg-muted/20 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* ClickUp-style color accent */}
      <div className="h-1 rounded-t-2xl" style={{ backgroundColor: column.color }} />

      <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-border/40">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{column.title}</h3>
          <Badge
            variant="secondary"
            className="h-5 min-w-5 justify-center px-1.5 text-[10px] font-semibold"
          >
            {column.tasks.length}
          </Badge>
        </div>
        <button
          type="button"
          data-kanban-interactive
          aria-label={`Column options for ${column.title}`}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-2 py-2 scrollbar-thin">
        {column.tasks.length === 0 && !isAddingTask && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            {hasActiveScope ? 'No tasks in this scope' : 'No tasks yet — add one below'}
          </p>
        )}

        {column.tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            entities={entities}
            onDragStart={onDragStart}
            onDelete={(taskId) => onDeleteTask(column.id, taskId)}
            onOpen={onTaskOpen}
          />
        ))}
      </div>

      <div className="border-t border-border/40 p-2">
        {isAddingTask ? (
          <AddTaskForm
            entities={entities}
            onAdd={(task) => {
              onAddTask(column.id, task);
              setIsAddingTask(false);
            }}
            onCancel={() => setIsAddingTask(false)}
          />
        ) : (
          <button
            type="button"
            data-kanban-interactive
            onClick={() => setIsAddingTask(true)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
