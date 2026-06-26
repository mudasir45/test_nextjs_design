'use client';

import { FolderKanban, Plus } from 'lucide-react';
import type { Project, ProjectClientRef, ProjectKanbanStats } from '@/modules/projects/core/types';
import { ProjectCard } from '@/modules/projects/ui/board/project-card';
import { ProjectListRow } from '@/modules/projects/ui/board/project-list-row';
import type { ProjectsViewMode } from '@/modules/projects/core/types';

interface ProjectsBoardProps {
  projects: Project[];
  viewMode: ProjectsViewMode;
  kanbanStatsById: Record<string, ProjectKanbanStats>;
  clientsById: Record<string, ProjectClientRef>;
  onProjectClick: (project: Project) => void;
  onCreateClick: () => void;
  empty?: boolean;
}

export function ProjectsBoard({
  projects,
  viewMode,
  kanbanStatsById,
  clientsById,
  onProjectClick,
  onCreateClick,
  empty,
}: ProjectsBoardProps) {
  if (empty) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-gradient-to-br from-violet-500/[0.04] via-transparent to-indigo-500/[0.03] px-8 py-24 text-center">
        <div className="rounded-2xl bg-violet-500/10 p-5 text-violet-600 dark:text-violet-400">
          <FolderKanban className="h-12 w-12" />
        </div>
        <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
          No projects yet
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Create a project to organize client work, link tasks on your Kanban board, and track
          delivery from kickoff to launch.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="mt-10 cursor-pointer rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700"
        >
          Create your first project
        </button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-10">
        {projects.map((project) => (
          <ProjectListRow
            key={project.id}
            project={project}
            kanbanStats={kanbanStatsById[project.id] ?? { total: 0, done: 0, inProgress: 0, todo: 0, completionRate: 0 }}
            client={project.clientId ? clientsById[project.clientId] : undefined}
            onClick={onProjectClick}
          />
        ))}
        <button
          type="button"
          onClick={onCreateClick}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 py-6 transition-all hover:border-violet-500/40 hover:bg-violet-500/[0.03]"
        >
          <Plus className="h-4 w-4 text-muted-foreground group-hover:text-violet-600" />
          <span className="text-sm font-medium text-muted-foreground group-hover:text-violet-700 dark:group-hover:text-violet-400">
            Add project
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-10">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            kanbanStats={kanbanStatsById[project.id] ?? { total: 0, done: 0, inProgress: 0, todo: 0, completionRate: 0 }}
            client={project.clientId ? clientsById[project.clientId] : undefined}
            onClick={onProjectClick}
          />
        ))}
        <button
          type="button"
          onClick={onCreateClick}
          className="group flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/70 transition-all hover:border-violet-500/40 hover:bg-violet-500/[0.03]"
        >
          <div className="rounded-full bg-muted/60 p-3 transition-colors group-hover:bg-violet-500/15">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-violet-600" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-violet-700 dark:group-hover:text-violet-400">
            New project
          </span>
        </button>
      </div>
    </div>
  );
}
