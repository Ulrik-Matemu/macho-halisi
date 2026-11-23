/**
 * Content for MACHO HALISI TIMES (/times) — the site's film-and-photograph
 * journal. Everything the page shows lives here so the team can swap a clip,
 * fix a caption or add a photo without touching components.
 *
 * Videos are served from /public/media/times/vids. Their file names (WhatsApp
 * exports) contain spaces and brackets, so `video()` URL-encodes them.
 * Dimensions/durations were read from the files; update them if a clip is
 * replaced (the player adapts to portrait and landscape from `orientation`).
 */

const video = (file: string) => `/media/times/vids/${encodeURIComponent(file)}`;

export interface TimesFilm {
  id: string;
  src: string;
  title: string;
  caption: string;
  /** Length in seconds (shown as m:ss before the clip loads). */
  seconds: number;
  orientation: "landscape" | "portrait";
  width: number;
  height: number;
  /** Where in the clip (seconds) to take the still shown before it plays. */
  still?: number;
}

export const TIMES_FILMS: TimesFilm[] = [
  {
    id: "film-1",
    src: video("WhatsApp Video 2026-11-12 at 3.38.59 PM.mp4"),
    title: "Film 01",
    caption: "From the road, with the Macho Halisi team.",
    seconds: 43,
    orientation: "landscape",
    width: 1024,
    height: 576,
  },
  {
    id: "film-2",
    src: video("WhatsApp Video 2026-11-12 at 3.37.42 PM.mp4"),
    title: "Film 02",
    caption: "A longer look at life on safari.",
    seconds: 68,
    orientation: "landscape",
    width: 816,
    height: 464,
  },
  {
    id: "film-3",
    src: video("WhatsApp Video 2026-11-12 at 3.42.17 PM(1).mp4"),
    title: "Film 03",
    caption: "Moments from the journey.",
    seconds: 50,
    orientation: "landscape",
    width: 848,
    height: 480,
  },
  {
    id: "film-4",
    src: video("WhatsApp Video 2026-11-12 at 3.37.42 PM(1).mp4"),
    title: "Film 04",
    caption: "A short story from the field.",
    seconds: 30,
    orientation: "landscape",
    width: 816,
    height: 464,
  },
  {
    id: "film-5",
    src: video("WhatsApp Video 2026-11-12 at 3.39.00 PM.mp4"),
    title: "Film 05",
    caption: "A quick glimpse.",
    seconds: 11,
    orientation: "landscape",
    width: 1024,
    height: 576,
  },
  {
    id: "film-6",
    src: video("WhatsApp Video 2026-11-12 at 3.38.54 PM.mp4"),
    title: "Film 06",
    caption: "Shot upright, for the phone in your hand.",
    seconds: 14,
    orientation: "portrait",
    width: 352,
    height: 624,
  },
  {
    id: "film-7",
    src: video("WhatsApp Video 2026-11-12 at 3.42.17 PM.mp4"),
    title: "Film 07",
    caption: "Another vertical moment.",
    seconds: 8,
    orientation: "portrait",
    width: 352,
    height: 624,
  },
];

/** The clip that loops silently behind the masthead. */
export const TIMES_HERO_FILM = TIMES_FILMS[0];
export const TIMES_HERO_POSTER = "/media/hero-vids/lion-poster.webp";

export type PhotoChapter = "wild" | "land" | "people" | "road";

export const PHOTO_CHAPTERS: { id: PhotoChapter | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "wild", label: "Wild" },
  { id: "land", label: "Landscapes" },
  { id: "people", label: "People" },
  { id: "road", label: "On the road" },
];

export interface TimesPhoto {
  src: string;
  width: number;
  height: number;
  title: string;
  place: string;
  chapter: PhotoChapter;
  alt: string;
}

