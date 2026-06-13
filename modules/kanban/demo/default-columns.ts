import type { Column } from '../core/types';

export const COLUMN_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#64748b',
];

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: '#6366f1',
    tasks: [
      {
        id: '1',
        title: 'Design System Audit',
        description: 'Review and update component library',
        priority: 'high',
        assigneeId: 'user-sarah',
        assignee: {
          name: 'Sarah Chen',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
        },
        tags: ['Design', 'System'],
        dueDate: '2024-01-15',
        attachments: 3,
        comments: 7,
        entityLink: { type: 'milestone', id: 'ms-audit' },
      },
      {
        id: '2',
        title: 'User Research Analysis',
        description: 'Analyze feedback from recent user interviews',
        priority: 'medium',
        assigneeId: 'user-alex',
        assignee: {
          name: 'Alex Rivera',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
        },
        tags: ['Research', 'UX'],
        dueDate: '2024-01-18',
        comments: 4,
        entityLink: { type: 'goal', id: 'goal-product-launch' },
      },
      {
        id: 'beta-1',
        title: 'Onboard beta testers',
        priority: 'high',
        entityLink: { type: 'milestone', id: 'ms-beta' },
      },
      {
        id: 'beta-2',
        title: 'Fix critical beta bugs',
        priority: 'high',
        entityLink: { type: 'milestone', id: 'ms-beta' },
      },
    ],
  },
  {
    id: 'progress',
    title: 'In Progress',
    color: '#22c55e',
    tasks: [
      {
        id: '3',
        title: 'Mobile App Redesign',
        description: 'Implementing new navigation patterns',
        priority: 'high',
        assigneeId: 'user-jordan',
        assignee: {
          name: 'Jordan Kim',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
        },
        tags: ['Mobile', 'UI'],
        attachments: 8,
        comments: 12,
        entityLink: { type: 'project', id: 'proj-mobile' },
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: '#f97316',
    tasks: [
      {
        id: '4',
        title: 'API Documentation',
        description: 'Complete developer documentation',
        priority: 'medium',
        assigneeId: 'user-maya',
        assignee: {
          name: 'Maya Patel',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
        },
        tags: ['Documentation', 'API'],
        dueDate: '2024-01-20',
        comments: 2,
        entityLink: { type: 'project', id: 'proj-api' },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#64748b',
    tasks: [
      {
        id: 'beta-3',
        title: 'Beta feedback synthesis',
        priority: 'medium',
        entityLink: { type: 'milestone', id: 'ms-beta' },
      },
      {
        id: '5',
        title: 'Landing Page Optimization',
        description: 'Improved conversion rate by 23%',
        priority: 'low',
        assigneeId: 'user-chris',
        assignee: {
          name: 'Chris Wong',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
        },
        tags: ['Marketing', 'Web'],
        attachments: 2,
        comments: 8,
        entityLink: { type: 'goal', id: 'goal-q1-revenue' },
      },
    ],
  },
];

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
} as const;

export const PRIORITY_STYLES = {
  low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  high: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
} as const;
