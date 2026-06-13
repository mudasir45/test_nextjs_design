'use client';

import { useState } from 'react';
import type { MilestoneDraft } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { MilestoneTargetFields } from '@/modules/goals/ui/milestones/milestone-target-fields';
import { tasksDraftCount } from '@/modules/goals/ui/milestones/milestone-tasks-draft-section';

const EMPTY_DRAFT: MilestoneDraft = {
  title: '',
  targetType: 'boolean',
};

interface MilestoneFormProps {
  initial?: MilestoneDraft;
  accentColor?: string;
  submitLabel?: string;
  goalId?: string;
  kanban?: KanbanBridge;
  onSubmit: (draft: MilestoneDraft) => void;
  onCancel?: () => void;
}

export function MilestoneForm({
  initial,
  accentColor,
  submitLabel = 'Add milestone',
  goalId,
  kanban,
  onSubmit,
  onCancel,
}: MilestoneFormProps) {
  const [draft, setDraft] = useState<MilestoneDraft>(initial ?? EMPTY_DRAFT);

  const tasksValid =
    draft.targetType !== 'tasks' || tasksDraftCount(draft) > 0;
  const canSubmit = draft.title.trim().length >= 2 && tasksValid;

  return (
    <div className="space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div>
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Milestone name
        </label>
        <input
          autoFocus
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="What counts as progress here?"
          className="mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Due date (optional)
        </label>
        <input
          type="date"
          value={draft.dueDate ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value || undefined }))}
          className="mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
      </div>

      <MilestoneTargetFields
        draft={draft}
        onChange={setDraft}
        accentColor={accentColor}
        goalId={goalId}
        kanban={kanban}
      />

      {draft.targetType === 'tasks' && !tasksValid && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Add or link at least one task for this milestone.
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit({ ...draft, title: draft.title.trim() })}
          className={cn(
            'cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all',
            'bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export function emptyMilestoneDraft(): MilestoneDraft {
  return { ...EMPTY_DRAFT };
}
