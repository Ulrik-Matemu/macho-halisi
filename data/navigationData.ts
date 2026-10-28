import { destinations, type DestinationCategory } from "./destinations";
import { CATEGORY_FILTERS } from "./destinationCategories";

export interface NavSubItem {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  href: string;
  image: string;
  badge?: string;
  highlights?: string[];
}

export interface NavCategory {
  id: string;
  title: string;
  href: string;
  featuredDefaultId: string;
  subItems: NavSubItem[];
}

/**
 * The DESTINATIONS menu entry. Its middle column lists the destination
 * categories (not the individual destinations); each links to the
 * /destinations explorer pre-filtered to that category. Generated from
 * data/destinations.ts so the counts and preview images can't drift.
 */
const destinationCategorySubItems: NavSubItem[] = CATEGORY_FILTERS.filter(
  (filter): filter is { value: DestinationCategory; label: string } => filter.value !== "all"
).flatMap((filter) => {
  const inCategory = destinations.filter((d) => d.category === filter.value);
  if (inCategory.length === 0) return [];
  return [
    {
      id: `category-${filter.value}`,
      title: filter.label.toUpperCase(),
      tagline: `${inCategory.length} destinations`,
      description: inCategory
        .slice(0, 4)
        .map((d) => d.name)
        .join(", "),
      href: `/destinations?category=${filter.value}`,
      image: inCategory[0].heroImage,
    },
  ];
});

