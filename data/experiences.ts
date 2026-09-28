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

const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

const PHOTO = {
  plainsVehicle: "1516426122078-c23e76319801",
  goldenPlains: "1547471080-7cc2caa01a7e",
  lions: "1575550959106-5a7defe28b56",
  lodge: "1566073771259-6a8506099945",
  elephant: "1549366021-9f761d450615",
  elephantsDusk: "1564760055775-d63b17a55c44",
  acacia: "1516026672322-bc52d61a55d5",
  trail: "1589553416260-f586c8f1514f",
  giraffe: "1626548307930-deac221f87d9",
  natron: "1758881534639-709146239bd1",
  migration: "1547970810-dc1eac8161a7",
  forest: "1518709268805-4e9042af9f23",
};

export const experiences: Experience[] = [
  {
    slug: "great-migration",
    short: "The Great Migration",
    line1: "Great Migration",
    line2: "Expeditions",
    badge: "Signature Journey",
    tagline: "The Greatest Wildlife Spectacle on Earth",
    description:
      "Follow two million hooves on the move through river crossings, predator ambushes, and calving season in the Ndutu plains.",
    seoDescription:
      "Great Migration safaris with Macho Halisi — Mara River crossings, predator action and mobile camps that follow the herds across the Serengeti and Ndutu.",
    heroImage: img(PHOTO.plainsVehicle, 2200),
    heroImageAlt: "Wildebeest herds moving across the Serengeti plains",
    glance: [
      { label: "Duration", value: "4 – 10 nights" },
      { label: "Where", value: "Serengeti · Ndutu · Mara" },
      { label: "Season", value: "Year-round, by sector" },
      { label: "Group", value: "Private, 2 – 6" },
      { label: "From", value: "$6,450 pp" },
    ],
    highlights: [
      {
        title: "Mara River Crossings",
        text: "July to October the herds mass on the northern banks. Our mobile camps sit minutes from the busiest crossing points.",
        image: { url: img(PHOTO.migration), alt: "Wildebeest gathering for a river crossing" },
      },
      {
        title: "Predator Action",
        text: "Lion, cheetah and crocodile shadow the herds. Your guide positions for the hunt, not for the crowd.",
        image: { url: img(PHOTO.lions), alt: "A lion pair resting in the Serengeti bush" },
      },
      {
        title: "Mobile Camps",
        text: "Canvas camps that relocate with the migration, so the herds come to your tent rather than the other way round.",
        image: { url: img(PHOTO.lodge), alt: "A safari camp at golden hour" },
      },
    ],
    day: [
      { time: "05:45", title: "First light", text: "Coffee at the fire and out before the columns begin to move." },
      { time: "08:30", title: "On the herds", text: "Your guide reads the lines of animals and chooses a crossing point." },
      { time: "13:00", title: "Bush lunch", text: "Shade, cold drinks and the radio for news of movement upriver." },
      { time: "16:00", title: "The river", text: "Afternoon on the bank as the herds build toward a crossing." },
      { time: "19:30", title: "Camp", text: "Dinner under canvas, the grunt of wildebeest all night long." },
    ],
    quote: "You hear it before you see it — a low sound, like weather, moving across the plain.",
    quoteBy: "Guide, Northern Serengeti",
    quoteImage: { url: img(PHOTO.goldenPlains, 2200), alt: "Golden acacia-dotted plains of the Serengeti at dusk" },
    places: [
      {
        name: "Serengeti",
        type: "National park",
        destinationSlug: "serengeti",
        image: { url: img(PHOTO.plainsVehicle), alt: "A safari vehicle on the Serengeti plains" },
      },
      {
        name: "Ndutu",
        type: "Calving grounds",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.goldenPlains), alt: "Short-grass plains near Ndutu" },
      },
      {
        name: "Mara River",
        type: "Crossing country",
        destinationSlug: "serengeti",
        image: { url: img(PHOTO.elephant), alt: "Woodland in the northern Serengeti" },
      },
    ],
  },
  {
    slug: "balloon-safari",
    short: "Balloon Safaris",
    line1: "Balloon Safaris",
    line2: "over the Serengeti",
    badge: "Aerial View",
    tagline: "Dawn Flights Over the Savannah",
    description:
      "Float silently over the awakening plains at sunrise, observing herds from above before enjoying a champagne bush breakfast under an acacia tree.",
    seoDescription:
      "Serengeti hot air balloon safaris with Macho Halisi — a silent sunrise flight over the plains followed by a champagne bush breakfast.",
    heroImage: img(PHOTO.goldenPlains, 2200),
    heroImageAlt: "The Serengeti plains lit gold at sunrise",
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
        image: { url: img(PHOTO.goldenPlains), alt: "Acacia-dotted plains at dawn" },
      },
      {
        title: "Champagne Bush Breakfast",
        text: "Land where the wind decides, to a table laid under an acacia and a glass already poured.",
        image: { url: img(PHOTO.acacia), alt: "A solitary acacia tree on the plains" },
      },
      {
        title: "Silent Flight",
        text: "Between burns the only sound is the grass below — close enough to hear hooves.",
        image: { url: img(PHOTO.elephantsDusk), alt: "Elephants crossing the grasslands at sunset" },
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
    quoteImage: { url: img(PHOTO.plainsVehicle, 2200), alt: "The open Serengeti plains from above the grass" },
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
    slug: "walking-safaris",
    short: "Walking Safaris",
    line1: "Guided Walking",
    line2: "Bush Safaris",
    badge: "Immersive Safari",
    tagline: "Track Africa's Wild on Foot",
    description:
      "Step into the bush accompanied by professional armed rangers. Learn ancient tracking techniques, medicinal botany, and the intimacy of wild encounters.",
    seoDescription:
      "Guided walking safaris in Tanzania with Macho Halisi — track wildlife on foot with armed rangers in Ruaha, Nyerere and the Serengeti wilderness zones.",
    heroImage: img(PHOTO.trail, 2200),
    heroImageAlt: "A walking trail winding through the Tanzanian bush",
    glance: [
      { label: "Duration", value: "3 hrs to multi-day" },
      { label: "Where", value: "Ruaha · Nyerere · Serengeti" },
      { label: "Season", value: "June – October" },
      { label: "Group", value: "Max 6 walkers" },
      { label: "From", value: "On request" },
    ],
    highlights: [
      {
        title: "Spoor Tracking",
        text: "Read the night's story in the dust — who passed, how long ago, and which way they went.",
        image: { url: img(PHOTO.trail), alt: "A footpath through the bush" },
      },
      {
        title: "Armed Expert Guide",
        text: "Walk behind a licensed armed ranger and a trained naturalist, never more than six in file.",
        image: { url: img(PHOTO.elephant), alt: "An elephant in riverine woodland" },
      },
      {
        title: "Senses Awakened",
        text: "On foot the bush sharpens: scent, birdsong, and the small life a vehicle drives straight past.",
        image: { url: img(PHOTO.forest), alt: "Dense green bush and forest" },
      },
    ],
    day: [
      { time: "06:00", title: "Briefing", text: "Hand signals, spacing, and what to do if the bush says stop." },
      { time: "06:30", title: "Into the bush", text: "Single file, slow pace, the ranger reading the wind." },
      { time: "08:30", title: "On the trail", text: "Following fresh spoor toward water and whatever made it." },
      { time: "10:30", title: "Brunch in the shade", text: "Back to camp before the heat, or a table set beneath a baobab." },
      { time: "16:30", title: "Sundowner walk", text: "A short loop to a kopje and a drink as the light drops." },
    ],
    quote: "In a vehicle you watch Africa. On foot, for the first time, it watches you.",
    quoteBy: "Ranger, Ruaha",
    quoteImage: { url: img(PHOTO.elephantsDusk, 2200), alt: "Elephants at dusk in the southern reserves" },
    places: [
      {
        name: "Ruaha",
        type: "National park",
        destinationSlug: "ruaha",
        image: { url: img(PHOTO.elephantsDusk), alt: "Elephants at dusk in Ruaha" },
      },
      {
        name: "Nyerere",
        type: "Rufiji river",
        destinationSlug: "southern-circuit",
        image: { url: img(PHOTO.elephant), alt: "Riverine forest in the southern reserves" },
      },
      {
        name: "Serengeti",
        type: "Wilderness zones",
        destinationSlug: "serengeti",
        image: { url: img(PHOTO.goldenPlains), alt: "Golden grassland in the Serengeti" },
      },
    ],
  },
  {
    slug: "photographic-safari",
    short: "Photographic Expeditions",
    line1: "Photographic",
    line2: "Expeditions",
    badge: "Pro Photographers",
    tagline: "Golden Hour Mastery with Custom 4x4s",
    description:
      "Custom photographic vehicles with 360-degree open hatches, bean bags, low-angle mounts, and private expert guides attuned to optimal lighting.",
    seoDescription:
      "Photographic safaris in Tanzania with Macho Halisi — modified open vehicles, golden-hour game drives and guides who position for light.",
    heroImage: img(PHOTO.lions, 2200),
    heroImageAlt: "A lion pair resting in the Serengeti bush",
    glance: [
      { label: "Duration", value: "6 – 12 nights" },
      { label: "Where", value: "Serengeti · Crater · Tarangire" },
      { label: "Season", value: "Year-round" },
      { label: "Vehicle", value: "1 – 3 photographers" },
      { label: "From", value: "$8,900 pp" },
    ],
    highlights: [
      {
        title: "Modified Open Vehicles",
        text: "Full 360° hatches, bean bags, floor-level mounts and charging at every seat.",
        image: { url: img(PHOTO.plainsVehicle), alt: "An open safari vehicle on the plains" },
      },
      {
        title: "Prime Lighting Hours",
        text: "Out before dawn and back after dark — midday is for editing, not driving.",
        image: { url: img(PHOTO.elephantsDusk), alt: "Elephants silhouetted at sunset" },
      },
      {
        title: "Expert Trackers",
        text: "Guides who understand the shot as well as the animal, and position for light over proximity.",
        image: { url: img(PHOTO.giraffe), alt: "A giraffe silhouetted against the sky" },
      },
    ],
    day: [
      { time: "05:15", title: "Golden hour", text: "In position before sunrise, sun behind you, subject ahead." },
      { time: "09:00", title: "Tracking", text: "Following leads from the night for behaviour, not just portraits." },
      { time: "12:00", title: "Review & edit", text: "Back in camp with a calibrated screen and a cold drink." },
      { time: "15:30", title: "Afternoon light", text: "Low-angle mounts and long lenses as the shadows stretch." },
      { time: "18:45", title: "Blue hour", text: "Silhouettes, then the stars from the vehicle roof." },
    ],
    quote: "The animals are everywhere. The light is the thing you have to hunt.",
    quoteBy: "Photographic guide, Ngorongoro",
    quoteImage: { url: img(PHOTO.goldenPlains, 2200), alt: "Golden light over the plains" },
    places: [
      {
        name: "Serengeti",
        type: "Big cat country",
        destinationSlug: "serengeti",
        image: { url: img(PHOTO.lions), alt: "Lions in the Serengeti" },
      },
      {
        name: "Ngorongoro Crater",
        type: "Rhino & lion",
        destinationSlug: "ngorongoro",
        image: { url: img(PHOTO.acacia), alt: "An acacia on the Ngorongoro highlands" },
      },
      {
        name: "Tarangire",
        type: "Elephant & baobab",
        destinationSlug: "tarangire",
        image: { url: img(PHOTO.elephant), alt: "An elephant in Tarangire's woodland" },
      },
    ],
  },
  {
    slug: "cultural-encounters",
    short: "Maasai Encounters",
    line1: "Authentic Maasai",
    line2: "Encounters",
    badge: "Cultural Heritage",
    tagline: "Centuries of Pastoral Traditions",
    description:
      "Respectful, non-commercial cultural exchanges with Maasai elders and warriors in traditional bomas, celebrating age-old songs and stories.",
    seoDescription:
      "Authentic Maasai cultural encounters with Macho Halisi — invited visits to working bomas in the Ngorongoro highlands and Monduli, with fees paid directly to the community.",
    heroImage: img(PHOTO.acacia, 2200),
    heroImageAlt: "A solitary acacia on the Ngorongoro highlands",
    glance: [
      { label: "Duration", value: "Half or full day" },
      { label: "Where", value: "Ngorongoro highlands · Monduli" },
      { label: "Season", value: "Year-round" },
      { label: "Group", value: "Small & private" },
      { label: "From", value: "Included in itineraries" },
    ],
    highlights: [
      {
        title: "Traditional Bomas",
        text: "A working homestead visited by invitation, not a staged village, with a guide from the community.",
        image: { url: img(PHOTO.acacia), alt: "Highland grazing country" },
      },
      {
        title: "Elder Storytelling",
        text: "The histories of cattle, land and age-sets, told in Maa and translated as you sit together.",
        image: { url: img(PHOTO.goldenPlains), alt: "Plains beneath the highlands at dusk" },
      },
      {
        title: "Direct Community Support",
        text: "Every visit fee goes straight to the boma's school and water fund, published each year.",
        image: { url: img(PHOTO.trail), alt: "A footpath through the highlands" },
      },
    ],
    day: [
      { time: "09:00", title: "Arrival", text: "Welcomed at the gate of the boma by the family who host you." },
      { time: "09:45", title: "With the women", text: "Beadwork, house-building and the running of a homestead." },
      { time: "11:00", title: "The elders", text: "Stories of the age-sets, the land and the long migrations of cattle." },
      { time: "12:30", title: "A shared meal", text: "Lunch together, and questions in both directions." },
      { time: "14:00", title: "With the herders", text: "A walk out with the young men and the cattle to water." },
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
        image: { url: img(PHOTO.giraffe), alt: "A giraffe near Arusha" },
      },
      {
        name: "Lake Natron",
        type: "Rift valley",
        destinationSlug: "lake-natron",
        image: { url: img(PHOTO.natron), alt: "The landscape around Lake Natron" },
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
