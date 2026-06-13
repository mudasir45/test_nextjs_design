import { CheckCircle2, CircleDollarSign, Hash, ListChecks } from 'lucide-react';
import type { MilestoneTargetType } from '@/modules/goals/core/types';

export interface TargetTypeOption {
  value: MilestoneTargetType;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof Hash;
}

export const TARGET_TYPE_OPTIONS: TargetTypeOption[] = [
  {
    value: 'boolean',
    label: 'Done / Not done',
    shortLabel: 'Done',
    description: 'A clear yes or no checkpoint',
    icon: CheckCircle2,
  },
  {
    value: 'number',
    label: 'Number',
    shortLabel: 'Number',
    description: 'Count toward a numeric target',
    icon: Hash,
  },
  {
    value: 'currency',
    label: 'Currency',
    shortLabel: 'Money',
    description: 'Track revenue, savings, or spend',
    icon: CircleDollarSign,
  },
  {
    value: 'tasks',
    label: 'Tasks',
    shortLabel: 'Tasks',
    description: 'Progress through linked work items',
    icon: ListChecks,
  },
];

export function getTargetTypeMeta(type: MilestoneTargetType): TargetTypeOption {
  return TARGET_TYPE_OPTIONS.find((o) => o.value === type) ?? TARGET_TYPE_OPTIONS[0];
}
