import type {
  EnvironmentCredential,
  InfrastructureItem,
  Project,
  ProjectDocument,
  ProjectEnvironment,
  ProjectHealth,
  ProjectKanbanStats,
  ProjectLink,
  ProjectsFilterState,
} from './types';
import { PRIORITY_STYLES, STATUS_STYLES } from '../theme/projects-theme';
import {
  normalizeDocumentType,
  normalizeEnvironmentStatus,
  normalizeEnvironmentType,
  normalizeInfrastructureCategory,
  normalizeLinkType,
} from './workspace-utils';

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  archived: 'Archived',
};

export function getStatusLabel(status: Project['status']): string {
  return STATUS_LABELS[status] ?? status;
}

function normalizeCredential(cred: EnvironmentCredential): EnvironmentCredential {
  return {
    ...cred,
    label: cred.label ?? 'Credential',
    value: cred.value ?? '',
    createdAt: cred.createdAt ?? new Date().toISOString(),
  };
}

function normalizeProjectDocument(doc: ProjectDocument): ProjectDocument {
  return {
    ...doc,
    type: normalizeDocumentType(doc.type),
    tags: doc.tags ?? [],
    createdAt: doc.createdAt ?? new Date().toISOString(),
    updatedAt: doc.updatedAt ?? doc.createdAt ?? new Date().toISOString(),
  };
}

function normalizeProjectLink(link: ProjectLink): ProjectLink {
  return {
    ...link,
    type: normalizeLinkType(link.type, link.url),
    createdAt: link.createdAt ?? new Date().toISOString(),
  };
}

function normalizeProjectEnvironment(env: ProjectEnvironment): ProjectEnvironment {
  return {
    ...env,
    type: normalizeEnvironmentType(env.type),
    status: normalizeEnvironmentStatus(env.status),
    urls: env.urls ?? [],
    credentials: (env.credentials ?? []).map(normalizeCredential),
    createdAt: env.createdAt ?? new Date().toISOString(),
    updatedAt: env.updatedAt ?? env.createdAt ?? new Date().toISOString(),
  };
}

function normalizeInfrastructureItem(item: InfrastructureItem): InfrastructureItem {
  return {
    ...item,
    category: normalizeInfrastructureCategory(item.category),
    credentials: (item.credentials ?? []).map(normalizeCredential),
  };
}

function isWorkspaceEmpty(project: Project): boolean {
  return (
    (project.documents?.length ?? 0) === 0 &&
    (project.links?.length ?? 0) === 0 &&
    (project.environments?.length ?? 0) === 0 &&
    (project.infrastructure?.length ?? 0) === 0
  );
}

/** Merge stored projects with demo seed workspace data when localStorage is missing it. */
export function mergeProjectsWithSeed(stored: Project[], seed: Project[]): Project[] {
  const seedById = new Map(seed.map((p) => [p.id, p]));
  const storedIds = new Set(stored.map((p) => p.id));

  const merged = stored.map((project) => {
    const seedProject = seedById.get(project.id);
    if (!seedProject || !isWorkspaceEmpty(project)) {
      return normalizeProject(project);
    }
    return normalizeProject({
      ...project,
      folders: seedProject.folders,
      documents: seedProject.documents,
      links: seedProject.links,
      environments: seedProject.environments,
      infrastructure: seedProject.infrastructure,
    });
  });

  for (const seedProject of seed) {
    if (!storedIds.has(seedProject.id)) {
      merged.push(normalizeProject(seedProject));
    }
  }

  return merged;
}

export function normalizeProject(project: Project): Project {
  const priority =
    project.priority && PRIORITY_STYLES[project.priority]
      ? project.priority
      : 'medium';
  const status =
    project.status && STATUS_STYLES[project.status] ? project.status : 'active';

  return {
    ...project,
    status,
    priority,
    teamMemberIds: project.teamMemberIds ?? [],
    tags: project.tags ?? [],
    documents: (project.documents ?? []).map(normalizeProjectDocument),
    folders: project.folders ?? [],
    links: (project.links ?? []).map(normalizeProjectLink),
    environments: (project.environments ?? []).map(normalizeProjectEnvironment),
    infrastructure: (project.infrastructure ?? []).map(normalizeInfrastructureItem),
    color: project.color ?? '#7C3AED',
  };
}

export function filterProjects(
  projects: Project[],
  filters: ProjectsFilterState,
): Project[] {
  return projects.filter((project) => {
    if (filters.status !== 'all' && project.status !== filters.status) return false;
    if (filters.priority !== 'all' && project.priority !== filters.priority) return false;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const haystack = [project.name, project.description, ...(project.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDueDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function computeProjectHealth(
  project: Project,
  kanbanStats?: ProjectKanbanStats,
): ProjectHealth {
  if (project.status === 'completed' || project.status === 'archived') {
    return 'completed';
  }

  const days = daysUntil(project.deadline);
  const rate = kanbanStats?.completionRate ?? 0;

  if (days !== null && days < 0) return 'behind';
  if (days !== null && days <= 7 && rate < 70) return 'at_risk';
  if (days !== null && days <= 14 && rate < 40) return 'at_risk';
  if (kanbanStats && kanbanStats.total > 0 && rate < 25 && days !== null && days <= 21) {
    return 'at_risk';
  }

  return 'on_track';
}

export interface ProjectsSummary {
  active: number;
  planning: number;
  onHold: number;
  atRisk: number;
  completedThisMonth: number;
}

export function getProjectsSummary(
  projects: Project[],
  healthById: Record<string, ProjectHealth>,
): ProjectsSummary {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    active: projects.filter((p) => p.status === 'active').length,
    planning: projects.filter((p) => p.status === 'planning').length,
    onHold: projects.filter((p) => p.status === 'on_hold').length,
    atRisk: projects.filter(
      (p) =>
        (p.status === 'active' || p.status === 'planning') &&
        healthById[p.id] === 'at_risk',
    ).length,
    completedThisMonth: projects.filter((p) => {
      if (p.status !== 'completed' || !p.completedAt) return false;
      return new Date(p.completedAt) >= monthStart;
    }).length,
  };
}

export function formatBudget(amount?: number, currency = 'USD'): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
