'use client';

import { Calendar, ChevronRight, Kanban } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/modules/projects/ui/primitives/badge';
import { cn } from '@/modules/projects/core/cn';
import {
  computeProjectHealth,
  daysUntil,
  formatBudget,
  formatDueDate,
} from '@/modules/projects/core/project-utils';
import type { Project, ProjectClientRef, ProjectKanbanStats } from '@/modules/projects/core/types';
import { ProgressRing } from '@/modules/projects/ui/shared/progress-ring';
import {
  HEALTH_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '@/modules/projects/theme/projects-theme';
import { useProjectsRoutes } from '@/modules/projects/provider/ProjectsProvider';

interface ProjectListRowProps {
  project: Project;
  kanbanStats: ProjectKanbanStats;
  client?: ProjectClientRef;
  onClick: (project: Project) => void;
}

export function ProjectListRow({ project, kanbanStats, client, onClick }: ProjectListRowProps) {
  const routes = useProjectsRoutes();
  const days = daysUntil(project.deadline);
  const health = computeProjectHealth(project, kanbanStats);
  const statusStyle = STATUS_STYLES[project.status];
  const healthStyle = HEALTH_STYLES[health];

  return (
    <button
      type="button"
      onClick={() => onClick(project)}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-violet-500/30 hover:shadow-sm sm:gap-6 sm:px-5 sm:py-4"
    >
      <div
        className="hidden h-10 w-1 shrink-0 rounded-full sm:block"
        style={{ backgroundColor: project.color }}
      />
      <ProgressRing
        value={kanbanStats.completionRate}
        color={project.color}
        size={44}
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-400">
            {project.name}
          </h3>
          <Badge className={cn('border-0 text-[10px]', statusStyle.className)}>{statusStyle.label}</Badge>
          <Badge className={cn('border-0 text-[10px]', healthStyle.className)}>{healthStyle.label}</Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {client ? `${client.company ?? client.name} · ` : ''}
          {kanbanStats.total > 0
            ? `${kanbanStats.done}/${kanbanStats.total} tasks`
            : 'No tasks yet'}
          {project.budget != null && ` · ${formatBudget(project.budget, project.currency)}`}
        </p>
      </div>
      <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
        {project.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDueDate(project.deadline)}
            {days !== null && days < 0 && (
              <span className="font-medium text-red-600 dark:text-red-400">Overdue</span>
            )}
          </span>
        )}
        <Badge className={cn('border-0 text-[10px]', PRIORITY_STYLES[project.priority].className)}>
          {PRIORITY_STYLES[project.priority].label}
        </Badge>
        <Link
          href={routes.kanbanForProject(project.id)}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 rounded-md px-2 py-1 font-medium text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
        >
          <Kanban className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
