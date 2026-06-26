'use client';

import type { CreateProjectPayload } from '@/modules/projects/core/types';
import { DrawerShell } from '@/modules/projects/ui/shell/drawer-shell';
import { ProjectCreationForm } from '@/modules/projects/ui/create/project-creation-form';

interface ProjectCreateDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateProjectPayload) => void;
}

export function ProjectCreateDrawer({ open, onClose, onCreate }: ProjectCreateDrawerProps) {
  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="New project"
      subtitle="Set up client work — tasks and boards come next."
      accentColor="#7C3AED"
    >
      <ProjectCreationForm onCreate={onCreate} onCancel={onClose} />
    </DrawerShell>
  );
}
