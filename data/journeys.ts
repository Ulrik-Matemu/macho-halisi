/**
 * Journey collections — design source: Claude Design project
 * 97cc8521-65d3-4bbc-9442-088e8a572c22, "Journey Collection.dc.html". Copy,
 * lengths, facets and prices are taken verbatim from that file's data block.
 *
 * The design leaves every image as an empty slot, so they are filled from
 * the vetted photos already used by data/destinations.ts (matched by subject)
 * until the client supplies journey-specific photography.
 */

export interface JourneyImage {
  url: string;
  alt: string;
}

export interface Journey {
  name: string;
  sub: string;
  /** In the collection's `unit`. */
  length: number;
  facet: string;
  /** "From" price in USD; null means price on request. */
  price: number | null;
  image: JourneyImage;
  /** When set, the journey links to its published itinerary page instead of opening an enquiry. */
  itinerarySlug?: string;
}

export interface JourneyCollection {
  slug: string;
  /** Label in the collection tab row. */
  tab: string;
  line1: string;
  line2: string;
  eyebrow: string;
  unit: "days" | "hours";
  /** Heading for the second filter group, e.g. "Difficulty". */
  facetLabel: string;
  caption: string;
  lead: string;
  facts: { label: string; value: string }[];
  heroImage: JourneyImage;
  seoDescription: string;
  items: Journey[];
}

/**
 * Photos already vetted on the site (data/destinations.ts), keyed by
 * subject so each journey gets an image that fits it.
 */
const PHOTOS = {
  kiliTrail: ["/media/kilimanjaro/lemosho.jpg", "A trekker on Kilimanjaro's high-altitude mountain trail"],
  rainforest: ["1747241118490-818d37b2bdae", "A waterfall cascading through montane rainforest"],
  highland: ["/media/kilimanjaro/kili-ariel.jpg", "A green highland trail across an open plateau"],
  plainsVehicle: ["/media/experiences/game-drive-guests.jpg", "A safari vehicle on the Serengeti plains"],
  goldenPlains: ["/media/serengeti/southern-plains.jpg", "Golden grassland plains at dusk"],
  lions: ["/media/serengeti/sere-lion-couple.jpg", "Lions resting in the long grass"],
  lodge: ["1566073771259-6a8506099945", "A luxury safari lodge at dusk"],
  elephant: ["/media/manyara/elephant.jpg", "An elephant walking through the bush"],
  elephantsDusk: ["/media/experiences/elephant-vehicle.jpg", "Elephants beneath the baobabs at dusk"],
  acacia: ["/media/serengeti/seronera-valley.jpg", "A lone acacia tree on the savannah"],
  giraffe: ["1549854233-ca0baec6fa74", "A giraffe standing in open grassland"],
  chimp: ["1742328114651-f4dbd710cd5d", "A chimpanzee resting in the forest"],
  flamingos: ["/media/manyara/flamingo.jpg", "Flamingos wading in the pink waters of Lake Natron"],
  riftRoad: ["/media/ngorongoro/ngoro-ariel.jpg", "A dirt road crossing the plains near Olduvai Gorge"],
  oceanTerrace: ["1586861635167-e5223aadc9fe", "A poolside terrace overlooking the turquoise Indian Ocean"],
  resortPool: ["1571896349842-33c89424de2d", "A private beachfront pool at night"],
  turquoise: ["/media/zanzibar/mnemba-atoll.jpg", "Aerial view of turquoise coastal waters"],
  reef: ["1664552348837-367b555cfaa9", "A snorkeller over coral reefs"],
  ruins: ["/media/zanzibar/stone-town.jpg", "Historic Swahili stone ruins on the coast"],
  boats: ["1740824570732-f2a2d2557dd5", "Traditional wooden boats pulled up on the shore"],
} as const satisfies Record<string, readonly [string, string]>;

function photo(key: keyof typeof PHOTOS, w = 1400): JourneyImage {
  const [id, alt] = PHOTOS[key];
  // Local files under /media are returned untouched (next/image handles
  // their sizing); anything else is still an Unsplash photo id, so the keys
  // with no in-house photograph yet keep working.
  const url = id.startsWith("/")
    ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;
  return { url, alt };
}

const J = (
  name: string,
  sub: string,
  length: number,
  facet: string,
  price: number | null,
  image: JourneyImage
): Journey => ({ name, sub, length, facet, price, image });

export const DEFAULT_COLLECTION_SLUG = "signature-itineraries";

