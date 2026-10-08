import { Eye, Compass, Truck, HeartHandshake, type LucideIcon } from "lucide-react";
import { whyBookPillars } from "@/data/aboutData";

// Maps the icon names stored in aboutData to their lucide components.
const ICONS: Record<string, LucideIcon> = { Eye, Compass, Truck, HeartHandshake };

/**
 * "Why book with us" value pillars. Square cards; the icon sits in a
 * circular badge (intentional rounded-full shape).
 */
export default function ValuePillars() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
      {whyBookPillars.map((pillar) => {
        const Icon = ICONS[pillar.icon] ?? Compass;
        return (
          <div
            key={pillar.title}
            className="bg-white/70 border border-safari-bark/10 p-6 sm:p-8 shadow-sm flex flex-col gap-4"
          >
            <span className="w-11 h-11 rounded-full bg-safari-russet/12 border border-safari-russet/25 text-safari-russet flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-luxury text-xl text-safari-bark mb-2">{pillar.title}</h3>
              <p className="font-sans font-light text-sm text-safari-bark/70 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
