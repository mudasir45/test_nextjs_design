import type { Project } from '../core/types';
import { mergeWorkspaceSeed } from './default-workspace-data';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const BASE_PROJECTS: Omit<
  Project,
  'documents' | 'folders' | 'links' | 'environments' | 'infrastructure'
>[] = [
  {
    id: 'proj-brand',
    name: 'Brand Refresh',
    description:
      'Complete visual identity overhaul including logo, color system, typography, and brand guidelines for BullNice B.V.',
    clientId: 'client-001',
    goalId: 'goal-q1-revenue',
    status: 'active',
    priority: 'high',
    color: '#6366F1',
    budget: 24000,
    currency: 'EUR',
    startDate: daysAgo(45),
    deadline: daysFromNow(28),
    teamMemberIds: ['user-sarah', 'user-alex', 'user-maya'],
    tags: ['design', 'branding'],
    createdAt: daysAgo(50),
    updatedAt: daysAgo(2),
  },
  {
    id: 'proj-mobile',
    name: 'Mobile App',
    description:
      'Cross-platform mobile application for client onboarding and project tracking.',
    clientId: 'client-002',
    status: 'active',
    priority: 'high',
    color: '#22C55E',
    budget: 48000,
    currency: 'USD',
    startDate: daysAgo(30),
    deadline: daysFromNow(60),
    teamMemberIds: ['user-jordan', 'user-sarah'],
    tags: ['development', 'mobile'],
    createdAt: daysAgo(35),
    updatedAt: daysAgo(1),
  },
  {
    id: 'proj-api',
    name: 'API Platform',
    description: 'REST and GraphQL API layer with authentication, rate limiting, and documentation.',
    clientId: 'client-003',
    status: 'on_hold',
    priority: 'medium',
    color: '#F97316',
    budget: 32000,
    currency: 'USD',
    startDate: daysAgo(60),
    deadline: daysFromNow(90),
    teamMemberIds: ['user-jordan'],
    tags: ['backend', 'api'],
    createdAt: daysAgo(65),
    updatedAt: daysAgo(14),
  },
  {
    id: 'proj-marketing',
    name: 'Marketing Site',
    description: 'High-converting marketing website with CMS integration and analytics.',
    clientId: 'client-004',
    status: 'active',
    priority: 'medium',
    color: '#EC4899',
    budget: 18000,
    currency: 'USD',
    startDate: daysAgo(20),
    deadline: daysFromNow(14),
    teamMemberIds: ['user-chris', 'user-maya'],
    tags: ['marketing', 'web'],
    createdAt: daysAgo(22),
    updatedAt: daysAgo(3),
  },
  {
    id: 'proj-internal',
    name: 'Studio Operations',
    description: 'Internal tooling for project templates, time tracking, and client onboarding.',
    status: 'planning',
    priority: 'low',
    color: '#7C3AED',
    startDate: daysAgo(5),
    deadline: daysFromNow(120),
    teamMemberIds: ['user-sarah'],
    tags: ['internal'],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(5),
  },
];

export const DEFAULT_PROJECTS: Project[] = BASE_PROJECTS.map((p) =>
  mergeWorkspaceSeed(p as Project),
);

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  archived: 'Archived',
};

/** Export projects in KanbanEntity shape for KanbanProvider integration. */
export function projectsToKanbanEntities(projects: Project[]) {
  return projects
    .filter((p) => p.status !== 'archived')
    .map((p) => ({
      id: p.id,
      label: p.name,
      color: p.color,
      subtitle: STATUS_LABELS[p.status] ?? p.status,
    }));
}
