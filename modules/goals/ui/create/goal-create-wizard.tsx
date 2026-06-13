'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import type {
  CreateGoalPayload,
  GoalCategory,
  GoalPriority,
  ProgressType,
  ReviewFrequency,
} from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { useGoalsTheme } from '@/modules/goals/provider/GoalsProvider';
import {
  CATEGORY_LABELS,
  GOAL_COLORS,
} from '@/modules/goals/theme/goals-theme';

interface GoalCreateWizardProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateGoalPayload) => void;
}

const STEPS = ['Identity', 'Why & Timeline', 'Milestones', 'Review'];

const PROGRESS_TYPES: { value: ProgressType; label: string; desc: string }[] = [
  { value: 'milestone', label: 'Milestones', desc: 'Track via checkpoints' },
  { value: 'percentage', label: 'Percentage', desc: 'Manual progress updates' },
  { value: 'numeric', label: 'Key Results', desc: 'Measurable outcomes' },
  { value: 'binary', label: 'Done / Not Done', desc: 'Simple completion' },
];

export function GoalCreateWizard({ open, onClose, onCreate }: GoalCreateWizardProps) {
  const theme = useGoalsTheme();
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('professional');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [color, setColor] = useState(GOAL_COLORS[0]);
  const [motivation, setMotivation] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [reviewFrequency, setReviewFrequency] = useState<ReviewFrequency>('weekly');
  const [progressType, setProgressType] = useState<ProgressType>('milestone');
  const [milestones, setMilestones] = useState<{ title: string; dueDate?: string }[]>([
    { title: '' },
  ]);
  const [keyResults, setKeyResults] = useState<
    { title: string; target: number; unit?: string }[]
  >([{ title: '', target: 100, unit: '' }]);

  if (!open) return null;

  const reset = () => {
    setStep(0);
    setTitle('');
    setDescription('');
    setCategory('professional');
    setPriority('medium');
    setColor(GOAL_COLORS[0]);
    setMotivation('');
    setTargetDate('');
    setReviewFrequency('weekly');
    setProgressType('milestone');
    setMilestones([{ title: '' }]);
    setKeyResults([{ title: '', target: 100, unit: '' }]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canNext = () => {
    if (step === 0) return title.trim().length > 0;
    if (step === 1) return true;
    if (step === 2) return true;
    return true;
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      motivation: motivation.trim() || undefined,
      category,
      priority,
      color,
      progressType,
      targetDate: targetDate || undefined,
      reviewFrequency,
      milestones: milestones.filter((m) => m.title.trim()).map((m) => ({
        title: m.title.trim(),
        targetType: 'boolean' as const,
        dueDate: m.dueDate,
      })),
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Create a Goal</h2>
            <p className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {STEPS.map((_, i) => (
            <div
              key={STEPS[i]}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i <= step ? 'bg-teal-500' : 'bg-muted',
              )}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Goal title" required>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Launch mobile app v1"
                  className={inputClass}
                  autoFocus
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does success look like?"
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Category">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_LABELS) as GoalCategory[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        category === c
                          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                          : 'bg-muted text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {CATEGORY_LABELS[c]}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Priority">
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as GoalPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                        priority === p
                          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Color">
                <div className="flex gap-2">
                  {GOAL_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        'h-7 w-7 cursor-pointer rounded-full transition-transform duration-200 hover:scale-110',
                        color === c && 'ring-2 ring-offset-2 ring-teal-500',
                      )}
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Why does this matter to you?">
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Your personal reason — this keeps you going when it gets hard"
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="Target date">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Review frequency">
                <div className="flex gap-2">
                  {(['weekly', 'biweekly', 'monthly'] as ReviewFrequency[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setReviewFrequency(f)}
                      className={cn(
                        'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                        reviewFrequency === f
                          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="How will you track progress?">
                <div className="grid grid-cols-2 gap-2">
                  {PROGRESS_TYPES.map((pt) => (
                    <button
                      key={pt.value}
                      type="button"
                      onClick={() => setProgressType(pt.value)}
                      className={cn(
                        'cursor-pointer rounded-lg border p-3 text-left transition-colors',
                        progressType === pt.value
                          ? 'border-teal-500 bg-teal-500/5'
                          : 'border-border hover:border-teal-500/50',
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">{pt.label}</p>
                      <p className="text-xs text-muted-foreground">{pt.desc}</p>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {progressType === 'numeric' ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Define measurable key results for this goal.
                  </p>
                  {keyResults.map((kr, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={kr.title}
                        onChange={(e) => {
                          const next = [...keyResults];
                          next[i] = { ...next[i], title: e.target.value };
                          setKeyResults(next);
                        }}
                        placeholder="Key result title"
                        className={cn(inputClass, 'flex-1')}
                      />
                      <input
                        type="number"
                        value={kr.target}
                        onChange={(e) => {
                          const next = [...keyResults];
                          next[i] = { ...next[i], target: Number(e.target.value) };
                          setKeyResults(next);
                        }}
                        className={cn(inputClass, 'w-20')}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setKeyResults([...keyResults, { title: '', target: 100, unit: '' }])
                    }
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400"
                  >
                    <Plus className="h-3 w-3" /> Add key result
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Break your goal into checkpoints. You can always add more later.
                  </p>
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={m.title}
                        onChange={(e) => {
                          const next = [...milestones];
                          next[i] = { ...next[i], title: e.target.value };
                          setMilestones(next);
                        }}
                        placeholder={`Milestone ${i + 1}`}
                        className={cn(inputClass, 'flex-1')}
                      />
                      <input
                        type="date"
                        value={m.dueDate ?? ''}
                        onChange={(e) => {
                          const next = [...milestones];
                          next[i] = { ...next[i], dueDate: e.target.value };
                          setMilestones(next);
                        }}
                        className={cn(inputClass, 'w-36')}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setMilestones([...milestones, { title: '' }])}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400"
                  >
                    <Plus className="h-3 w-3" /> Add milestone
                  </button>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {title.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              {motivation && (
                <p className="text-sm italic text-muted-foreground">&ldquo;{motivation}&rdquo;</p>
              )}
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-left text-sm">
                <p>
                  <span className="text-muted-foreground">Category:</span>{' '}
                  {CATEGORY_LABELS[category]}
                </p>
                <p>
                  <span className="text-muted-foreground">Priority:</span>{' '}
                  <span className="capitalize">{priority}</span>
                </p>
                {targetDate && (
                  <p>
                    <span className="text-muted-foreground">Target:</span> {targetDate}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Tracking:</span>{' '}
                  {PROGRESS_TYPES.find((p) => p.value === progressType)?.label}
                </p>
              </div>
              <p className="text-sm text-teal-600 dark:text-teal-400">
                Ready to commit? Let&apos;s go!
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                theme.buttonPrimary,
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                theme.buttonCta,
              )}
            >
              Create Goal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
