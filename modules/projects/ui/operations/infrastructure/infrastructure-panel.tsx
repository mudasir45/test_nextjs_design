'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type {
  EnvironmentCredential,
  InfrastructureCategory,
  Project,
} from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { INFRASTRUCTURE_CATEGORY_META } from '@/modules/projects/core/workspace-utils';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';
import { CredentialRow } from '@/modules/projects/ui/operations/environments/credential-row';

interface InfrastructurePanelProps {
  project: Project;
  actions: ProjectWorkspaceActions;
}

export function InfrastructurePanel({ project, actions }: InfrastructurePanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState<InfrastructureCategory>('hosting');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');

  const categories = Object.keys(INFRASTRUCTURE_CATEGORY_META) as InfrastructureCategory[];

  const grouped = categories.reduce(
    (acc, cat) => {
      const items = project.infrastructure.filter((i) => i.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {} as Record<InfrastructureCategory, typeof project.infrastructure>,
  );

  const handleAdd = () => {
    if (!name.trim()) return;
    actions.addInfrastructureItem({
      name: name.trim(),
      provider: provider.trim() || undefined,
      category,
      url: url.trim() || undefined,
      note: note.trim() || undefined,
      credentials: [],
    });
    setName('');
    setProvider('');
    setCategory('hosting');
    setUrl('');
    setNote('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {project.infrastructure.length} infrastructure item
          {project.infrastructure.length !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>

      {showAdd && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Name (e.g. AWS ECS)"
            />
            <input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Provider"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as InfrastructureCategory)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {INFRASTRUCTURE_CATEGORY_META[c].label}
              </option>
            ))}
          </select>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            placeholder="Console URL (optional)"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            placeholder="Notes"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!name.trim()}
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">No infrastructure items</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Track hosting, databases, CDN, and CI/CD resources here.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => {
          const meta = INFRASTRUCTURE_CATEGORY_META[cat as InfrastructureCategory];
          return (
            <div key={cat} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {meta.label}
              </h3>
              {items.map((item) => {
                const isOpen = expanded[item.id] ?? false;
                return (
                  <div key={item.id} className="rounded-xl border border-border/60 bg-card">
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [item.id]: !isOpen }))
                      }
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
                    >
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform',
                          isOpen && 'rotate-180',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{item.name}</span>
                          {item.provider && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                              {item.provider}
                            </span>
                          )}
                        </div>
                        {item.note && !isOpen && (
                          <p className="truncate text-xs text-muted-foreground">{item.note}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.deleteInfrastructureItem(item.id);
                        }}
                        className="cursor-pointer rounded p-1 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </button>
                    {isOpen && (
                      <div className="border-t border-border/50 px-4 pb-4 pt-3">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-violet-600 hover:underline dark:text-violet-400"
                          >
                            {item.url}
                          </a>
                        )}
                        {item.note && (
                          <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
                        )}
                        {item.credentials.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {item.credentials.map((cred) => (
                              <CredentialRowInline
                                key={cred.id}
                                cred={cred}
                                onDelete={() => actions.deleteInfraCredential(item.id, cred.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}

function CredentialRowInline({
  cred,
  onDelete,
}: {
  cred: EnvironmentCredential;
  onDelete: () => void;
}) {
  return (
    <CredentialRow
      label={cred.label}
      value={cred.value}
      username={cred.username}
      role={cred.role}
      note={cred.note}
      onDelete={onDelete}
    />
  );
}
