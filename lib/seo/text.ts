/**
 * Trims text for meta descriptions and summaries on a word boundary, with
 * an ellipsis, instead of cutting mid-word. Collapses whitespace first so
 * paragraph breaks from CMS text don't leak into <meta> tags.
 */
export function clip(text: string, max = 158): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(" ")) || cut;
  return `${atWord.replace(/[\s,;:.–—-]+$/, "")}…`;
}

/** "Serengeti, Ngorongoro and Zanzibar" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
