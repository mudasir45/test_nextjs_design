'use client';

import { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import type { GoalMilestone, MilestoneDraft } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { MilestoneTargetFields } from '@/modules/goals/ui/milestones/milestone-target-fields';

interface MilestoneInlineEditorProps {
  milestone: GoalMilestone;
  goalId?: string;
  kanban?: KanbanBridge;
  accentColor?: string;
  onSave: (updates: Partial<GoalMilestone>) => void;
  onCancel: () => void;
}

export function MilestoneInlineEditor({
  milestone,
  goalId,
  kanban,
  accentColor,
  onSave,
  onCancel,
}: MilestoneInlineEditorProps) {
  const [draft, setDraft] = useState<MilestoneDraft>({
    title: milestone.title,
    targetType: milestone.targetType,
    dueDate: milestone.dueDate,
    startValue: milestone.startValue,
    targetValue: milestone.targetValue,
    unit: milestone.unit,
  });

  return (
    <div className="mt-3 space-y-4 rounded-xl border border-teal-500/25 bg-teal-500/[0.03] p-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">Name</label>
        <input
          autoFocus
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Due date</label>
        <input
          type="date"
          value={draft.dueDate ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value || undefined }))}
          className="mt-1 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
      </div>
      <MilestoneTargetFields
        draft={draft}
        onChange={setDraft}
        accentColor={accentColor}
        goalId={goalId}
        milestoneId={milestone.id}
        kanban={kanban}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
        <button
          type="button"
          disabled={draft.title.trim().length < 2}
          onClick={() =>
            onSave({
              title: draft.title.trim(),
              targetType: draft.targetType,
              dueDate: draft.dueDate,
              startValue: draft.startValue,
              targetValue: draft.targetValue,
              unit: draft.unit,
            })
          }
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-40"
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </button>
      </div>
    </div>
  );
}

interface QuickValueAdjustProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  unit?: string;
  step?: number;
}

export function QuickValueAdjust({
  value,
  onChange,
  prefix,
  unit,
  step = 1,
}: QuickValueAdjustProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Current</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(value - step)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border/80 text-sm font-medium hover:bg-muted"
        >
          −
        </button>
        <div className="relative min-w-[5rem]">
          {prefix && (
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className={cn(
              'w-full rounded-lg border border-border/80 bg-background py-1.5 text-center text-sm tabular-nums focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15',
              prefix ? 'pl-5 pr-2' : 'px-2',
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border/80 text-sm font-medium hover:bg-muted"
        >
          +
        </button>
      </div>
      {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
    </div>
  );
}

export function EditMilestoneButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Edit milestone"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
}
