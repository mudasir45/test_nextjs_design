export type SaveStatus = 'saved' | 'unsaved' | 'saving';

export function insertAroundSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after = '',
  placeholder = 'text',
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const next = `${textarea.value.slice(0, start)}${before}${selected}${after}${textarea.value.slice(end)}`;
  const cursor = start + before.length + selected.length + after.length;
  return { next, cursor };
}

export function insertLinePrefix(textarea: HTMLTextAreaElement, prefix: string) {
  const start = textarea.selectionStart;
  const value = textarea.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', start);
  const end = lineEnd === -1 ? value.length : lineEnd;
  const line = value.slice(lineStart, end);
  const stripped = line.replace(/^#{1,6}\s+|^[-*]\s+|^\d+\.\s+|^>\s+/, '');
  const nextLine = `${prefix}${stripped}`;
  const next = `${value.slice(0, lineStart)}${nextLine}${value.slice(end)}`;
  const cursor = lineStart + nextLine.length;
  return { next, cursor };
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Lightweight markdown preview for document content. */
export function renderMarkdownPreview(content: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return content
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('### ')) {
        return `<h3 class="text-base font-semibold text-foreground mt-6 mb-2">${escape(trimmed.slice(4))}</h3>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 class="text-lg font-semibold text-foreground mt-8 mb-3">${escape(trimmed.slice(3))}</h2>`;
      }
      if (trimmed.startsWith('# ')) {
        return `<h1 class="text-xl font-bold text-foreground mt-8 mb-3">${escape(trimmed.slice(2))}</h1>`;
      }
      if (trimmed.startsWith('> ')) {
        return `<blockquote class="border-l-2 border-violet-500/40 pl-4 text-muted-foreground italic">${escape(trimmed.slice(2))}</blockquote>`;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed
          .split('\n')
          .map((line) => line.replace(/^[-*]\s+/, ''))
          .map((line) => `<li>${formatInline(escape(line))}</li>`)
          .join('');
        return `<ul class="list-disc space-y-1 pl-5 text-sm leading-relaxed">${items}</ul>`;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed
          .split('\n')
          .map((line) => line.replace(/^\d+\.\s+/, ''))
          .map((line) => `<li>${formatInline(escape(line))}</li>`)
          .join('');
        return `<ol class="list-decimal space-y-1 pl-5 text-sm leading-relaxed">${items}</ol>`;
      }
      return `<p class="text-sm leading-relaxed text-foreground/90">${formatInline(escape(trimmed.replace(/\n/g, '<br/>')))}</p>`;
    })
    .filter(Boolean)
    .join('');
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-violet-600 underline dark:text-violet-400" target="_blank" rel="noopener noreferrer">$1</a>');
}
