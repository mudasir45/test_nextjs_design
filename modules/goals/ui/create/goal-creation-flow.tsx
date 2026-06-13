'use client';

import { useCallback, useState } from 'react';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import type { CreateGoalPayload, GoalCategory, MilestoneDraft } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { useKanbanBridge } from '@/modules/goals/core/hooks/use-kanban-bridge';
import { CATEGORY_LABELS, GOAL_COLORS } from '@/modules/goals/theme/goals-theme';
import { getTargetTypeMeta } from '@/modules/goals/theme/milestone-target-types';
import { tasksDraftCount } from '@/modules/goals/ui/milestones/milestone-tasks-draft-section';
import { MilestoneBuilder } from '@/modules/goals/ui/create/milestone-builder';

interface GoalCreationFlowProps {
  onCreate: (payload: CreateGoalPayload) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 'title', prompt: 'What do you want to achieve?', hint: 'One clear outcome — not a task list.' },
  { id: 'why', prompt: 'Why does this matter to you?', hint: 'This is your anchor when motivation dips.' },
  { id: 'when', prompt: 'When do you want to get there?', hint: 'A target date creates gentle urgency.' },
  { id: 'path', prompt: 'How will you measure progress?', hint: 'Add milestones with the type that fits each checkpoint.' },
  { id: 'commit', prompt: 'Your goal is taking shape.', hint: 'Review and start when you feel ready.' },
] as const;

const WHY_PROMPTS = [
  'Financial freedom',
  'Career growth',
  'Health & energy',
  'Creative fulfillment',
  'Family & relationships',
];

export function GoalCreationFlow({ onCreate, onCancel }: GoalCreationFlowProps) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [motivation, setMotivation] = useState('');
  const [category, setCategory] = useState<GoalCategory>('professional');
  const [color, setColor] = useState(GOAL_COLORS[0]);
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([]);
  const kanban = useKanbanBridge([]);

  const canContinue = useCallback(() => {
    if (step === 0) return title.trim().length >= 3;
    return true;
  }, [step, title]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onCreate({
        title: title.trim(),
        motivation: motivation.trim() || undefined,
        category,
        priority: 'medium',
        color,
        targetDate: targetDate || undefined,
        reviewFrequency: 'weekly',
        milestones,
      });
    }
  };

  const current = STEPS[step];

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col">
      <div className="flex shrink-0 gap-2 px-8 pt-8">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-500',
              i <= step ? 'bg-teal-500' : 'bg-muted',
            )}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-600 dark:text-teal-400">
          Step {step + 1} of {STEPS.length}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {current.prompt}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{current.hint}</p>

        <div className="mt-10 space-y-5">
          {step === 0 && (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canContinue() && handleNext()}
              placeholder="e.g. Launch my product to 100 users"
              className={inputClass}
            />
          )}

          {step === 1 && (
            <>
              <textarea
                autoFocus
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={4}
                placeholder="Write it in your own words…"
                className={inputClass}
              />
              <div className="flex flex-wrap gap-2">
                {WHY_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setMotivation((m) => (m ? `${m}. ${p}` : p))}
                    className="cursor-pointer rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-teal-500/40 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="date"
                autoFocus
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-muted-foreground">Category</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_LABELS) as GoalCategory[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                      category === c
                        ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                        : 'bg-muted text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Accent</p>
              <div className="flex gap-2">
                {GOAL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'h-8 w-8 cursor-pointer rounded-full transition-transform hover:scale-110',
                      color === c && 'ring-2 ring-teal-500 ring-offset-2',
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <MilestoneBuilder
              milestones={milestones}
              onChange={setMilestones}
              accentColor={color}
              kanban={kanban}
            />
          )}

          {step === 4 && (
            <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-6">
              {motivation && (
                <blockquote className="text-lg font-medium leading-relaxed text-foreground">
                  &ldquo;{motivation}&rdquo;
                </blockquote>
              )}
              <p className="font-semibold text-foreground">{title}</p>
              <dl className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <dt>Category</dt>
                  <dd className="font-medium text-foreground">{CATEGORY_LABELS[category]}</dd>
                </div>
                {targetDate && (
                  <div className="flex justify-between gap-4">
                    <dt>Target</dt>
                    <dd className="font-medium text-foreground">
                      {new Date(targetDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt>Measurement</dt>
                  <dd className="font-medium text-foreground">
                    {milestones.length > 0
                      ? `${milestones.length} milestone${milestones.length === 1 ? '' : 's'}`
                      : 'Add milestones later'}
                  </dd>
                </div>
              </dl>
              {milestones.length > 0 && (
                <ul className="space-y-2 border-t border-border/40 pt-4">
                  {milestones.map((m, i) => (
                    <li key={`${m.title}-${i}`} className="flex justify-between gap-4 text-sm">
                      <span className="text-foreground">{m.title}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {getTargetTypeMeta(m.targetType).shortLabel}
                        {m.targetType === 'tasks' && tasksDraftCount(m) > 0
                          ? ` · ${tasksDraftCount(m)} tasks`
                          : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="pt-2 text-center text-sm text-muted-foreground">
                You can refine milestones and log progress anytime on your goal page.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-border/60 px-8 py-5">
        <button
          type="button"
          onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>
        <button
          type="button"
          disabled={!canContinue()}
          onClick={handleNext}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200',
            'bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40',
          )}
        >
          {step === STEPS.length - 1 ? (
            <>
              <Sparkles className="h-4 w-4" />
              Start this goal
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-border/80 bg-background px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15 transition-shadow';
