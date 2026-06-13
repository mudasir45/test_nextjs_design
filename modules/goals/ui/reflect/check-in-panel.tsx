'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Frown,
  Meh,
  Pencil,
  Send,
  Smile,
  Sparkles,
  Sprout,
  Footprints,
  TrendingUp,
  Zap,
  Star,
} from 'lucide-react';
import type { CheckInMood, GoalCheckIn, ProgressType, ReflectionMomentum } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';

interface CheckInPanelProps {
  currentProgress: number;
  progressType?: ProgressType;
  existingTodayCheckIn?: GoalCheckIn | null;
  onSubmit: (data: {
    note: string;
    progressSnapshot: number;
    mood?: CheckInMood;
    momentum?: ReflectionMomentum;
  }) => void;
}

const MOODS: {
  value: CheckInMood;
  label: string;
  description: string;
  icon: typeof Smile;
}[] = [
  { value: 'struggling', label: 'Struggling', description: 'Energy is low', icon: Frown },
  { value: 'ok', label: 'OK', description: 'Steady, nothing major', icon: Meh },
  { value: 'good', label: 'Good', description: 'Feeling motivated', icon: Smile },
  { value: 'great', label: 'Great', description: 'On fire right now', icon: Sparkles },
];

const MOMENTUM_STAGES: {
  value: ReflectionMomentum;
  label: string;
  description: string;
  icon: typeof Sprout;
  progressHint: number;
}[] = [
  { value: 'starting', label: 'Just beginning', description: 'Planting the seeds', icon: Sprout, progressHint: 15 },
  { value: 'steady', label: 'Slow & steady', description: 'Showing up consistently', icon: Footprints, progressHint: 35 },
  { value: 'progressing', label: 'Real progress', description: 'Things are moving', icon: TrendingUp, progressHint: 55 },
  { value: 'momentum', label: 'Strong momentum', description: 'In a good rhythm', icon: Zap, progressHint: 75 },
  { value: 'breakthrough', label: 'Breakthrough', description: 'A big leap this week', icon: Star, progressHint: 92 },
];

const STEPS = ['Feeling', 'Momentum', 'Capture'] as const;

function parseReflectionNote(note: string): { win: string; blocker: string } {
  const moved = note.match(/^Moved forward: ([\s\S]+?)(?:\n\nIn the way:|$)/);
  const blocked = note.match(/\n\nIn the way: ([\s\S]+)$/);
  if (moved || blocked) {
    return {
      win: moved?.[1]?.trim() ?? '',
      blocker: blocked?.[1]?.trim() ?? '',
    };
  }
  return { win: note.trim(), blocker: '' };
}

