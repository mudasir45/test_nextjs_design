'use client';

import type { CreateGoalPayload } from '@/modules/goals/core/types';
import { DrawerShell } from '@/modules/goals/ui/drawer-shell';
import { GoalCreationFlow } from '@/modules/goals/ui/goal-creation-flow';

interface GoalCreateDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateGoalPayload) => void;
}

export function GoalCreateDrawer({ open, onClose, onCreate }: GoalCreateDrawerProps) {
  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Define a goal"
      subtitle="One step at a time — no rush."
      accentColor="#0D9488"
    >
      <GoalCreationFlow
        onCreate={onCreate}
        onCancel={onClose}
      />
    </DrawerShell>
  );
}
