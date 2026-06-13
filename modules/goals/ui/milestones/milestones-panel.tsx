'use client';

import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { GoalMilestone, MilestoneDraft } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import {
  calculateSingleMilestoneProgress,
  formatDueDate,
  formatMilestoneProgressLabel,
} from '@/modules/goals/core/progress-utils';
import { normalizeMilestone } from '@/modules/goals/core/milestone-utils';
import { getTargetTypeMeta } from '@/modules/goals/theme/milestone-target-types';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { MilestoneForm } from '@/modules/goals/ui/milestones/milestone-form';
import { MilestoneTasksSection } from '@/modules/goals/ui/milestones/milestone-tasks-section';
import {
  EditMilestoneButton,
  MilestoneInlineEditor,
  QuickValueAdjust,
} from '@/modules/goals/ui/milestones/milestone-inline-editor';

interface MilestonesPanelProps {
  goalId: string;
  milestones: GoalMilestone[];
  color?: string;
  kanban?: KanbanBridge;
  onToggle: (milestoneId: string) => void;
  onUpdate: (milestoneId: string, updates: Partial<GoalMilestone>) => void;
  onRemove: (milestoneId: string) => void;
  onAdd: (draft: MilestoneDraft) => void;
}

export function MilestonesPanel({
  goalId,
  milestones,
  color = '#0D9488',
  kanban,
  onToggle,
  onUpdate,
  onRemove,
  onAdd,
}: MilestonesPanelProps) {
  const [adding, setAdding] = useState(false);
  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sorted.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">
          No milestones yet. Add one to define how progress is measured.
        </p>
      )}

      <div className="space-y-3">
        {sorted.map((milestone, index) => (
          <MilestoneRow
            key={milestone.id}
            milestone={milestone}
            goalId={goalId}
            color={color}
            kanban={kanban}
            isLast={index === sorted.length - 1}
            onToggle={() => onToggle(milestone.id)}
            onUpdate={(updates) => onUpdate(milestone.id, updates)}
            onRemove={() => onRemove(milestone.id)}
          />
        ))}
      </div>

      {adding ? (
        <MilestoneForm
          accentColor={color}
          goalId={goalId}
          kanban={kanban}
          onSubmit={(draft) => {
            onAdd(draft);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-teal-500/40 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:border-teal-500 hover:bg-teal-500/5 dark:text-teal-400"
        >
          <Plus className="h-4 w-4" />
          Add milestone
        </button>
      )}
    </div>
  );
}

