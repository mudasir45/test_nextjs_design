import type { ExpenseEntityType } from './types';

/** Generic linkable entity for expense tagging — host app maps goals, tasks, projects, etc. */
export interface LinkableEntity {
  id: string;
  name: string;
  type: ExpenseEntityType;
  /** Optional grouping label, e.g. goal title for a milestone */
  group?: string;
}

export interface LinkableEntityGroups {
  projects?: LinkableEntity[];
  goals?: LinkableEntity[];
  milestones?: LinkableEntity[];
  tasks?: LinkableEntity[];
}

const GROUP_LABELS: Record<keyof LinkableEntityGroups, string> = {
  projects: 'Projects',
  goals: 'Goals',
  milestones: 'Milestones',
  tasks: 'Tasks',
};

/** Flatten grouped entities into a single list for pickers and filters. */
export function flattenLinkableEntities(groups: LinkableEntityGroups): LinkableEntity[] {
  return (Object.keys(GROUP_LABELS) as (keyof LinkableEntityGroups)[]).flatMap(
    (key) => groups[key] ?? [],
  );
}

/** Group entities for segmented UI (expense form, filters). */
export function groupLinkableEntities(
  groups: LinkableEntityGroups,
): { label: string; entities: LinkableEntity[] }[] {
  return (Object.keys(GROUP_LABELS) as (keyof LinkableEntityGroups)[])
    .map((key) => ({
      label: GROUP_LABELS[key],
      entities: groups[key] ?? [],
    }))
    .filter((g) => g.entities.length > 0);
}

/** Find a display name for a stored expense entity reference. */
export function resolveEntityName(
  entityType: ExpenseEntityType | undefined,
  entityId: string | undefined,
  entityName: string | undefined,
  groups: LinkableEntityGroups,
): string | undefined {
  if (entityName?.trim()) return entityName.trim();
  if (!entityId || !entityType || entityType === 'general' || entityType === 'personal') {
    return undefined;
  }

  const flat = flattenLinkableEntities(groups);
  return flat.find((e) => e.id === entityId && e.type === entityType)?.name;
}
