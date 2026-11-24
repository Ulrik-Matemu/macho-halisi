/**
 * Content for MACHO HALISI TIMES (/times). Everything the page shows lives
 * here, so a clip, a title or a position can change without touching a
 * component.
 *
 * Videos are served from /public/media/times/vids. The file names (WhatsApp
 * exports) contain spaces and brackets, so `video()` URL-encodes them.
 * `width`/`height` are the DISPLAYED size, which for the two lion clips
 * (…3.38.59 and …3.39.00) is portrait even though the file is stored
 * landscape with a 90° rotation flag. Posters in /public/media/times/posters
 * are stills taken from the clips themselves.
 *
 * Photographs live in /public/media/times/photos (picked from the team's own
 * folder, "MACHO HALISI TIMES", and renamed). Most are phone exports around
 * 750–1080px, so the layout below keeps them at modest widths.
 */

const video = (file: string) => `/media/times/vids/${encodeURIComponent(file)}`;
const poster = (id: string) => `/media/times/posters/${id}.jpg`;

export interface TimesFilm {
  kind: "film";
  id: string;
  src: string;
  poster: string;
  title: string;
  /** The small label under the title: a place, or what the frame is of. */
  place: string;
  width: number;
  height: number;
  seconds: number;
}

export interface TimesPhoto {
  kind: "photo";
  id: string;
  src: string;
  title: string;
  /** The small label under the title: a place, or what the frame is of. */
  place: string;
  width: number;
  height: number;
  alt: string;
}

export type TimesItem = TimesFilm | TimesPhoto;

const film = (f: Omit<TimesFilm, "kind" | "poster" | "src"> & { file: string }): TimesFilm => {
  const { file, ...rest } = f;
  return { kind: "film", src: video(file), poster: poster(f.id), ...rest };
};

export const TIMES_FILMS: Record<string, TimesFilm> = Object.fromEntries(
  [
    film({ id: "crossing", file: "WhatsApp Video 2026-11-12 at 3.37.42 PM(1).mp4", title: "The Crossing", place: "Serengeti", width: 816, height: 464, seconds: 30 }),
    film({ id: "river", file: "WhatsApp Video 2026-11-12 at 3.37.42 PM.mp4", title: "Waiting at the water", place: "Serengeti", width: 816, height: 464, seconds: 68 }),
    film({ id: "leopard", file: "WhatsApp Video 2026-11-12 at 3.38.54 PM.mp4", title: "Unhurried", place: "Forest track", width: 352, height: 624, seconds: 14 }),
    film({ id: "pride", file: "WhatsApp Video 2026-11-12 at 3.38.59 PM.mp4", title: "After the hunt", place: "The plains", width: 576, height: 1024, seconds: 43 }),
    film({ id: "lionesses", file: "WhatsApp Video 2026-11-12 at 3.39.00 PM.mp4", title: "Long grass", place: "The plains", width: 576, height: 1024, seconds: 11 }),
    film({ id: "hippo", file: "WhatsApp Video 2026-11-12 at 3.42.17 PM(1).mp4", title: "Pink and grey", place: "Ngorongoro Crater", width: 848, height: 480, seconds: 50 }),
    film({ id: "male", file: "WhatsApp Video 2026-11-12 at 3.42.17 PM.mp4", title: "Eye contact", place: "The plains", width: 352, height: 624, seconds: 8 }),
  ].map((f) => [f.id, f])
);

/** The clip that loops silently behind the masthead. */
export const TIMES_HERO_FILM = TIMES_FILMS.hippo;

const photo = (id: string, file: string, width: number, height: number, title: string, place: string, alt: string): TimesPhoto => ({
  kind: "photo",
  id,
  src: file.startsWith("/") ? file : `/media/times/photos/${file}.jpg`,
  width,
  height,
  title,
  place,
  alt,
});

