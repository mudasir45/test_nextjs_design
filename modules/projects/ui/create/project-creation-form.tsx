'use client';

import { useState } from 'react';
import type { CreateProjectPayload } from '@/modules/projects/core/types';
import { PROJECT_COLORS, PRIORITY_STYLES } from '@/modules/projects/theme/projects-theme';
import { cn } from '@/modules/projects/core/cn';
import { useProjectsRefs, useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';

export interface ProjectFormInitialValues {
  name?: string;
  description?: string;
  clientId?: string;
  goalId?: string;
  priority?: CreateProjectPayload['priority'];
  color?: string;
  deadline?: string;
  budget?: number;
  teamMemberIds?: string[];
}

interface ProjectCreationFormProps {
  onCreate: (payload: CreateProjectPayload) => void;
  onCancel: () => void;
  initialValues?: ProjectFormInitialValues;
  submitLabel?: string;
}

export function ProjectCreationForm({
  onCreate,
  onCancel,
  initialValues,
  submitLabel = 'Create project',
}: ProjectCreationFormProps) {
  const theme = useProjectsTheme();
  const { clients, goals, teamMembers } = useProjectsRefs();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [clientId, setClientId] = useState(initialValues?.clientId ?? '');
  const [goalId, setGoalId] = useState(initialValues?.goalId ?? '');
  const [priority, setPriority] = useState<CreateProjectPayload['priority']>(
    initialValues?.priority ?? 'medium',
  );
  const [color, setColor] = useState(initialValues?.color ?? PROJECT_COLORS[0]);
  const [deadline, setDeadline] = useState(initialValues?.deadline ?? '');
  const [budget, setBudget] = useState(
    initialValues?.budget != null ? String(initialValues.budget) : '',
  );
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>(
    initialValues?.teamMemberIds ?? [],
  );

  const canSubmit = name.trim().length > 0;

  const toggleMember = (id: string) => {
    setTeamMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submit = () => {
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      clientId: clientId || undefined,
      goalId: goalId || undefined,
      priority,
      color,
      deadline: deadline || undefined,
      budget: budget ? Number(budget) : undefined,
      teamMemberIds,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
        <div>
          <label className="text-sm font-medium text-foreground">Project name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Brand Refresh"
            className="mt-2 w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you delivering?"
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {clients.length > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
              >
                <option value="">No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ?? c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {goals.length > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground">Linked goal</label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
              >
                <option value="">No goal</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Budget (optional)</label>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="24000"
              className="mt-2 w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Priority</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                  priority === p
                    ? PRIORITY_STYLES[p].className
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                )}
              >
                {PRIORITY_STYLES[p].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  'h-8 w-8 cursor-pointer rounded-full transition-transform hover:scale-110',
                  color === c && 'ring-2 ring-offset-2 ring-violet-500',
                )}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        {teamMembers.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground">Team</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {teamMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMember(m.id)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    teamMemberIds.includes(m.id)
                      ? 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400'
                      : 'border-border/60 text-muted-foreground hover:border-border',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border/60 px-8 py-5">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            'cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            theme.buttonPrimary,
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
