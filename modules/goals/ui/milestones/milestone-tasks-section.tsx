'use client';

import { useEffect, useRef, useState } from 'react';
import { Link2, Plus, Unlink } from 'lucide-react';
import { TaskDetailModal } from '@/modules/kanban/ui/task-detail-modal';
import { cn } from '@/modules/goals/core/cn';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { LinkExistingTasksPicker } from '@/modules/goals/ui/milestones/milestone-task-link-picker';
import { PRIORITY_STYLES } from '@/modules/kanban/demo/default-columns';

interface MilestoneTasksSectionProps {
  goalId: string;
  milestoneId: string;
  kanban: KanbanBridge;
}

export function MilestoneTasksSection({
  goalId,
  milestoneId,
  kanban,
}: MilestoneTasksSectionProps) {
  const [newTitle, setNewTitle] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const linked = kanban.getMilestoneTasks(milestoneId);
  const linkable = kanban.getLinkableTasksForGoal(goalId, milestoneId);
  const selectedContext = selectedTaskId ? kanban.getTaskContext(selectedTaskId) : null;

  const handleCreate = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    kanban.createTaskForMilestone(milestoneId, trimmed);
    setNewTitle('');
    inputRef.current?.focus();
  };

  return (
    <div className="mt-3 space-y-3 border-t border-border/40 pt-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
          placeholder="New task title…"
          className="min-w-0 flex-1 rounded-lg border border-border/80 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
        <button
          type="button"
          disabled={!newTitle.trim()}
          onClick={handleCreate}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="relative z-20">
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          disabled={linkable.length === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-teal-600 disabled:opacity-40 dark:text-teal-400"
        >
          <Link2 className="h-3.5 w-3.5" />
          Link existing task
          {linkable.length > 0 && ` (${linkable.length})`}
        </button>
        <LinkExistingTasksPicker
          open={pickerOpen}
          tasks={linkable}
          onSelect={(taskId) => {
            kanban.linkTaskToMilestone(taskId, milestoneId);
            setPickerOpen(false);
          }}
        />
      </div>

      {linked.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Add or link tasks — progress updates as they move to Done on the board.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {linked.map(({ task, columnId }) => {
            const isDone = columnId === kanban.doneColumnId;
            const priorityClass = task.priority
              ? PRIORITY_STYLES[task.priority]
              : PRIORITY_STYLES.medium;
            return (
              <li
                key={task.id}
                className="group flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={() => setSelectedTaskId(task.id)}
                  className={cn(
                    'min-w-0 flex-1 cursor-pointer text-left text-sm transition-colors hover:text-teal-700 dark:hover:text-teal-400',
                    isDone && 'text-muted-foreground line-through',
                  )}
                >
                  {task.title}
                </button>
                {task.priority && (
                  <span
                    className={cn(
                      'hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline',
                      priorityClass,
                    )}
                  >
                    {task.priority}
                  </span>
                )}
                <span className="text-[10px] capitalize text-muted-foreground">
                  {isDone ? 'Done' : columnId.replace('-', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => kanban.unlinkTaskFromMilestone(task.id, goalId)}
                  className="cursor-pointer rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                  aria-label="Unlink task"
                  title="Unlink from milestone"
                >
                  <Unlink className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedContext && (
        <TaskDetailModal
          task={selectedContext.task}
          column={selectedContext.column}
          columns={kanban.columns}
          entities={kanban.entities}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={(updates) =>
            kanban.updateTask(selectedContext.column.id, selectedContext.task.id, updates)
          }
          onMoveToColumn={(toColumnId) =>
            kanban.moveTaskToColumn(
              selectedContext.task.id,
              selectedContext.column.id,
              toColumnId,
            )
          }
          onDelete={() => {
            kanban.deleteTask(selectedContext.column.id, selectedContext.task.id);
            setSelectedTaskId(null);
          }}
        />
      )}
    </div>
  );
}

/** Sync task-type milestone counts from kanban when columns change. */
export function useSyncMilestoneTasksFromKanban(
  milestones: { id: string; targetType: string; taskTarget?: number; taskCompleted?: number }[],
  kanban: KanbanBridge,
  onUpdate: (milestoneId: string, updates: { taskTarget: number; taskCompleted: number }) => void,
) {
  useEffect(() => {
    for (const m of milestones) {
      if (m.targetType !== 'tasks') continue;
      const stats = kanban.getMilestoneTaskStats(m.id);
      const currentTarget = m.taskTarget ?? 0;
      const currentDone = m.taskCompleted ?? 0;
      // Don't wipe draft counts before kanban state has caught up with linked tasks.
      if (stats.total === 0 && currentTarget > 0) continue;
      if (stats.total !== currentTarget || stats.done !== currentDone) {
        onUpdate(m.id, { taskTarget: stats.total, taskCompleted: stats.done });
      }
    }
  }, [kanban.columns, milestones, kanban, onUpdate]);
}
