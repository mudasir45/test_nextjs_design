import type { KanbanEntities } from '../core/types';

export const DEFAULT_ENTITIES: KanbanEntities = {
  projects: [
    { id: 'proj-brand', label: 'Brand Refresh', color: '#6366f1', subtitle: 'Active' },
    { id: 'proj-mobile', label: 'Mobile App', color: '#22c55e', subtitle: 'Active' },
    { id: 'proj-api', label: 'API Platform', color: '#f97316', subtitle: 'On Hold' },
    { id: 'proj-marketing', label: 'Marketing Site', color: '#ec4899', subtitle: 'Active' },
  ],
  assignees: [
    {
      id: 'user-sarah',
      label: 'Sarah Chen',
      subtitle: 'Design Lead',
      color: '#6366f1',
    },
    {
      id: 'user-alex',
      label: 'Alex Rivera',
      subtitle: 'UX Research',
      color: '#8b5cf6',
    },
    {
      id: 'user-jordan',
      label: 'Jordan Kim',
      subtitle: 'Engineering',
      color: '#22c55e',
    },
    {
      id: 'user-maya',
      label: 'Maya Patel',
      subtitle: 'Technical Writer',
      color: '#f97316',
    },
    {
      id: 'user-chris',
      label: 'Chris Wong',
      subtitle: 'Marketing',
      color: '#64748b',
    },
  ],
  goals: [
    {
      id: 'goal-q1-revenue',
      label: 'Q1 Revenue Target',
      subtitle: 'Professional · Quarterly',
      color: '#2563eb',
    },
    {
      id: 'goal-product-launch',
      label: 'Product Launch',
      subtitle: 'Professional · Quarterly',
      color: '#7c3aed',
    },
    {
      id: 'goal-design-system',
      label: 'Design System Maturity',
      subtitle: 'Professional · Monthly',
      color: '#0891b2',
    },
  ],
  milestones: [
    {
      id: 'ms-wireframes',
      label: 'Wireframes approved',
      goalId: 'goal-product-launch',
      subtitle: 'Due Mar 15',
    },
    {
      id: 'ms-beta',
      label: 'Beta release',
      goalId: 'goal-product-launch',
      subtitle: 'Due Apr 30',
    },
    {
      id: 'ms-audit',
      label: 'Component audit complete',
      goalId: 'goal-design-system',
      subtitle: 'Due Jan 20',
    },
    {
      id: 'ms-clients',
      label: '5 new retainer clients',
      goalId: 'goal-q1-revenue',
      subtitle: 'Due Mar 31',
    },
  ],
};

export function getEntityLabel(
  entities: KanbanEntities,
  type: 'project' | 'assignee' | 'goal' | 'milestone',
  id?: string,
): string | undefined {
  if (!id) return undefined;
  const list =
    type === 'project'
      ? entities.projects
      : type === 'assignee'
        ? entities.assignees
        : type === 'goal'
          ? entities.goals
          : entities.milestones;
  return list.find((e) => e.id === id)?.label;
}
