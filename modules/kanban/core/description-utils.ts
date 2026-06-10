/** Plain-text preview for cards — strips HTML when description is rich text. */
export function stripDescriptionHtml(value?: string): string {
  if (!value) return '';
  if (!/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function descriptionToHtml(value?: string): string {
  if (!value) return '';
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
}

export function isEmptyDescription(html?: string): boolean {
  if (!html) return true;
  const text = stripDescriptionHtml(html);
  return text.length === 0;
}
