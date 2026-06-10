'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';
import { descriptionToHtml, isEmptyDescription } from '@/modules/kanban/core/description-utils';

interface RichDescriptionEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

type FormatCommand =
  | 'bold'
  | 'italic'
  | 'strikeThrough'
  | 'insertUnorderedList'
  | 'insertOrderedList'
  | 'formatBlock'
  | 'createLink';

export function RichDescriptionEditor({
  value,
  onChange,
  placeholder = 'Write a description — use the toolbar to format text…',
  className,
}: RichDescriptionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = descriptionToHtml(value);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- init only; remount via key

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (!sel || !savedRange.current) return;
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  };

  const exec = useCallback((command: FormatCommand, val?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();
    document.execCommand(command, false, val);
    saveSelection();
    onChange(el.innerHTML);
  }, [onChange]);

  const handleLink = () => {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  const handleHeading = () => {
    exec('formatBlock', 'h2');
  };

  const handleQuote = () => {
    exec('formatBlock', 'blockquote');
  };

  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  };

  const handleBlur = () => {
    saveSelection();
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  };

  const isEmpty = isEmptyDescription(value);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border/70 bg-muted/10 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/50 bg-muted/20 px-2 py-1.5">
        <ToolbarButton label="Bold" onClick={() => exec('bold')}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => exec('italic')}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" onClick={() => exec('strikeThrough')}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton label="Heading" onClick={handleHeading}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" onClick={() => exec('insertUnorderedList')}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => exec('insertOrderedList')}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={handleQuote}>
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={handleLink}>
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      <div className="relative min-h-[160px] px-4 py-3">
        {isEmpty && (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          className={cn(
            'min-h-[140px] text-sm leading-relaxed text-foreground outline-none',
            '[&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold',
            '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
            '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
            '[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
            '[&_a]:text-primary [&_a]:underline',
            '[&_p]:my-1',
          )}
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  );
}
