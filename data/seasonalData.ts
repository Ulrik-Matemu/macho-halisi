export interface MonthData {
  index: number;
  month: string;
  short: string;
  seasonLabel: string;
  migrationLocation: string;
  migrationCrossings: "none" | "low" | "moderate" | "peak";
  calvingActivity: "peak" | "moderate" | "none";
  rainfall: "minimal" | "moderate" | "high" | "short-rains";
  tempDayC: number;
  tempNightC: number;
  crowdLevel: "serene" | "moderate" | "peak";
  valueRating: "exceptional" | "balanced" | "premium";
  bestFor: string[];
  keyHighlight: string;
  description: string;
  recommendedParks: { name: string; slug: string; reason: string }[];
}

export interface SeasonalEra {
  id: string;
  title: string;
  subtitle: string;
  monthsSpan: string;
  image: {
    url: string;
    alt: string;
  };
  narrative: string;
  pros: string[];
  cons: string[];
  insiderSecret: string;
}

export interface WildlifeSpectacle {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  primeMonths: string[]; // e.g. ["Jul", "Aug", "Sep", "Oct"]
  description: string;
  primaryPark: string;
  parkSlug: string;
}

export const MONTHS_DATA: MonthData[] = [
  {
    index: 0,
    month: "January",
    short: "Jan",
    seasonLabel: "The Calving Season",
    migrationLocation: "Southern Serengeti & Ndutu Plains",
    migrationCrossings: "none",
    calvingActivity: "moderate",
    rainfall: "moderate",
    tempDayC: 28,
    tempNightC: 15,
    crowdLevel: "moderate",
    valueRating: "balanced",
    bestFor: ["Ndutu Calving", "Cheetah & Lion Hunts", "Birding Migrants"],
    keyHighlight: "Cheetahs prowling the short-grass plains as herds mass in the south.",
    description:
      "Two million wildebeest, zebras, and gazelles have blanketed the nutrient-rich volcanic soils of the Southern Serengeti and Ndutu. The plains are emerald green, water is plentiful, and the first early calving begins. Excellent month for photography without peak dry-season dust.",
    recommendedParks: [
      { name: "Ndutu & South Serengeti", slug: "serengeti", reason: "Herd congregation on short grass" },
      { name: "Ngorongoro Crater", slug: "ngorongoro", reason: "Year-round black rhino sightings" },
      { name: "Zanzibar Coast", slug: "zanzibar", reason: "Warm ocean waters & calm diving" },
    ],
  },
  {
    index: 1,
    month: "February",
    short: "Feb",
    seasonLabel: "Peak Calving & Predator Spectacle",
    migrationLocation: "Ndutu Plains & Ngorongoro Conservation Area",
    migrationCrossings: "none",
    calvingActivity: "peak",
    rainfall: "minimal",
    tempDayC: 29,
    tempNightC: 16,
    crowdLevel: "moderate",
    valueRating: "balanced",
    bestFor: ["Synchronized Calving", "Apex Predator Action", "Kili Trekking"],
    keyHighlight: "8,000 wildebeest calves born daily, sparking dramatic predator ambushes.",
    description:
      "The biological pinnacle of the Southern Serengeti. Over a brief three-week window, half a million calves take their first faltering steps within minutes of birth. Lion prides, leopards, cheetahs, and spotted hyenas patrol the open horizons in plain view.",
    recommendedParks: [
      { name: "Ndutu Plains", slug: "serengeti", reason: "Epic daily calving & predator stalking" },
      { name: "Mount Kilimanjaro", slug: "kilimanjaro", reason: "Clear skies & optimal summit conditions" },
      { name: "Lake Manyara", slug: "manyara", reason: "Lush groundwater forest & flamingos" },
    ],
  },
  {
    index: 2,
    month: "March",
    short: "Mar",
    seasonLabel: "The Late Calving Transition",
    migrationLocation: "Southern Serengeti Moving West",
    migrationCrossings: "none",
    calvingActivity: "moderate",
    rainfall: "moderate",
    tempDayC: 28,
    tempNightC: 16,
    crowdLevel: "serene",
    valueRating: "exceptional",
    bestFor: ["Growing Calves", "Dramatic Storm Clouds", "Low Vehicle Density"],
    keyHighlight: "Towering afternoon thunderheads illuminating golden plains and growing herds.",
    description:
      "Calves are now swift on their feet. The herds begin their slow northwest momentum toward the Maswa Game Reserve and western corridor. Light afternoon showers produce dramatic cinematic cloudscapes that fine-art photographers adore.",
    recommendedParks: [
      { name: "Central Serengeti (Seronera)", slug: "serengeti", reason: "Resident big cats on granite kopjes" },
      { name: "Ngorongoro Crater", slug: "ngorongoro", reason: "Lush crater floor and fewer vehicles" },
      { name: "Tarangire", slug: "tarangire", reason: "Quiet birding paradise" },
    ],
  },
  {
    index: 3,
    month: "April",
    short: "Apr",
    seasonLabel: "The Emerald Green Season",
    migrationLocation: "Central Serengeti & Western Corridor",
    migrationCrossings: "low",
    calvingActivity: "none",
    rainfall: "high",
    tempDayC: 26,
    tempNightC: 15,
    crowdLevel: "serene",
    valueRating: "exceptional",
    bestFor: ["Absolute Solitude", "Emerald Landscapes", "Exclusive Concession Rates"],
    keyHighlight: "Having the endless plains to yourself at premier luxury tented camps.",
    description:
      "The 'Long Rains' arrive in refreshing afternoon showers. The landscape transforms into a vibrant sea of wildflowers and deep green savannah. Safari vehicles are vanishingly few, luxury lodge rates drop substantially, and wildlife viewing remains astonishingly intimate.",
    recommendedParks: [
      { name: "Central Serengeti", slug: "serengeti", reason: "Private encounters at resident prides" },
      { name: "Ngorongoro Crater", slug: "ngorongoro", reason: "Mist-shrouded caldera in total serenity" },
      { name: "Ruaha National Park", slug: "southern-circuit", reason: "Wild southern solitude" },
    ],
  },
  {
    index: 4,
    month: "May",
    short: "May",
    seasonLabel: "The Rut & Moru Kopjes",
    migrationLocation: "Western Corridor & Grumeti River",
    migrationCrossings: "low",
    calvingActivity: "none",
    rainfall: "moderate",
    tempDayC: 26,
    tempNightC: 14,
    crowdLevel: "serene",
    valueRating: "exceptional",
    bestFor: ["Wildebeest Rut", "Grumeti River Massing", "Photographic Drama"],
    keyHighlight: "Columns of wildebeest stretching from horizon to horizon during the mating rut.",
    description:
      "Rain tapers off by mid-May. The wildebeest rut begins: bull wildebeest spar fiercely for breeding rights amidst continuous territorial clashes. The herds push through Moru Kopjes toward the Grumeti River, where colossal Nile crocodiles await.",
    recommendedParks: [
      { name: "Western Serengeti", slug: "serengeti", reason: "Herds massing along the Grumeti River" },
      { name: "Lake Manyara", slug: "manyara", reason: "Full hippo pools & baboon troops" },
      { name: "Zanzibar Coast", slug: "zanzibar", reason: "Refreshing sea breezes & tranquil resorts" },
    ],
  },
  {
    index: 5,
    month: "June",
    short: "Jun",
    seasonLabel: "The Dry Season Dawn",
    migrationLocation: "Grumeti River & Northern Serengeti Transition",
    migrationCrossings: "moderate",
    calvingActivity: "none",
    rainfall: "minimal",
    tempDayC: 27,
    tempNightC: 13,
    crowdLevel: "moderate",
    valueRating: "balanced",
    bestFor: ["Grumeti Crossings", "Crisp Clean Air", "Clear Starry Skies"],
    keyHighlight: "First dramatic river crossings across the crocodile-laden Grumeti River.",
    description:
      "Winter sets in across the highlands with cool, crisp evenings and cloudless blue skies. Waterholes begin drying, drawing wildlife out of the thickets toward remaining river courses. The advance guard of the migration reaches northern Serengeti.",
    recommendedParks: [
      { name: "Grumeti Reserves", slug: "serengeti", reason: "Thrilling Grumeti river crossings" },
      { name: "Tarangire National Park", slug: "tarangire", reason: "Elephant herds returning to the river" },
      { name: "Mount Kilimanjaro", slug: "kilimanjaro", reason: "Dry climbing routes begin" },
    ],
  },
  {
    index: 6,
    month: "July",
    short: "Jul",
    seasonLabel: "Peak Dry Season & River Crossings",
    migrationLocation: "Northern Serengeti & Mara River",
    migrationCrossings: "peak",
    calvingActivity: "none",
    rainfall: "minimal",
    tempDayC: 26,
    tempNightC: 12,
    crowdLevel: "peak",
    valueRating: "premium",
    bestFor: ["Mara River Crossings", "Tarangire Elephants", "Southern Circuit"],
    keyHighlight: "The adrenaline-surging leap of thousands of wildebeest into the Mara River.",
    description:
      "Prime safari season. The herds gather on the steep rocky banks of the Mara River. Days of tension culminate when a single brave animal leaps into the swirling water, triggering an unstoppable stampede against giant Nile crocodiles.",
    recommendedParks: [
      { name: "Northern Serengeti (Kogatende)", slug: "serengeti", reason: "World-famous Mara River crossings" },
      { name: "Tarangire National Park", slug: "tarangire", reason: "Hundreds of elephants under baobabs" },
      { name: "Ruaha & Nyerere", slug: "southern-circuit", reason: "Peak dry-season predator tracking" },
    ],
  },
  {
    index: 7,
    month: "August",
    short: "Aug",
    seasonLabel: "The Height of the Mara Crossings",
    migrationLocation: "Northern Serengeti & Mara River Basin",
    migrationCrossings: "peak",
    calvingActivity: "none",
    rainfall: "minimal",
    tempDayC: 27,
    tempNightC: 13,
    crowdLevel: "peak",
    valueRating: "premium",
    bestFor: ["Daily Mara Crossings", "Apex Predators", "Kilimanjaro Summit"],
    keyHighlight: "Dust devils whirling above the Mara River as herds crisscross between borders.",
    description:
      "Spectacular daily river crossing action. Herds cross back and forth across the Mara River following localized rainfall. Vegetation is low and dry, offering the highest visibility for leopards lounging in acacia branches and cheetah hunts across the golden plains.",
    recommendedParks: [
      { name: "Kogatende & Lamai Wedge", slug: "serengeti", reason: "Unbeatable river crossing vantage points" },
      { name: "Tarangire Riverbed", slug: "tarangire", reason: "Elephant digging for underground water" },
      { name: "Zanzibar Archipelago", slug: "zanzibar", reason: "Pristine dry sunshine and warm seas" },
    ],
  },
  {
    index: 8,
    month: "September",
    short: "Sep",
    seasonLabel: "The Golden Savannah Peak",
    migrationLocation: "Northern Serengeti & Lamai Wedge",
    migrationCrossings: "peak",
    calvingActivity: "none",
    rainfall: "minimal",
    tempDayC: 28,
    tempNightC: 14,
    crowdLevel: "peak",
    valueRating: "premium",
    bestFor: ["Late Mara Crossings", "Tarangire Baobab Landscape", "Whale Shark Season"],
    keyHighlight: "Uninterrupted predator viewing under golden golden afternoon light.",
    description:
      "Tanzania at its driest and most intense. Every water source is an active theater of survival. Tarangire hosts the highest density of elephants anywhere in East Africa. River crossings continue with breathtaking drama along the northern border.",
    recommendedParks: [
      { name: "Northern Serengeti", slug: "serengeti", reason: "Dramatic crossings and predator territorial patrols" },
      { name: "Tarangire National Park", slug: "tarangire", reason: "Absolute peak elephant congregations" },
      { name: "Mafia Island", slug: "zanzibar", reason: "Whale sharks begin arriving in the channel" },
    ],
  },
  {
    index: 9,
    month: "October",
    short: "Oct",
    seasonLabel: "The Final Crossing & Southward Stirring",
    migrationLocation: "Northern Serengeti Turning South",
    migrationCrossings: "moderate",
    calvingActivity: "none",
    rainfall: "minimal",
    tempDayC: 29,
    tempNightC: 15,
    crowdLevel: "moderate",
    valueRating: "balanced",
    bestFor: ["Last River Crossings", "Warm Days", "Chimpanzee Trekking"],
    keyHighlight: "Sensing the first distant scent of rain, the mega-herd begins its march south.",
    description:
      "A magical shoulder month. Days are pleasantly warm. The herds sense the first moisture laden winds and begin moving down from the north toward the central plains. Crowds thin noticeably while predator density remains at its peak.",
    recommendedParks: [
      { name: "Northern & Central Serengeti", slug: "serengeti", reason: "Final river crossings & kopje leopards" },
      { name: "Mahale Mountains", slug: "southern-circuit", reason: "Chimpanzees feeding near lakeshore" },
      { name: "Kilimanjaro", slug: "kilimanjaro", reason: "Warm temperatures and clear skies" },
    ],
  },
  {
    index: 10,
    month: "November",
    short: "Nov",
    seasonLabel: "The Short Rains & Renewal",
    migrationLocation: "Eastern & Central Serengeti (Lobo / Seronera)",
    migrationCrossings: "none",
    calvingActivity: "none",
    rainfall: "short-rains",
    tempDayC: 29,
    tempNightC: 16,
    crowdLevel: "serene",
    valueRating: "exceptional",
    bestFor: ["Low Season Exclusivity", "Bird Migrations", "Lush Refreshment"],
    keyHighlight: "The 'Secret Season': gentle nighttime rains, vibrant skies, and low rates.",
    description:
      "Known as the 'Short Rains', short afternoon showers wash the dust from the air without impeding safari drives. The savannah greens overnight, fresh grasses sprout, and European migratory birds arrive in their tens of thousands.",
    recommendedParks: [
      { name: "Eastern Serengeti & Lobo", slug: "serengeti", reason: "Herds moving through dramatic rock formations" },
      { name: "Ngorongoro Crater", slug: "ngorongoro", reason: "Crater lake flamingos and vibrant floor" },
      { name: "Tarangire", slug: "tarangire", reason: "Lush landscape and birding extravaganza" },
    ],
  },
  {
    index: 11,
    month: "December",
    short: "Dec",
    seasonLabel: "The Festive Bush & Return to Ndutu",
    migrationLocation: "Southern Serengeti Plains & Ndutu",
    migrationCrossings: "none",
    calvingActivity: "moderate",
    rainfall: "moderate",
    tempDayC: 28,
    tempNightC: 16,
    crowdLevel: "peak",
    valueRating: "premium",
    bestFor: ["Holiday Celebrations", "Ndutu Arrival", "Zanzibar Festivities"],
    keyHighlight: "Celebrating Christmas and New Year beneath a canopy of African stars.",
    description:
      "The great circular journey comes full circle. Millions of animals arrive back onto the southern plains where they were born twelve months prior. The festive season brings warm champagne evenings, bush dinners under lantern light, and joyful energy.",
    recommendedParks: [
      { name: "Southern Serengeti", slug: "serengeti", reason: "Herds massing across the open horizons" },
      { name: "Zanzibar Island", slug: "zanzibar", reason: "Festive barefoot luxury on powder sands" },
      { name: "Ngorongoro Crater", slug: "ngorongoro", reason: "Spectacular Big Five wildlife density" },
    ],
  },
];

