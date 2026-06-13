'use client';

import { cn } from '@/modules/goals/core/cn';

export interface LinkableTaskOption {
  task: { id: string; title: string };
  columnId: string;
}

interface LinkExistingTasksPickerProps {
  open: boolean;
  tasks: LinkableTaskOption[];
  onSelect: (taskId: string) => void;
  className?: string;
}

export function LinkExistingTasksPicker({
  open,
  tasks,
  onSelect,
  className,
}: LinkExistingTasksPickerProps) {
  if (!open || tasks.length === 0) return null;

  return (
    <div
      className={cn(
        'absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-border/80',
        className,
      )}
    >
      <div className="border-b border-border/60 bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Select a task to link
        </p>
      </div>
      <ul className="max-h-44 space-y-1 overflow-y-auto bg-card p-2">
        {tasks.map(({ task, columnId }) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => onSelect(task.id)}
              className="flex w-full cursor-pointer flex-col rounded-lg border border-border/60 bg-background px-3 py-2.5 text-left shadow-sm transition-colors hover:border-teal-500/50 hover:bg-teal-500/5"
            >
              <span className="text-sm font-medium text-foreground">{task.title}</span>
              <span className="mt-0.5 text-[11px] capitalize text-muted-foreground">
                In {columnId.replace('-', ' ')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
