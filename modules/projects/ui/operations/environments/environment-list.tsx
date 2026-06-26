'use client';

import { useMemo } from 'react';
import { Plus, Server } from 'lucide-react';
import type { Project } from '@/modules/projects/core/types';
import { ENVIRONMENT_TYPE_ORDER } from '@/modules/projects/core/workspace-utils';
import { EmptyState } from '@/modules/projects/ui/shared/empty-state';
import { EnvironmentCard } from '@/modules/projects/ui/operations/environments/environment-card';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';

interface EnvironmentListProps {
  project: Project;
  actions: ProjectWorkspaceActions;
  onAddEnvironment: () => void;
}

export function EnvironmentList({ project, actions, onAddEnvironment }: EnvironmentListProps) {
  const sorted = useMemo(
    () =>
      [...project.environments].sort(
        (a, b) =>
          ENVIRONMENT_TYPE_ORDER.indexOf(a.type) - ENVIRONMENT_TYPE_ORDER.indexOf(b.type),
      ),
    [project.environments],
  );

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No environments yet"
        description="Add development, staging, and production environments with URLs and credentials — your single source of truth for ops."
        action={
          <button
            type="button"
            onClick={onAddEnvironment}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            Add environment
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sorted.length} environment{sorted.length !== 1 ? 's' : ''} · click to expand
        </p>
        <button
          type="button"
          onClick={onAddEnvironment}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Add environment
        </button>
      </div>
      <div className="space-y-3">
        {sorted.map((env, i) => (
          <EnvironmentCard
            key={env.id}
            environment={env}
            defaultExpanded={i === 0}
            actions={actions}
          />
        ))}
      </div>
    </div>
  );
}
