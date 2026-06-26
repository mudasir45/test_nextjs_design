'use client';

import { useState } from 'react';
import { Link2, Plus } from 'lucide-react';
import type { Project, ProjectLinkType } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { detectLinkType, LINK_TYPE_META } from '@/modules/projects/core/workspace-utils';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';
import { LinkCard } from '@/modules/projects/ui/links/link-card';
import { EmptyState } from '@/modules/projects/ui/shared/empty-state';
import { useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';

interface LinksTabProps {
  project: Project;
  actions: ProjectWorkspaceActions;
}

const LINK_TYPES = Object.keys(LINK_TYPE_META) as ProjectLinkType[];

export function LinksTab({ project, actions }: LinksTabProps) {
  const theme = useProjectsTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectLinkType>('other');

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) setType(detectLinkType(value));
  };

  const handleAdd = () => {
    if (!title.trim() || !url.trim()) return;
    actions.addLink({
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      type,
    });
    setTitle('');
    setUrl('');
    setDescription('');
    setType('other');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">References & links</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Figma, GitHub, Notion, production URLs, and more
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
            theme.buttonPrimary,
          )}
        >
          <Plus className="h-4 w-4" />
          Add link
        </button>
      </div>

      {showAdd && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              placeholder="Title"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProjectLinkType)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            >
              {LINK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {LINK_TYPE_META[t].label}
                </option>
              ))}
            </select>
          </div>
          <input
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            placeholder="https://..."
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!title.trim() || !url.trim()}
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Save link
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

      {project.links.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No links yet"
          description="Add Figma files, GitHub repos, Notion pages, and production URLs — everything your team needs in one place."
          action={
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold',
                theme.buttonPrimary,
              )}
            >
              <Plus className="h-4 w-4" />
              Add first link
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDelete={() => actions.deleteLink(link.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