export const TIMES_PHOTOS: Record<string, TimesPhoto> = Object.fromEntries(
  [
    photo("lioness-lookout", "lioness-lookout", 750, 1000, "The lookout", "Lioness", "A lioness standing alert on a rocky rise under a pale sky"),
    photo("leopard-log", "leopard-log", 1080, 810, "Siesta", "Leopard", "A leopard dozing with its head on a fallen log, spotted coat half in shade"),
    photo("leopard-close", "leopard-close", 810, 1080, "Held gaze", "Leopard", "A leopard looking straight at the camera from the branches of an acacia"),
    photo("lion-bush", "lion-bush", 1000, 750, "In the leaves", "Lion", "A male lion resting in the shade of a leafy thicket"),
    photo("lion-yawn", "lion-yawn", 1080, 607, "Big yawn", "Lion", "A male lion yawning wide, tongue out, on the short grass"),
    photo("cheetah", "cheetah", 750, 1000, "Poised", "Cheetah", "A cheetah sitting upright in long grass, scanning the plain"),
    photo("cheetahs", "cheetahs", 1000, 750, "Together", "Cheetahs", "Two cheetahs lying close together in bright green grass"),
    photo("giraffe-sky", "giraffe-sky", 1536, 2048, "Skyward", "Giraffe", "A giraffe standing tall against a blue sky with scattered cloud"),
    photo("flamingos", "flamingos", 1000, 750, "Pink line", "Flamingos", "A row of flamingos wading in still water, reflected beneath them"),
    photo("migration", "migration", 1000, 462, "Thousands", "Great Migration", "Wildebeest streaming down to and across a river in a dense column"),
    photo("lioness-yawn", "lioness-yawn", 810, 1080, "Mid-yawn", "Lioness", "A lioness stretched out on the ground, yawning"),
    photo("sunset-portrait", "sunset-portrait", 810, 1080, "Day's end", "On safari", "A Macho Halisi safari vehicle seen from behind against a setting sun"),
    photo("sunset-side", "sunset-side", 1080, 810, "Golden hour", "Our fleet", "A Macho Halisi safari vehicle in profile with guests aboard at sunset"),
    photo("lion-shade", "lion-shade", 1000, 750, "Shade", "Lion", "A lion lying in the shade of a parked safari vehicle"),
    photo("owl", "owl", 750, 1000, "Still watch", "Eagle-owl", "A large eagle-owl perched upright on a bare branch"),
    photo("beetle", "beetle", 2048, 1152, "Small things", "Dung beetle", "A dung beetle rolling a ball of dung across bare sand"),
    photo("pride-rest", "pride-rest", 1000, 750, "Pride at rest", "Lions", "A pride of lions asleep in the grass beside a safari vehicle"),
    photo("lion-crater", "lion-crater", 1080, 1080, "Eye level", "Ngorongoro Crater", "A male lion walking past a safari vehicle with the crater wall behind"),
    photo("zebras-sky", "zebras-sky", 1536, 2048, "Big sky", "Zebra", "Zebras grazing on green plains under a huge cloudy sky"),
    photo("lioness-cubs", "lioness-cubs", 1000, 750, "On the track", "Lioness & cubs", "A lioness and two cubs crossing a dirt track through acacia woodland"),
    photo("lioness-tree", "lioness-tree", 1000, 750, "Up high", "Lioness", "A lioness stretched along a large branch of a tree"),
    photo("vultures", "vultures", 1000, 750, "Two of a kind", "Vultures", "Two vultures perched on a thorny nest against a blue sky"),
    photo("leopard-acacia", "leopard-acacia", 1000, 750, "Branch work", "Leopard", "A leopard lying along a gnarled acacia branch"),
    photo("leopard-trunk", "leopard-trunk", 750, 1000, "Alert", "Leopard", "A leopard on a lichen-covered trunk, ears pricked"),
    photo("giraffe-lake", "giraffe-lake", 750, 1000, "Mirror", "Giraffe", "A giraffe walking along a lake shore, reflected in the water"),
    photo("lion-road", "lion-road", 750, 1000, "Road rest", "Lion", "A male lion lying on a dusty road, looking into the lens"),
    photo("oasis-from-above", "/media/oasis/aerial-suites.jpg", 2000, 1125, "From above", "Oasis Residence", "A thatched Oasis Residence pool suite among the forested hills of Karatu, seen from above"),
    photo("oasis-bath", "/media/oasis/stone-bath.jpg", 2200, 1650, "Stone bath", "Oasis Residence", "A carved stone bath on a timber deck at Oasis Residence"),
  ].map((p) => [p.id, p])
);

