export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'archived';

export type ProjectPriority = 'low' | 'medium' | 'high';

export type ProjectHealth = 'on_track' | 'at_risk' | 'behind' | 'completed';

export type ProjectsViewMode = 'grid' | 'list';

export type ProjectsFocusTab = 'active' | 'completed' | 'all';

export type ProjectWorkspaceTab =
  | 'overview'
  | 'tasks'
  | 'documents'
  | 'links'
  | 'operations';

export type ProjectDocumentType =
  | 'prd'
  | 'spec'
  | 'research'
  | 'meeting_notes'
  | 'sop'
  | 'client_doc'
  | 'other';

export type ProjectDocumentStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'archived';

export type ProjectLinkType =
  | 'figma'
  | 'github'
  | 'notion'
  | 'production'
  | 'docs'
  | 'api'
  | 'marketing'
  | 'other';

export type EnvironmentType =
  | 'development'
  | 'qa'
  | 'staging'
  | 'uat'
  | 'production';

export type EnvironmentStatus =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'deprecated';

export type InfrastructureCategory =
  | 'hosting'
  | 'database'
  | 'cdn'
  | 'monitoring'
  | 'ci_cd'
  | 'storage'
  | 'other';

/** An immutable snapshot of a document captured at a point in time. */
export interface ProjectDocumentVersion {
  id: string;
  /** Sequential, human-friendly version number (1, 2, 3…). */
  version: number;
  title: string;
  type: ProjectDocumentType;
  status: ProjectDocumentStatus;
  content?: string;
  /** Optional note describing what changed in this version. */
  label?: string;
  /** How the snapshot was created. */
  origin: 'manual' | 'auto' | 'restore';
  wordCount: number;
  createdAt: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: ProjectDocumentType;
  /** Lifecycle stage. Optional for backward-compat; defaults to "draft". */
  status?: ProjectDocumentStatus;
  content?: string;
  url?: string;
  folderId?: string;
  tags: string[];
  /** Newest-first history of captured versions. Optional for backward-compat. */
  versions?: ProjectDocumentVersion[];
  /** The version number currently reflected by the live content. */
  currentVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  parentId?: string;
}

export interface ProjectLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: ProjectLinkType;
  createdAt: string;
}

export interface EnvironmentUrl {
  label: string;
  url: string;
}

export interface EnvironmentCredential {
  id: string;
  label: string;
  value: string;
  role?: string;
  username?: string;
  note?: string;
  createdAt: string;
}

export interface ProjectEnvironment {
  id: string;
  name: string;
  type: EnvironmentType;
  status: EnvironmentStatus;
  note?: string;
  urls: EnvironmentUrl[];
  credentials: EnvironmentCredential[];
  createdAt: string;
  updatedAt: string;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  provider?: string;
  category: InfrastructureCategory;
  note?: string;
  url?: string;
  credentials: EnvironmentCredential[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  goalId?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  color: string;
  budget?: number;
  currency?: string;
  startDate: string;
  deadline?: string;
  completedAt?: string;
  teamMemberIds: string[];
  tags: string[];
  documents: ProjectDocument[];
  folders: ProjectFolder[];
  links: ProjectLink[];
  environments: ProjectEnvironment[];
  infrastructure: InfrastructureItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsFilterState {
  status: ProjectStatus | 'all';
  priority: ProjectPriority | 'all';
  search: string;
}

export const DEFAULT_FILTERS: ProjectsFilterState = {
  status: 'all',
  priority: 'all',
  search: '',
};

export interface CreateProjectPayload {
  name: string;
  description?: string;
  clientId?: string;
  goalId?: string;
  priority: ProjectPriority;
  color: string;
  budget?: number;
  currency?: string;
  deadline?: string;
  teamMemberIds?: string[];
  tags?: string[];
}

export interface ProjectsModuleProps {
  storageKey?: string;
  initialProjects?: Project[];
  adapter?: import('./adapters/types').ProjectsStorageAdapter;
  onProjectsChange?: (projects: Project[]) => void;
  className?: string;
}

/** Minimal client shape for display — host app maps from Invoices or CRM. */
export interface ProjectClientRef {
  id: string;
  name: string;
  company?: string;
}

/** Minimal goal shape for linking display. */
export interface ProjectGoalRef {
  id: string;
  title: string;
  color?: string;
}

/** Minimal team member for avatars — maps from Kanban assignees. */
export interface ProjectTeamMemberRef {
  id: string;
  label: string;
  subtitle?: string;
  color?: string;
}

export interface ProjectKanbanStats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  completionRate: number;
}
