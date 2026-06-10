'use client';

/**
 * Kanban Board — portable module entry component.
 *
 * Works standalone or inside KanbanProvider for entities, adapter, theme, and callbacks.
 * @see modules/kanban/INTEGRATION.md
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, Plus, RotateCcw } from 'lucide-react';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
  generateId,
} from '@/modules/kanban/core/adapters';
import {
  applyScope,
  countTasks,
  countTasksInScope,
  entityLinkFromScope,
  isScopeActive,
} from '@/modules/kanban/core/scope-utils';
import { useKanbanBoard } from '@/modules/kanban/core/hooks/use-kanban-board';
import { useBoardScope } from '@/modules/kanban/core/hooks/use-board-scope';
import { DEFAULT_COLUMNS } from '@/modules/kanban/demo/default-columns';
import { DEFAULT_ENTITIES } from '@/modules/kanban/demo/default-entities';
import { useKanbanContextOptional, useKanbanTheme } from '@/modules/kanban/provider/KanbanProvider';
import { AddColumnForm } from '@/modules/kanban/ui/add-column-form';
import type { AddTaskPayload } from '@/modules/kanban/ui/add-task-form';
import { BoardScopeNavigator } from '@/modules/kanban/ui/board-scope-navigator';
import { KanbanColumn } from '@/modules/kanban/ui/kanban-column';
import { TaskDetailModal } from '@/modules/kanban/ui/task-detail-modal';
import type {
  BoardScopeState,
  Column,
  KanbanBoardProps,
  KanbanFilters,
  Task,
} from '@/modules/kanban/core/types';

export type {
  Column,
  Task,
  TaskPriority,
  TaskLinks,
  TaskEntityType,
  TaskEntityLink,
  BoardScope,
  BoardScopeState,
  KanbanBoardProps,
  KanbanFilters,
  KanbanEntities,
} from '@/modules/kanban/core/types';

export type { KanbanStorageAdapter } from '@/modules/kanban/core/adapters/types';

export function KanbanBoard({
  storageKey = DEFAULT_STORAGE_KEY,
  initialColumns = DEFAULT_COLUMNS,
  entities: entitiesProp,
  adapter: adapterProp,
  onColumnsChange,
  onScopeChange,
  onFiltersChange,
  enableLogging = process.env.NODE_ENV === 'development',
  className,
}: KanbanBoardProps) {
  const ctx = useKanbanContextOptional();
  const theme = useKanbanTheme();

  const entities = entitiesProp ?? ctx?.entities ?? DEFAULT_ENTITIES;
  const adapter =
    adapterProp ??
    ctx?.adapter ??
    createDefaultLocalStorageAdapter(storageKey);

  const resolveAssignee = ctx?.resolveAssignee;

  const handleColumnsChange = onColumnsChange ?? ctx?.callbacks.onColumnsChange;
  const handleScopeChange = (state: BoardScopeState) => {
    onScopeChange?.(state);
    ctx?.callbacks.onScopeChange?.(state);
    onFiltersChange?.(scopeStateToLegacyFilters(state));
  };

  const { columns, hydrated, updateColumns, resetBoard } = useKanbanBoard({
    storageKey,
    initialColumns,
    adapter,
    onColumnsChange: handleColumnsChange,
    enableLogging,
  });

  const {
    state: scopeState,
    hydrated: scopeHydrated,
    setScope,
    setAssigneeId,
    clearScope,
  } = useBoardScope({
    adapter,
    onScopeChange: handleScopeChange,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [selectedTaskRef, setSelectedTaskRef] = useState<{
    taskId: string;
    columnId: string;
  } | null>(null);
  const panStart = useRef({ x: 0, scrollLeft: 0 });

  const totalTasks = countTasks(columns);
  const scopeActive = isScopeActive(scopeState);

  const visibleColumns = useMemo(
    () => applyScope(columns, scopeState, entities),
    [columns, scopeState, entities],
  );
  const visibleTasks = countTasksInScope(columns, scopeState, entities);

  const selectedTaskContext = useMemo(() => {
    if (!selectedTaskRef) return null;
    const column = columns.find((c) => c.id === selectedTaskRef.columnId);
    const task = column?.tasks.find((t) => t.id === selectedTaskRef.taskId);
    if (!column || !task) return null;
    return { task, column };
  }, [selectedTaskRef, columns]);

  const handleDragStart = (e: React.DragEvent, task: Task, columnId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ task, sourceColumnId: columnId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const { task, sourceColumnId } = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      task: Task;
      sourceColumnId: string;
    };

    if (sourceColumnId === targetColumnId) return;

    updateColumns(
      (prev) =>
        prev.map((col) => {
          if (col.id === sourceColumnId) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
          }
          if (col.id === targetColumnId) {
            return { ...col, tasks: [...col.tasks, task] };
          }
          return col;
        }),
      'Task moved',
    );

    void ctx?.callbacks.onTaskMove?.(task.id, sourceColumnId, targetColumnId);
  };

  const handleAddTask = (columnId: string, data: AddTaskPayload) => {
    const entityLink = entityLinkFromScope(scopeState.scope);
    const assigneeId = data.assigneeId ?? scopeState.assigneeId ?? undefined;

    const newTask: Task = {
      id: generateId('task'),
      title: data.title,
      priority: data.priority,
      dueDate: data.dueDate,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      entityLink,
      assigneeId,
      assignee: resolveAssignee?.(assigneeId ?? '', entities) ?? undefined,
    };

    updateColumns(
      (prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col,
        ),
      'Task added',
    );

    void ctx?.callbacks.onTaskCreate?.(newTask, columnId);
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    updateColumns(
      (prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
            : col,
        ),
      'Task deleted',
    );
    if (selectedTaskRef?.taskId === taskId) setSelectedTaskRef(null);
    void ctx?.callbacks.onTaskDelete?.(taskId, columnId);
  };

  const handleUpdateTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    updateColumns(
      (prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((t) =>
                  t.id === taskId ? { ...t, ...updates } : t,
                ),
              }
            : col,
        ),
      'Task updated',
    );
    void ctx?.callbacks.onTaskUpdate?.(taskId, updates, columnId);
  };

  const handleMoveTaskToColumn = (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
  ) => {
    if (fromColumnId === toColumnId) return;

    updateColumns(
      (prev) => {
        let movedTask: Task | undefined;
        const stripped = prev.map((col) => {
          if (col.id === fromColumnId) {
            movedTask = col.tasks.find((t) => t.id === taskId);
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
          }
          return col;
        });
        if (!movedTask) return prev;
        return stripped.map((col) =>
          col.id === toColumnId
            ? { ...col, tasks: [...col.tasks, movedTask!] }
            : col,
        );
      },
      'Task status changed',
    );

    setSelectedTaskRef({ taskId, columnId: toColumnId });
    void ctx?.callbacks.onTaskMove?.(taskId, fromColumnId, toColumnId);
  };

  const handleAddColumn = (title: string, color: string) => {
    const newColumn: Column = {
      id: generateId('col'),
      title,
      color,
      tasks: [],
    };

    updateColumns((prev) => [...prev, newColumn], 'Column added');
    setIsAddingColumn(false);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
    });
  };

  const handleReset = () => {
    if (
      window.confirm('Reset board to defaults? This clears your saved tasks, columns, and scope.')
    ) {
      adapter.clearBoard();
      clearScope();
      resetBoard();
    }
  };

  const shouldStartPan = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return (
      !target.closest('[data-kanban-task]') &&
      !target.closest('[data-kanban-interactive]') &&
      !target.closest('button')
    );
  };

  const handlePanMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !shouldStartPan(e.target)) return;
    const el = scrollRef.current;
    if (!el) return;
    setIsPanning(true);
    panStart.current = { x: e.pageX, scrollLeft: el.scrollLeft };
  };

  useEffect(() => {
    if (!isPanning) return;

    const onMove = (e: MouseEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft = panStart.current.scrollLeft - (e.pageX - panStart.current.x);
    };
    const onUp = () => setIsPanning(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isPanning]);

  if (!hydrated || !scopeHydrated) {
    return (
      <div className={`flex min-h-[420px] items-center justify-center ${className ?? ''}`}>
        <div
          className={`h-8 w-8 animate-spin rounded-full border-2 ${theme.spinner}`}
        />
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${className ?? ''}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme.headerIcon}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Project Board</h1>
            <p className="text-xs text-muted-foreground">
              {columns.length} columns · {totalTasks} tasks · saved locally
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-kanban-interactive
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset board
          </button>
          <button
            type="button"
            data-kanban-interactive
            onClick={() => setIsAddingColumn(true)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 ${theme.buttonPrimary}`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add column
          </button>
        </div>
      </div>

      <BoardScopeNavigator
        state={scopeState}
        entities={entities}
        columns={columns}
        visibleCount={visibleTasks}
        onScopeChange={setScope}
        onAssigneeChange={setAssigneeId}
        onClear={clearScope}
      />

      <div
        ref={scrollRef}
        role="region"
        aria-label="Kanban board columns"
        onMouseDown={handlePanMouseDown}
        className={`flex flex-1 gap-4 overflow-x-auto pb-4 pt-1 ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        } scrollbar-thin`}
      >
        {visibleColumns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            entities={entities}
            hasActiveScope={scopeActive}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onTaskOpen={(task, columnId) =>
              setSelectedTaskRef({ taskId: task.id, columnId })
            }
          />
        ))}

        {isAddingColumn ? (
          <AddColumnForm onAdd={handleAddColumn} onCancel={() => setIsAddingColumn(false)} />
        ) : (
          <button
            type="button"
            data-kanban-interactive
            onClick={() => setIsAddingColumn(true)}
            className="flex h-[420px] w-[300px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/40 hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Add column</span>
          </button>
        )}
      </div>

      {selectedTaskContext && (
        <TaskDetailModal
          task={selectedTaskContext.task}
          column={selectedTaskContext.column}
          columns={columns}
          entities={entities}
          onClose={() => setSelectedTaskRef(null)}
          onUpdate={(updates) =>
            handleUpdateTask(
              selectedTaskContext.column.id,
              selectedTaskContext.task.id,
              updates,
            )
          }
          onMoveToColumn={(toColumnId) =>
            handleMoveTaskToColumn(
              selectedTaskContext.task.id,
              selectedTaskContext.column.id,
              toColumnId,
            )
          }
          onDelete={() =>
            handleDeleteTask(selectedTaskContext.column.id, selectedTaskContext.task.id)
          }
        />
      )}
    </div>
  );
}

function scopeStateToLegacyFilters(state: BoardScopeState): KanbanFilters {
  const base = {
    projectId: null as string | null,
    goalId: null as string | null,
    milestoneId: null as string | null,
    assigneeId: state.assigneeId,
  };
  if (state.scope.view === 'project') return { ...base, projectId: state.scope.projectId };
  if (state.scope.view === 'goal') {
    return {
      ...base,
      goalId: state.scope.goalId,
      milestoneId: state.scope.milestoneId ?? null,
    };
  }
  return base;
}

export default KanbanBoard;