/**
 * The wall. Scenes run top to bottom; inside a "grid" scene each slot sits on
 * a 12-column grid (desktop) at its own column, width, vertical offset (in vh)
 * and parallax speed (negative drifts against the scroll, positive with it).
 * On phones every slot simply stacks, alternating left and right.
 * Slots within one scene must not share columns. Keep each scene's columns
 * symmetrical about the middle of the 12 (e.g. 1–12, 2–11, 3–10) so the wall
 * stays centred on the page. At the 1500px container a slot is roughly
 * 127px × span − 24px wide, so a 1000px photo is happiest at span 6 or less.
 */
export interface WallSlot {
  id: string;
  col: number;
  span: number;
  top?: number;
  speed?: number;
}

export type WallScene =
  | { kind: "grid"; anchor?: string; slots: WallSlot[] }
  | { kind: "expand"; id: string };

export const TIMES_SCENES: WallScene[] = [
  {
    kind: "grid",
    anchor: "films",
    slots: [
      { id: "crossing", col: 1, span: 7, speed: 0.05 },
      { id: "lioness-lookout", col: 10, span: 3, top: 24, speed: -0.09 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "leopard", col: 3, span: 3, speed: -0.06 },
      { id: "leopard-log", col: 7, span: 4, top: 18, speed: 0.07 },
    ],
  },
  { kind: "expand", id: "river" },
  {
    kind: "grid",
    anchor: "stills",
    slots: [
      { id: "leopard-close", col: 1, span: 3, top: 6, speed: 0.06 },
      { id: "lion-bush", col: 7, span: 6, top: 26, speed: -0.07 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "pride", col: 1, span: 4, speed: 0.03 },
      { id: "lion-yawn", col: 7, span: 6, top: 30, speed: -0.06 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "lionesses", col: 1, span: 3, top: 12, speed: 0.08 },
      { id: "cheetah", col: 6, span: 3, speed: -0.05 },
      { id: "male", col: 10, span: 3, top: 30, speed: 0.11 },
    ],
  },
  {
    kind: "grid",
    slots: [{ id: "cheetahs", col: 4, span: 6, speed: 0.03 }],
  },
  {
    kind: "grid",
    slots: [
      { id: "giraffe-sky", col: 2, span: 4, speed: -0.05 },
      { id: "flamingos", col: 7, span: 5, top: 26, speed: 0.07 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "migration", col: 1, span: 7, speed: 0.04 },
      { id: "lioness-yawn", col: 10, span: 3, top: 22, speed: -0.08 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "sunset-portrait", col: 2, span: 3, top: 8, speed: -0.07 },
      { id: "sunset-side", col: 6, span: 6, speed: 0.05 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "lion-shade", col: 1, span: 6, speed: 0.05 },
      { id: "owl", col: 10, span: 3, top: 16, speed: -0.08 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "beetle", col: 1, span: 4, top: 22, speed: -0.06 },
      { id: "pride-rest", col: 7, span: 6, speed: 0.05 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "lion-crater", col: 2, span: 5, speed: 0.04 },
      { id: "zebras-sky", col: 9, span: 3, top: 14, speed: -0.09 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "lioness-cubs", col: 1, span: 6, speed: 0.04 },
      { id: "lioness-tree", col: 8, span: 5, top: 28, speed: -0.06 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "leopard-trunk", col: 1, span: 3, speed: 0.07 },
      { id: "vultures", col: 5, span: 4, top: 18, speed: -0.05 },
      { id: "giraffe-lake", col: 10, span: 3, top: 6, speed: 0.09 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "lion-road", col: 3, span: 3, speed: -0.06 },
      { id: "leopard-acacia", col: 7, span: 4, top: 20, speed: 0.07 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "oasis-from-above", col: 1, span: 7, speed: 0.04 },
      { id: "oasis-bath", col: 9, span: 4, top: 22, speed: -0.07 },
    ],
  },
];

/** Every item on the wall, in page order — what the viewer pages through. */
export const TIMES_ORDER: TimesItem[] = TIMES_SCENES.flatMap((scene) =>
  scene.kind === "expand"
    ? [TIMES_FILMS[scene.id]]
    : scene.slots.map((slot) => TIMES_FILMS[slot.id] ?? TIMES_PHOTOS[slot.id])
);

export const timesIndex = (id: string) => TIMES_ORDER.findIndex((item) => item.id === id);
