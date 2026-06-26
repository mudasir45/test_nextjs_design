export interface ProjectsRoutes {
  index: string;
  detail: (projectId: string) => string;
  kanbanForProject: (projectId: string) => string;
  invoicesForClient: (clientId: string) => string;
  goalDetail: (goalId: string) => string;
}

export const DEFAULT_PROJECTS_ROUTES: ProjectsRoutes = {
  index: '/projects',
  detail: (projectId) => `/projects/${projectId}`,
  kanbanForProject: (projectId) => `/kanban?scope=project&projectId=${projectId}`,
  invoicesForClient: (clientId) => `/invoices?client=${clientId}`,
  goalDetail: (goalId) => `/goals/${goalId}`,
};
