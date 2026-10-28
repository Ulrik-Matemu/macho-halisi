import type { DestinationCategory } from "@/data/destinations";

/** Public destination categories, in display order — drives the explorer chips and the nav menu. */
export const CATEGORY_FILTERS: { value: DestinationCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "national-park", label: "National Parks" },
  { value: "game-reserve", label: "Game Reserves" },
  { value: "mountain", label: "Mountains" },
  { value: "lake", label: "Lakes & Water Bodies" },
  { value: "historic-site", label: "Historical Sites" },
  { value: "natural-wonder", label: "Natural Wonders" },
  { value: "island", label: "Islands" },
];
