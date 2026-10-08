import Link from "next/link";
import { breadcrumbs, JsonLd, type Crumb } from "@/lib/seo/jsonLd";

/**
 * Visible breadcrumb trail plus its BreadcrumbList JSON-LD, built from the
 * same list so the two can't disagree. The last crumb is the current page
 * (not a link). `visible={false}` emits only the structured data, for pages
 * whose full-bleed hero leaves no room for a trail.
 */
export default function Breadcrumbs({
  items,
  tone = "light",
  visible = true,
  className = "",
}: {
  items: Crumb[];
  /** "light" for the cream editorial pages, "dark" for the black ones. */
  tone?: "light" | "dark";
  visible?: boolean;
  className?: string;
}) {
  const muted = tone === "light" ? "text-safari-bark/55 hover:text-safari-russet" : "text-white/50 hover:text-safari-gold";
  const current = tone === "light" ? "text-safari-bark/80" : "text-white/80";
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbs(items)} />
      {visible && (
        <nav aria-label="Breadcrumb" className={`font-sans font-light text-[11px] tracking-[0.18em] uppercase ${className}`}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {all.map((c, i) => {
              const last = i === all.length - 1;
              return (
                <li key={c.path} className="flex items-center gap-2 min-w-0">
                  {last ? (
                    <span aria-current="page" className={`truncate ${current}`}>
                      {c.name}
                    </span>
                  ) : (
                    <>
                      <Link href={c.path} className={`transition-colors ${muted}`}>
                        {c.name}
                      </Link>
                      <span aria-hidden="true" className={tone === "light" ? "text-safari-bark/30" : "text-white/25"}>
                        /
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
}
