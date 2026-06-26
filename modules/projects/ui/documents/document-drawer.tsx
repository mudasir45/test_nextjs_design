'use client';

import { useEffect, useState } from 'react';
import type { ProjectDocument, ProjectDocumentType } from '@/modules/projects/core/types';
import { DrawerShell } from '@/modules/projects/ui/shell/drawer-shell';
import { DOCUMENT_TYPE_META } from '@/modules/projects/core/workspace-utils';

interface DocumentDrawerProps {
  open: boolean;
  document: ProjectDocument | null;
  accentColor?: string;
  onClose: () => void;
  onSave: (updates: Partial<ProjectDocument>) => void;
}

const DOC_TYPES = Object.keys(DOCUMENT_TYPE_META) as ProjectDocumentType[];

export function DocumentDrawer({
  open,
  document,
  accentColor,
  onClose,
  onSave,
}: DocumentDrawerProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProjectDocumentType>('other');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (!document) return;
    setTitle(document.title);
    setType(document.type);
    setContent(document.content ?? '');
    setUrl(document.url ?? '');
    setTags(document.tags.join(', '));
  }, [document]);

  const handleSave = () => {
    onSave({
      title: title.trim(),
      type,
      content: content.trim() || undefined,
      url: url.trim() || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    onClose();
  };

  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title={document?.title ?? 'Document'}
      subtitle="Edit document details"
      accentColor={accentColor}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            Save changes
          </button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProjectDocumentType)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DOCUMENT_TYPE_META[t].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="Document content or notes..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              External URL (optional)
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Tags (comma-separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder="scope, v1, research"
            />
          </div>
        </div>
      </div>
    </DrawerShell>
  );
}
