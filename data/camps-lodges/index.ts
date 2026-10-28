import type { CampLodge } from "@/data/campsLodges";
import { serengetiStays } from "./serengeti";
import { ngorongoroStays } from "./ngorongoro";
import { manyaraStays, tarangireStays } from "./manyara-tarangire";
import { arushaStays, moshiStays, natronEyasiStays } from "./arusha-moshi";
import { stoneTownStays, zanzibarBeachStays, pembaMafiaStays, coastStays } from "./islands-coast";
import { tangaStays, southernStays, westStays, highlandsSouthStays } from "./south-west";

/** Written best-first within each region: getStaysForDestination keeps this order. */
export const campsLodgeEntries: CampLodge[] = [
  ...serengetiStays,
  ...ngorongoroStays,
  ...manyaraStays,
  ...tarangireStays,
  ...arushaStays,
  ...moshiStays,
  ...natronEyasiStays,
  ...stoneTownStays,
  ...zanzibarBeachStays,
  ...pembaMafiaStays,
  ...coastStays,
  ...tangaStays,
  ...southernStays,
  ...westStays,
  ...highlandsSouthStays,
];
