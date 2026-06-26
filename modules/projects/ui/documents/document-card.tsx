'use client';

import {
  BookOpen,
  ClipboardList,
  FileText,
  FlaskConical,
  FolderOpen,
  MessageSquare,
  ScrollText,
} from 'lucide-react';
import type { ProjectDocument, ProjectDocumentType } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { formatRelativeDate, getDocumentTypeMeta } from '@/modules/projects/core/workspace-utils';
import { Badge } from '@/modules/projects/ui/primitives/badge';

const DOC_ICONS: Record<ProjectDocumentType, typeof FileText> = {
  prd: ClipboardList,
  spec: ScrollText,
  research: FlaskConical,
  meeting_notes: MessageSquare,
  sop: BookOpen,
  client_doc: FolderOpen,
  other: FileText,
};

interface DocumentCardProps {
  document: ProjectDocument;
  folderName?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export function DocumentCard({ document, folderName, onClick, onDelete }: DocumentCardProps) {
  const meta = getDocumentTypeMeta(document.type);
  const Icon = DOC_ICONS[document.type];

  return (
    <article
      className={cn(
        'group flex cursor-pointer items-start gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-border hover:shadow-sm',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', meta.className)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{document.title}</h3>
          <Badge className={cn('border-0 text-[10px]', meta.className)}>{meta.label}</Badge>
        </div>
        {document.content && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {document.content}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          {folderName && <span>{folderName}</span>}
          {folderName && <span>·</span>}
          <span>Updated {formatRelativeDate(document.updatedAt)}</span>
          {document.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted/60 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="cursor-pointer shrink-0 rounded-md px-2 py-1 text-xs text-red-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10 dark:text-red-400"
        >
          Delete
        </button>
      )}
    </article>
  );
}
