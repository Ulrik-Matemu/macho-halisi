import type { Destination } from "@/data/destinations";
import { parksAndReserves } from "./parks-reserves";
import { mountains } from "./mountains";
import { lakes } from "./lakes";
import { historicSites } from "./historic";
import { naturalWonders } from "./wonders";
import { islands } from "./islands";

export const extraDestinations: Destination[] = [
  ...parksAndReserves,
  ...mountains,
  ...lakes,
  ...historicSites,
  ...naturalWonders,
  ...islands,
];
