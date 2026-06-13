'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { CheckInMood } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { useGoalsTheme } from '@/modules/goals/provider/GoalsProvider';
import { MOOD_OPTIONS } from '@/modules/goals/theme/goals-theme';

interface CheckInModalProps {
  open: boolean;
  goalTitle: string;
  currentProgress: number;
  onClose: () => void;
  onSubmit: (data: {
    note: string;
    progressSnapshot: number;
    mood?: CheckInMood;
  }) => void;
}

export function CheckInModal({
  open,
  goalTitle,
  currentProgress,
  onClose,
  onSubmit,
}: CheckInModalProps) {
  const theme = useGoalsTheme();
  const [note, setNote] = useState('');
  const [progress, setProgress] = useState(currentProgress);
  const [mood, setMood] = useState<CheckInMood | undefined>();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmit({ note: note.trim(), progressSnapshot: progress, mood });
    setNote('');
    setProgress(currentProgress);
    setMood(undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold text-foreground">Log Progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">{goalTitle}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              How are you feeling?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMood(opt.value)}
                  className={cn(
                    'cursor-pointer rounded-lg border p-2 text-center transition-all duration-200 hover:scale-[1.02]',
                    mood === opt.value
                      ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/20'
                      : 'border-border hover:border-teal-500/50',
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                    {opt.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="progress-slider" className="text-sm font-medium text-foreground">
                Progress
              </label>
              <span className="text-sm font-semibold tabular-nums text-teal-600 dark:text-teal-400">
                {progress}%
              </span>
            </div>
            <input
              id="progress-slider"
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-teal-500"
            />
          </div>

          <div>
            <label htmlFor="checkin-note" className="mb-2 block text-sm font-medium text-foreground">
              What did you accomplish?
            </label>
            <textarea
              id="checkin-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Share your progress, wins, or blockers..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!note.trim()}
              className={cn(
                'cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                theme.buttonCta,
              )}
            >
              Save Check-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
