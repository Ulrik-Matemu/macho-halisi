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
 */

const video = (file: string) => `/media/times/vids/${encodeURIComponent(file)}`;
const poster = (id: string) => `/media/times/posters/${id}.jpg`;

export interface TimesFilm {
  kind: "film";
  id: string;
  src: string;
  poster: string;
  title: string;
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

const photo = (id: string, src: string, width: number, height: number, title: string, place: string, alt: string): TimesPhoto => ({
  kind: "photo",
  id,
  src,
  width,
  height,
  title,
  place,
  alt,
});

export const TIMES_PHOTOS: Record<string, TimesPhoto> = Object.fromEntries(
  [
    photo("watcher", "/media/serengeti/sere-lion.jpg", 1280, 1920, "The watcher", "Serengeti", "A male lion in profile, mane lit by low sun"),
    photo("up-a-tree", "/media/manyara/manyara-lion.jpg", 1280, 1280, "Up a tree", "Lake Manyara", "A lioness resting among the branches of a tree"),
    photo("long-walk", "/media/tarangire/African_Elephants_021816-2969_2048x.webp", 2048, 1365, "The long walk home", "Tarangire", "A large herd of elephants moving through green bush"),
    photo("good-view", "/media/experiences/cheetah-on-vehicle.jpg", 1080, 1350, "A very good view", "Serengeti", "A cheetah standing on the roof of a Macho Halisi safari vehicle"),
    photo("the-bowl", "/media/ngorongoro/ngoro-ariel.jpg", 1280, 854, "The bowl", "Ngorongoro Crater", "The Ngorongoro Crater seen from above, green slopes falling to the crater floor"),
    photo("above-clouds", "/media/kilimanjaro/kili-ariel.jpg", 1280, 1581, "Above the clouds", "Kilimanjaro", "Mount Kilimanjaro rising above a sea of cloud, seen from the air"),
    photo("baobabs", "/media/tarangire/Baobab-Tree-in-Tarangire-National-Park-1536x1022.jpg", 1536, 1022, "Giants of the dry season", "Tarangire", "Towering baobab trees under a blue sky beside a dirt track"),
    photo("beaded-collar", "/media/experiences/cultural/maasai-woman.jpg", 1280, 1707, "Beaded collar", "Maasai community", "A smiling Maasai woman wearing a beaded collar and a blue and red shuka"),
    photo("behind-the-wheel", "/media/about/team/guides-team.jpg", 5755, 3837, "Behind the wheel", "Our guides", "The Macho Halisi guides standing together beside the safari vehicles"),
    photo("sundowners", "/media/entumoto-17831035.jpg", 1280, 851, "Sundowners", "The savanna", "Guests in camp chairs with drinks at a table, watching the sun set over the plains"),
    photo("still-water", "/media/experiences/canoeing/duluti-sunset.jpg", 1280, 2275, "Still water", "Lake Duluti", "Silhouetted figures beside a lake at sunset"),
    photo("after-dark", "/media/experiences/night-game-drives/leopard.jpg", 1280, 853, "After dark", "Night drive", "A leopard lying among branches, lit by a spotlight at night"),
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
 * stays centred on the page.
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
      { id: "watcher", col: 10, span: 3, top: 24, speed: -0.09 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "leopard", col: 3, span: 3, speed: -0.06 },
      { id: "up-a-tree", col: 7, span: 4, top: 18, speed: 0.07 },
    ],
  },
  { kind: "expand", id: "river" },
  {
    kind: "grid",
    anchor: "stills",
    slots: [
      { id: "long-walk", col: 1, span: 6, speed: 0.04 },
      { id: "good-view", col: 10, span: 3, top: 28, speed: -0.09 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "pride", col: 1, span: 4, speed: 0.03 },
      { id: "the-bowl", col: 7, span: 6, top: 32, speed: -0.06 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "lionesses", col: 1, span: 3, top: 12, speed: 0.08 },
      { id: "above-clouds", col: 6, span: 3, speed: -0.05 },
      { id: "male", col: 10, span: 3, top: 30, speed: 0.11 },
    ],
  },
  {
    kind: "grid",
    slots: [{ id: "baobabs", col: 3, span: 8, speed: 0.03 }],
  },
  {
    kind: "grid",
    slots: [
      { id: "beaded-collar", col: 2, span: 3, top: 10, speed: -0.07 },
      { id: "behind-the-wheel", col: 6, span: 6, speed: 0.05 },
    ],
  },
  {
    kind: "grid",
    slots: [
      { id: "sundowners", col: 1, span: 6, speed: 0.05 },
      { id: "still-water", col: 10, span: 3, top: 14, speed: -0.08 },
    ],
  },
  {
    kind: "grid",
    slots: [{ id: "after-dark", col: 4, span: 6, speed: 0.04 }],
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
