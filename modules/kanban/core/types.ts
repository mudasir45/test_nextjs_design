export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskActivity {
  id: string;
  text: string;
  createdAt: string;
}

export type TaskEntityType = 'project' | 'goal' | 'milestone';

/** Single workspace entity this task belongs to. */
export interface TaskEntityLink {
  type: TaskEntityType;
  id: string;
}

/** @deprecated — migrated to entityLink + assigneeId */
export interface TaskLinks {
  projectId?: string;
  assigneeId?: string;
  goalId?: string;
  milestoneId?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignee?: {
    name: string;
    avatar: string;
  };
  assigneeId?: string;
  tags?: string[];
  dueDate?: string;
  attachments?: number;
  /** @deprecated use activity.length — kept for legacy cards */
  comments?: number;
  activity?: TaskActivity[];
  createdAt?: string;
  updatedAt?: string;
  /** One linked entity: project OR goal OR milestone */
  entityLink?: TaskEntityLink;
  /** @deprecated — use entityLink + assigneeId */
  links?: TaskLinks;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

export type FilterEntityType = 'project' | 'assignee' | 'goal' | 'milestone';

export interface KanbanEntity {
  id: string;
  label: string;
  color?: string;
  /** Parent goal id — used to scope milestone options. */
  goalId?: string;
  subtitle?: string;
}

export interface KanbanEntities {
  projects: KanbanEntity[];
  assignees: KanbanEntity[];
  goals: KanbanEntity[];
  milestones: KanbanEntity[];
}

/** What the board is currently focused on — navigation, not multi-filter. */
export type BoardScope =
  | { view: 'all' }
  | { view: 'project'; projectId: string }
  | { view: 'goal'; goalId: string; milestoneId?: string };

export interface BoardScopeState {
  scope: BoardScope;
  /** Optional secondary filter — person, not entity link */
  assigneeId: string | null;
}

/** @deprecated — migrated to BoardScopeState */
export interface KanbanFilters {
  projectId: string | null;
  assigneeId: string | null;
  goalId: string | null;
  milestoneId: string | null;
}

export const EMPTY_FILTERS: KanbanFilters = {
  projectId: null,
  assigneeId: null,
  goalId: null,
  milestoneId: null,
};

export interface KanbanBoardProps {
  storageKey?: string;
  initialColumns?: Column[];
  entities?: KanbanEntities;
  /** Override persistence — defaults to localStorage via provider or built-in adapter. */
  adapter?: import('./adapters/types').KanbanStorageAdapter;
  onColumnsChange?: (columns: Column[]) => void;
  onScopeChange?: (state: BoardScopeState) => void;
  /** @deprecated use onScopeChange */
  onFiltersChange?: (filters: KanbanFilters) => void;
  enableLogging?: boolean;
  className?: string;
}