export const SEASONAL_ERAS: SeasonalEra[] = [
  {
    id: "dry",
    title: "The Great Dry Season",
    subtitle: "High Drama, River Crossings & Thirst-Driven Crowds",
    monthsSpan: "June through October",
    image: {
      url: "https://images.unsplash.com/photo-1547970810-dc1eac8161a7?auto=format&fit=crop&w=1600&q=85",
      alt: "Wildebeest jumping into the Mara River during the great migration",
    },
    narrative:
      "This is the quintessential safari chapter that stars in every wildlife documentary. As vegetation withers and seasonal watercourses vanish, animals congregate tightly around permanent rivers like the Mara and Tarangire. Temperatures are mild, malaria risk is at its lowest, and predator visibility is extraordinary.",
    pros: [
      "Legendary Mara River crossings with crocodile ambush action",
      "Maximum wildlife visibility as grasses thin out",
      "Virtually zero rainfall and cloudless starry nights",
      "Ideal dry trekking conditions for Mount Kilimanjaro",
    ],
    cons: [
      "Highest accommodation rates and peak booking demand",
      "Dusty bush tracks and higher vehicle volume at river crossings",
    ],
    insiderSecret:
      "Book mobile luxury camps situated on private concessions adjacent to Kogatende to access river vantage points at dawn before public gate convoys arrive.",
  },
  {
    id: "calving",
    title: "The Calving & Emerald Season",
    subtitle: "New Life, Newborn Calves & Ruthless Big Cat Action",
    monthsSpan: "December through March",
    image: {
      url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
      alt: "Lions resting in the golden green grass of the southern Serengeti",
    },
    narrative:
      "The volcanic plains of the south are rich in calcium and phosphorus, drawing two million mothers to give birth simultaneously. Over 8,000 calves arrive daily. The air is warm, the plains are lush and green, and the sheer density of apex predators is unmatched anywhere on the planet.",
    pros: [
      "Witnessing newborn wildlife take their very first steps",
      "Cheetahs, lions, and leopards actively hunting on open short grass",
      "Warm Indian Ocean waters perfect for combining with Zanzibar",
      "Lush, dramatic skies without heavy continuous rain",
    ],
    cons: [
      "Late December to early January commands holiday peak surcharges",
      "Occasional short convective thunderstorms in afternoons",
    ],
    insiderSecret:
      "February is the most underrated month in all of African safari travel: the synchronized calving is equal in drama to river crossings, with significantly fewer vehicles.",
  },
  {
    id: "green",
    title: "The Green Season & Solitude",
    subtitle: "The Secret Season of Silence, Wildflowers & Low Rates",
    monthsSpan: "April through May",
    image: {
      url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=85",
      alt: "Elephants feeding peacefully in lush green landscape after the rains",
    },
    narrative:
      "The 'Long Rains' arrive as brief, cleansing afternoon downpours rather than day-long monsoons. The savannah erupts into a sea of emerald green, wildflowers blossom, and air clarity reaches optical perfection. For those who value silence over crowds, this is heaven.",
    pros: [
      "Having prime wildlife sightings entirely to yourself",
      "Up to 40% savings on premier luxury lodges and tented camps",
      "Vibrant landscapes, newborn bird species, and dramatic light",
      "Rich resident game populations that never migrate away",
    ],
    cons: [
      "Some unpaved tracks become muddy and require skilled 4x4 handling",
      "Some seasonal camps close for maintenance during April",
    ],
    insiderSecret:
      "Ngorongoro Crater is enclosed by its volcanic walls and remains fully accessible and lush during April and May, offering near-private game viewing.",
  },
];