export const navigationData: NavCategory[] = [
  {
    id: "about",
    title: "ABOUT MACHO HALISI",
    href: "/about",
    featuredDefaultId: "our-story",
    subItems: [
      {
        id: "our-story",
        title: "ABOUT US",
        tagline: "Genuine Eyes on the Wild",
        description:
          "A 100% Tanzanian-owned safari company founded by Dawson Minja in Karatu, creating authentic African adventures for more than seventeen years.",
        href: "/about",
        image:
          "/media/about/team/guides-team.jpg",
        badge: "Native Born & Led",
        highlights: ["100% Tanzanian Owned", "17+ Years", "Fleet of 20 Safari Vehicles"],
      },
      {
        id: "how-we-plan",
        title: "HOW WE PLAN",
        tagline: "",
        description: "",
        href: "/how-we-plan",
        image: "/media/about/fleet/cruiser-three-quarter.jpg",
        badge: "Why Macho Halisi",
        highlights: ["How we plan"],
      },
      {
        id: "why-book",
        title: "WHY BOOK WITH US",
        tagline: "We Provide the Experience. You Create the Memories.",
        description:
          "We know Tanzania, tailor every itinerary, and look after safety and responsible tourism — so you can simply enjoy the journey.",
        href: "/why-book-with-us",
        image:
          "/media/about/fleet/cruiser-three-quarter.jpg",
        badge: "Why Macho Halisi",
        highlights: ["Tailor-Made Journeys", "Expert Guides", "Safety First"],
      },
      {
        id: "travel-information",
        title: "TRAVEL INFORMATION",
        tagline: "Visas, Packing & Bush Logistics",
        description:
          "Everything to prepare for a Tanzanian safari — visas, baggage limits, climate and clothing, photography, currency, park rules, tipping, and health and safety.",
        href: "/travel-information",
        image:
          "/media/about/fleet/fleet-lineup-grass.jpg",
        badge: "Field Guide",
        highlights: ["Visas & Baggage", "USD 2013+ Rules", "AMREF Air Cover"],
      },
    ],
  },
  {
    id: "destinations",
    title: "DESTINATIONS",
    href: "/destinations",
    featuredDefaultId: "category-national-park",
    subItems: destinationCategorySubItems,
  },
  {
    id: "experiences",
    title: "ACTIVITIES & EXPERIENCES",
    href: "/experiences",
    featuredDefaultId: "hot-air-balloon",
    subItems: [
      {
        id: "hot-air-balloon",
        title: "HOT AIR BALLOON SAFARIS",
        tagline: "Dawn Flights Over the Savannah",
        description:
          "Float silently over the awakening plains at sunrise, observing herds from above before enjoying a champagne bush breakfast under an acacia tree.",
        href: "/experiences/balloon-safari",
        image: "/media/serengeti/sere-baloon.jpg",
        badge: "Aerial View",
        highlights: ["Sunrise Panorama", "Champagne Bush Breakfast", "Silent Flight"],
      },
      {
        id: "maasai-hadzabe",
        title: "CULTURAL EXPERIENCES",
        tagline: "Maasai, Hadzabe & Datoga Communities",
        description:
          "Meet the Maasai, Hadzabe and Datoga communities and learn about their traditions, knowledge and craftsmanship.",
        href: "/experiences/cultural-encounters",
        image: "/media/ngorongoro/ngoro-maasai.jpg",
        badge: "Cultural Heritage",
        highlights: ["Maasai Bomas", "Hadzabe Hunt Walk", "Datoga Blacksmiths"],
      },
      {
        id: "coffee-tours",
        title: "COFFEE TOURS",
        tagline: "Karatu Coffee Estates",
        description:
          "Walk the coffee plantations of Karatu, see how cherries become roasted beans and finish with a crop-to-cup tasting.",
        href: "/experiences/coffee-tours",
        image: "/media/experiences/coffee-tours/picking-cherries.jpg",
        badge: "Farm to Cup",
        highlights: ["Farm Walk", "Roast & Prepare", "Crop-to-Cup Tasting"],
      },
      {
        id: "waterfall-hot-spring",
        title: "WATERFALLS & HOT SPRINGS",
        tagline: "Endoro, Materuni, Napuru & Chemka",
        description:
          "Forest trails, mountain waterfalls and the turquoise Chemka springs, a refreshing change of pace from game drives.",
        href: "/experiences/waterfall-hot-spring",
        image: "/media/kilimanjaro/kili-ariel.jpg",
        badge: "Nature Day Out",
        highlights: ["Endoro & Elephant Caves", "Materuni Waterfall", "Chemka Hot Springs"],
      },
      {
        id: "canoeing",
        title: "CANOEING",
        tagline: "Lake Duluti & Lake Manyara",
        description:
          "Experience northern Tanzania from the water on a peaceful crater lake or beneath the Rift Valley escarpment.",
        href: "/experiences/canoeing",
        image: "/media/arusha-national-park/Arusha_National_Park_Momella_Lake_Flamingos_83.jpg",
        badge: "On the Water",
        highlights: ["Lake Duluti", "Lake Manyara", "Birdlife"],
      },
      {
        id: "night-game-drives",
        title: "NIGHT GAME DRIVES",
        tagline: "Lake Manyara & Tarangire",
        description:
          "Discover the wilderness after dark with an experienced guide, where authorised night drives are available.",
        href: "/experiences/night-game-drives",
        image: "/media/experiences/night-game-drives/leopard.jpg",
        badge: "After Dark",
        highlights: ["Nocturnal Wildlife", "Guided Observation", "A Different Ecosystem"],
      },
    ],
  },
  {
    id: "journeys",
    title: "BESPOKE JOURNEYS & ACCOMODATIONS",
    // Mirrors the collections in data/journeys.ts (not imported here —
    // this file ships in the client bundle via FullscreenNavMenu).
    href: "/itineraries",
    featuredDefaultId: "view-all-journeys",
    subItems: [
      {
        id: "view-all-journeys",
        title: "SAFARI ITINERARIES",
        tagline: "7 · 9 · 10 · 12 · 15 Days",
        description:
          "Browse our 7, 9, 10, 12 and 15-day Macho Halisi itineraries — full day-by-day programmes with lodges and meal plans. Enquire and we tailor any of them to you.",
        href: "/itineraries",
        image:
          "/media/serengeti/seronera-valley.jpg",
        highlights: [],
      },
      {
        id: "camps-and-lodges",
        title: "CAMPS & LODGES",
        tagline: "Where to Stay Across Tanzania",
        description:
          "Hand-picked safari lodges, tented camps, hotels and beach retreats — in the parks and in the nearest base towns — for every destination we visit.",
        href: "/camps-lodges",
        image: "/media/arusha-national-park/fig-tree.jpg",
        highlights: [],
      },
    ],
  },
  {
    id: "camps-lodges",
    title: "OUR LODGE",
    // Sub-items are not curated here: FullscreenNavMenu fills this
    // category from the published accommodations in the database.
    href: "/accommodations",
    featuredDefaultId: "",
    subItems: [],
  },
];
