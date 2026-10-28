import type { CampLodge, LodgeKind, LodgeTier } from "@/data/campsLodges";
import type { LodgeHubId } from "@/data/campsLodgeHubs";

/**
 * Compact authoring shape for the camps & lodges data files. Photos live at
 * /media/camps-lodges/<slug>/hero.jpg and gallery-N.jpg; `imageAlts[0]`
 * describes the cover and the rest the gallery. Omit `imageAlts` when no
 * openly licensed photo has been sourced yet.
 */
export interface LodgeSpec {
  slug: string;
  name: string;
  kind: LodgeKind;
  tier: LodgeTier;
  hub: LodgeHubId;
  location: string;
  tagline: string;
  summary: string;
  description: string[];
  highlights: [title: string, description: string][];
  features: string[];
  idealFor: string[];
  destinations?: string[];
  imageAlts?: string[];
  featured?: boolean;
}

export function defineLodge(spec: LodgeSpec): CampLodge {
  const dir = `/media/camps-lodges/${spec.slug}`;
  return {
    slug: spec.slug,
    name: spec.name,
    kind: spec.kind,
    tier: spec.tier,
    hub: spec.hub,
    location: spec.location,
    tagline: spec.tagline,
    summary: spec.summary,
    description: spec.description,
    highlights: spec.highlights.map(([title, description]) => ({ title, description })),
    features: spec.features,
    idealFor: spec.idealFor,
    destinations: spec.destinations ?? [],
    featured: spec.featured ?? false,
    images: (spec.imageAlts ?? []).map((alt, i) => ({
      url: `${dir}/${i === 0 ? "hero" : `gallery-${i}`}.jpg`,
      alt,
    })),
  };
}