export function CheckInPanel({
  currentProgress,
  progressType = 'milestone',
  existingTodayCheckIn,
  onSubmit,
}: CheckInPanelProps) {
  const parsed = existingTodayCheckIn
    ? parseReflectionNote(existingTodayCheckIn.note)
    : { win: '', blocker: '' };

  const [mode, setMode] = useState<'idle' | 'form'>(() =>
    existingTodayCheckIn ? 'idle' : 'form',
  );
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<CheckInMood | undefined>(existingTodayCheckIn?.mood);
  const [momentum, setMomentum] = useState<ReflectionMomentum | undefined>(
    existingTodayCheckIn?.momentum,
  );
  const [win, setWin] = useState(parsed.win);
  const [blocker, setBlocker] = useState(parsed.blocker);

  useEffect(() => {
    if (!existingTodayCheckIn) {
      setMode('form');
      return;
    }
    const next = parseReflectionNote(existingTodayCheckIn.note);
    setMood(existingTodayCheckIn.mood);
    setMomentum(existingTodayCheckIn.momentum);
    setWin(next.win);
    setBlocker(next.blocker);
    setMode('idle');
    setStep(0);
  }, [existingTodayCheckIn?.id, existingTodayCheckIn?.note, existingTodayCheckIn?.mood, existingTodayCheckIn?.momentum]);

  const reset = () => {
    setStep(0);
    if (existingTodayCheckIn) {
      const next = parseReflectionNote(existingTodayCheckIn.note);
      setMood(existingTodayCheckIn.mood);
      setMomentum(existingTodayCheckIn.momentum);
      setWin(next.win);
      setBlocker(next.blocker);
      setMode('idle');
    } else {
      setMood(undefined);
      setMomentum(undefined);
      setWin('');
      setBlocker('');
    }
  };

  const buildNote = () => {
    const parts: string[] = [];
    if (win.trim()) parts.push(`Moved forward: ${win.trim()}`);
    if (blocker.trim()) parts.push(`In the way: ${blocker.trim()}`);
    return parts.join('\n\n');
  };

  const resolveProgressSnapshot = (): number => {
    if (progressType === 'percentage' && momentum) {
      const hint = MOMENTUM_STAGES.find((m) => m.value === momentum)?.progressHint ?? currentProgress;
      return hint;
    }
    return currentProgress;
  };

  const handleSubmit = () => {
    const note = buildNote();
    if (!note.trim() || !mood) return;
    onSubmit({
      note,
      progressSnapshot: resolveProgressSnapshot(),
      mood,
      momentum,
    });
    if (existingTodayCheckIn) {
      setMode('idle');
      setStep(0);
    } else {
      reset();
    }
  };

  const canContinue = () => {
    if (step === 0) return mood !== undefined;
    if (step === 1) return momentum !== undefined;
    return win.trim().length > 0;
  };

  const moodLabel = MOODS.find((m) => m.value === existingTodayCheckIn?.mood)?.label;
  const momentumLabel = MOMENTUM_STAGES.find(
    (m) => m.value === existingTodayCheckIn?.momentum,
  )?.label;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-teal-500/[0.05] via-card to-card">
      <div className="border-b border-border/40 px-6 py-5">
        <p className="text-base font-semibold text-foreground">Pause & reflect</p>
        <p className="mt-1 text-sm text-muted-foreground">
          One reflection per day — a quick pulse on how this goal feels.
        </p>
        {mode === 'form' && (
          <div className="mt-4 flex gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col gap-1">
                <div
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i <= step ? 'bg-teal-500' : 'bg-muted',
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    i === step ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {mode === 'idle' && existingTodayCheckIn ? (
        <div className="px-6 py-8">
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.04] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Reflected today
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {moodLabel && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                  {moodLabel}
                </span>
              )}
              {momentumLabel && (
                <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400">
                  {momentumLabel}
                </span>
              )}
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {existingTodayCheckIn.note}
            </p>
            <button
              type="button"
              onClick={() => setMode('form')}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
            >
              <Pencil className="h-4 w-4" />
              Update today&apos;s reflection
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 py-8">
            {existingTodayCheckIn && (
              <p className="mb-4 text-xs text-muted-foreground">
                Updating your reflection for today — saves replace the earlier entry.
              </p>
            )}
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  How are you feeling about this goal?
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {MOODS.map(({ value, label, description, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMood(value)}
                      className={cn(
                        'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-200',
                        mood === value
                          ? 'border-teal-500/50 bg-teal-500/10 shadow-sm ring-1 ring-teal-500/20'
                          : 'border-border/50 bg-muted/30 hover:border-teal-500/30 hover:bg-muted/50',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-6 w-6',
                          mood === value
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-muted-foreground',
                        )}
                      />
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <span className="text-center text-[11px] leading-tight text-muted-foreground">
                        {description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  What&apos;s your momentum right now?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pick the stage that fits — no numbers needed.
                </p>
                <div className="space-y-2">
                  {MOMENTUM_STAGES.map(({ value, label, description, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMomentum(value)}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200',
                        momentum === value
                          ? 'border-teal-500/50 bg-teal-500/10 ring-1 ring-teal-500/20'
                          : 'border-border/50 hover:border-teal-500/30 hover:bg-muted/30',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                          momentum === value ? 'bg-teal-500/20 text-teal-600' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-lg font-medium text-foreground">Capture the moment</h3>
                <div>
                  <label htmlFor="reflection-win" className="mb-2 block text-sm font-medium text-foreground">
                    What moved forward?
                  </label>
                  <textarea
                    id="reflection-win"
                    autoFocus
                    value={win}
                    onChange={(e) => setWin(e.target.value)}
                    rows={3}
                    placeholder="Even a small win counts…"
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label htmlFor="reflection-blocker" className="mb-2 block text-sm font-medium text-muted-foreground">
                    Anything in the way? <span className="font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="reflection-blocker"
                    value={blocker}
                    onChange={(e) => setBlocker(e.target.value)}
                    rows={2}
                    placeholder="Blockers, doubts, or distractions…"
                    className={textareaClass}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/40 px-6 py-4">
            <button
              type="button"
              onClick={() => {
                if (step === 0 && existingTodayCheckIn) {
                  reset();
                } else if (step === 0) {
                  reset();
                } else {
                  setStep(step - 1);
                }
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              {step === 0 && existingTodayCheckIn ? 'Cancel' : step === 0 ? 'Reset' : 'Back'}
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() => setStep(step + 1)}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold',
                  'bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={handleSubmit}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold',
                  'bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                <Send className="h-4 w-4" />
                {existingTodayCheckIn ? "Update today's reflection" : 'Save reflection'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const textareaClass =
  'w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-3 text-sm leading-relaxed focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/15';

export { MOMENTUM_STAGES };
