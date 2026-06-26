'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useIsClient } from '@/lib/use-is-client';
import { useProjects } from '@/modules/projects/core/hooks/use-projects';
import { useProjectKanbanStats } from '@/modules/projects/core/hooks/use-project-kanban-stats';
import { useProjectWorkspace } from '@/modules/projects/core/hooks/use-project-workspace';
import { useWorkspaceTab } from '@/modules/projects/core/hooks/use-workspace-tab';
import type {
  CreateProjectPayload,
  ProjectStatus,
  ProjectWorkspaceTab,
} from '@/modules/projects/core/types';
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
import { ProjectWorkspaceHeader } from '@/modules/projects/ui/workspace/project-workspace-header';
import { ProjectWorkspaceBar } from '@/modules/projects/ui/workspace/project-workspace-bar';
import { ProjectWorkspaceTabs } from '@/modules/projects/ui/workspace/project-workspace-tabs';
import { OverviewTab } from '@/modules/projects/ui/workspace/tabs/overview-tab';
import { TasksTab } from '@/modules/projects/ui/workspace/tabs/tasks-tab';
import { DocumentsTab } from '@/modules/projects/ui/workspace/tabs/documents-tab';
import { LinksTab } from '@/modules/projects/ui/workspace/tabs/links-tab';
import { OperationsTab } from '@/modules/projects/ui/workspace/tabs/operations-tab';
import { ProjectEditDrawer } from '@/modules/projects/ui/edit/project-edit-drawer';

