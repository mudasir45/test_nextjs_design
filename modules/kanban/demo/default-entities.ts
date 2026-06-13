import type { KanbanEntities } from '../core/types';
import {
  DEFAULT_GOALS,
  goalsToKanbanEntities,
  milestonesToKanbanEntities,
} from '@/modules/goals/demo/default-goals';

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
  goals: goalsToKanbanEntities(DEFAULT_GOALS),
  milestones: milestonesToKanbanEntities(DEFAULT_GOALS),
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
