'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsClient } from '@/lib/use-is-client';
import { useProjects } from '@/modules/projects/core/hooks/use-projects';
import { useAllProjectKanbanStats } from '@/modules/projects/core/hooks/use-project-kanban-stats';
import {
  computeProjectHealth,
  getProjectsSummary,
} from '@/modules/projects/core/project-utils';
import type { Project, ProjectsModuleProps, ProjectsFocusTab, ProjectsViewMode } from '@/modules/projects/core/types';
import { DEFAULT_FILTERS } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import {
  useProjectsContextOptional,
  useProjectsRoutes,
  useProjectsTheme,
  useProjectsRefs,
} from '@/modules/projects/provider/ProjectsProvider';
import { DEFAULT_PROJECTS } from '@/modules/projects/demo/default-projects';
import {
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
} from '@/modules/projects/core/adapters';
import { ProjectCreateDrawer } from '@/modules/projects/ui/create/project-create-drawer';
import { ProjectsToolbar } from '@/modules/projects/ui/board/projects-toolbar';
import { ProjectsSummaryCards } from '@/modules/projects/ui/board/projects-summary-cards';
import { ProjectsBoard } from '@/modules/projects/ui/board/projects-board';

export function ProjectsModule({
  storageKey = DEFAULT_STORAGE_KEY,
  initialProjects = DEFAULT_PROJECTS,
  adapter: adapterProp,
  onProjectsChange,
  className,
}: ProjectsModuleProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const ctx = useProjectsContextOptional();
  const theme = useProjectsTheme();
  const routes = useProjectsRoutes();
  const { clients } = useProjectsRefs();

  const adapter =
    adapterProp ?? ctx?.adapter ?? createDefaultLocalStorageAdapter(storageKey);
  const seedProjects = ctx?.initialProjects ?? initialProjects;
  const projectsChangeCb = onProjectsChange ?? ctx?.callbacks.onProjectsChange;

  const {
    projects,
    filteredProjects,
    filters,
    setFilters,
    hydrated,
    createProject,
  } = useProjects({
    storageKey: ctx?.storageKey ?? storageKey,
    initialProjects: seedProjects,
    adapter,
    onProjectsChange: projectsChangeCb,
  });

  const [focusTab, setFocusTab] = useState<ProjectsFocusTab>('active');
  const [viewMode, setViewMode] = useState<ProjectsViewMode>('grid');
  const [createOpen, setCreateOpen] = useState(false);

  const projectIds = useMemo(() => projects.map((p) => p.id), [projects]);
  const kanbanStatsById = useAllProjectKanbanStats(projectIds);

  const clientsById = useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c])),
    [clients],
  );

  const healthById = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeProjectHealth>> = {};
    for (const p of projects) {
      map[p.id] = computeProjectHealth(p, kanbanStatsById[p.id]);
    }
    return map;
  }, [projects, kanbanStatsById]);

  const summary = useMemo(
    () => getProjectsSummary(projects, healthById),
    [projects, healthById],
  );

  const displayProjects = useMemo(() => {
    let list = filteredProjects;
    if (focusTab === 'active') {
      list = list.filter(
        (p) => p.status === 'active' || p.status === 'planning' || p.status === 'on_hold',
      );
    } else if (focusTab === 'completed') {
      list = list.filter((p) => p.status === 'completed' || p.status === 'archived');
    }
    return [...list].sort((a, b) => {
      const aStats = kanbanStatsById[a.id]?.completionRate ?? 0;
      const bStats = kanbanStatsById[b.id]?.completionRate ?? 0;
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return bStats - aStats;
    });
  }, [filteredProjects, focusTab, kanbanStatsById]);

  const activeCount = projects.filter(
    (p) => p.status === 'active' || p.status === 'planning' || p.status === 'on_hold',
  ).length;

  const handleProjectClick = useCallback(
    (project: Project) => {
      router.push(routes.detail(project.id));
    },
    [router, routes],
  );

  const handleCreate = useCallback(
    (payload: Parameters<typeof createProject>[0]) => {
      const project = createProject(payload);
      ctx?.callbacks.onProjectCreate?.(project);
      setCreateOpen(false);
      router.push(routes.detail(project.id));
    },
    [createProject, ctx, router, routes],
  );

  const handleTabChange = useCallback(
    (tab: ProjectsFocusTab) => {
      setFocusTab(tab);
      setFilters({ ...DEFAULT_FILTERS, search: filters.search });
    },
    [filters.search, setFilters],
  );

  if (!isClient || !hydrated) {
    return (
      <div className={cn('flex flex-1 items-center justify-center', className)}>
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  const isEmpty = projects.length === 0;
  const noResults = !isEmpty && displayProjects.length === 0;

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-5', className)}>
      <ProjectsToolbar
        activeCount={activeCount}
        tab={focusTab}
        onTabChange={handleTabChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
        onCreateClick={() => setCreateOpen(true)}
      />

      {!isEmpty && <ProjectsSummaryCards summary={summary} />}

      {noResults ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No projects here. Try another tab or adjust your search.
          </p>
        </div>
      ) : (
        <ProjectsBoard
          projects={displayProjects}
          viewMode={viewMode}
          kanbanStatsById={kanbanStatsById}
          clientsById={clientsById}
          onProjectClick={handleProjectClick}
          onCreateClick={() => setCreateOpen(true)}
          empty={isEmpty}
        />
      )}

      <ProjectCreateDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default ProjectsModule;
