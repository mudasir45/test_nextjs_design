'use client';

import { ArrowRight } from 'lucide-react';
import type { MilestoneDraft, MilestoneTargetType } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { TARGET_TYPE_DEFAULTS } from '@/modules/goals/core/progress-utils';
import { TARGET_TYPE_OPTIONS } from '@/modules/goals/theme/milestone-target-types';
import type { KanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { MilestoneTasksDraftSection } from '@/modules/goals/ui/milestones/milestone-tasks-draft-section';
import { MilestoneTasksSection } from '@/modules/goals/ui/milestones/milestone-tasks-section';

interface MilestoneTargetFieldsProps {
  draft: MilestoneDraft;
  onChange: (draft: MilestoneDraft) => void;
  accentColor?: string;
  goalId?: string;
  milestoneId?: string;
  kanban?: KanbanBridge;
}

export function MilestoneTargetFields({
  draft,
  onChange,
  accentColor = '#0D9488',
  goalId,
  milestoneId,
  kanban,
}: MilestoneTargetFieldsProps) {
  const setType = (targetType: MilestoneTargetType) => {
    const defaults = TARGET_TYPE_DEFAULTS[targetType];
    onChange({
      ...draft,
      targetType,
      startValue: defaults.startValue,
      targetValue: defaults.targetValue,
      unit: targetType === 'number' ? draft.unit : undefined,
      newTaskTitles: targetType === 'tasks' ? draft.newTaskTitles ?? [] : undefined,
      linkTaskIds: targetType === 'tasks' ? draft.linkTaskIds ?? [] : undefined,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          How to measure
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {TARGET_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = draft.targetType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200',
                  selected
                    ? 'border-teal-500/50 bg-teal-500/5 ring-1 ring-teal-500/20'
                    : 'border-border/60 hover:border-teal-500/30',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    selected ? 'bg-teal-500/15 text-teal-700 dark:text-teal-400' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">{opt.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{opt.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {(draft.targetType === 'number' || draft.targetType === 'currency') && (
        <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <ValueField
              label="Start"
              value={draft.startValue ?? 0}
              prefix={draft.targetType === 'currency' ? '$' : undefined}
              onChange={(startValue) => onChange({ ...draft, startValue })}
            />
            <span className="hidden pb-3 text-teal-600 sm:block dark:text-teal-400">
              <ArrowRight className="h-4 w-4" style={{ color: accentColor }} />
            </span>
            <ValueField
              label="Target"
              value={draft.targetValue ?? 1}
              prefix={draft.targetType === 'currency' ? '$' : undefined}
              onChange={(targetValue) => onChange({ ...draft, targetValue })}
            />
          </div>
          {draft.targetType === 'number' && (
            <div className="mt-3">
              <label className="text-xs font-medium text-muted-foreground">Unit (optional)</label>
              <input
                value={draft.unit ?? ''}
                onChange={(e) => onChange({ ...draft, unit: e.target.value || undefined })}
                placeholder="e.g. users, miles, %"
                className={fieldClass}
              />
            </div>
          )}
        </div>
      )}

      {draft.targetType === 'tasks' && kanban && milestoneId && goalId && (
        <MilestoneTasksSection goalId={goalId} milestoneId={milestoneId} kanban={kanban} />
      )}

      {draft.targetType === 'tasks' && kanban && !milestoneId && (
        <MilestoneTasksDraftSection
          draft={draft}
          onChange={onChange}
          kanban={kanban}
          goalId={goalId}
        />
      )}

      {draft.targetType === 'tasks' && !kanban && (
        <p className="rounded-xl border border-border/60 bg-muted/15 p-4 text-xs text-muted-foreground">
          Save the milestone first, then add tasks on the goal page.
        </p>
      )}
    </div>
  );
}

function ValueField({
  label,
  value,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative mt-1">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={cn(fieldClass, prefix && 'pl-7')}
        />
      </div>
    </div>
  );
}

const fieldClass =
  'mt-1 w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm text-foreground focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15';