interface ProjectDetailPageProps {
  projectId: string;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const ctx = useProjectsContextOptional();
  const theme = useProjectsTheme();
  const routes = useProjectsRoutes();
  const { clients, goals, teamMembers } = useProjectsRefs();
  const { activeTab, setActiveTab } = useWorkspaceTab(projectId);
  const [editOpen, setEditOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll-linked collapsing header. `progress` runs 0 → 1 as you scroll the hero
  // out of view: the rich hero shrinks/fades while the slim bar + tabs dock to the
  // top. Driven directly by scroll position (via rAF) so it tracks the finger/wheel
  // smoothly and re-expands the moment you return to the top boundary.
  // `stickyH` (bar + tabs) sizes full-height tabs (e.g. Documents) to fill the
  // viewport beneath the docked header.
  const heroRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [barH, setBarH] = useState(45);
  const [heroH, setHeroH] = useState(280);
  const [stickyH, setStickyH] = useState(101);

  useEffect(() => {
    const measure = () => {
      const b = barRef.current?.offsetHeight ?? 45;
      const t = tabsRef.current?.offsetHeight ?? 56;
      const h = heroRef.current?.offsetHeight ?? 280;
      setBarH(b);
      setHeroH(h);
      setStickyH(b + t);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTab]);

  useEffect(() => {
    let frame = 0;
    // Collapse over the hero's own height so the fade completes exactly as the
    // tabs reach the docked bar — no abrupt jump, no dead zone.
    const distance = Math.max(1, heroH - barH);
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const p = Math.min(1, Math.max(0, window.scrollY / distance));
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [barH, heroH, activeTab]);

  const adapter = useMemo(
    () => ctx?.adapter ?? createDefaultLocalStorageAdapter(ctx?.storageKey ?? DEFAULT_STORAGE_KEY),
    [ctx?.adapter, ctx?.storageKey],
  );
  const seedProjects = ctx?.initialProjects ?? DEFAULT_PROJECTS;

  const { projects, hydrated, updateProject, deleteProject } = useProjects({
    storageKey: ctx?.storageKey ?? DEFAULT_STORAGE_KEY,
    initialProjects: seedProjects,
    adapter,
  });

  const project = projects.find((p) => p.id === projectId) ?? null;
  const kanbanStats = useProjectKanbanStats(projectId);
  const workspaceActions = useProjectWorkspace(project, updateProject);

  const client = project?.clientId
    ? clients.find((c) => c.id === project.clientId)
    : undefined;
  const goal = project?.goalId ? goals.find((g) => g.id === project.goalId) : undefined;
  const team = teamMembers.filter((m) => project?.teamMemberIds.includes(m.id));

  const handleStatusChange = useCallback(
    (status: ProjectStatus) => {
      updateProject(projectId, { status });
      ctx?.callbacks.onProjectUpdate?.(projectId, { status });
    },
    [projectId, updateProject, ctx],
  );

  const handleEditSave = useCallback(
    (payload: CreateProjectPayload) => {
      updateProject(projectId, payload);
      ctx?.callbacks.onProjectUpdate?.(projectId, payload);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setSavedToast(true);
      toastTimer.current = setTimeout(() => setSavedToast(false), 2400);
    },
    [projectId, updateProject, ctx],
  );

  const handleDelete = useCallback(() => {
    deleteProject(projectId);
    ctx?.callbacks.onProjectDelete?.(projectId);
    router.push(routes.index);
  }, [deleteProject, projectId, ctx, router, routes]);

  const handleNavigateTab = useCallback(
    (tab: ProjectWorkspaceTab) => setActiveTab(tab),
    [setActiveTab],
  );

  const isReady = isClient && hydrated;

  if (!isReady) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-muted-foreground">This project could not be found.</p>
        <Link
          href={routes.index}
          className="mt-4 inline-flex text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  const tabCounts = {
    documents: project.documents.length,
    links: project.links.length,
    operations: project.environments.length + project.infrastructure.length,
  };

  const isDocuments = activeTab === 'documents';

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Slim bar — always pinned; reveals project context as the hero collapses. */}
      <div
        ref={barRef}
        className="sticky top-0 z-30 border-b px-1 backdrop-blur supports-backdrop-filter:bg-background/75"
        style={{
          borderColor: `color-mix(in srgb, var(--border) ${40 + progress * 60}%, transparent)`,
          backgroundColor: `color-mix(in srgb, var(--background) ${75 + progress * 20}%, transparent)`,
          boxShadow:
            progress > 0.01
              ? `0 ${6 * progress}px ${20 * progress}px -14px rgba(0,0,0,${0.25 * progress})`
              : undefined,
        }}
      >
        <ProjectWorkspaceBar
          project={project}
          completionRate={kanbanStats.completionRate}
          progress={progress}
          onEdit={() => setEditOpen(true)}
        />
      </div>

      {/* Rich hero — shrinks and fades into the bar as you scroll (scroll-linked). */}
      <div
        ref={heroRef}
        style={{
          opacity: Math.max(0, 1 - progress * 1.15),
          transform: `translateY(${progress * -14}px) scale(${1 - progress * 0.04})`,
          transformOrigin: 'top center',
          pointerEvents: progress > 0.9 ? 'none' : undefined,
          willChange: 'transform, opacity',
        }}
      >
        <ProjectWorkspaceHeader
          project={project}
          kanbanStats={kanbanStats}
          client={client}
          goal={goal}
          team={team}
          onStatusChange={handleStatusChange}
          onEdit={() => setEditOpen(true)}
          onDelete={handleDelete}
        />
      </div>

      {/* Tabs — pin directly beneath the slim bar. */}
      <div
        ref={tabsRef}
        className="sticky z-20 bg-background"
        style={{ top: barH }}
      >
        <ProjectWorkspaceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor={project.color}
          counts={tabCounts}
        />
      </div>

      <div
        className={cn('px-1', isDocuments ? 'pb-3 pt-3' : 'pb-16 pt-6')}
        role="tabpanel"
        style={
          isDocuments
            ? { height: `calc(100dvh - ${stickyH}px)`, minHeight: '24rem' }
            : undefined
        }
      >
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            kanbanStats={kanbanStats}
            client={client}
            goal={goal}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {activeTab === 'tasks' && <TasksTab project={project} kanbanStats={kanbanStats} />}
        {activeTab === 'documents' && (
          <div className="flex h-full min-h-0 flex-col">
            <DocumentsTab project={project} actions={workspaceActions} />
          </div>
        )}
        {activeTab === 'links' && <LinksTab project={project} actions={workspaceActions} />}
        {activeTab === 'operations' && (
          <OperationsTab project={project} actions={workspaceActions} />
        )}
      </div>

      <ProjectEditDrawer
        open={editOpen}
        project={project}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />

      {savedToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-lg">
            <Check className="h-4 w-4 text-emerald-500" />
            Project updated
          </div>
        </div>
      )}
    </div>
  );
}
