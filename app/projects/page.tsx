'use client';

import {
  DEFAULT_PROJECTS,
  ProjectsModule,
  ProjectsProvider,
} from '@/modules/projects';
import { DEFAULT_CLIENTS } from '@/modules/invoices/demo/default-clients';
import { DEFAULT_GOALS } from '@/modules/goals/demo/default-goals';
import { DEFAULT_ENTITIES } from '@/modules/kanban/demo/default-entities';

export default function ProjectsPage() {
  const clients = DEFAULT_CLIENTS.map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
  }));

  const goals = DEFAULT_GOALS.map((g) => ({
    id: g.id,
    title: g.title,
    color: g.color,
  }));

  const teamMembers = DEFAULT_ENTITIES.assignees.map((a) => ({
    id: a.id,
    label: a.label,
    subtitle: a.subtitle,
    color: a.color,
  }));

  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background px-4 py-5 md:px-6 lg:px-8">
      <ProjectsProvider
        initialProjects={DEFAULT_PROJECTS}
        clients={clients}
        goals={goals}
        teamMembers={teamMembers}
      >
        <ProjectsModule />
      </ProjectsProvider>
    </main>
  );
}
