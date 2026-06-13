'use client';

import { useRef, useState } from 'react';
import { Link2, Plus, X } from 'lucide-react';
import type { MilestoneDraft } from '@/modules/goals/core/types';
import { getLinkableTasksForDraft } from '@/modules/goals/core/kanban-task-bridge';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { LinkExistingTasksPicker } from '@/modules/goals/ui/milestones/milestone-task-link-picker';

interface MilestoneTasksDraftSectionProps {
  draft: MilestoneDraft;
  onChange: (draft: MilestoneDraft) => void;
  kanban: KanbanBridge;
  goalId?: string;
  milestoneId?: string;
}

export function MilestoneTasksDraftSection({
  draft,
  onChange,
  kanban,
  goalId,
  milestoneId,
}: MilestoneTasksDraftSectionProps) {
  const [newTitle, setNewTitle] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const newTaskTitles = draft.newTaskTitles ?? [];
  const linkTaskIds = draft.linkTaskIds ?? [];

  const linkable = getLinkableTasksForDraft(kanban.columns, {
    goalId,
    excludeMilestoneId: milestoneId,
  }).filter(({ task }) => !linkTaskIds.includes(task.id));

  const linkedExisting = linkTaskIds
    .map((id) => kanban.getTaskContext(id))
    .filter(Boolean) as { task: { id: string; title: string }; column: { id: string } }[];

  const addNewTitle = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onChange({
      ...draft,
      newTaskTitles: [...newTaskTitles, trimmed],
    });
    setNewTitle('');
    inputRef.current?.focus();
  };

  const totalTasks = newTaskTitles.length + linkTaskIds.length;

  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Tasks for this milestone
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Progress completes when all linked tasks are done on the board.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addNewTitle();
            }
          }}
          placeholder="New task title…"
          className="min-w-0 flex-1 rounded-lg border border-border/80 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
        <button
          type="button"
          disabled={!newTitle.trim()}
          onClick={addNewTitle}
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
            onChange({
              ...draft,
              linkTaskIds: [...linkTaskIds, taskId],
            });
            setPickerOpen(false);
          }}
        />
      </div>

      {totalTasks === 0 ? (
        <p className="text-xs text-muted-foreground">Add or link at least one task.</p>
      ) : (
        <ul className="space-y-1.5">
          {newTaskTitles.map((title, i) => (
            <li
              key={`new-${title}-${i}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border/60 bg-background/80 px-3 py-2 text-sm"
            >
              <span className="text-foreground">{title}</span>
              <span className="text-[10px] text-muted-foreground">New</span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    newTaskTitles: newTaskTitles.filter((_, idx) => idx !== i),
                  })
                }
                className="cursor-pointer rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          {linkedExisting.map(({ task, column }) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-sm"
            >
              <span className="text-foreground">{task.title}</span>
              <span className="text-[10px] capitalize text-muted-foreground">
                {column.id.replace('-', ' ')}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...draft,
                    linkTaskIds: linkTaskIds.filter((id) => id !== task.id),
                  })
                }
                className="cursor-pointer rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function tasksDraftCount(draft: MilestoneDraft): number {
  return (draft.newTaskTitles?.length ?? 0) + (draft.linkTaskIds?.length ?? 0);
}
