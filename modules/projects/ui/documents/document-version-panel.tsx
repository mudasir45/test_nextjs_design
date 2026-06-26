'use client';

import { useEffect, useMemo, useState } from 'react';
import { History, RotateCcw, Save } from 'lucide-react';
import type {
  ProjectDocument,
  ProjectDocumentVersion,
} from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { renderMarkdownPreview } from '@/modules/projects/core/document-editor-utils';
import {
  DOCUMENT_TYPE_META,
  formatDateTime,
  getDocumentStatusMeta,
} from '@/modules/projects/core/workspace-utils';
import { DrawerShell } from '@/modules/projects/ui/shell/drawer-shell';

interface DocumentVersionPanelProps {
  open: boolean;
  document: ProjectDocument | null;
  accentColor?: string;
  onClose: () => void;
  onSaveVersion: (label?: string) => void;
  onRestore: (versionId: string) => void;
}

const ORIGIN_LABELS: Record<ProjectDocumentVersion['origin'], string> = {
  manual: 'Manual save',
  auto: 'Autosaved',
  restore: 'Restored',
};

export function DocumentVersionPanel({
  open,
  document,
  accentColor,
  onClose,
  onSaveVersion,
  onRestore,
}: DocumentVersionPanelProps) {
  const versions = useMemo(
    () => [...(document?.versions ?? [])].sort((a, b) => b.version - a.version),
    [document?.versions],
  );

  const [selectedId, setSelectedId] = useState<string | null>(versions[0]?.id ?? null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!open) return;
    setSelectedId(versions[0]?.id ?? null);
    setLabel('');
  }, [open, document?.id, versions]);

  if (!document) return null;

  const selected = versions.find((v) => v.id === selectedId) ?? versions[0] ?? null;
  const currentVersion = document.currentVersion ?? versions[0]?.version ?? 1;
  const isSelectedCurrent = selected ? selected.version === currentVersion : false;

  const handleSave = () => {
    onSaveVersion(label.trim() || undefined);
    setLabel('');
  };

  const handleRestore = () => {
    if (!selected) return;
    if (
      window.confirm(
        `Restore version ${selected.version}? Your current content is saved to history first, so nothing is lost.`,
      )
    ) {
      onRestore(selected.id);
      onClose();
    }
  };

  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Version history"
      subtitle={document.title || 'Untitled document'}
      accentColor={accentColor}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Save a new version */}
        <div className="shrink-0 border-b border-border/60 px-6 py-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Capture the current document as a restore point
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder="Describe what changed (optional)"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              <Save className="h-4 w-4" />
              Save version
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Version list */}
          <div className="max-h-56 shrink-0 overflow-y-auto border-b border-border/60 md:max-h-none md:w-72 md:border-b-0 md:border-r">
            <ul className="divide-y divide-border/40 p-2">
              {versions.length === 0 && (
                <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No versions yet. Save one above to start tracking history.
                </li>
              )}
              {versions.map((v) => {
                const isActive = v.id === selected?.id;
                const isCurrent = v.version === currentVersion;
                return (
                  <li key={v.id} className="py-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedId(v.id)}
                      className={cn(
                        'flex w-full cursor-pointer flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-colors',
                        isActive ? 'bg-muted ring-1 ring-border/60' : 'hover:bg-muted/50',
                      )}
                    >
                      <div className="flex w-full items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">v{v.version}</span>
                        {isCurrent && (
                          <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Current
                          </span>
                        )}
                        <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground/70">
                          {ORIGIN_LABELS[v.origin]}
                        </span>
                      </div>
                      {v.label && (
                        <span className="line-clamp-1 text-xs text-foreground/80">{v.label}</span>
                      )}
                      <span className="text-[11px] text-muted-foreground" suppressHydrationWarning>
                        {formatDateTime(v.createdAt)} · {v.wordCount} words
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Selected version preview */}
          <div className="flex min-h-0 flex-1 flex-col">
            {selected ? (
              <>
                <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border/60 px-6 py-3">
                  <span className="text-sm font-semibold text-foreground">
                    Version {selected.version}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium',
                      DOCUMENT_TYPE_META[selected.type]?.className,
                    )}
                  >
                    {DOCUMENT_TYPE_META[selected.type]?.label ?? selected.type}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium',
                      getDocumentStatusMeta(selected.status).className,
                    )}
                  >
                    {getDocumentStatusMeta(selected.status).label}
                  </span>
                  <button
                    type="button"
                    onClick={handleRestore}
                    disabled={isSelectedCurrent}
                    title={
                      isSelectedCurrent
                        ? 'This is the current version'
                        : `Restore version ${selected.version}`
                    }
                    className={cn(
                      'ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      'border-border/60 text-foreground hover:bg-muted',
                    )}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {isSelectedCurrent ? 'Current version' : 'Restore this version'}
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{selected.title}</h3>
                  <article
                    className="prose-like space-y-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        renderMarkdownPreview(selected.content ?? '') ||
                        '<p class="text-sm text-muted-foreground">This version has no content.</p>',
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <History className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Select a version to preview it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DrawerShell>
  );
}