function MilestoneRow({
  milestone,
  goalId,
  color,
  kanban,
  isLast,
  onToggle,
  onUpdate,
  onRemove,
}: {
  milestone: GoalMilestone;
  goalId: string;
  color: string;
  kanban?: KanbanBridge;
  isLast: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<GoalMilestone>) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const m = normalizeMilestone(milestone);
  const meta = getTargetTypeMeta(m.targetType);
  const Icon = meta.icon;
  const progress = calculateSingleMilestoneProgress(m);
  const isComplete = progress >= 100 || m.status === 'completed';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            if (m.targetType !== 'tasks') onToggle();
          }}
          disabled={m.targetType === 'tasks'}
          aria-disabled={m.targetType === 'tasks'}
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            m.targetType === 'tasks' ? 'cursor-default' : 'cursor-pointer',
            isComplete
              ? 'border-transparent text-white'
              : 'border-muted-foreground/30 bg-card hover:border-teal-500',
          )}
          style={isComplete ? { backgroundColor: color } : undefined}
          aria-label={`Toggle ${m.title}`}
        >
          {isComplete ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
        {!isLast && (
          <div
            className={cn(
              'my-1 min-h-[20px] w-0.5 flex-1 transition-colors',
              isComplete ? 'bg-teal-500' : 'bg-muted',
            )}
          />
        )}
      </div>

      <div className={cn('min-w-0 flex-1 pb-4', isLast && 'pb-0')}>
        <div className="rounded-xl border border-border/50 bg-card/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    'font-medium text-foreground',
                    isComplete && 'text-muted-foreground line-through',
                  )}
                >
                  {m.title}
                </p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {meta.shortLabel}
                </span>
              </div>
              {m.dueDate && (
                <p className="mt-1 text-xs text-muted-foreground">Due {formatDueDate(m.dueDate)}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{formatMilestoneProgressLabel(m)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <EditMilestoneButton onClick={() => setEditing((e) => !e)} />
              <button
                type="button"
                onClick={onRemove}
                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-600"
                aria-label="Remove milestone"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {editing && (
            <MilestoneInlineEditor
              milestone={m}
              goalId={goalId}
              kanban={kanban}
              accentColor={color}
              onSave={(updates) => {
                onUpdate(updates);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          )}

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>

          {!editing && milestone.targetType !== 'tasks' && (
            <MilestoneControls milestone={m} onUpdate={onUpdate} />
          )}
          {!editing && milestone.targetType === 'tasks' && kanban && (
            <MilestoneTasksSection
              goalId={goalId}
              milestoneId={m.id}
              kanban={kanban}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneControls({
  milestone,
  onUpdate,
}: {
  milestone: GoalMilestone;
  onUpdate: (updates: Partial<GoalMilestone>) => void;
}) {
  switch (milestone.targetType) {
    case 'boolean':
      return (
        <button
          type="button"
          onClick={() =>
            onUpdate({
              status: milestone.status === 'completed' ? 'pending' : 'completed',
              completedAt:
                milestone.status === 'completed' ? undefined : new Date().toISOString(),
            })
          }
          className="mt-3 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          Mark as {milestone.status === 'completed' ? 'not done' : 'done'}
        </button>
      );
    case 'number':
      return (
        <>
          <QuickValueAdjust
            value={milestone.currentValue ?? milestone.startValue ?? 0}
            onChange={(currentValue) => onUpdate({ currentValue })}
            unit={milestone.unit}
            step={1}
          />
          <TargetRangeHint milestone={milestone} onUpdate={onUpdate} />
        </>
      );
    case 'currency':
      return (
        <>
          <QuickValueAdjust
            value={milestone.currentValue ?? milestone.startValue ?? 0}
            onChange={(currentValue) => onUpdate({ currentValue })}
            prefix="$"
            step={milestone.targetValue && milestone.targetValue > 1000 ? 100 : 10}
          />
          <TargetRangeHint milestone={milestone} onUpdate={onUpdate} prefix="$" />
        </>
      );
    default:
      return null;
  }
}

function TargetRangeHint({
  milestone,
  onUpdate,
  prefix,
}: {
  milestone: GoalMilestone;
  onUpdate: (updates: Partial<GoalMilestone>) => void;
  prefix?: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        Start
        <InlineNumber
          value={milestone.startValue ?? 0}
          prefix={prefix}
          onChange={(startValue) => onUpdate({ startValue })}
        />
      </span>
      <span className="text-teal-600 dark:text-teal-400">→</span>
      <span className="inline-flex items-center gap-1">
        Target
        <InlineNumber
          value={milestone.targetValue ?? 1}
          prefix={prefix}
          onChange={(targetValue) => onUpdate({ targetValue })}
        />
      </span>
      {milestone.targetType === 'number' && (
        <span className="inline-flex items-center gap-1">
          Unit
          <input
            value={milestone.unit ?? ''}
            onChange={(e) => onUpdate({ unit: e.target.value || undefined })}
            placeholder="optional"
            className="w-16 rounded border border-border/60 bg-background px-1.5 py-0.5 text-xs"
          />
        </span>
      )}
    </div>
  );
}

function InlineNumber({
  value,
  prefix,
  onChange,
}: {
  value: number;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <span className="inline-flex items-center">
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-16 rounded border border-border/60 bg-background px-1.5 py-0.5 text-xs tabular-nums"
      />
    </span>
  );
}
