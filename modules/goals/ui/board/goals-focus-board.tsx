'use client';

import { Compass, Plus } from 'lucide-react';
import type { Goal } from '@/modules/goals/core/types';
import { cn } from '@/modules/goals/core/cn';
import { GoalTileCard } from '@/modules/goals/ui/board/goal-tile-card';

interface GoalsFocusBoardProps {
  goals: (Goal & { effectiveProgress: number })[];
  selectedGoalId: string | null;
  onGoalClick: (goal: Goal) => void;
  onCreateClick: () => void;
  empty?: boolean;
  /** When true, first goal gets hero bento placement */
  bentoFocus?: boolean;
}

function getTileVariant(
  index: number,
  bentoFocus: boolean,
  total: number,
): 'hero' | 'featured' | 'default' {
  if (!bentoFocus || total === 0) return 'default';
  if (index === 0) return 'hero';
  if (index <= 2 && total >= 2) return 'featured';
  return 'default';
}

function getTileClass(index: number, bentoFocus: boolean, total: number): string {
  if (!bentoFocus || total === 0) return '';
  if (index === 0) return 'lg:col-span-2 lg:row-span-2';
  return '';
}

export function GoalsFocusBoard({
  goals,
  selectedGoalId,
  onGoalClick,
  onCreateClick,
  empty,
  bentoFocus = true,
}: GoalsFocusBoardProps) {
  if (empty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-gradient-to-br from-teal-500/[0.04] via-transparent to-violet-500/[0.03] px-8 py-24 text-center">
        <div className="rounded-2xl bg-teal-500/10 p-5 text-teal-600 dark:text-teal-400">
          <Compass className="h-12 w-12" />
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
          Start with one intention
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Great goals aren&apos;t long lists — they&apos;re clear directions.
          Define what you want, why it matters, and the path will follow.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-10 cursor-pointer rounded-full bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-teal-600/30"
        >
          Define your first goal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-8">
      <div
        className={cn(
          'grid gap-4',
          bentoFocus
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(180px,auto)]'
            : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
        )}
      >
        {goals.map((goal, index) => (
          <div key={goal.id} className={cn(getTileClass(index, bentoFocus, goals.length))}>
            <GoalTileCard
              goal={goal}
              variant={getTileVariant(index, bentoFocus, goals.length)}
              rank={bentoFocus && index === 0 ? 1 : undefined}
              selected={selectedGoalId === goal.id}
              onClick={onGoalClick}
            />
          </div>
        ))}

        {/* Add goal tile — always visible in mosaic */}
        <button
          type="button"
          onClick={onCreateClick}
          className={cn(
            'group flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60',
            'bg-muted/10 transition-all duration-300 hover:border-teal-500/40 hover:bg-teal-500/[0.04]',
            bentoFocus && goals.length >= 3 && 'lg:col-span-1',
          )}
        >
          <div className="rounded-full bg-muted/60 p-3 transition-colors group-hover:bg-teal-500/15">
            <Plus className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-teal-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-400">
            Define another goal
          </span>
        </button>
      </div>
    </div>
  );
}
