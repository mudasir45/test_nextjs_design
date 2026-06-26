import type {
  EnvironmentStatus,
  EnvironmentType,
  InfrastructureCategory,
  ProjectDocument,
  ProjectDocumentStatus,
  ProjectDocumentType,
  ProjectLinkType,
  ProjectWorkspaceTab,
} from './types';

export const WORKSPACE_TABS: {
  id: ProjectWorkspaceTab;
  label: string;
}[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'documents', label: 'Documents' },
  { id: 'links', label: 'Links' },
  { id: 'operations', label: 'Operations' },
];

export const DOCUMENT_TYPE_META: Record<
  ProjectDocumentType,
  { label: string; className: string }
> = {
  prd: { label: 'PRD', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400' },
  spec: { label: 'Spec', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  research: { label: 'Research', className: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' },
  meeting_notes: {
    label: 'Meeting Notes',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  sop: { label: 'SOP', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  client_doc: {
    label: 'Client Doc',
    className: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  },
  other: { label: 'Other', className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
};

export const DOCUMENT_STATUS_ORDER: ProjectDocumentStatus[] = [
  'draft',
  'in_review',
  'approved',
  'archived',
];

export const DOCUMENT_STATUS_META: Record<
  ProjectDocumentStatus,
  { label: string; className: string; dotClass: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300',
    dotClass: 'bg-zinc-400',
  },
  in_review: {
    label: 'In review',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    dotClass: 'bg-amber-500',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
  },
  archived: {
    label: 'Archived',
    className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    dotClass: 'bg-slate-400',
  },
};

export function getDocumentStatusMeta(status?: string) {
  if (status && status in DOCUMENT_STATUS_META) {
    return DOCUMENT_STATUS_META[status as ProjectDocumentStatus];
  }
  return DOCUMENT_STATUS_META.draft;
}

/** Fills in defaults for documents loaded from older/persisted data. */
export function normalizeDocument(doc: ProjectDocument): ProjectDocument {
  return {
    ...doc,
    status: doc.status ?? 'draft',
    tags: doc.tags ?? [],
    versions: doc.versions ?? [],
    currentVersion: doc.currentVersion ?? (doc.versions?.length ? doc.versions[0].version : 1),
  };
}

export const LINK_TYPE_META: Record<
  ProjectLinkType,
  { label: string; className: string; accent: string }
> = {
  figma: {
    label: 'Figma',
    className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    accent: '#A855F7',
  },
  github: {
    label: 'GitHub',
    className: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
    accent: '#18181B',
  },
  notion: {
    label: 'Notion',
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    accent: '#EA580C',
  },
  production: {
    label: 'Production',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    accent: '#16A34A',
  },
  docs: {
    label: 'Docs',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    accent: '#2563EB',
  },
  api: {
    label: 'API',
    className: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
    accent: '#0891B2',
  },
  marketing: {
    label: 'Marketing',
    className: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    accent: '#DB2777',
  },
  other: {
    label: 'Link',
    className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
    accent: '#71717A',
  },
};

export const ENVIRONMENT_TYPE_ORDER: EnvironmentType[] = [
  'development',
  'qa',
  'staging',
  'uat',
  'production',
];

export const ENVIRONMENT_TYPE_META: Record<
  EnvironmentType,
  { label: string; className: string; dotClass: string }
> = {
  development: {
    label: 'Development',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  qa: {
    label: 'QA',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    dotClass: 'bg-amber-500',
  },
  staging: {
    label: 'Staging',
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    dotClass: 'bg-violet-500',
  },
  uat: {
    label: 'UAT',
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    dotClass: 'bg-orange-500',
  },
  production: {
    label: 'Production',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
  },
};

export const ENVIRONMENT_STATUS_META: Record<
  string,
  { label: string; className: string }
> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  inactive: { label: 'Inactive', className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  deprecated: { label: 'Deprecated', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
};

export const INFRASTRUCTURE_CATEGORY_META: Record<
  InfrastructureCategory,
  { label: string; className: string }
> = {
  hosting: { label: 'Hosting', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400' },
  database: { label: 'Database', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  cdn: { label: 'CDN', className: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' },
  monitoring: {
    label: 'Monitoring',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  ci_cd: { label: 'CI/CD', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  storage: { label: 'Storage', className: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' },
  other: { label: 'Other', className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
};

export const CREDENTIAL_ROLE_META: Record<string, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
  developer: { label: 'Developer', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  dev: { label: 'Dev', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  qa: { label: 'QA', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  viewer: { label: 'Viewer', className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
  api: { label: 'API', className: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' },
};

export const MASKED_VALUE = '••••••••••••';
export const HIDDEN_VALUE = '__HIDDEN__';

export function getCredentialRoleMeta(role?: string) {
  if (!role) return { label: 'General', className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' };
  const key = role.toLowerCase();
  return CREDENTIAL_ROLE_META[key] ?? {
    label: role,
    className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  };
}

export function detectLinkType(url: string): ProjectLinkType {
  const lower = url.toLowerCase();
  if (lower.includes('figma.com')) return 'figma';
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('notion.so') || lower.includes('notion.site')) return 'notion';
  if (lower.includes('swagger') || lower.includes('api.')) return 'api';
  if (lower.includes('docs.')) return 'docs';
  return 'other';
}

export function getLinkTypeMeta(type?: string) {
  if (type && type in LINK_TYPE_META) {
    return LINK_TYPE_META[type as ProjectLinkType];
  }
  return LINK_TYPE_META.other;
}

export function getDocumentTypeMeta(type?: string) {
  if (type && type in DOCUMENT_TYPE_META) {
    return DOCUMENT_TYPE_META[type as ProjectDocumentType];
  }
  return DOCUMENT_TYPE_META.other;
}

export function getEnvironmentTypeMeta(type?: string) {
  if (type && type in ENVIRONMENT_TYPE_META) {
    return ENVIRONMENT_TYPE_META[type as EnvironmentType];
  }
  return ENVIRONMENT_TYPE_META.development;
}

export function getEnvironmentStatusMeta(status?: string) {
  if (status && status in ENVIRONMENT_STATUS_META) {
    return ENVIRONMENT_STATUS_META[status];
  }
  return ENVIRONMENT_STATUS_META.active;
}

export function getInfrastructureCategoryMeta(category?: string) {
  if (category && category in INFRASTRUCTURE_CATEGORY_META) {
    return INFRASTRUCTURE_CATEGORY_META[category as InfrastructureCategory];
  }
  return INFRASTRUCTURE_CATEGORY_META.other;
}

export function normalizeLinkType(type: string | undefined, url?: string): ProjectLinkType {
  if (type && type in LINK_TYPE_META) return type as ProjectLinkType;
  if (url) return detectLinkType(url);
  return 'other';
}

export function normalizeDocumentType(type: string | undefined): ProjectDocumentType {
  if (type && type in DOCUMENT_TYPE_META) return type as ProjectDocumentType;
  return 'other';
}

export function normalizeEnvironmentType(type: string | undefined): EnvironmentType {
  if (type && type in ENVIRONMENT_TYPE_META) return type as EnvironmentType;
  return 'development';
}

export function normalizeEnvironmentStatus(status: string | undefined): EnvironmentStatus {
  if (status && status in ENVIRONMENT_STATUS_META) return status as EnvironmentStatus;
  return 'active';
}

export function normalizeInfrastructureCategory(
  category: string | undefined,
): InfrastructureCategory {
  if (category && category in INFRASTRUCTURE_CATEGORY_META) {
    return category as InfrastructureCategory;
  }
  return 'other';
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function tabStorageKey(projectId: string) {
  return `imergix-projects-v2-tab-${projectId}`;
}

export function isValidWorkspaceTab(tab: string): tab is ProjectWorkspaceTab {
  return WORKSPACE_TABS.some((t) => t.id === tab);
}
