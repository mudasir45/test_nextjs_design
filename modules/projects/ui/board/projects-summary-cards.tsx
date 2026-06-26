'use client';

import { AlertTriangle, CheckCircle2, FolderKanban, PauseCircle } from 'lucide-react';
import type { ProjectsSummary } from '@/modules/projects/core/project-utils';
import { cn } from '@/modules/projects/core/cn';
import { SUMMARY_CARD_STYLES } from '@/modules/projects/theme/projects-theme';

interface ProjectsSummaryCardsProps {
  summary: ProjectsSummary;
}

const ICONS = {
  active: FolderKanban,
  atRisk: AlertTriangle,
  onHold: PauseCircle,
  completed: CheckCircle2,
};

export function ProjectsSummaryCards({ summary }: ProjectsSummaryCardsProps) {
  const cards = [
    { key: 'active' as const, value: summary.active },
    { key: 'atRisk' as const, value: summary.atRisk },
    { key: 'onHold' as const, value: summary.onHold },
    { key: 'completed' as const, value: summary.completedThisMonth },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ key, value }) => {
        const style = SUMMARY_CARD_STYLES[key];
        const Icon = ICONS[key];
        return (
          <div
            key={key}
            className={cn(
              'rounded-xl border p-4 transition-shadow hover:shadow-sm',
              style.className,
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{style.label}</p>
              <Icon className={cn('h-4 w-4 opacity-60', style.valueClass)} />
            </div>
            <p className={cn('mt-2 text-2xl font-bold tabular-nums tracking-tight', style.valueClass)}>
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