export const TIMES_PHOTOS: TimesPhoto[] = [
  // Interleaved so every chapter appears early in the "All" view.
  { src: "/media/serengeti/sere-lion.jpg", width: 1280, height: 1920, title: "The watcher", place: "Serengeti", chapter: "wild", alt: "A male lion in profile, mane lit by low sun" },
  { src: "/media/ngorongoro/ngoro-ariel.jpg", width: 1280, height: 854, title: "The bowl", place: "Ngorongoro Crater", chapter: "land", alt: "The Ngorongoro Crater seen from above, green slopes falling to the crater floor" },
  { src: "/media/experiences/cheetah-on-vehicle.jpg", width: 1080, height: 1350, title: "A very good view", place: "Serengeti", chapter: "road", alt: "A cheetah standing on the roof of a Macho Halisi safari vehicle" },
  { src: "/media/experiences/cultural/maasai-woman.jpg", width: 1280, height: 1707, title: "Beaded collar", place: "Maasai community", chapter: "people", alt: "A smiling Maasai woman wearing a beaded collar and a blue and red shuka" },
  { src: "/media/tarangire/African_Elephants_021816-2969_2048x.webp", width: 2048, height: 1365, title: "The long walk home", place: "Tarangire", chapter: "wild", alt: "A large herd of elephants moving through green bush" },
  { src: "/media/tarangire/Baobab-Tree-in-Tarangire-National-Park-1536x1022.jpg", width: 1536, height: 1022, title: "Giants of the dry season", place: "Tarangire", chapter: "land", alt: "Towering baobab trees under a blue sky beside a dirt track" },
  { src: "/media/about/team/guides-team.jpg", width: 5755, height: 3837, title: "The people behind the wheel", place: "Macho Halisi guides", chapter: "people", alt: "The Macho Halisi guides standing together beside the safari vehicles" },
  { src: "/media/experiences/elephant-vehicle.jpg", width: 1616, height: 1080, title: "Right of way", place: "Safari track", chapter: "road", alt: "An elephant on a dirt track, with a safari vehicle approaching behind it" },
  { src: "/media/manyara/manyara-lion.jpg", width: 1280, height: 1280, title: "Up a tree", place: "Lake Manyara", chapter: "wild", alt: "A lioness resting among the branches of a tree" },
  { src: "/media/serengeti/seronera-valley.jpg", width: 1280, height: 1707, title: "Seronera, from the air", place: "Serengeti", chapter: "land", alt: "Green hills and a winding valley in the central Serengeti seen from above" },
  { src: "/media/ngorongoro/ngoro-maasai.jpg", width: 1279, height: 852, title: "On the road to the crater", place: "Ngorongoro", chapter: "people", alt: "A group of Maasai men in red and checked shukas walking along a dirt road" },
  { src: "/media/experiences/game-drive-guests.jpg", width: 1616, height: 1080, title: "Roof up", place: "On game drive", chapter: "road", alt: "Guests standing through the open roof of a safari vehicle, watching wildlife" },
  { src: "/media/great-migration/gm-hero.jpg", width: 1280, height: 960, title: "The crossing", place: "Great Migration", chapter: "wild", alt: "Wildebeest leaping and splashing as they cross a river" },
  { src: "/media/kilimanjaro/kili-ariel.jpg", width: 1280, height: 1581, title: "Above the clouds", place: "Kilimanjaro", chapter: "land", alt: "Mount Kilimanjaro rising above a sea of cloud, seen from the air" },
  { src: "/media/experiences/cultural/maasai-group.jpg", width: 1280, height: 853, title: "The circle", place: "Maasai community", chapter: "people", alt: "A line of Maasai in bright shukas moving together across dry ground" },
  { src: "/media/entumoto-17831035.jpg", width: 1280, height: 851, title: "Sundowners", place: "The savanna", chapter: "road", alt: "Guests in camp chairs with drinks at a table, watching the sun set over the plains" },
  { src: "/media/tarangire/tara-cheetah.jpg", width: 1280, height: 960, title: "On watch", place: "Tarangire", chapter: "wild", alt: "A cheetah standing alert in dry grass" },
  { src: "/media/arusha-national-park/fig-tree.jpg", width: 1555, height: 1037, title: "The arch", place: "Arusha National Park", chapter: "land", alt: "A great fig tree whose trunk forms an arch over the track" },
  { src: "/media/experiences/cultural/datoga-women.jpg", width: 1920, height: 1080, title: "Gathered", place: "Lake Eyasi", chapter: "people", alt: "Datoga women standing together in front of a thorn-fenced homestead" },
  { src: "/media/about/fleet/fleet-lineup-golden.jpg", width: 5563, height: 3709, title: "Ready for the morning", place: "The Macho Halisi fleet", chapter: "road", alt: "A line of Macho Halisi safari vehicles in golden evening light" },
  { src: "/media/cheetah-about-us2.jpg", width: 1920, height: 1133, title: "Family portrait", place: "Serengeti", chapter: "wild", alt: "A cheetah and her cubs on a termite mound" },
  { src: "/media/experiences/waterfall-hot-spring/materuni.jpg", width: 2046, height: 1354, title: "Materuni", place: "Kilimanjaro foothills", chapter: "land", alt: "A tall waterfall falling through dense green forest" },
  { src: "/media/experiences/night-game-drives/leopard.jpg", width: 1280, height: 853, title: "After dark", place: "Night drive", chapter: "wild", alt: "A leopard lying among branches, lit by a spotlight at night" },
  { src: "/media/manyara/flamingo.jpg", width: 1280, height: 847, title: "Pink on pink", place: "Lake Manyara", chapter: "wild", alt: "A flock of flamingos wading in shallow water" },
  { src: "/media/experiences/canoeing/duluti-sunset.jpg", width: 1280, height: 2275, title: "Still water", place: "Lake Duluti", chapter: "land", alt: "Silhouetted figures beside a lake at sunset" },
  { src: "/media/experiences/leopard-photographers.jpg", width: 1020, height: 574, title: "The long lens", place: "Serengeti", chapter: "road", alt: "Guests photographing a leopard from a safari vehicle" },
  { src: "/media/about/team/guide-golden-hour.jpg", width: 6000, height: 4000, title: "Golden hour", place: "Macho Halisi guide", chapter: "people", alt: "A Macho Halisi guide standing with arms crossed in front of a safari vehicle in golden light" },
  { src: "/media/zanzibar/stone-town.jpg", width: 1280, height: 853, title: "Stone Town", place: "Zanzibar", chapter: "land", alt: "Church spires and rooftops of Stone Town at sunrise" },
  { src: "/media/experiences/night-game-drives/lioness.jpg", width: 1280, height: 853, title: "Lioness, by torchlight", place: "Night drive", chapter: "wild", alt: "A lioness caught in a spotlight in the dark" },
];

