'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, History, MoreHorizontal, Save, Trash2 } from 'lucide-react';
import type {
  ProjectDocument,
  ProjectDocumentStatus,
  ProjectDocumentType,
  ProjectFolder,
} from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import {
  insertAroundSelection,
  insertLinePrefix,
  renderMarkdownPreview,
  wordCount,
  type SaveStatus,
} from '@/modules/projects/core/document-editor-utils';
import {
  DOCUMENT_STATUS_META,
  DOCUMENT_STATUS_ORDER,
  DOCUMENT_TYPE_META,
  formatRelativeDate,
  getDocumentStatusMeta,
} from '@/modules/projects/core/workspace-utils';
import { DocumentEditorToolbar } from '@/modules/projects/ui/documents/document-editor-toolbar';

const DOC_TYPES = Object.keys(DOCUMENT_TYPE_META) as ProjectDocumentType[];

export interface DocumentEditorDraft {
  title: string;
  type: ProjectDocumentType;
  status: ProjectDocumentStatus;
  content: string;
  folderId?: string;
  url?: string;
  tags: string[];
}

interface DocumentEditorViewProps {
  document: ProjectDocument | null;
  isNew?: boolean;
  folders: ProjectFolder[];
  accentColor?: string;
  onSave: (draft: DocumentEditorDraft) => void;
  onDelete?: () => void;
  onSaveVersion?: (label?: string) => void;
  onOpenHistory?: () => void;
}

function draftFromDocument(doc: ProjectDocument | null): DocumentEditorDraft {
  if (!doc) {
    return { title: '', type: 'other', status: 'draft', content: '', tags: [] };
  }
  return {
    title: doc.title,
    type: doc.type,
    status: doc.status ?? 'draft',
    content: doc.content ?? '',
    folderId: doc.folderId,
    url: doc.url,
    tags: doc.tags ?? [],
  };
}

