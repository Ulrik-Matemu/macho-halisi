/** Shared formatting helpers so every screen renders dates/prices identically. */

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPrice(value: number | string): string {
  return `$${Number(value).toLocaleString()}`;
}
