'use client';

import {
  BookOpen,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  Megaphone,
  Palette,
  Trash2,
} from 'lucide-react';
import type { ProjectLink, ProjectLinkType } from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import { getLinkTypeMeta, LINK_TYPE_META } from '@/modules/projects/core/workspace-utils';

const LINK_ICONS: Record<ProjectLinkType, typeof Link2> = {
  figma: Palette,
  github: Code2,
  notion: BookOpen,
  production: Globe,
  docs: FileText,
  api: Link2,
  marketing: Megaphone,
  other: Link2,
};

interface LinkCardProps {
  link: ProjectLink;
  onDelete?: () => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const meta = getLinkTypeMeta(link.type);
  const Icon = LINK_ICONS[link.type];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
    } catch {
      /* ignore */
    }
  };

  let hostname = link.url;
  try {
    hostname = new URL(link.url).hostname;
  } catch {
    /* invalid url */
  }

  return (
    <article
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-sm"
      style={{ borderTopColor: `${meta.accent}40`, borderTopWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.accent}15`, color: meta.accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', meta.className)}>
          {meta.label}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">{link.title}</h3>
      {link.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {link.description}
        </p>
      )}
      <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{hostname}</p>

      <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-4">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Copy URL
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="cursor-pointer rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100 dark:hover:text-red-400"
            aria-label="Delete link"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </article>
  );
}
