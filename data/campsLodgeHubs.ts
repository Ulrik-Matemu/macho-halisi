/**
 * Regional hubs that connect camps & lodges to destination pages. A lodge
 * does not have to sit inside a park — it only has to be a convenient base
 * for the destinations listed on its hub.
 */
export type LodgeHubId =
  | "serengeti"
  | "ngorongoro-karatu"
  | "manyara"
  | "tarangire"
  | "arusha"
  | "moshi"
  | "natron"
  | "eyasi"
  | "stone-town"
  | "zanzibar-beaches"
  | "pemba"
  | "mafia"
  | "dar-es-salaam"
  | "saadani"
  | "tanga"
  | "usambara"
  | "selous"
  | "mikumi"
  | "ruaha"
  | "iringa"
  | "katavi"
  | "kigoma"
  | "mwanza"
  | "mbeya"
  | "kilwa";

export interface LodgeHub {
  label: string;
  /** Destinations to draw area photos from instead of `destinations` (e.g. to avoid a photo of people). */
  coverFrom?: string[];
  /** Wider grouping used for the /camps-lodges filter chips. */
  area: LodgeArea;
  destinations: string[];
}

export type LodgeArea =
  | "Northern Circuit"
  | "Zanzibar & the Islands"
  | "Coast & Dar es Salaam"
  | "Southern Circuit"
  | "Western Tanzania & Lake Victoria"
  | "Southern Highlands & South Coast";

export const LODGE_AREAS: LodgeArea[] = [
  "Northern Circuit",
  "Zanzibar & the Islands",
  "Coast & Dar es Salaam",
  "Southern Circuit",
  "Western Tanzania & Lake Victoria",
  "Southern Highlands & South Coast",
];

export const LODGE_HUBS: Record<LodgeHubId, LodgeHub> = {
  serengeti: {
    label: "Serengeti",
    area: "Northern Circuit",
    destinations: ["serengeti", "great-migration", "ikorongo-grumeti", "maswa"],
  },
  "ngorongoro-karatu": {
    label: "Ngorongoro & Karatu",
    area: "Northern Circuit",
    destinations: ["ngorongoro", "empakaai", "laetoli", "olduvai-gorge", "lake-eyasi", "rift-valley", "ol-doinyo-lengai", "lake-natron"],
  },
  manyara: {
    label: "Lake Manyara",
    area: "Northern Circuit",
    destinations: ["manyara", "rift-valley"],
  },
  tarangire: {
    label: "Tarangire & Babati",
    area: "Northern Circuit",
    destinations: ["tarangire", "kondoa-rock-art", "hanang", "lake-babati"],
  },
  arusha: {
    label: "Arusha",
    area: "Northern Circuit",
    destinations: ["arusha", "meru", "momella-lakes", "lake-duluti", "longido", "kikuletwa", "mkomazi", "lake-natron"],
  },
  moshi: {
    label: "Moshi & Kilimanjaro",
    area: "Northern Circuit",
    destinations: ["kilimanjaro", "materuni-falls", "kikuletwa", "lake-chala", "pare", "mkomazi"],
  },
  natron: {
    label: "Lake Natron",
    area: "Northern Circuit",
    destinations: ["lake-natron", "ol-doinyo-lengai", "empakaai"],
  },
  eyasi: {
    label: "Lake Eyasi",
    area: "Northern Circuit",
    coverFrom: ["rift-valley"],
    destinations: ["lake-eyasi"],
  },
  "stone-town": {
    label: "Stone Town",
    area: "Zanzibar & the Islands",
    destinations: ["stone-town", "zanzibar", "mangapwani", "jozani", "chumbe"],
  },
  "zanzibar-beaches": {
    label: "Zanzibar Beaches",
    area: "Zanzibar & the Islands",
    destinations: ["zanzibar", "jozani", "mnemba", "chumbe"],
  },
  pemba: {
    label: "Pemba",
    area: "Zanzibar & the Islands",
    destinations: ["pemba", "misali"],
  },
  mafia: {
    label: "Mafia Island",
    area: "Zanzibar & the Islands",
    destinations: ["mafia"],
  },
  "dar-es-salaam": {
    label: "Dar es Salaam",
    area: "Coast & Dar es Salaam",
    destinations: ["bongoyo", "mbudya", "bagamoyo", "saadani"],
  },
  saadani: {
    label: "Saadani",
    area: "Coast & Dar es Salaam",
    destinations: ["saadani", "bagamoyo"],
  },
  tanga: {
    label: "Tanga & Pangani",
    area: "Coast & Dar es Salaam",
    destinations: ["pangani", "tongoni", "amboni-caves", "usambara"],
  },
  usambara: {
    label: "Usambara Mountains",
    area: "Coast & Dar es Salaam",
    destinations: ["usambara", "pare"],
  },
  selous: {
    label: "Selous & Nyerere",
    area: "Southern Circuit",
    destinations: ["nyerere", "selous", "rufiji-river"],
  },
  mikumi: {
    label: "Mikumi & Morogoro",
    area: "Southern Circuit",
    destinations: ["mikumi", "uluguru", "udzungwa", "southern-circuit"],
  },
  ruaha: {
    label: "Ruaha",
    area: "Southern Circuit",
    destinations: ["ruaha", "southern-circuit", "isimila"],
  },
  iringa: {
    label: "Iringa & Mufindi",
    area: "Southern Circuit",
    destinations: ["isimila", "ruaha", "udzungwa"],
  },
  katavi: {
    label: "Katavi",
    area: "Western Tanzania & Lake Victoria",
    destinations: ["katavi", "lake-rukwa", "kalambo-falls"],
  },
  kigoma: {
    label: "Kigoma, Gombe & Mahale",
    area: "Western Tanzania & Lake Victoria",
    destinations: ["mahale", "gombe", "lake-tanganyika"],
  },
  mwanza: {
    label: "Mwanza & Lake Victoria",
    area: "Western Tanzania & Lake Victoria",
    destinations: ["lake-victoria", "rubondo", "ukerewe", "butiama"],
  },
  mbeya: {
    label: "Mbeya & Lake Nyasa",
    area: "Southern Highlands & South Coast",
    destinations: ["kitulo", "rungwe", "lake-ngozi", "kipengere", "lake-nyasa", "mbozi-meteorite"],
  },
  kilwa: {
    label: "Kilwa & the South Coast",
    area: "Southern Highlands & South Coast",
    destinations: ["kilwa", "mikindani", "songo-songo"],
  },
};