/** "One day on the road" — the pinned horizontal story. */
export interface TimesFrame {
  time: string;
  title: string;
  text: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const TIMES_DAY_FRAMES: TimesFrame[] = [
  {
    time: "First light",
    title: "Before the world wakes",
    text: "Coffee in the dark, a quiet engine, and the plains turning from blue to gold.",
    src: "/media/hot-air-baloon.jpg",
    width: 1280,
    height: 841,
    alt: "Hot-air balloons drifting over the savanna at dawn",
  },
  {
    time: "Morning",
    title: "Where the river runs",
    text: "Water draws everything to it, which is why our guides always start there.",
    src: "/media/serengeti/northern-river-country.jpg",
    width: 1280,
    height: 910,
    alt: "A river winding across the northern Serengeti with safari vehicles beside it",
  },
  {
    time: "Midday",
    title: "Down into the crater",
    text: "A world inside a world: the Ngorongoro caldera, framed by its green rim.",
    src: "/media/ngorongoro/ngoro-ariel.jpg",
    width: 1280,
    height: 854,
    alt: "The Ngorongoro Crater from the rim",
  },
  {
    time: "Afternoon",
    title: "Under the baobabs",
    text: "Slow, shaded hours among the giants of Tarangire.",
    src: "/media/tarangire/Baobab-Tree-in-Tarangire-National-Park-1536x1022.jpg",
    width: 1536,
    height: 1022,
    alt: "Baobab trees along a track in Tarangire National Park",
  },
  {
    time: "Golden hour",
    title: "Sundowners on the savanna",
    text: "The best seat in Tanzania is a camp chair and a low sun.",
    src: "/media/entumoto-17831035.jpg",
    width: 1280,
    height: 851,
    alt: "Guests relaxing in camp chairs as the sun sets over the plains",
  },
  {
    time: "After dark",
    title: "The night shift",
    text: "When the day animals sleep, the spotlight finds the ones that don't.",
    src: "/media/experiences/night-game-drives/leopard.jpg",
    width: 1280,
    height: 853,
    alt: "A leopard resting in a tree at night",
  },
];

/** The Oasis Residence mosaic ("Where the day ends"). */
export const TIMES_STAY_PHOTOS = [
  { src: "/media/oasis/aerial-suites.jpg", width: 2000, height: 1125, alt: "A thatched Oasis Residence pool suite among the forested hills of Karatu, seen from above" },
  { src: "/media/oasis/stone-bath.jpg", width: 2200, height: 1650, alt: "A carved stone bath on a timber deck at Oasis Residence" },
  { src: "/media/oasis/living-lounge.jpg", width: 2200, height: 1650, alt: "A suite living room with locally made art at Oasis Residence" },
  { src: "/media/oasis/pool-terrace.jpg", width: 2200, height: 1650, alt: "A private pool and terrace overlooking the forest at Oasis Residence" },
  { src: "/media/oasis/shared-pool.jpg", width: 2000, height: 1500, alt: "The secluded shared swimming pool at Oasis Residence" },
] as const;
