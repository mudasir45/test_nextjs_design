'use client';

import { Calendar, Kanban, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/modules/projects/ui/primitives/card';
import { Badge } from '@/modules/projects/ui/primitives/badge';
import { cn } from '@/modules/projects/core/cn';
import {
  computeProjectHealth,
  daysUntil,
  formatBudget,
  formatDueDate,
} from '@/modules/projects/core/project-utils';
import type { Project, ProjectClientRef, ProjectHealth, ProjectKanbanStats } from '@/modules/projects/core/types';
import { ProgressRing } from '@/modules/projects/ui/shared/progress-ring';
import {
  HEALTH_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '@/modules/projects/theme/projects-theme';
import { useProjectsRoutes } from '@/modules/projects/provider/ProjectsProvider';

interface ProjectCardProps {
  project: Project;
  kanbanStats: ProjectKanbanStats;
  client?: ProjectClientRef;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, kanbanStats, client, onClick }: ProjectCardProps) {
  const routes = useProjectsRoutes();
  const days = daysUntil(project.deadline);
  const health: ProjectHealth = computeProjectHealth(project, kanbanStats);
  const statusStyle = STATUS_STYLES[project.status];
  const healthStyle = HEALTH_STYLES[health];
  const progress = kanbanStats.completionRate;

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
      onClick={() => onClick(project)}
    >
      <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: project.color }} />
      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Badge className={cn('border-0', statusStyle.className)}>{statusStyle.label}</Badge>
              <Badge className={cn('border-0', healthStyle.className)}>{healthStyle.label}</Badge>
            </div>
            <h3 className="truncate text-base font-semibold text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-400">
              {project.name}
            </h3>
            {client && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {client.company ?? client.name}
              </p>
            )}
            {project.description && (
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
            )}
          </div>
          <ProgressRing value={progress} color={project.color} size={52} />
        </div>

        {kanbanStats.total > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Tasks</span>
              <span>
                {kanbanStats.done}/{kanbanStats.total} done
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: project.color }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {project.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDueDate(project.deadline)}
                {days !== null && days >= 0 && (
                  <span className="text-violet-600 dark:text-violet-400">· {days}d</span>
                )}
                {days !== null && days < 0 && (
                  <span className="text-red-600 dark:text-red-400">· overdue</span>
                )}
              </span>
            )}
            {project.teamMemberIds.length > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {project.teamMemberIds.length}
              </span>
            )}
            <Badge className={cn('border-0 text-[10px]', PRIORITY_STYLES[project.priority].className)}>
              {PRIORITY_STYLES[project.priority].label}
            </Badge>
          </div>
          <Link
            href={routes.kanbanForProject(project.id)}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-violet-600 transition-colors hover:bg-violet-500/10 dark:text-violet-400"
          >
            <Kanban className="h-3 w-3" />
            Board
          </Link>
        </div>

        {project.budget != null && (
          <p className="mt-2 text-[11px] font-medium text-muted-foreground">
            Budget · {formatBudget(project.budget, project.currency)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
