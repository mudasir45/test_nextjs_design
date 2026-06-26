'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { EnvironmentStatus, EnvironmentType } from '@/modules/projects/core/types';
import {
  ENVIRONMENT_STATUS_META,
  ENVIRONMENT_TYPE_META,
} from '@/modules/projects/core/workspace-utils';
import { DrawerShell } from '@/modules/projects/ui/shell/drawer-shell';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';

interface AddEnvironmentDrawerProps {
  open: boolean;
  accentColor?: string;
  onClose: () => void;
  onAdd: ProjectWorkspaceActions['addEnvironment'];
}

type UrlRow = { label: string; url: string };
type CredRow = { label: string; value: string; role: string; username: string; note: string };

const ENV_TYPES = Object.keys(ENVIRONMENT_TYPE_META) as EnvironmentType[];
const ENV_STATUSES = Object.keys(ENVIRONMENT_STATUS_META) as EnvironmentStatus[];

export function AddEnvironmentDrawer({
  open,
  accentColor,
  onClose,
  onAdd,
}: AddEnvironmentDrawerProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [type, setType] = useState<EnvironmentType>('development');
  const [status, setStatus] = useState<EnvironmentStatus>('active');
  const [note, setNote] = useState('');
  const [urls, setUrls] = useState<UrlRow[]>([{ label: 'Frontend', url: '' }]);
  const [credentials, setCredentials] = useState<CredRow[]>([]);

  const reset = () => {
    setStep(0);
    setName('');
    setType('development');
    setStatus('active');
    setNote('');
    setUrls([{ label: 'Frontend', url: '' }]);
    setCredentials([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      type,
      status,
      note: note.trim() || undefined,
      urls: urls.filter((u) => u.label.trim() && u.url.trim()),
      credentials: credentials
        .filter((c) => c.label.trim() && c.value.trim())
        .map((c) => ({
          id: '',
          label: c.label.trim(),
          value: c.value.trim(),
          role: c.role.trim() || undefined,
          username: c.username.trim() || undefined,
          note: c.note.trim() || undefined,
          createdAt: '',
        })),
    });
    handleClose();
  };

  const steps = ['Details', 'URLs', 'Credentials'];

  return (
    <DrawerShell
      open={open}
      onClose={handleClose}
      title="Add environment"
      subtitle={`Step ${step + 1} of ${steps.length} — ${steps[step]}`}
      accentColor={accentColor}
      footer={
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => (step > 0 ? setStep(step - 1) : handleClose())}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !name.trim()}
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Create environment
            </button>
          )}
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="Production, QA, Client Review..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EnvironmentType)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  {ENV_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {ENVIRONMENT_TYPE_META[t].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EnvironmentStatus)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  {ENV_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {ENVIRONMENT_STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="Optional context for this environment..."
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {urls.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={row.label}
                  onChange={(e) => {
                    const next = [...urls];
                    next[i] = { ...next[i], label: e.target.value };
                    setUrls(next);
                  }}
                  className="w-28 shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                  placeholder="Label"
                />
                <input
                  value={row.url}
                  onChange={(e) => {
                    const next = [...urls];
                    next[i] = { ...next[i], url: e.target.value };
                    setUrls(next);
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                  placeholder="https://..."
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setUrls(urls.filter((_, j) => j !== i))}
                    className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setUrls([...urls, { label: '', url: '' }])}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Add URL
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {credentials.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add credentials now or skip — you can add them later.
              </p>
            )}
            {credentials.map((row, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-border/60 p-4">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={row.label}
                    onChange={(e) => {
                      const next = [...credentials];
                      next[i] = { ...next[i], label: e.target.value };
                      setCredentials(next);
                    }}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                    placeholder="Label"
                  />
                  <input
                    value={row.role}
                    onChange={(e) => {
                      const next = [...credentials];
                      next[i] = { ...next[i], role: e.target.value };
                      setCredentials(next);
                    }}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                    placeholder="Role (admin, dev, qa)"
                  />
                </div>
                <input
                  value={row.username}
                  onChange={(e) => {
                    const next = [...credentials];
                    next[i] = { ...next[i], username: e.target.value };
                    setCredentials(next);
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                  placeholder="Username (optional)"
                />
                <input
                  value={row.value}
                  onChange={(e) => {
                    const next = [...credentials];
                    next[i] = { ...next[i], value: e.target.value };
                    setCredentials(next);
                  }}
                  type="password"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                  placeholder="Password / API key / token"
                />
                <button
                  type="button"
                  onClick={() => setCredentials(credentials.filter((_, j) => j !== i))}
                  className="cursor-pointer text-xs text-red-600 dark:text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setCredentials([
                  ...credentials,
                  { label: '', value: '', role: '', username: '', note: '' },
                ])
              }
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400"
            >
              <Plus className="h-3.5 w-3.5" />
              Add credential
            </button>
          </div>
        )}
      </div>
    </DrawerShell>
  );
}
