'use client';

import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';
import { cn } from '@/modules/projects/core/cn';

interface DocumentEditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onStrike: () => void;
  onH1: () => void;
  onH2: () => void;
  onH3: () => void;
  onBullet: () => void;
  onNumbered: () => void;
  onQuote: () => void;
  onCode: () => void;
  onLink: () => void;
  preview: boolean;
  onSetPreview: (preview: boolean) => void;
  className?: string;
}

function ToolbarBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Bold;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function DocumentEditorToolbar({
  onBold,
  onItalic,
  onStrike,
  onH1,
  onH2,
  onH3,
  onBullet,
  onNumbered,
  onQuote,
  onCode,
  onLink,
  preview,
  onSetPreview,
  className,
}: DocumentEditorToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/20 px-2 py-1.5',
        className,
      )}
    >
      <ToolbarBtn icon={Bold} label="Bold" onClick={onBold} />
      <ToolbarBtn icon={Italic} label="Italic" onClick={onItalic} />
      <ToolbarBtn icon={Strikethrough} label="Strikethrough" onClick={onStrike} />
      <span className="mx-1 h-5 w-px bg-border/60" />
      <ToolbarBtn icon={Heading1} label="Heading 1" onClick={onH1} />
      <ToolbarBtn icon={Heading2} label="Heading 2" onClick={onH2} />
      <ToolbarBtn icon={Heading3} label="Heading 3" onClick={onH3} />
      <span className="mx-1 h-5 w-px bg-border/60" />
      <ToolbarBtn icon={List} label="Bullet list" onClick={onBullet} />
      <ToolbarBtn icon={ListOrdered} label="Numbered list" onClick={onNumbered} />
      <ToolbarBtn icon={Quote} label="Quote" onClick={onQuote} />
      <ToolbarBtn icon={Code} label="Inline code" onClick={onCode} />
      <ToolbarBtn icon={Link} label="Link" onClick={onLink} />
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSetPreview(true)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            preview
              ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => onSetPreview(false)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            !preview
              ? 'bg-card text-foreground shadow-sm ring-1 ring-border/60'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
