'use client';

import type { CreateProjectPayload, Project } from '@/modules/projects/core/types';
import { DrawerShell } from '@/modules/projects/ui/shell/drawer-shell';
import { ProjectCreationForm } from '@/modules/projects/ui/create/project-creation-form';

interface ProjectEditDrawerProps {
  open: boolean;
  project: Project;
  onClose: () => void;
  onSave: (payload: CreateProjectPayload) => void;
}

export function ProjectEditDrawer({ open, project, onClose, onSave }: ProjectEditDrawerProps) {
  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Edit project"
      subtitle="Update details, client, timeline, and team."
      accentColor={project.color}
    >
      <ProjectCreationForm
        onCreate={(payload) => {
          onSave(payload);
          onClose();
        }}
        onCancel={onClose}
        submitLabel="Save changes"
        initialValues={{
          name: project.name,
          description: project.description,
          clientId: project.clientId,
          goalId: project.goalId,
          priority: project.priority,
          color: project.color,
          deadline: project.deadline ? project.deadline.slice(0, 10) : '',
          budget: project.budget,
          teamMemberIds: project.teamMemberIds,
        }}
      />
    </DrawerShell>
  );
}
