'use client';

import { useState } from 'react';
import { cn } from '@/modules/projects/core/cn';
import type { Project } from '@/modules/projects/core/types';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';
import { EnvironmentList } from '@/modules/projects/ui/operations/environments/environment-list';
import { AddEnvironmentDrawer } from '@/modules/projects/ui/operations/environments/add-environment-drawer';
import { InfrastructurePanel } from '@/modules/projects/ui/operations/infrastructure/infrastructure-panel';

interface OperationsTabProps {
  project: Project;
  actions: ProjectWorkspaceActions;
}

type OpsSection = 'environments' | 'infrastructure';

export function OperationsTab({ project, actions }: OperationsTabProps) {
  const [section, setSection] = useState<OpsSection>('environments');
  const [addEnvOpen, setAddEnvOpen] = useState(false);

  return (
    <div className="space-y-6 py-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Operations center</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Environments, URLs, credentials, and infrastructure — your single source of truth.
        </p>
      </div>

      <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-1">
        {(
          [
            { id: 'environments' as const, label: 'Environments', count: project.environments.length },
            {
              id: 'infrastructure' as const,
              label: 'Infrastructure',
              count: project.infrastructure.length,
            },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={cn(
              'cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all',
              section === item.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
            {item.count > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">({item.count})</span>
            )}
          </button>
        ))}
      </div>

      {section === 'environments' ? (
        <EnvironmentList
          project={project}
          actions={actions}
          onAddEnvironment={() => setAddEnvOpen(true)}
        />
      ) : (
        <InfrastructurePanel project={project} actions={actions} />
      )}

      <AddEnvironmentDrawer
        open={addEnvOpen}
        accentColor={project.color}
        onClose={() => setAddEnvOpen(false)}
        onAdd={actions.addEnvironment}
      />
    </div>
  );
}
