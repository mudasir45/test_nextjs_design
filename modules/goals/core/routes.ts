/** Route helpers — override in GoalsProvider for your app’s URL structure. */
export interface GoalsRoutes {
  /** Goals list page */
  index: string;
  /** Single goal detail page */
  detail: (goalId: string) => string;
  /** Task board scoped to a goal (optional) */
  kanbanForGoal?: (goalId: string) => string;
}

export const DEFAULT_GOALS_ROUTES: GoalsRoutes = {
  index: '/goals',
  detail: (goalId) => `/goals/${goalId}`,
  kanbanForGoal: (goalId) => `/kanban?scope=goal&goalId=${goalId}`,
};