export const WILDLIFE_SPECTACLES: WildlifeSpectacle[] = [
  {
    id: "river-crossings",
    title: "The Great Mara River Crossings",
    tagline: "Heart-stopping crocodile ambushes & thousands leaping into currents",
    iconName: "Waves",
    primeMonths: ["Jul", "Aug", "Sep", "Oct"],
    description:
      "Two million animals must cross the crocodile-dense Mara River to reach lush grazing. You will sit quietly on the riverbank as tension mounts before an explosion of water and courage.",
    primaryPark: "Northern Serengeti",
    parkSlug: "serengeti",
  },
  {
    id: "calving",
    title: "Wildebeest Calving Spectacle",
    tagline: "Half a million calves born in 3 weeks on the Ndutu plains",
    iconName: "Sparkles",
    primeMonths: ["Jan", "Feb", "Mar"],
    description:
      "Synchronized birthing creates a breathtaking wave of new life across the short-grass plains, closely stalked by the highest cheetah concentration on Earth.",
    primaryPark: "Ndutu & Ngorongoro Conservation Area",
    parkSlug: "ngorongoro",
  },
  {
    id: "big-cats",
    title: "Apex Big Cat Encounters",
    tagline: "Lions, leopards, and cheetahs hunting with ruthless grace",
    iconName: "Eye",
    primeMonths: ["Jun", "Jul", "Aug", "Sep", "Oct", "Jan", "Feb"],
    description:
      "Whether it is tree-climbing lions in Manyara, kopje-dwelling prides in Seronera, or leopards along the Grumeti riverbanks, Tanzania provides unmatched big cat intimacy.",
    primaryPark: "Central Serengeti & Tarangire",
    parkSlug: "serengeti",
  },
  {
    id: "kilimanjaro",
    title: "Mount Kilimanjaro Summit Treks",
    tagline: "Dry mountain routes & crystal-clear glacial vistas at 5,895m",
    iconName: "Mountain",
    primeMonths: ["Jan", "Feb", "Jul", "Aug", "Sep", "Oct"],
    description:
      "Ascend Uhuru Peak under optimal dry conditions. Clear skies provide panoramic views across the African continent and maximum summit success rates.",
    primaryPark: "Mount Kilimanjaro National Park",
    parkSlug: "kilimanjaro",
  },
  {
    id: "elephants",
    title: "Great Elephant Congregations",
    tagline: "Massive herds gathering beneath colossal baobabs",
    iconName: "Trees",
    primeMonths: ["Jul", "Aug", "Sep", "Oct"],
    description:
      "During the dry season, up to 300 elephants gather at single riverbeds in Tarangire, digging for fresh water with their trunks beneath ancient baobab trees.",
    primaryPark: "Tarangire National Park",
    parkSlug: "tarangire",
  },
  {
    id: "whale-sharks",
    title: "Zanzibar Coast & Whale Sharks",
    tagline: "Swimming with ocean giants & barefoot turquoise bliss",
    iconName: "Compass",
    primeMonths: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    description:
      "Pair your dusty bush adventure with powder-white sands, dhow cruises, and swimming alongside harmless whale sharks in the crystalline waters of Mafia Island.",
    primaryPark: "Zanzibar & Mafia Island Archipelago",
    parkSlug: "zanzibar",
  },
];
