'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { MilestoneDraft } from '@/modules/goals/core/types';
import { getTargetTypeMeta } from '@/modules/goals/theme/milestone-target-types';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { MilestoneTargetFields } from '@/modules/goals/ui/milestones/milestone-target-fields';
import { tasksDraftCount } from '@/modules/goals/ui/milestones/milestone-tasks-draft-section';
import { emptyMilestoneDraft } from '@/modules/goals/ui/milestones/milestone-form';

interface MilestoneBuilderProps {
  milestones: MilestoneDraft[];
  onChange: (milestones: MilestoneDraft[]) => void;
  accentColor?: string;
  kanban?: KanbanBridge;
}

export function MilestoneBuilder({ milestones, onChange, accentColor, kanban }: MilestoneBuilderProps) {
  const [draft, setDraft] = useState<MilestoneDraft>(emptyMilestoneDraft());
  const [showForm, setShowForm] = useState(milestones.length === 0);

  const tasksValid = draft.targetType !== 'tasks' || tasksDraftCount(draft) > 0;

  const addMilestone = () => {
    if (draft.title.trim().length < 2 || !tasksValid) return;
    onChange([...milestones, { ...draft, title: draft.title.trim() }]);
    setDraft(emptyMilestoneDraft());
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {milestones.length > 0 && (
        <ul className="space-y-2">
          {milestones.map((m, i) => {
            const meta = getTargetTypeMeta(m.targetType);
            const Icon = meta.icon;
            const taskCount = m.targetType === 'tasks' ? tasksDraftCount(m) : 0;
            return (
              <li
                key={`${m.title}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-400">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{m.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {meta.label}
                    {taskCount > 0 && ` · ${taskCount} task${taskCount === 1 ? '' : 's'}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(milestones.filter((_, idx) => idx !== i))}
                  className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showForm ? (
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Milestone name"
            className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
          />
          <input
            type="date"
            value={draft.dueDate ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value || undefined }))}
            className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
          />
          <MilestoneTargetFields
            draft={draft}
            onChange={setDraft}
            accentColor={accentColor}
            kanban={kanban}
          />
          {draft.targetType === 'tasks' && !tasksValid && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Add or link at least one task for this milestone.
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addMilestone}
              disabled={draft.title.trim().length < 2 || !tasksValid}
              className="cursor-pointer rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-40"
            >
              Save milestone
            </button>
            {milestones.length > 0 && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400"
        >
          <Plus className="h-4 w-4" />
          Add milestone
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        Optional — you can always add or edit milestones on your goal page later.
      </p>
    </div>
  );
}
