/**
 * Safari experiences — design source: Claude Design project
 * 97cc8521-65d3-4bbc-9442-088e8a572c22, "Experience Page.dc.html". Copy is
 * taken verbatim from that file's data block; slugs follow the existing
 * hrefs in data/navigationData.ts so every nav link resolves.
 *
 * The design leaves the highlight, quote and place images as empty slots,
 * so they are filled from the same vetted Unsplash photos already used by
 * data/destinations.ts (and allow-listed in next.config.ts) until the
 * client supplies experience-specific photography.
 */

import { experienceLongform, type ExperienceLongform } from "@/data/experienceContent";

export interface ExperienceImage {
  url: string;
  alt: string;
}

export interface ExperienceGlanceItem {
  label: string;
  value: string;
}

export interface ExperienceHighlight {
  title: string;
  text: string;
  image: ExperienceImage;
}

export interface ExperienceDayEntry {
  time: string;
  title: string;
  text: string;
}

export interface ExperiencePlace {
  name: string;
  type: string;
  /** Matching page in data/destinations.ts. */
  destinationSlug: string;
  image: ExperienceImage;
}

export interface Experience {
  slug: string;
  /** Client-supplied long-form copy (data/experienceContent.ts). */
  longform: ExperienceLongform;
  short: string;
  line1: string;
  line2: string;
  badge: string;
  tagline: string;
  description: string;
  seoDescription: string;
  heroImage: string;
  heroImageAlt: string;
  glance: ExperienceGlanceItem[];
  highlights: ExperienceHighlight[];
  day: ExperienceDayEntry[];
  quote: string;
  quoteBy: string;
  quoteImage: ExperienceImage;
  places: ExperiencePlace[];
}

/**
 * Resolves a PHOTO entry to an image URL. Local files under /media are
 * returned untouched (next/image handles their sizing); anything else is
 * still treated as an Unsplash photo id and gets the CDN transform, so the
 * handful of keys with no in-house photograph yet keep working.
 */
const img = (id: string, w = 1400) =>
  id.startsWith("/")
    ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

const PHOTO = {
  plainsVehicle: "/media/experiences/game-drive-guests.jpg",
  goldenPlains: "/media/serengeti/southern-plains.jpg",
  hotAirBalloon: "/media/hot-air-baloon.jpg",
  lions: "/media/serengeti/sere-lion-couple.jpg",
  // No in-house lodge photography yet.
  lodge: "/media/accomodations/63bf7866.avif",
  elephant: "/media/manyara/elephant.jpg",
  elephantsDusk: "/media/experiences/elephant-vehicle.jpg",
  acacia: "/media/serengeti/seronera-valley.jpg",
  trail: "/media/NEW-TANZANIA-Kichaka-Expeditions-family-bush-walk-C_KE.jpg",
  // No in-house giraffe photograph yet.
  giraffe: "1626548307930-deac221f87d9",
  natron: "/media/manyara/flamingo.jpg",
  migration: "/media/great-migration/gm-hero.jpg",
  forest: "/media/manyara/manyara-hero.jpg",
};

type ExperienceBase = Omit<Experience, "longform">;

