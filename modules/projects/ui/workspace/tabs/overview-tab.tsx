'use client';

import Link from 'next/link';
import {
  FileText,
  Kanban,
  Link2,
  Receipt,
  Server,
  Target,
} from 'lucide-react';
import type {
  Project,
  ProjectClientRef,
  ProjectGoalRef,
  ProjectKanbanStats,
  ProjectWorkspaceTab,
} from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import {
  formatRelativeDate,
  getDocumentTypeMeta,
  getLinkTypeMeta,
} from '@/modules/projects/core/workspace-utils';
import { useProjectsRoutes, useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';
import { ProjectStatsPanel } from '@/modules/projects/ui/detail/project-stats-panel';

interface OverviewTabProps {
  project: Project;
  kanbanStats: ProjectKanbanStats;
  client?: ProjectClientRef;
  goal?: ProjectGoalRef;
  onNavigateTab: (tab: ProjectWorkspaceTab) => void;
}

export function OverviewTab({
  project,
  kanbanStats,
  client,
  goal,
  onNavigateTab,
}: OverviewTabProps) {
  const routes = useProjectsRoutes();
  const theme = useProjectsTheme();

  const recentDocs = [...project.documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
  const recentLinks = [...project.links]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const quickActions = [
    {
      label: 'Open Kanban',
      href: routes.kanbanForProject(project.id),
      icon: Kanban,
    },
    ...(goal
      ? [{ label: 'View Goal', href: routes.goalDetail(goal.id), icon: Target }]
      : []),
    ...(client
      ? [{ label: 'Client Invoices', href: routes.invoicesForClient(client.id), icon: Receipt }]
      : []),
    {
      label: 'Operations',
      onClick: () => onNavigateTab('operations'),
      icon: Server,
    },
  ];

  return (
    <div className="space-y-8 py-6">
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Task progress
        </h2>
        <ProjectStatsPanel stats={kanbanStats} color={project.color} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Documents', value: project.documents.length, tab: 'documents' as const },
          { label: 'Links', value: project.links.length, tab: 'links' as const },
          { label: 'Environments', value: project.environments.length, tab: 'operations' as const },
          {
            label: 'Infrastructure',
            value: project.infrastructure.length,
            tab: 'operations' as const,
          },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigateTab(item.tab)}
            className="cursor-pointer rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:border-border hover:shadow-sm"
          >
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{item.label}</p>
          </button>
        ))}
      </section>

      {goal && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Linked goal
          </h2>
          <Link
            href={routes.goalDetail(goal.id)}
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-sm"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${goal.color ?? project.color}20` }}
            >
              <Target className="h-5 w-5" style={{ color: goal.color ?? project.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{goal.title}</p>
              <p className="text-xs text-muted-foreground">View goal details and milestones</p>
            </div>
          </Link>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const className = cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted/50',
            );
            if ('href' in action && action.href) {
              return (
                <Link key={action.label} href={action.href} className={className}>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </Link>
              );
            }
            return (
              <button
                key={action.label}
                type="button"
                onClick={'onClick' in action ? action.onClick : undefined}
                className={className}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {action.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Recent documents
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('documents')}
              className={cn('cursor-pointer text-xs font-medium', theme.accentText)}
            >
              View all
            </button>
          </div>
          {recentDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents yet.</p>
          ) : (
            <div className="space-y-2">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-3 py-2.5"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {getDocumentTypeMeta(doc.type).label} · {formatRelativeDate(doc.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Recent links
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('links')}
              className={cn('cursor-pointer text-xs font-medium', theme.accentText)}
            >
              View all
            </button>
          </div>
          {recentLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet.</p>
          ) : (
            <div className="space-y-2">
              {recentLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-3 py-2.5 transition-colors hover:bg-muted/30"
                >
                  <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{link.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {getLinkTypeMeta(link.type).label}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
