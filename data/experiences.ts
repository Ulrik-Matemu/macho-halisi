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

export const experiences: Experience[] = [
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
      { label: "Duration", value: "One morning · 3 hrs" },
      { label: "Where", value: "Central & Western Serengeti" },
      { label: "Season", value: "Year-round, not Apr – May" },
      { label: "Basket", value: "Up to 16 guests" },
      { label: "From", value: "$599 pp" },
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
    short: "Maasai & Hadzabe Cultural Experience",
    line1: "Maasai & Hadzabe",
    line2: "Cultural Experience",
    badge: "Cultural Heritage",
    tagline: "Two Living Traditions, One Journey",
    description:
      "Respectful, non-commercial visits with Maasai herders in their bomas and with the Hadzabe hunter-gatherers around Lake Eyasi — two of Tanzania's oldest ways of life, shared on their terms.",
    seoDescription:
      "Maasai and Hadzabe cultural experiences with Macho Halisi — invited visits to Maasai bomas in the Ngorongoro highlands and Monduli, and a morning with the Hadzabe hunter-gatherers at Lake Eyasi.",
    heroImage: img("/media/ngorongoro/ngoro-maasai.jpg", 2200),
    heroImageAlt: "Maasai herders in the Ngorongoro highlands",
    glance: [
      { label: "Duration", value: "Half or full day" },
      { label: "Where", value: "Ngorongoro highlands · Monduli · Lake Eyasi" },
      { label: "Season", value: "Year-round" },
      { label: "Group", value: "Small & private" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Maasai Bomas",
        text: "A working homestead visited by invitation, not a staged village, with a guide from the community.",
        image: { url: img(PHOTO.acacia), alt: "Highland grazing country" },
      },
      {
        title: "Hadzabe at Lake Eyasi",
        text: "Rise before dawn to follow Hadzabe hunters on foot, and learn how they track, forage and make fire.",
        image: { url: img(PHOTO.natron), alt: "The arid country around Lake Eyasi" },
      },
      {
        title: "Direct Community Support",
        text: "Visit fees are paid directly to the families and communities who host you.",
        image: { url: img(PHOTO.goldenPlains), alt: "Plains beneath the highlands at dusk" },
      },
    ],
    day: [
      { time: "06:00", title: "Before dawn", text: "Meet the Hadzabe hunters at their camp near Lake Eyasi and set out with them." },
      { time: "09:30", title: "Back to camp", text: "Share the morning's catch and learn the foraging and fire-making skills." },
      { time: "12:30", title: "Lunch", text: "A break at the lakeshore before the drive to Maasai country." },
      { time: "14:30", title: "The boma", text: "Welcomed at the gate by the family who host you; beadwork, songs and stories of the age-sets." },
      { time: "16:30", title: "With the herders", text: "A walk out with the young men and the cattle to water." },
    ],
    quote: "We are not a show. Come as a guest, and you will leave as one who has been told something.",
    quoteBy: "Elder, Monduli",
    quoteImage: { url: img(PHOTO.natron, 2200), alt: "The arid country of the Rift valley" },
    places: [
      {
        name: "Ngorongoro",
        type: "Conservation area",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.elephantsDusk), alt: "Grasslands near the crater at sunset" },
      },
      {
        name: "Monduli",
        type: "Highlands",
        destinationSlug: "arusha",
        image: { url: img(PHOTO.acacia), alt: "Highland country near Arusha" },
      },
      {
        name: "Lake Eyasi",
        type: "Rift valley",
        destinationSlug: "lake-natron",
        image: { url: img(PHOTO.natron), alt: "The landscape of the Rift valley lakes" },
      },
    ],
  },
  {
    slug: "coffee-tours",
    short: "Coffee Tours",
    line1: "Coffee",
    line2: "Tours",
    badge: "Farm to Cup",
    tagline: "From the Slopes to the Cup",
    description:
      "Walk the shaded coffee farms on the slopes of Kilimanjaro and Mount Meru with local growers, then roast, grind and taste the beans over an open fire.",
    seoDescription:
      "Tanzania coffee tours with Macho Halisi — farm walks on the slopes of Kilimanjaro and Mount Meru, traditional roasting and grinding, and tasting with local growers.",
    heroImage: img("/media/kilimanjaro/lemosho.jpg", 2200),
    heroImageAlt: "The green slopes of Kilimanjaro where coffee is grown",
    glance: [
      { label: "Duration", value: "Half day" },
      { label: "Where", value: "Kilimanjaro & Mount Meru slopes" },
      { label: "Season", value: "Year-round · harvest Jul – Dec" },
      { label: "Group", value: "Private, small groups" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Farm Walk",
        text: "Wander through shaded plots of coffee, banana and avocado with the family who tend them.",
        image: { url: img("/media/kilimanjaro/lemosho.jpg"), alt: "Forested slopes above the farms" },
      },
      {
        title: "Roast & Grind",
        text: "Pick, pulp and roast the beans over the fire, then pound them by hand in a traditional mortar.",
        image: { url: img(PHOTO.trail), alt: "A footpath through the farmland" },
      },
      {
        title: "The Tasting",
        text: "Drink the coffee you have just made, fresh and unhurried, beside the people who grew it.",
        image: { url: img(PHOTO.forest), alt: "Green hillside country" },
      },
    ],
    day: [
      { time: "08:30", title: "Pick-up", text: "A short drive up the mountain slopes from your lodge." },
      { time: "09:30", title: "Into the plantation", text: "Walk the farm and learn how the cherries are grown and picked." },
      { time: "11:00", title: "Roast & grind", text: "Prepare the beans the traditional way, over the fire." },
      { time: "12:00", title: "Tasting", text: "Fresh coffee and a home-cooked local lunch." },
    ],
    quote: "The mountain gives the rain, the family gives the care, and the cup gives you both.",
    quoteBy: "Grower, Kilimanjaro slopes",
    quoteImage: { url: img("/media/kilimanjaro/kili-ariel.jpg", 2200), alt: "Kilimanjaro rising above the farmland" },
    places: [
      {
        name: "Kilimanjaro slopes",
        type: "Moshi & Marangu",
        destinationSlug: "kilimanjaro",
        image: { url: img("/media/kilimanjaro/kili-ariel.jpg"), alt: "Kilimanjaro above the foothills" },
      },
      {
        name: "Mount Meru",
        type: "Arusha highlands",
        destinationSlug: "arusha",
        image: { url: img("/media/arusha-national-park/fig-tree.jpg"), alt: "Forest on the slopes of Mount Meru" },
      },
    ],
  },
  {
    slug: "waterfall-hot-spring",
    short: "Waterfall & Hot Spring",
    line1: "Waterfall &",
    line2: "Hot Spring Experience",
    badge: "Nature Day Out",
    tagline: "Cool Cascades, Warm Springs",
    description:
      "Hike to a tall forest waterfall on the Kilimanjaro foothills, then float in the clear, warm blue waters of a natural hot spring.",
    seoDescription:
      "Waterfall and hot spring day trips with Macho Halisi — a forest hike to a Kilimanjaro-foothills waterfall and a swim in a natural hot spring near Moshi.",
    heroImage: img("/media/kilimanjaro/lemosho.jpg", 2200),
    heroImageAlt: "Forested foothills of Kilimanjaro",
    glance: [
      { label: "Duration", value: "Full day" },
      { label: "Where", value: "Moshi · Kilimanjaro foothills" },
      { label: "Season", value: "Year-round" },
      { label: "Group", value: "Private, flexible" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "The Waterfall Hike",
        text: "A guided walk through farms and forest to a waterfall dropping into a cool pool.",
        image: { url: img("/media/kilimanjaro/lemosho.jpg"), alt: "Forest trail on the foothills" },
      },
      {
        title: "Natural Hot Spring",
        text: "Swim in the warm, clear water of a spring ringed by palms; ropes and platforms for jumping in.",
        image: { url: img(PHOTO.forest), alt: "Green tropical vegetation" },
      },
      {
        title: "Picnic & Rest",
        text: "A packed lunch in the shade, with time to swim, rest and take in the scenery.",
        image: { url: img(PHOTO.trail), alt: "A shaded path" },
      },
    ],
    day: [
      { time: "08:00", title: "Departure", text: "Drive to the foothills with your guide." },
      { time: "09:30", title: "Waterfall hike", text: "Walk through the villages and forest to the falls." },
      { time: "12:30", title: "Picnic lunch", text: "Eat by the water before the afternoon." },
      { time: "14:00", title: "Hot spring", text: "Swim and relax in the natural spring." },
      { time: "16:30", title: "Return", text: "Back to your lodge, refreshed." },
    ],
    quote: "After a week of dust and game drives, cold water from the mountain is the best thing in the world.",
    quoteBy: "Guide, Moshi",
    quoteImage: { url: img("/media/kilimanjaro/kili-ariel.jpg", 2200), alt: "Kilimanjaro seen from the foothills" },
    places: [
      {
        name: "Kilimanjaro foothills",
        type: "Moshi",
        destinationSlug: "kilimanjaro",
        image: { url: img("/media/kilimanjaro/kili-ariel.jpg"), alt: "Kilimanjaro above the foothills" },
      },
      {
        name: "Arusha",
        type: "Gateway town",
        destinationSlug: "arusha",
        image: { url: img("/media/arusha-national-park/fig-tree.jpg"), alt: "Forest near Arusha" },
      },
    ],
  },
  {
    slug: "canoeing",
    short: "Canoeing",
    line1: "Canoeing",
    line2: "Safaris",
    badge: "On the Water",
    tagline: "Wildlife at Water Level",
    description:
      "Paddle the calm Momella Lakes in Arusha National Park with a ranger, gliding past flamingos, hippos and buffalo on the shore.",
    seoDescription:
      "Canoeing safaris with Macho Halisi — a guided paddle on the Momella Lakes in Arusha National Park among flamingos, hippos and buffalo, with Mount Meru above.",
    heroImage: img("/media/arusha-national-park/Arusha_National_Park_Momella_Lake_Flamingos_83.jpg", 2200),
    heroImageAlt: "Flamingos on the Momella Lakes in Arusha National Park",
    glance: [
      { label: "Duration", value: "2 – 3 hrs" },
      { label: "Where", value: "Arusha National Park" },
      { label: "Season", value: "Year-round" },
      { label: "Group", value: "Small groups, guided" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Momella Lakes",
        text: "Paddle quietly on shallow soda lakes where flamingos and waterbirds feed along the shore.",
        image: { url: img("/media/arusha-national-park/Arusha_National_Park_Momella_Lake_Flamingos_83.jpg"), alt: "Flamingos on Momella Lake" },
      },
      {
        title: "Ranger-Led",
        text: "An accompanying ranger and a trained paddling guide keep the outing safe and informative.",
        image: { url: img("/media/arusha-national-park/colombus-monkey.jpg"), alt: "Colobus monkey in the forest" },
      },
      {
        title: "Mount Meru Backdrop",
        text: "On clear mornings the peak of Mount Meru rises behind the water.",
        image: { url: img("/media/arusha-national-park/fig-tree.jpg"), alt: "Forest on the Mount Meru slopes" },
      },
    ],
    day: [
      { time: "07:00", title: "Park gate", text: "Enter Arusha National Park and meet your ranger." },
      { time: "08:00", title: "Briefing", text: "Safety briefing and equipment at the lakeshore." },
      { time: "08:30", title: "On the water", text: "Paddle the lake, watching the birdlife from a few metres away." },
      { time: "10:30", title: "Shore", text: "A short walk and a drive through the park to finish." },
    ],
    quote: "From a canoe the animals forget you are there — and you finally see them as they are.",
    quoteBy: "Ranger, Arusha National Park",
    quoteImage: { url: img("/media/arusha-national-park/fig-tree.jpg", 2200), alt: "The forest of Arusha National Park" },
    places: [
      {
        name: "Arusha National Park",
        type: "Momella Lakes",
        destinationSlug: "arusha",
        image: { url: img("/media/arusha-national-park/Arusha_National_Park_Momella_Lake_Flamingos_83.jpg"), alt: "Momella Lakes" },
      },
    ],
  },
  {
    slug: "night-game-drives",
    short: "Night Game Drives",
    line1: "Night",
    line2: "Game Drives",
    badge: "After Dark",
    tagline: "The Bush After Sunset",
    description:
      "Search the dark with a spotlight for leopards, hyenas, bushbabies, civets and other animals that most guests never see by day.",
    seoDescription:
      "Night game drives in Tanzania with Macho Halisi — spotlight drives in private concessions and wildlife areas bordering the national parks, in search of nocturnal wildlife.",
    heroImage: img("/media/experiences/lion-resting.jpg", 2200),
    heroImageAlt: "A lion resting at dusk",
    glance: [
      { label: "Duration", value: "2 – 3 hrs after dusk" },
      { label: "Where", value: "Private concessions & wildlife areas" },
      { label: "Season", value: "Year-round" },
      { label: "Vehicle", value: "Open 4x4 with spotlight" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Nocturnal Wildlife",
        text: "Leopard, hyena, genet, civet, bushbaby and owls — the animals that wake as the light fades.",
        image: { url: img("/media/experiences/leopard-photographers.jpg"), alt: "A leopard at dusk" },
      },
      {
        title: "Expert Spotters",
        text: "Our guides read eye-shine and sound in the dark, and use a red-filtered spotlight to avoid disturbing the animals.",
        image: { url: img("/media/experiences/lion-vehicle.jpg"), alt: "A lion beside a safari vehicle" },
      },
      {
        title: "Sundowner & Stars",
        text: "Start with a drink at sunset and finish under a sky with no city lights.",
        image: { url: img(PHOTO.goldenPlains), alt: "Plains at sunset" },
      },
    ],
    day: [
      { time: "17:30", title: "Sundowners", text: "Set out in the last light with a drink at a quiet viewpoint." },
      { time: "19:00", title: "Spotlight begins", text: "Your guide sweeps the bush for eye-shine and movement." },
      { time: "20:30", title: "Return", text: "Back to camp for a late dinner." },
    ],
    quote: "By day the bush shows you what it wants you to see. By night, it shows you the rest.",
    quoteBy: "Guide, Karatu",
    quoteImage: { url: img("/media/experiences/lion-vehicle-2.jpg", 2200), alt: "Lions near a safari vehicle at dusk" },
    places: [
      {
        name: "Tarangire borderlands",
        type: "Wildlife management areas",
        destinationSlug: "tarangire",
        image: { url: img("/media/tarangire/tara-hero.jpg"), alt: "Tarangire landscape" },
      },
      {
        name: "Lake Manyara area",
        type: "Private concessions",
        destinationSlug: "manyara",
        image: { url: img(PHOTO.forest), alt: "Lake Manyara country" },
      },
      {
        name: "Ngorongoro highlands",
        type: "Karatu",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.elephantsDusk), alt: "Highlands at dusk" },
      },
    ],
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug);
}

export function getAllExperienceSlugs(): string[] {
  return experiences.map((e) => e.slug);
}
