'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import type { Project } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';
import { normalizeDocument } from '@/modules/projects/core/workspace-utils';
import { DocumentSidebar } from '@/modules/projects/ui/documents/document-sidebar';
import {
  DocumentEditorView,
  type DocumentEditorDraft,
} from '@/modules/projects/ui/documents/document-editor-view';
import { DocumentVersionPanel } from '@/modules/projects/ui/documents/document-version-panel';
import { EmptyState } from '@/modules/projects/ui/shared/empty-state';
import { useProjectsTheme } from '@/modules/projects/provider/ProjectsProvider';

interface DocumentsTabProps {
  project: Project;
  actions: ProjectWorkspaceActions;
}

export function DocumentsTab({ project, actions }: DocumentsTabProps) {
  const theme = useProjectsTheme();
  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | 'new' | null>(null);
  const [mobileShowEditor, setMobileShowEditor] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const documents = useMemo(
    () => project.documents.map(normalizeDocument),
    [project.documents],
  );

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedFolderId !== 'all' && doc.folderId !== selectedFolderId) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.content?.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [documents, search, selectedFolderId]);

  const folderMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of project.folders) map[f.id] = f.name;
    return map;
  }, [project.folders]);

  const folderCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of documents) {
      if (d.folderId) map[d.folderId] = (map[d.folderId] ?? 0) + 1;
    }
    return map;
  }, [documents]);

  const sortedDocs = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [filtered],
  );

  useEffect(() => {
    if (selectedId && selectedId !== 'new' && !documents.some((d) => d.id === selectedId)) {
      setSelectedId(sortedDocs[0]?.id ?? null);
      setMobileShowEditor(false);
    }
  }, [documents, selectedId, sortedDocs]);

  useEffect(() => {
    if (selectedId === null && sortedDocs.length > 0) {
      setSelectedId(sortedDocs[0].id);
    }
  }, [sortedDocs, selectedId]);

  const activeDocument =
    selectedId && selectedId !== 'new'
      ? (documents.find((d) => d.id === selectedId) ?? null)
      : null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileShowEditor(true);
  };

  const handleNew = () => {
    setSelectedId('new');
    setMobileShowEditor(true);
  };

  const handleSave = (draft: DocumentEditorDraft) => {
    const payload = {
      title: draft.title,
      type: draft.type,
      status: draft.status,
      content: draft.content.trim() || undefined,
      folderId: draft.folderId,
      url: draft.url,
      tags: draft.tags,
    };

    if (selectedId === 'new') {
      const created = actions.addDocument(payload);
      if (created) setSelectedId(created.id);
      return;
    }

    if (selectedId) {
      actions.updateDocument(selectedId, payload);
    }
  };

  const handleDelete = () => {
    if (!selectedId || selectedId === 'new') return;
    actions.deleteDocument(selectedId);
    setSelectedId(sortedDocs.find((d) => d.id !== selectedId)?.id ?? null);
    setMobileShowEditor(false);
  };

  const handleSaveVersion = (label?: string) => {
    if (!activeDocument) return;
    actions.saveDocumentVersion(activeDocument.id, label);
  };

  const handleRestoreVersion = (versionId: string) => {
    if (!activeDocument) return;
    actions.restoreDocumentVersion(activeDocument.id, versionId);
  };

  const handleCreateFolder = (name: string) => {
    const folder = actions.addFolder(name);
    if (folder) setSelectedFolderId(folder.id);
  };

  const showEditor = selectedId === 'new' || activeDocument;

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
      {/* Sidebar — hidden on mobile when editor is open */}
      <div
        className={cn(
          'h-full min-h-0 shrink-0',
          mobileShowEditor ? 'hidden lg:flex' : 'flex w-full lg:w-auto',
        )}
      >
        <DocumentSidebar
          documents={sortedDocs}
          folders={project.folders}
          folderMap={folderMap}
          totalCount={documents.length}
          folderCounts={folderCounts}
          selectedId={selectedId}
          search={search}
          selectedFolderId={selectedFolderId}
          onSearchChange={setSearch}
          onFolderChange={setSelectedFolderId}
          onSelect={handleSelect}
          onNew={handleNew}
          onCreateFolder={handleCreateFolder}
          accentClassName={theme.buttonPrimary}
        />
      </div>

      {/* Editor panel */}
      <div
        className={cn(
          'min-h-0 min-w-0 flex-1',
          !mobileShowEditor && 'hidden lg:flex',
          mobileShowEditor && 'flex',
        )}
      >
        {showEditor ? (
          <div className="flex h-full min-h-0 w-full flex-col">
            <button
              type="button"
              onClick={() => setMobileShowEditor(false)}
              className="shrink-0 cursor-pointer border-b border-border/60 px-4 py-2 text-left text-xs font-medium text-muted-foreground hover:text-foreground lg:hidden"
            >
              ← All documents
            </button>
            <div className="min-h-0 flex-1 p-2 md:p-3">
              <DocumentEditorView
                key={selectedId === 'new' ? 'new' : activeDocument?.id}
                document={activeDocument}
                isNew={selectedId === 'new'}
                folders={project.folders}
                accentColor={project.color}
                onSave={handleSave}
                onDelete={selectedId !== 'new' ? handleDelete : undefined}
                onSaveVersion={selectedId !== 'new' ? handleSaveVersion : undefined}
                onOpenHistory={selectedId !== 'new' ? () => setHistoryOpen(true) : undefined}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <EmptyState
              icon={FileText}
              title="Select a document"
              description="Choose a document from the sidebar or create a new one to start writing."
              action={
                <button
                  type="button"
                  onClick={handleNew}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white',
                    theme.buttonPrimary,
                  )}
                >
                  New document
                </button>
              }
            />
          </div>
        )}
      </div>

      <DocumentVersionPanel
        open={historyOpen && !!activeDocument}
        document={activeDocument}
        accentColor={project.color}
        onClose={() => setHistoryOpen(false)}
        onSaveVersion={handleSaveVersion}
        onRestore={(versionId) => {
          handleRestoreVersion(versionId);
        }}
      />
    </div>
  );
}
