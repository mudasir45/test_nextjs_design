'use client';

import Link from 'next/link';
import { Building2, Calendar, Kanban, Pencil, Target, Trash2 } from 'lucide-react';
import type {
  Project,
  ProjectClientRef,
  ProjectGoalRef,
  ProjectHealth,
  ProjectKanbanStats,
  ProjectStatus,
  ProjectTeamMemberRef,
} from '@/modules/projects/core/types';
import { Badge } from '@/modules/projects/ui/primitives/badge';
import { cn } from '@/modules/projects/core/cn';
import {
  computeProjectHealth,
  daysUntil,
  formatBudget,
  formatDueDate,
} from '@/modules/projects/core/project-utils';
import { ProgressRing } from '@/modules/projects/ui/shared/progress-ring';
import {
  HEALTH_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from '@/modules/projects/theme/projects-theme';
import { useProjectsRoutes, useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';

interface ProjectWorkspaceHeaderProps {
  project: Project;
  kanbanStats: ProjectKanbanStats;
  client?: ProjectClientRef;
  goal?: ProjectGoalRef;
  team: ProjectTeamMemberRef[];
  onStatusChange: (status: ProjectStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_OPTIONS: ProjectStatus[] = ['planning', 'active', 'on_hold', 'completed', 'archived'];

export function ProjectWorkspaceHeader({
  project,
  kanbanStats,
  client,
  goal,
  team,
  onStatusChange,
  onEdit,
  onDelete,
}: ProjectWorkspaceHeaderProps) {
  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${project.name}"? This permanently removes its documents, links, environments, and infrastructure.`,
      )
    ) {
      onDelete();
    }
  };

  const routes = useProjectsRoutes();
  const theme = useProjectsTheme();
  const health: ProjectHealth = computeProjectHealth(project, kanbanStats);
  const days = daysUntil(project.deadline);
  const statusStyle = STATUS_STYLES[project.status];
  const healthStyle = HEALTH_STYLES[health];

  return (
    <div className="space-y-3 px-1 pt-3">
      <div
        className="relative overflow-hidden rounded-2xl border border-border/60 p-5 md:p-6"
        style={{
          background: `linear-gradient(135deg, ${project.color}14 0%, transparent 55%), var(--card)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: project.color }}
        />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className={cn('border-0', statusStyle.className)}>{statusStyle.label}</Badge>
              <Badge className={cn('border-0', healthStyle.className)}>{healthStyle.label}</Badge>
              <Badge className={cn('border-0', PRIORITY_STYLES[project.priority].className)}>
                {PRIORITY_STYLES[project.priority].label}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {client && (
                <Link
                  href={routes.invoicesForClient(client.id)}
                  className="inline-flex items-center gap-1.5 font-medium text-foreground/80 transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <Building2 className="h-4 w-4" />
                  {client.company ?? client.name}
                </Link>
              )}
              {goal && (
                <Link
                  href={routes.goalDetail(goal.id)}
                  className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <Target className="h-4 w-4" />
                  {goal.title}
                </Link>
              )}
              {project.deadline && (
                <span className="inline-flex items-center gap-1.5" suppressHydrationWarning>
                  <Calendar className="h-4 w-4" />
                  {formatDueDate(project.deadline)}
                  {days !== null && days >= 0 && (
                    <span className="text-violet-600 dark:text-violet-400">({days}d left)</span>
                  )}
                  {days !== null && days < 0 && (
                    <span className="font-medium text-red-600 dark:text-red-400">(overdue)</span>
                  )}
                </span>
              )}
              {project.budget != null && (
                <span>Budget · {formatBudget(project.budget, project.currency)}</span>
              )}
            </div>

            {team.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {team.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      title={member.label}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
                      style={{ backgroundColor: member.color ?? project.color }}
                    >
                      {member.label
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                  ))}
                </div>
                {team.length > 5 && (
                  <span className="text-xs text-muted-foreground">+{team.length - 5} more</span>
                )}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <ProgressRing
              value={kanbanStats.completionRate}
              color={project.color}
              size={72}
              strokeWidth={6}
            />
            <div className="flex flex-col gap-2">
              <Link
                href={routes.kanbanForProject(project.id)}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  theme.buttonPrimary,
                )}
              >
                <Kanban className="h-4 w-4" />
                Open board
              </Link>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Status</span>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(s)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all',
                  project.status === s
                    ? STATUS_STYLES[s].className
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted',
                )}
              >
                {STATUS_STYLES[s].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
      </div>
    </div>
  );
}