export const journeyCollections: JourneyCollection[] = [
  {
    slug: "kilimanjaro-routes",
    tab: "Kilimanjaro Routes",
    line1: "Kilimanjaro",
    line2: "Routes",
    eyebrow: "Uhuru Peak · 5,895 m",
    unit: "days",
    facetLabel: "Difficulty",
    caption: "Barranco Wall · Machame route",
    lead: "Seven ways up the same mountain, each with its own forest, its own camps and its own summit night. The route matters more than the fitness.",
    facts: [
      { label: "Summit", value: "5,895 m" },
      { label: "Best months", value: "Jan – Mar · Jun – Oct" },
      { label: "Success, 8-day", value: "≈ 95%" },
    ],
    heroImage: photo("kiliTrail", 2200),
    seoDescription:
      "Compare every Kilimanjaro route — Machame, Lemosho, Marangu, Rongai, Northern Circuit, Umbwe and Shira — by length, difficulty and price, with private climbs from Macho Halisi.",
    items: [
      J("Machame", "The Whiskey Route — scenic, busy, strong acclimatisation profile", 7, "Challenging", 3450, photo("kiliTrail")),
      J("Lemosho", "The western approach through remote rainforest and the Shira Plateau", 8, "Moderate", 3890, photo("rainforest")),
      J("Marangu", "The only route with hut accommodation, direct ascent from the south-east", 6, "Moderate", 2950, photo("highland")),
      J("Rongai", "The quiet northern approach from the Kenyan border — drier, fewer climbers", 7, "Moderate", 3380, photo("kiliTrail")),
      J("Northern Circuit", "The longest route, circling the summit cone for the best acclimatisation", 9, "Moderate", 4450, photo("highland")),
      J("Umbwe", "The steepest and most direct line, for experienced trekkers only", 6, "Demanding", 3150, photo("rainforest")),
      J("Shira", "High start on the Shira Plateau by vehicle, joining the Lemosho line", 7, "Challenging", 3520, photo("kiliTrail")),
    ],
  },
  {
    slug: "kilimanjaro-climbing-itineraries",
    tab: "Climbing Itineraries",
    line1: "Kilimanjaro",
    line2: "Climbing Itineraries",
    eyebrow: "Fixed-departure & private",
    unit: "days",
    facetLabel: "Difficulty",
    caption: "Summit dawn · Stella Point",
    lead: "Every route in the lengths we actually recommend, plus climbs paired with a safari or the coast. Private climbs start any day you choose.",
    facts: [
      { label: "Departures", value: "Daily, private" },
      { label: "Crew ratio", value: "3 – 4 per climber" },
      { label: "Includes", value: "Park & rescue fees" },
    ],
    heroImage: photo("highland", 2200),
    seoDescription:
      "Private Kilimanjaro climbing itineraries from 5 to 12 days — Lemosho, Machame, Marangu, Rongai and Northern Circuit, plus summit-and-safari and summit-and-Zanzibar combinations.",
    items: [
      J("Machame, 6 Days", "Fast Whiskey Route for fit, altitude-tested climbers", 6, "Demanding", 2990, photo("kiliTrail")),
      J("Machame, 7 Days", "The classic — an extra night at Karanga for acclimatisation", 7, "Challenging", 3450, photo("rainforest")),
      J("Lemosho, 7 Days", "Western approach with a short plateau crossing", 7, "Challenging", 3620, photo("highland")),
      J("Lemosho, 8 Days", "Our most recommended climb — highest success, fewer crowds", 8, "Moderate", 3890, photo("kiliTrail")),
      J("Lemosho, 9 Days", "Unhurried, with a Crater Camp night beside the glaciers", 9, "Moderate", 4640, photo("rainforest")),
      J("Marangu, 5 Days", "Hut-to-hut, the shortest option available", 5, "Demanding", 2490, photo("highland")),
      J("Marangu, 6 Days", "With an acclimatisation day at Horombo Huts", 6, "Moderate", 2950, photo("kiliTrail")),
      J("Rongai, 6 Days", "Northern approach, direct", 6, "Challenging", 3050, photo("highland")),
      J("Rongai, 7 Days", "Via Mawenzi Tarn for a better profile", 7, "Moderate", 3380, photo("rainforest")),
      J("Northern Circuit, 9 Days", "Full circuit, quietest trails on the mountain", 9, "Moderate", 4450, photo("kiliTrail")),
      J("Northern Circuit, 10 Days", "The longest, gentlest climb we offer", 10, "Moderate", 4890, photo("highland")),
      J("Umbwe, 6 Days", "Steep and direct, for experienced mountaineers", 6, "Demanding", 3150, photo("rainforest")),
      J("Full Moon Lemosho, 8 Days", "Timed so summit night falls under a full moon", 8, "Moderate", 4190, photo("kiliTrail")),
      J("Lemosho & Serengeti, 12 Days", "Summit, then four nights on safari to recover", 12, "Moderate", 9480, photo("plainsVehicle")),
      J("Machame & Zanzibar, 11 Days", "Summit, then four nights on the Indian Ocean", 11, "Challenging", 6120, photo("oceanTerrace")),
    ],
  },
  {
    slug: "zanzibar-journeys",
    tab: "Zanzibar Journeys",
    line1: "Zanzibar",
    line2: "Journeys",
    eyebrow: "Indian Ocean · Spice Islands",
    unit: "days",
    facetLabel: "Style",
    caption: "Dhow at dusk · Nungwi",
    lead: "Stone Town alleys, reef lagoons and a slower clock. Take the island on its own or as the soft landing after the mountain or the plains.",
    facts: [
      { label: "Flight from Arusha", value: "1h 20m" },
      { label: "Best months", value: "Jun – Oct · Dec – Feb" },
      { label: "Water", value: "26 – 29 °C" },
    ],
    heroImage: photo("boats", 2200),
    seoDescription:
      "Zanzibar journeys from a long weekend in Stone Town to island-hopping Pemba and Mafia — beach, culture, honeymoon and diving trips on Tanzania's Swahili coast.",
    items: [
      J("Stone Town & Spice Coast", "Two nights in the old town, then the north-east shore", 6, "Culture", 2380, photo("boats")),
      J("Zanzibar Barefoot", "A week on the sand and nothing else asked of you", 7, "Beach", 2690, photo("oceanTerrace")),
      J("Mnemba Private Island", "The atoll, the house reef and a handful of bandas", 5, "Honeymoon", null, photo("turquoise")),
      J("Pemba & Zanzibar", "The wilder sister island, then the classic coast", 8, "Island-hop", 3940, photo("reef")),
      J("Mafia Island Whale Sharks", "Seasonal swims in the marine park, Oct – Feb", 5, "Island-hop", 2880, photo("reef")),
      J("Honeymoon on the Reef", "Private villa, sandbank picnic, sunset dhow", 7, "Honeymoon", 4150, photo("resortPool")),
      J("Zanzibar for Families", "Shallow lagoons, turtles and a slower pace", 8, "Beach", 3560, photo("turquoise")),
      J("Swahili Coast Heritage", "Stone Town, Bagamoyo and the Kilwa ruins", 9, "Culture", 4280, photo("ruins")),
      J("Diving the Channel", "Nine dives across Mnemba and Leven Bank", 6, "Beach", 2740, photo("reef")),
      J("Long Weekend in Stone Town", "Rooftops, markets and the Forodhani food stalls", 3, "Culture", 1180, photo("boats")),
    ],
  },
  {
    slug: "spice-tours",
    tab: "Spice Tours",
    line1: "Spice",
    line2: "Tours",
    eyebrow: "Zanzibar farms & kitchens",
    unit: "hours",
    facetLabel: "Format",
    caption: "Clove harvest · Kizimbani",
    lead: "Cloves, vanilla, cardamom and nutmeg — walked, picked, cooked and eaten with the families who grow them.",
    facts: [
      { label: "Pick-up", value: "Stone Town & coast" },
      { label: "Season", value: "Year-round" },
      { label: "Group", value: "Private" },
    ],
    heroImage: photo("rainforest", 2200),
    seoDescription:
      "Private Zanzibar spice tours — farm walks at Kizimbani, Swahili cooking classes, vanilla and cocoa estates and spice-farm dinners, with pick-up from Stone Town and the coast.",
    items: [
      J("Classic Spice Farm Walk", "Guided walk through a working organic farm near Kizimbani", 3, "Half-day", 95, photo("highland")),
      J("Spice & Stone Town", "Morning on the farm, afternoon in the old town", 7, "Full-day", 185, photo("ruins")),
      J("Swahili Cooking Class", "Market shop, then a four-course lunch you cook yourself", 5, "Culinary", 160, photo("oceanTerrace")),
      J("Vanilla & Cocoa Estate", "Small-grower estate tasting in the island interior", 4, "Half-day", 120, photo("rainforest")),
      J("Spice Farm to Sunset Dhow", "Farm lunch, then an evening sail off Mtoni", 8, "Full-day", 240, photo("boats")),
      J("Private Chef Spice Dinner", "Spice farm visit and a candlelit dinner at the farmhouse", 6, "Culinary", 290, photo("resortPool")),
    ],
  },
  {
    slug: "signature-itineraries",
    tab: "Signature Itineraries",
    line1: "Signature",
    line2: "Itineraries",
    eyebrow: "Safari · Mountain · Coast",
    unit: "days",
    facetLabel: "Style",
    caption: "Morning drive · Central Serengeti",
    lead: "Our most-travelled journeys across Tanzania. Every one is private, and every one is a starting point rather than a fixed programme.",
    facts: [
      { label: "Regions", value: "North · South · Coast" },
      { label: "Private", value: "Every journey" },
      { label: "Tailor-made", value: "Always" },
    ],
    heroImage: photo("plainsVehicle", 2200),
    seoDescription:
      "Macho Halisi's signature Tanzania itineraries — private safaris, Kilimanjaro climbs and Zanzibar extensions across the north, south and coast, each tailor-made from a proven starting point.",
    items: [
      J("The Great Migration", "Serengeti and Ngorongoro, following the herds", 8, "Safari", 6450, photo("goldenPlains")),
      J("Roof of Africa", "Lemosho route, eight days to Uhuru Peak", 9, "Adventure", 4200, photo("kiliTrail")),
      J("The Southern Circuit", "Ruaha and Nyerere by light aircraft", 10, "Safari", null, photo("elephantsDusk")),
      J("Spice Coast & Sands", "Stone Town and the north-east coast", 7, "Safari & Beach", 3180, photo("oceanTerrace")),
      J("Tarangire & Manyara", "Elephant country and the Rift escarpment", 5, "Safari", 2740, photo("elephant")),
      J("Honeymoon in the Wild", "Serengeti camps and a private island finale", 11, "Honeymoon", null, photo("lodge")),
      J("Culture & Coffee Trails", "Arusha, Karatu and the highland farms", 4, "Family", 1690, photo("highland")),
      J("Migration River Crossings", "Northern Serengeti, July to October", 6, "Safari", 5900, photo("plainsVehicle")),
      J("Northern Circuit Classic", "Tarangire, Crater and Serengeti", 7, "Safari", 4380, photo("acacia")),
      J("Calving Season Ndutu", "February on the southern short-grass plains", 6, "Safari", 5280, photo("goldenPlains")),
      J("Safari & Summit", "Five days on the plains, eight on the mountain", 14, "Adventure", 9850, photo("kiliTrail")),
      J("Family Safari Adventure", "Short drives, pools and child-friendly camps", 8, "Family", 5640, photo("giraffe")),
      J("Chimpanzees of Mahale", "Lake Tanganyika and the Mahale forests", 7, "Adventure", null, photo("chimp")),
      J("Selous to Sands", "Nyerere boat safaris, then Zanzibar", 9, "Safari & Beach", 5120, photo("turquoise")),
      J("Lake Natron & Ol Doinyo", "Flamingos and a night climb of the volcano", 5, "Adventure", 2960, photo("flamingos")),
      J("Walking the Wild South", "Walking and fly-camping in Ruaha", 8, "Adventure", 6280, photo("elephantsDusk")),
      J("The Grand Tanzania", "North, south and coast in one long journey", 16, "Safari & Beach", null, photo("acacia")),
      J("Photographic Serengeti", "Custom vehicles and golden-hour timing", 9, "Safari", 8900, photo("lions")),
      J("Crater & Coast", "Ngorongoro, then a week on the beach", 9, "Safari & Beach", 4860, photo("resortPool")),
      J("Short Serengeti Escape", "Three nights by air from Arusha", 4, "Safari", 3240, photo("plainsVehicle")),
      J("Honeymoon Crater & Mnemba", "Crater lodge and a private atoll", 8, "Honeymoon", null, photo("lodge")),
      J("Multi-generational Tanzania", "Private houses, flexible pace, all ages", 10, "Family", 7420, photo("giraffe")),
      J("Kilimanjaro & Zanzibar", "Summit, then the Indian Ocean", 12, "Adventure", 6120, photo("reef")),
      J("Mahale & Katavi", "Remote west — chimps and buffalo herds", 10, "Adventure", null, photo("chimp")),
      J("Rift Valley Lakes", "Manyara, Eyasi and Natron by road", 6, "Family", 2880, photo("riftRoad")),
      J("Serengeti Balloon & Crater", "A dawn flight and a day inside the Crater", 6, "Safari", 4150, photo("lions")),
    ],
  },
];

export function getJourneyCollectionBySlug(slug: string): JourneyCollection | undefined {
  return journeyCollections.find((c) => c.slug === slug);
}

export function getAllJourneyCollectionSlugs(): string[] {
  return journeyCollections.map((c) => c.slug);
}
