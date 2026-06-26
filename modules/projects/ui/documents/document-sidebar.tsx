'use client';

import { useState } from 'react';
import {
  BookOpen,
  Check,
  ClipboardList,
  FileText,
  FlaskConical,
  FolderOpen,
  FolderPlus,
  MessageSquare,
  Plus,
  ScrollText,
  Search,
  X,
} from 'lucide-react';
import type { ProjectDocument, ProjectDocumentType, ProjectFolder } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import {
  DOCUMENT_TYPE_META,
  formatRelativeDate,
  getDocumentStatusMeta,
  getDocumentTypeMeta,
} from '@/modules/projects/core/workspace-utils';

const DOC_ICONS: Record<ProjectDocumentType, typeof FileText> = {
  prd: ClipboardList,
  spec: ScrollText,
  research: FlaskConical,
  meeting_notes: MessageSquare,
  sop: BookOpen,
  client_doc: FolderOpen,
  other: FileText,
};

interface DocumentSidebarProps {
  documents: ProjectDocument[];
  folders: ProjectFolder[];
  folderMap: Record<string, string>;
  totalCount: number;
  folderCounts: Record<string, number>;
  selectedId: string | 'new' | null;
  search: string;
  selectedFolderId: string | 'all';
  onSearchChange: (value: string) => void;
  onFolderChange: (folderId: string | 'all') => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onCreateFolder: (name: string) => void;
  accentClassName?: string;
}

export function DocumentSidebar({
  documents,
  folders,
  folderMap,
  totalCount,
  folderCounts,
  selectedId,
  search,
  selectedFolderId,
  onSearchChange,
  onFolderChange,
  onSelect,
  onNew,
  onCreateFolder,
  accentClassName,
}: DocumentSidebarProps) {
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const submitFolder = () => {
    const name = folderName.trim();
    if (name) onCreateFolder(name);
    setFolderName('');
    setCreatingFolder(false);
  };

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-border/60 bg-muted/10 lg:w-60 xl:w-72">
      <div className="shrink-0 space-y-2 border-b border-border/60 p-3">
        <button
          type="button"
          onClick={onNew}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors',
            accentClassName ?? 'bg-violet-600 hover:bg-violet-700',
          )}
        >
          <Plus className="h-4 w-4" />
          New document
        </button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents…"
            aria-label="Search documents"
            className="w-full rounded-lg border border-border/60 bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Folders */}
      <div className="shrink-0 border-b border-border/60 p-2">
        <div className="mb-1 flex items-center justify-between px-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Folders
          </p>
          <button
            type="button"
            onClick={() => setCreatingFolder((v) => !v)}
            className="cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="New folder"
            title="New folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </button>
        </div>

        {creatingFolder && (
          <div className="mb-1 flex items-center gap-1 px-1">
            <input
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitFolder();
                if (e.key === 'Escape') {
                  setFolderName('');
                  setCreatingFolder(false);
                }
              }}
              placeholder="Folder name"
              aria-label="Folder name"
              className="min-w-0 flex-1 rounded-md border border-border/60 bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
            />
            <button
              type="button"
              onClick={submitFolder}
              className="cursor-pointer rounded-md p-1 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
              aria-label="Create folder"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setFolderName('');
                setCreatingFolder(false);
              }}
              className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted"
              aria-label="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => onFolderChange('all')}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
            selectedFolderId === 'all'
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted/50',
          )}
        >
          All documents
          <span className="ml-auto opacity-60">{totalCount}</span>
        </button>
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => onFolderChange(folder.id)}
            className={cn(
              'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
              selectedFolderId === folder.id
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted/50',
            )}
          >
            <FolderOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">{folder.name}</span>
            <span className="ml-auto opacity-60">{folderCounts[folder.id] ?? 0}</span>
          </button>
        ))}
        {folders.length === 0 && !creatingFolder && (
          <p className="px-2 py-1 text-[11px] text-muted-foreground/70">
            No folders yet.
          </p>
        )}
      </div>

      {/* Document list */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Documents
        </p>
        {documents.length === 0 ? (
          <p className="px-2 py-4 text-xs text-muted-foreground">
            {search.trim() ? 'No documents match your search.' : 'No documents yet.'}
          </p>
        ) : (
          <div className="space-y-0.5">
            {documents.map((doc) => {
              const Icon = DOC_ICONS[doc.type];
              const meta = getDocumentTypeMeta(doc.type);
              const statusMeta = getDocumentStatusMeta(doc.status);
              const isActive = selectedId === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => onSelect(doc.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors',
                    isActive
                      ? 'bg-card shadow-sm ring-1 ring-border/60'
                      : 'hover:bg-muted/50',
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      meta.className,
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', statusMeta.dotClass)}
                        title={statusMeta.label}
                      />
                      <p className="truncate text-xs font-medium text-foreground">{doc.title}</p>
                    </div>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {DOCUMENT_TYPE_META[doc.type].label}
                      {doc.folderId && folderMap[doc.folderId]
                        ? ` · ${folderMap[doc.folderId]}`
                        : ''}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70" suppressHydrationWarning>
                      {formatRelativeDate(doc.updatedAt)}
                      {doc.currentVersion ? ` · v${doc.currentVersion}` : ''}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