const baseExperiences: ExperienceBase[] = [
  {
    slug: "balloon-safari",
    short: "Hot Air Balloon Safaris",
    line1: "Hot Air Balloon",
    line2: "Safaris",
    badge: "Aerial View",
    tagline: "Dawn Flights Over the Savannah",
    description:
      "Float silently over the awakening plains at sunrise, observing herds from above before enjoying a champagne bush breakfast under an acacia tree.",
    seoDescription:
      "Serengeti hot air balloon safaris with Macho Halisi — a silent sunrise flight over the plains followed by a champagne bush breakfast.",
    heroImage: img(PHOTO.hotAirBalloon, 2200),
    heroImageAlt: "Hot air balloons rising over the Serengeti plains at sunrise",
    glance: [
      { label: "Duration", value: "One morning" },
      { label: "Where", value: "Serengeti · Central, Western & Ndutu" },
      { label: "Season", value: "Year-round, not Apr – May" },
      { label: "Flight", value: "Around one hour" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Sunrise Panorama",
        text: "Lift off in the half-dark and watch the plains light up beneath you, herd by herd.",
        image: { url: img("/media/hot-air-baloon-3.jpg"), alt: "Acacia-dotted plains at dawn" },
      },
      {
        title: "Champagne Bush Breakfast",
        text: "Land where the wind decides, to a table laid under an acacia and a glass already poured.",
        image: { url: img("/media/entumoto-17831035.jpg"), alt: "A solitary acacia tree on the plains" },
      },
      {
        title: "Silent Flight",
        text: "Between burns the only sound is the grass below — close enough to hear hooves.",
        image: { url: img("/media/hot-air-baloon2.jpg"), alt: "Elephants crossing the grasslands at sunset" },
      },
    ],
    day: [
      { time: "05:00", title: "Collection", text: "A quiet drive through the dark to the launch site." },
      { time: "06:15", title: "Lift-off", text: "The envelope fills, the basket lightens, and the ground falls away." },
      { time: "07:15", title: "Landing", text: "Down wherever the wind has carried you, the chase crew already waiting." },
      { time: "08:00", title: "Bush breakfast", text: "Linen, champagne and a full cooked breakfast on the plains." },
      { time: "09:30", title: "The drive back", text: "A game drive to camp through the morning light." },
    ],
    quote: "At a thousand feet the Serengeti finally makes sense — you can see where everything is going.",
    quoteBy: "Pilot, Seronera",
    quoteImage: { url: img("/media/hot-air-baloon.jpg", 2200), alt: "The open Serengeti plains from above the grass" },
    places: [
      {
        name: "Central Serengeti",
        type: "Seronera valley",
        destinationSlug: "serengeti",
        image: { url: img(PHOTO.lions), alt: "Lions resting in the Seronera valley" },
      },
      {
        name: "Western Corridor",
        type: "Grumeti river",
        destinationSlug: "serengeti",
        image: { url: img(PHOTO.elephant), alt: "Riverine woodland in the western Serengeti" },
      },
      {
        name: "Ndutu",
        type: "Seasonal flights",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.goldenPlains), alt: "The open plains around Ndutu" },
      },
    ],
  },
  {
    slug: "cultural-encounters",
    short: "Cultural Experiences",
    line1: "Cultural",
    line2: "Experiences",
    badge: "Cultural Heritage",
    tagline: "Maasai, Hadzabe & Datoga Communities",
    description:
      "Meet members of the Maasai, Hadzabe and Datoga communities around Lake Eyasi and Karatu, learn about their traditions and craftsmanship, and see how people, land and wildlife are bound together.",
    seoDescription:
      "Cultural experiences with Macho Halisi — Maasai boma visits, a Hadzabe hunter-gatherer walk and Datoga blacksmith demonstrations around Lake Eyasi, arranged from Karatu.",
    heroImage: img("/media/experiences/cultural/maasai-group.jpg", 2200),
    heroImageAlt: "Maasai community members gathering near Lake Eyasi",
    glance: [
      { label: "Communities", value: "Maasai · Hadzabe · Datoga" },
      { label: "Where", value: "Lake Eyasi & Karatu" },
      { label: "Base", value: "Karatu · Kudu Lodge" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Maasai Boma Visits",
        text: "Learn about the traditional homestead, the importance of cattle, Maasai beadwork and, where offered, songs and dances.",
        image: { url: img("/media/experiences/cultural/maasai-woman.jpg"), alt: "A Maasai woman in traditional beadwork" },
      },
      {
        title: "Hadzabe Hunter-Gatherers",
        text: "An early-morning guided walk near Lake Eyasi, with tracking, archery and fire-making, subject to local arrangements and community consent.",
        image: { url: img("/media/experiences/cultural/hadzabe-hunter.jpg"), alt: "A Hadzabe hunter preparing his bow and knife" },
      },
      {
        title: "Datoga Blacksmiths",
        text: "Watch artisans around Lake Eyasi turn metal into arrowheads, knives, jewellery and other everyday objects.",
        image: { url: img("/media/experiences/cultural/datoga-blacksmith.jpg"), alt: "A Datoga blacksmith hammering a spear tip" },
      },
    ],
    day: [
      { time: "Early", title: "Departure from Karatu", text: "An early start is recommended to allow time for the morning's activities and meaningful interaction." },
      { time: "Morning", title: "Hadzabe walk", text: "Join community members on a guided walk through the bush, as they are comfortable sharing." },
      { time: "Midday", title: "Datoga artisans", text: "Meet the blacksmiths of Lake Eyasi and see how metal becomes tools and ornaments." },
      { time: "Afternoon", title: "Return to Karatu", text: "Reflect on the day's discoveries and enjoy a relaxed afternoon at your lodge." },
    ],
    quote: "We are not a show. Come as a guest, and you will leave as one who has been told something.",
    quoteBy: "Elder, Monduli",
    quoteImage: { url: img(PHOTO.natron, 2200), alt: "The arid country of the Rift valley" },
    places: [
      {
        name: "Lake Eyasi",
        type: "Hadzabe & Datoga communities",
        destinationSlug: "lake-natron",
        image: { url: img("/media/experiences/cultural/hadzabe-eating.jpg"), alt: "A Hadzabe man in the bush near Lake Eyasi" },
      },
      {
        name: "Ngorongoro",
        type: "Maasai highlands",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.elephantsDusk), alt: "Grasslands near the crater at sunset" },
      },
    ],
  },
  {
    slug: "coffee-tours",
    short: "Coffee Tours",
    line1: "Coffee",
    line2: "Tours",
    badge: "Farm to Cup",
    tagline: "Karatu Coffee Estates",
    description:
      "From the coffee plant to the perfect cup: walk the plantations of Karatu's fertile highlands, see how cherries become roasted beans, and finish with a crop-to-cup tasting.",
    seoDescription:
      "Coffee tours in Karatu with Macho Halisi — a guided walk through the coffee plantations, traditional roasting and preparation, and a crop-to-cup tasting.",
    heroImage: img("/media/experiences/coffee-tours/beans-sack.jpg", 2200),
    heroImageAlt: "A sack of roasted coffee beans",
    glance: [
      { label: "Where", value: "Karatu highlands" },
      { label: "Best for", value: "Arrival day or a break between game drives" },
      { label: "Season", value: "Picking depends on the season" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Farm Walk",
        text: "A guided walk between the coffee bushes, with cherries at every stage from green fruit to deep red.",
        image: { url: img("/media/experiences/coffee-tours/picking-cherries.jpg"), alt: "Picking coffee cherries by hand on the farm" },
      },
      {
        title: "Roast & Prepare",
        text: "Where facilities permit, watch a roasting demonstration and learn how grinding and brewing shape the cup.",
        image: { url: img("/media/experiences/coffee-tours/cherries-in-hands.jpg"), alt: "Freshly picked red coffee cherries" },
      },
      {
        title: "The Tasting",
        text: "A freshly prepared cup of locally grown coffee, with notes of fruit, chocolate, nuts or flowers.",
        image: { url: img("/media/experiences/coffee-tours/cups.jpg"), alt: "Cups of freshly brewed coffee" },
      },
    ],
    day: [
      { time: "Start", title: "Into the plantation", text: "Walk the coffee-growing area with a local specialist and learn how the harvest is shaped." },
      { time: "Next", title: "From cherry to bean", text: "Sorting, pulping, fermentation, washing and drying, depending on the estate." },
      { time: "Then", title: "Roasting", text: "See how temperature and roasting time influence aroma, body, acidity and flavour." },
      { time: "Finish", title: "Tasting", text: "A crop-to-cup tasting, with time to ask questions about the growers and the region." },
    ],
    quote: "The mountain gives the rain, the family gives the care, and the cup gives you both.",
    quoteBy: "Grower, Karatu highlands",
    quoteImage: { url: img("/media/experiences/coffee-tours/beans-sack.jpg", 2200), alt: "Coffee beans in a burlap sack" },
    places: [
      {
        name: "Karatu",
        type: "Coffee estates",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.elephantsDusk), alt: "Highlands near Karatu" },
      },
      {
        name: "Lake Manyara",
        type: "Nearby on the northern circuit",
        destinationSlug: "manyara",
        image: { url: img(PHOTO.forest), alt: "Lake Manyara country" },
      },
      {
        name: "Tarangire",
        type: "Nearby on the northern circuit",
        destinationSlug: "tarangire",
        image: { url: img("/media/tarangire/tara-hero.jpg"), alt: "Tarangire landscape" },
      },
    ],
  },
  {
    slug: "waterfall-hot-spring",
    short: "Waterfalls & Hot Springs",
    line1: "Waterfalls &",
    line2: "Hot Springs",
    badge: "Nature Day Out",
    tagline: "Endoro, Materuni, Napuru & Chemka",
    description:
      "Forest trails, mountain waterfalls and a turquoise swimming spring: four natural sanctuaries around Karatu, Kilimanjaro and Mount Meru that offer a refreshing change of pace from game drives.",
    seoDescription:
      "Waterfall and hot spring excursions with Macho Halisi — Endoro Waterfalls and Elephant Caves near Karatu, Materuni on Kilimanjaro, Napuru near Mount Meru and Chemka Hot Springs.",
    heroImage: img("/media/experiences/waterfall-hot-spring/materuni.jpg", 2200),
    heroImageAlt: "Materuni waterfall tumbling through the forested foothills of Kilimanjaro",
    glance: [
      { label: "Sites", value: "Endoro · Materuni · Napuru · Chemka" },
      { label: "Where", value: "Karatu · Kilimanjaro · Mount Meru" },
      { label: "Fitness", value: "Gentle walks to more demanding hikes" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Endoro & Elephant Caves",
        text: "A forest trail near Karatu past the caves where elephants dig for minerals, ending at the waterfall.",
        image: { url: img("/media/experiences/waterfall-hot-spring/elephant-caves.webp"), alt: "Elephants gathered at the Endoro caves" },
      },
      {
        title: "Materuni Waterfall",
        text: "A walk through Chagga farmland on the slopes of Kilimanjaro to a waterfall plunging into a natural pool.",
        image: { url: img("/media/experiences/waterfall-hot-spring/materuni.jpg"), alt: "Materuni waterfall seen from the forest trail" },
      },
      {
        title: "Chemka Hot Springs",
        text: "Clear turquoise water ringed by trees, a place to swim and rest between safari days.",
        image: { url: img("/media/experiences/waterfall-hot-spring/hot-spring.jpg"), alt: "The turquoise water of Chemka Hot Springs" },
      },
    ],
    day: [
      { time: "Start", title: "Set out with your guide", text: "Timing and transport are planned around where you are staying and the road conditions." },
      { time: "On foot", title: "The trail", text: "A local guide explains the vegetation, farming and natural features along the way." },
      { time: "At the water", title: "Waterfall or spring", text: "Time for photographs, a swim where permitted, and the cool air." },
      { time: "Return", title: "Back to your lodge", text: "Refreshed, with the rest of the day at your own pace." },
    ],
    quote: "After a week of dust and game drives, cold water from the mountain is the best thing in the world.",
    quoteBy: "Guide, Moshi",
    quoteImage: { url: img("/media/kilimanjaro/kili-ariel.jpg", 2200), alt: "Kilimanjaro seen from the foothills" },
    places: [
      {
        name: "Endoro",
        type: "Karatu highlands",
        destinationSlug: "ngorongoro",
        image: { url: img("/media/experiences/waterfall-hot-spring/elephant-caves-2.jpg"), alt: "Elephants near the Endoro caves" },
      },
      {
        name: "Materuni",
        type: "Slopes of Kilimanjaro",
        destinationSlug: "kilimanjaro",
        image: { url: img("/media/experiences/waterfall-hot-spring/materuni.jpg"), alt: "Materuni waterfall" },
      },
      {
        name: "Napuru & Chemka",
        type: "Mount Meru and the Arusha–Moshi region",
        destinationSlug: "arusha",
        image: { url: img("/media/experiences/waterfall-hot-spring/hot-spring-2.jpg"), alt: "Palm-fringed spring water at Chemka" },
      },
    ],
  },
  {
    slug: "canoeing",
    short: "Canoeing",
    line1: "Canoeing",
    line2: "Safaris",
    badge: "On the Water",
    tagline: "Lake Duluti & Lake Manyara",
    description:
      "A different way to experience northern Tanzania: glide across a forested crater lake near Arusha or enjoy the Rift Valley from water level, with birdlife all around.",
    seoDescription:
      "Canoeing with Macho Halisi — a peaceful paddle on Lake Duluti near Arusha, and a water-level view of the Rift Valley at Lake Manyara where permitted.",
    heroImage: img("/media/experiences/canoeing/kilimanjaro-canoes.webp", 2200),
    heroImageAlt: "Canoeists on a lake beneath Mount Kilimanjaro",
    glance: [
      { label: "Where", value: "Lake Duluti · Lake Manyara" },
      { label: "Highlights", value: "Birdwatching & photography" },
      { label: "Booking", value: "Arrange in advance" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Lake Duluti",
        text: "A sheltered crater lake near Arusha where kingfishers, egrets and fish eagles may be seen, with views towards Mount Meru.",
        image: { url: img("/media/experiences/canoeing/duluti-sunset.jpg"), alt: "Sunset over Lake Duluti" },
      },
      {
        title: "Lake Manyara",
        text: "A quieter perspective of the lake beneath the Great Rift Valley escarpment, where canoeing is available and permitted.",
        image: { url: img("/media/experiences/canoeing/manyara-elephant.jpg"), alt: "Canoeists watching an elephant on the shore" },
      },
      {
        title: "Birdlife",
        text: "Waterbirds along the shoreline, including flamingos and pelicans at Manyara when conditions are suitable.",
        image: { url: img("/media/experiences/canoeing/flamingo-canoes.webp"), alt: "Canoeists paddling past a flamingo" },
      },
    ],
    day: [
      { time: "Plan", title: "Confirm availability", text: "Weather, water levels, schedules and safety requirements all shape the final arrangements." },
      { time: "Brief", title: "Equipment and briefing", text: "A guided excursion with an authorised operator at a designated location." },
      { time: "Paddle", title: "On the water", text: "Move quietly across the lake, with birdlife and landscape for company." },
      { time: "After", title: "Walk or game drive", text: "Combine with a guided walk around Lake Duluti, or a game drive if canoeing is unavailable." },
    ],
    quote: "From a canoe the animals forget you are there — and you finally see them as they are.",
    quoteBy: "Guide, Lake Duluti",
    quoteImage: { url: img("/media/experiences/canoeing/manyara-elephant.jpg", 2200), alt: "Canoeing close to an elephant at the water's edge" },
    places: [
      {
        name: "Lake Manyara",
        type: "Rift Valley escarpment",
        destinationSlug: "manyara",
        image: { url: img("/media/manyara/manyara-hero.jpg"), alt: "Lake Manyara country" },
      },
      {
        name: "Lake Duluti",
        type: "Crater lake near Arusha",
        destinationSlug: "arusha",
        image: { url: img("/media/experiences/canoeing/duluti-sunset.jpg"), alt: "Lake Duluti at dusk" },
      },
    ],
  },
  {
    slug: "night-game-drives",
    short: "Night Game Drives",
    line1: "Night",
    line2: "Game Drives",
    badge: "After Dark",
    tagline: "Lake Manyara & Tarangire",
    description:
      "When daylight fades the wilderness enters a different phase: nocturnal species emerge, predators move and an experienced guide helps you read the dark.",
    seoDescription:
      "Night game drives with Macho Halisi — authorised after-dark wildlife drives around Lake Manyara and Tarangire, with an experienced driver-guide.",
    heroImage: img("/media/experiences/night-game-drives/leopard.jpg", 2200),
    heroImageAlt: "A leopard resting in the spotlight at night",
    glance: [
      { label: "Where", value: "Lake Manyara & Tarangire" },
      { label: "Guided by", value: "Driver-guide and, where required, a park ranger" },
      { label: "Note", value: "Only where authorised; confirmed before travel" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Nocturnal Wildlife",
        text: "Leopards, lions, hyenas, genets, civets, servals, porcupines, bushbabies and owls, depending on habitat and season.",
        image: { url: img("/media/experiences/night-game-drives/lioness.jpg"), alt: "A lioness caught in the spotlight" },
      },
      {
        title: "Guided Observation",
        text: "Your guide uses appropriate lighting and observation techniques, respecting the rules for wildlife viewing after dark.",
        image: { url: img("/media/night/night-game-drive-masai-mara.webp"), alt: "A rusty-spotted genet in a vehicle spotlight on a night drive" },
      },
      {
        title: "A Different Ecosystem",
        text: "Learn how scavengers, insects, small mammals and predators work after sunset.",
        image: { url: img("/media/experiences/night-game-drives/giraffe-waterhole.jpg"), alt: "A giraffe at a waterhole after dark" },
      },
    ],
    day: [
      { time: "Dusk", title: "Briefing", text: "Guests receive a briefing before setting out in a suitable safari vehicle." },
      { time: "After dark", title: "The drive", text: "A measured pace along designated routes, looking for tracks and listening for calls." },
      { time: "Return", title: "Back to your lodge", text: "Arrangements for a comfortable return are made in advance." },
    ],
    quote: "By day the bush shows you what it wants you to see. By night, it shows you the rest.",
    quoteBy: "Guide, Karatu",
    quoteImage: { url: img("/media/night/night-game-drive-masai-mara.webp", 2200), alt: "A full moon  ashining through acacia branches on a night in Tarangire" },
    places: [
      {
        name: "Lake Manyara",
        type: "Where authorised",
        destinationSlug: "manyara",
        image: { url: img("/media/experiences/night-game-drives/large-spotted-genet.jpg"), alt: "A large-spotted genet seen at night in a spotlight" },
      },
      {
        name: "Tarangire",
        type: "Where authorised",
        destinationSlug: "tarangire",
        image: { url: img("/media/experiences/night-game-drives/tarangire-moon.jpg"), alt: "Moonlight through acacia branches at night in Tarangire" },
      },
    ],
  },
];

export const experiences: Experience[] = baseExperiences.map((e) => {
  const longform = experienceLongform[e.slug];
  if (!longform) throw new Error(`Missing long-form content for experience "${e.slug}"`);
  return { ...e, longform };
});

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}

export function getAllExperienceSlugs(): string[] {
  return experiences.map((e) => e.slug);
}
