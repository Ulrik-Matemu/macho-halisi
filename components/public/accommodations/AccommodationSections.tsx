import { Check, Users } from "lucide-react";
import {
  SPACE_GROUPS,
  ACTIVITY_CATEGORY_LABELS,
  type AccommodationSpace,
  type NearbyPlace,
  type AccommodationActivity,
  type ActivityCategory,
} from "@/lib/accommodations/types";

const H2 = "font-serif-luxury text-2xl text-white font-light tracking-wide mb-6";

/** Rooms, camping, dining, wellness and meeting spaces, grouped by category. */
export function SpacesSection({ spaces }: { spaces: AccommodationSpace[] }) {
  const groups = SPACE_GROUPS.map(({ label, categories }) => ({
    label,
    items: categories.flatMap((c) => spaces.filter((s) => s.category === c)),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <>
      {groups.map(({ label, items }) => (
        <section key={label}>
          <h2 className={H2}>{label}</h2>
          <div className="space-y-8">
            {items.map((space) => (
              <div key={space.name} className="border-l border-safari-gold/40 pl-5">
                <h3 className="font-serif-luxury text-xl text-white font-light tracking-wide">{space.name}</h3>
                {space.tagline && (
                  <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-safari-gold mt-1">
                    {space.tagline}
                  </p>
                )}
                {space.description && (
                  <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed whitespace-pre-line mt-3">
                    {space.description}
                  </p>
                )}
                {space.capacity && (
                  <p className="flex items-center gap-1.5 text-sm text-white/60 font-sans mt-3">
                    <Users className="w-4 h-4 text-safari-ochre shrink-0" />
                    Up to {space.capacity}
                  </p>
                )}
                {space.features.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                    {space.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70 font-sans">
                        <Check className="w-4 h-4 text-safari-ochre shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function NearbySection({ places }: { places: NearbyPlace[] }) {
  if (places.length === 0) return null;
  return (
    <section>
      <h2 className={H2}>A Gateway to Northern Tanzania</h2>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {places.map((p) => (
          <li key={p.name} className="py-4 flex gap-5">
            <span className="w-20 shrink-0 text-safari-gold font-sans text-sm tabular-nums pt-0.5">
              {p.distanceKm ? `~${p.distanceKm} km` : ""}
            </span>
            <div>
              <h3 className="text-white font-sans">{p.name}</h3>
              {p.description && <p className="text-sm text-white/60 font-sans leading-relaxed mt-1">{p.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const ACTIVITY_ORDER: ActivityCategory[] = ["SAFARI", "CULTURE", "WALK"];

export function ActivitiesSection({ activities }: { activities: AccommodationActivity[] }) {
  const groups = ACTIVITY_ORDER.map((category) => ({
    category,
    items: activities.filter((a) => a.category === category),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section>
      <h2 className={H2}>Safari Adventures &amp; Local Experiences</h2>
      <div className="space-y-8">
        {groups.map(({ category, items }) => (
          <div key={category}>
            <h3 className="text-[11px] font-sans tracking-[0.25em] uppercase text-safari-gold mb-3">
              {ACTIVITY_CATEGORY_LABELS[category]}
            </h3>
            <ul className="space-y-3">
              {items.map((a) => (
                <li key={a.name} className="text-sm sm:text-base font-sans leading-relaxed">
                  <span className="text-white">{a.name}</span>
                  {a.description && <span className="text-white/60"> — {a.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-sm text-white/50 font-sans mt-6">
        We can assist guests in arranging excursions suited to their interests, schedules, and sense of adventure.
      </p>
    </section>
  );
}
