'use client';

import Link from 'next/link';
import { ArrowLeft, Kanban, Pencil } from 'lucide-react';
import type { Project } from '@/modules/projects/core/types';
import { Badge } from '@/modules/projects/ui/primitives/badge';
import { cn } from '@/modules/projects/core/cn';
import { STATUS_STYLES } from '@/modules/projects/theme/projects-theme';
import { useProjectsRoutes, useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';

interface ProjectWorkspaceBarProps {
  project: Project;
  completionRate: number;
  /** 0 → 1 collapse progress. The project context + actions reveal as it rises. */
  progress: number;
  onEdit: () => void;
}

/**
 * Slim, always-pinned bar that sits above the tabs. It keeps a constant height
 * (so dependent layout math stays stable) and reveals the project context and
 * quick actions, scroll-linked, as the rich hero collapses into it.
 */
export function ProjectWorkspaceBar({
  project,
  completionRate,
  progress,
  onEdit,
}: ProjectWorkspaceBarProps) {
  const routes = useProjectsRoutes();
  const theme = useProjectsTheme();
  const statusStyle = STATUS_STYLES[project.status];

  // Reveal a touch ahead of the hero finishing so the handoff feels continuous.
  const reveal = Math.min(1, Math.max(0, (progress - 0.35) / 0.5));
  const interactive = reveal > 0.6;

  return (
    <div className="flex h-11 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <Link
          href={routes.index}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Projects
        </Link>

        <div
          className="flex min-w-0 items-center gap-2"
          style={{
            opacity: reveal,
            transform: `translateX(${(1 - reveal) * -6}px)`,
            pointerEvents: interactive ? undefined : 'none',
          }}
          aria-hidden={!interactive}
        >
          <span className="h-3.5 w-px shrink-0 bg-border" />
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="truncate text-sm font-semibold text-foreground">{project.name}</span>
          <Badge className={cn('hidden shrink-0 border-0 sm:inline-flex', statusStyle.className)}>
            {statusStyle.label}
          </Badge>
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-2"
        style={{
          opacity: reveal,
          transform: `translateX(${(1 - reveal) * 6}px)`,
          pointerEvents: interactive ? undefined : 'none',
        }}
        aria-hidden={!interactive}
      >
        <span className="hidden text-xs font-medium text-muted-foreground md:inline">
          {completionRate}% done
        </span>
        <Link
          href={routes.kanbanForProject(project.id)}
          tabIndex={interactive ? undefined : -1}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
            theme.buttonPrimary,
          )}
        >
          <Kanban className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Open board</span>
        </Link>
        <button
          type="button"
          onClick={onEdit}
          tabIndex={interactive ? undefined : -1}
          aria-label="Edit project"
          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