export function DocumentEditorView({
  document,
  isNew = false,
  folders,
  accentColor = '#7C3AED',
  onSave,
  onDelete,
  onSaveVersion,
  onOpenHistory,
}: DocumentEditorViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  const [draft, setDraft] = useState<DocumentEditorDraft>(() => draftFromDocument(document));
  const [preview, setPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [versionFlash, setVersionFlash] = useState(false);

  useEffect(() => {
    const next = draftFromDocument(document);
    setDraft(next);
    setPreview(false);
    setSaveStatus('saved');
    lastSavedRef.current = JSON.stringify(next);
  }, [document?.id, isNew]);

  const persist = useCallback(
    (next: DocumentEditorDraft) => {
      if (!next.title.trim()) return;
      setSaveStatus('saving');
      onSave({
        ...next,
        title: next.title.trim(),
        content: next.content,
        url: next.url?.trim() || undefined,
      });
      lastSavedRef.current = JSON.stringify(next);
      setSaveStatus('saved');
    },
    [onSave],
  );

  const updateDraft = useCallback(
    (patch: Partial<DocumentEditorDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch };
        const serialized = JSON.stringify(next);
        if (serialized !== lastSavedRef.current) {
          setSaveStatus('unsaved');
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
          saveTimerRef.current = setTimeout(() => {
            if (next.title.trim()) persist(next);
          }, 900);
        }
        return next;
      });
    },
    [persist],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const handleSaveVersion = useCallback(() => {
    if (!onSaveVersion || !draft.title.trim()) return;
    // Flush any pending edits first so the snapshot reflects the latest content.
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (saveStatus !== 'saved') persist(draft);
    onSaveVersion();
    setVersionFlash(true);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setVersionFlash(false), 2200);
  }, [onSaveVersion, draft, persist, saveStatus]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSaveVersion();
        } else if (draft.title.trim()) {
          persist(draft);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [draft, persist, handleSaveVersion]);

  const applyTextareaUpdate = (updater: (el: HTMLTextAreaElement) => { next: string; cursor: number }) => {
    const el = textareaRef.current;
    if (!el) return;
    const { next, cursor } = updater(el);
    updateDraft({ content: next });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  const statusMeta = getDocumentStatusMeta(draft.status);
  const currentVersion = document?.currentVersion ?? 1;
  const versionCount = document?.versions?.length ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="h-0.5 shrink-0" style={{ backgroundColor: accentColor }} />

      {/* Editor header */}
      <div className="flex shrink-0 items-start gap-3 border-b border-border/60 px-4 py-3 md:px-6">
        <div className="min-w-0 flex-1 space-y-2.5">
          <input
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
            placeholder="Untitled document"
            aria-label="Document title"
            className="w-full bg-transparent text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground/60 md:text-xl"
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="doc-type">
              Document type
            </label>
            <select
              id="doc-type"
              value={draft.type}
              onChange={(e) => updateDraft({ type: e.target.value as ProjectDocumentType })}
              className="cursor-pointer rounded-md border border-border/60 bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {DOCUMENT_TYPE_META[t].label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="doc-status">
              Document status
            </label>
            <div className="relative inline-flex items-center">
              <span
                className={cn(
                  'pointer-events-none absolute left-2 h-1.5 w-1.5 rounded-full',
                  statusMeta.dotClass,
                )}
              />
              <select
                id="doc-status"
                value={draft.status}
                onChange={(e) => updateDraft({ status: e.target.value as ProjectDocumentStatus })}
                className={cn(
                  'cursor-pointer rounded-md border-0 py-1 pl-5 pr-2 text-xs font-medium outline-none focus:ring-2 focus:ring-violet-500/20',
                  statusMeta.className,
                )}
              >
                {DOCUMENT_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {DOCUMENT_STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>

            {folders.length > 0 && (
              <>
                <label className="sr-only" htmlFor="doc-folder">
                  Folder
                </label>
                <select
                  id="doc-folder"
                  value={draft.folderId ?? ''}
                  onChange={(e) => updateDraft({ folderId: e.target.value || undefined })}
                  className="cursor-pointer rounded-md border border-border/60 bg-background px-2 py-1 text-xs text-muted-foreground outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="">No folder</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className={cn(
                  'inline-block h-1.5 w-1.5 rounded-full',
                  saveStatus === 'saved' && 'bg-emerald-500',
                  saveStatus === 'saving' && 'animate-pulse bg-amber-500',
                  saveStatus === 'unsaved' && 'bg-amber-500',
                )}
              />
              {saveStatus === 'saving' && 'Saving…'}
              {saveStatus === 'saved' && 'Saved'}
              {saveStatus === 'unsaved' && 'Unsaved changes'}
              {draft.content ? ` · ${wordCount(draft.content)} words` : ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          {onSaveVersion && (
            <button
              type="button"
              onClick={handleSaveVersion}
              disabled={!draft.title.trim()}
              title="Save a restorable version (⌘⇧S)"
              className={cn(
                'hidden cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex',
                versionFlash
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Save className="h-3.5 w-3.5" />
              {versionFlash ? 'Saved version' : 'Save version'}
            </button>
          )}
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              title="Version history"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">v{currentVersion}</span>
              {versionCount > 0 && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {versionCount}
                </span>
              )}
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Document options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-lg border border-border bg-card py-1 shadow-lg">
                  {onSaveVersion && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveVersion();
                        setMenuOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted sm:hidden"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save version
                    </button>
                  )}
                  {onOpenHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenHistory();
                        setMenuOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <History className="h-3.5 w-3.5" />
                      Version history
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        onDelete();
                        setMenuOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete document
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <DocumentEditorToolbar
        preview={preview}
        onSetPreview={setPreview}
        onBold={() =>
          applyTextareaUpdate((el) => insertAroundSelection(el, '**', '**', 'bold text'))
        }
        onItalic={() =>
          applyTextareaUpdate((el) => insertAroundSelection(el, '*', '*', 'italic text'))
        }
        onStrike={() =>
          applyTextareaUpdate((el) => insertAroundSelection(el, '~~', '~~', 'text'))
        }
        onH1={() => applyTextareaUpdate((el) => insertLinePrefix(el, '# '))}
        onH2={() => applyTextareaUpdate((el) => insertLinePrefix(el, '## '))}
        onH3={() => applyTextareaUpdate((el) => insertLinePrefix(el, '### '))}
        onBullet={() => applyTextareaUpdate((el) => insertLinePrefix(el, '- '))}
        onNumbered={() => applyTextareaUpdate((el) => insertLinePrefix(el, '1. '))}
        onQuote={() => applyTextareaUpdate((el) => insertLinePrefix(el, '> '))}
        onCode={() =>
          applyTextareaUpdate((el) => insertAroundSelection(el, '`', '`', 'code'))
        }
        onLink={() =>
          applyTextareaUpdate((el) => insertAroundSelection(el, '[', '](https://)', 'label'))
        }
      />

      {/* Editor body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {preview ? (
          <article
            className="prose-like mx-auto max-w-3xl space-y-3 px-6 py-8 md:px-10"
            dangerouslySetInnerHTML={{
              __html:
                renderMarkdownPreview(draft.content) ||
                '<p class="text-sm text-muted-foreground">Nothing to preview yet.</p>',
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={draft.content}
            onChange={(e) => updateDraft({ content: e.target.value })}
            placeholder="Start writing… Use the toolbar for formatting, or write markdown directly."
            aria-label="Document content"
            className="mx-auto block min-h-full w-full max-w-3xl resize-none bg-transparent px-6 py-8 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50 md:px-10 md:text-[15px] md:leading-7"
            spellCheck
          />
        )}
      </div>

      {/* Footer meta */}
      <div className="shrink-0 border-t border-border/60 bg-muted/10 px-4 py-2.5 md:px-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {draft.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => updateDraft({ tags: draft.tags.filter((t) => t !== tag) })}
                  className="cursor-pointer hover:text-foreground"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault();
                  const tag = tagInput.trim().toLowerCase();
                  if (!draft.tags.includes(tag)) {
                    updateDraft({ tags: [...draft.tags, tag] });
                  }
                  setTagInput('');
                }
              }}
              placeholder="Add tag…"
              aria-label="Add tag"
              className="min-w-[80px] flex-1 bg-transparent text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <input
            value={draft.url ?? ''}
            onChange={(e) => updateDraft({ url: e.target.value })}
            placeholder="External URL (optional)"
            aria-label="External URL"
            className="w-full max-w-xs rounded-md border border-border/50 bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/20 sm:w-48"
          />
        </div>
        {document && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/40 pt-2 text-[10px] text-muted-foreground/80">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatRelativeDate(document.updatedAt)}
            </span>
            <span>·</span>
            <span>Created {formatRelativeDate(document.createdAt)}</span>
            <span>·</span>
            <span>
              Version {currentVersion}
              {versionCount > 0 ? ` · ${versionCount} saved` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
