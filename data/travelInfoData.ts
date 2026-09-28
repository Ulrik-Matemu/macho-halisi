export interface TravelTopic {
  id: string;
  title: string;
  shortTitle: string;
  iconName: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: "clothing" | "optics-tech" | "health-toiletries" | "documents";
  essential: boolean;
  notes: string;
  tripTypes: ("safari" | "kili" | "beach")[];
}

export interface TravelFaq {
  question: string;
  answer: string;
  category: "visas" | "health" | "money" | "gear" | "etiquette";
}

export const TRAVEL_TOPICS: TravelTopic[] = [
  { id: "visas", title: "Visas & Entry", shortTitle: "Visas", iconName: "Passport" },
  { id: "health", title: "Health & Vaccines", shortTitle: "Health", iconName: "HeartPulse" },
  { id: "packing", title: "Packing Checklist", shortTitle: "Packing", iconName: "CheckSquare" },
  { id: "luggage", title: "Bush Luggage Specs", shortTitle: "Luggage", iconName: "Briefcase" },
  { id: "currency", title: "Currency & Tipping", shortTitle: "Money", iconName: "Coins" },
  { id: "etiquette", title: "Bush Etiquette", shortTitle: "Etiquette", iconName: "ShieldCheck" },
  { id: "faqs", title: "Frequent Questions", shortTitle: "FAQs", iconName: "HelpCircle" },
];

export const PACKING_ITEMS: PackingItem[] = [
  // Clothing
  {
    id: "c-khaki",
    name: "Neutral Safari Attire (Khaki, Olive, Sand)",
    category: "clothing",
    essential: true,
    notes: "Avoid dark blue and black (attracts tsetse flies); avoid bright white and camouflage.",
    tripTypes: ["safari", "beach"],
  },
  {
    id: "c-fleece",
    name: "Warm Fleece or Light Down Jacket",
    category: "clothing",
    essential: true,
    notes: "Ngorongoro Crater rim and pre-dawn game drives are surprisingly cold (10°C / 50°F).",
    tripTypes: ["safari", "kili"],
  },
  {
    id: "c-boots",
    name: "Comfortable Sturdy Walking Shoes or Trail Runners",
    category: "clothing",
    essential: true,
    notes: "Break in before departure. Essential for walking safaris and camp evenings.",
    tripTypes: ["safari", "kili"],
  },
  {
    id: "c-hat",
    name: "Wide-Brimmed Safari Sun Hat with Chin Cord",
    category: "clothing",
    essential: true,
    notes: "Crucial for open-roof game drives under high UV equatorial sunshine.",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "c-linen",
    name: "Lightweight Breathable Linen / Cotton Shirts",
    category: "clothing",
    essential: true,
    notes: "Long sleeves protect against intense midday sun and evening mosquitoes.",
    tripTypes: ["safari", "beach"],
  },
  {
    id: "c-swim",
    name: "Swimwear & Beach Sandals",
    category: "clothing",
    essential: false,
    notes: "For lodge plunge pools and barefoot relaxation along the Zanzibar coastline.",
    tripTypes: ["safari", "beach"],
  },
  {
    id: "c-thermal",
    name: "Thermal Base Layers & Waterproof Hardshell",
    category: "clothing",
    essential: true,
    notes: "Vital for Kilimanjaro summit push where arctic temperatures reach -15°C.",
    tripTypes: ["kili"],
  },

  // Optics & Tech
  {
    id: "t-binocs",
    name: "High-Quality Binoculars (8x42 or 10x42)",
    category: "optics-tech",
    essential: true,
    notes: "One pair per traveler transforms your safari experience tenfold.",
    tripTypes: ["safari", "kili"],
  },
  {
    id: "t-zoom",
    name: "Telephoto Camera Lens (100–400mm or equivalent)",
    category: "optics-tech",
    essential: false,
    notes: "For crisp wildlife portraits and distant predator behavioral shots.",
    tripTypes: ["safari"],
  },
  {
    id: "t-batteries",
    name: "Spare Camera Batteries & Memory Cards",
    category: "optics-tech",
    essential: true,
    notes: "Dusty days mean lots of frames; vehicle charging is available, but backups are key.",
    tripTypes: ["safari", "kili"],
  },
  {
    id: "t-plug",
    name: "UK-Style Type G Electrical Adapter",
    category: "optics-tech",
    essential: true,
    notes: "Standard three-rectangular-pin British sockets (230V / 50Hz) are universal in Tanzania.",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "t-headlamp",
    name: "Hands-Free Headlamp with Red Light Mode",
    category: "optics-tech",
    essential: true,
    notes: "For tented camps at night and early pre-dawn summit attempts.",
    tripTypes: ["safari", "kili"],
  },

  // Health & Toiletries
  {
    id: "h-deet",
    name: "DEET-Based Insect Repellent (30%+ Concentration)",
    category: "health-toiletries",
    essential: true,
    notes: "Apply on exposed ankles and wrists around dusk and dawn.",
    tripTypes: ["safari", "beach"],
  },
  {
    id: "h-sunscreen",
    name: "Broad-Spectrum SPF 50 Sunscreen & Lip Balm",
    category: "health-toiletries",
    essential: true,
    notes: "Equatorial African sun penetrates even on overcast mornings.",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "h-meds",
    name: "Malaria Prophylaxis & Personal Prescriptions",
    category: "health-toiletries",
    essential: true,
    notes: "Consult your travel clinic (Malarone or Doxycycline are common choices). Keep in carry-on.",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "h-drops",
    name: "Lubricating Eye Drops & Saline Nasal Spray",
    category: "health-toiletries",
    essential: false,
    notes: "Dry season dust can irritate contact lens wearers and sensitive eyes.",
    tripTypes: ["safari"],
  },

  // Documents
  {
    id: "d-passport",
    name: "Passport Valid for 6+ Months from Exit Date",
    category: "documents",
    essential: true,
    notes: "Must have at least 3 completely blank unstamped visa pages.",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "d-visa",
    name: "Printed Tanzania eVisa Confirmation",
    category: "documents",
    essential: true,
    notes: "Apply 3–4 weeks prior via immigration.go.tz or obtain on arrival.",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "d-yellow",
    name: "Yellow Fever Vaccination Certificate (if applicable)",
    category: "documents",
    essential: false,
    notes: "Only mandatory if arriving from or transiting >12h through an endemic country (e.g. Kenya, Ethiopia).",
    tripTypes: ["safari", "kili", "beach"],
  },
  {
    id: "d-cash",
    name: "Crisp USD Cash (Printed 2009 or Newer)",
    category: "documents",
    essential: true,
    notes: "Tanzanian banks and camps strictly refuse US dollar bills printed prior to 2009.",
    tripTypes: ["safari", "kili", "beach"],
  },
];

export const TRAVEL_FAQS: TravelFaq[] = [
  {
    question: "Do I need a visa to enter Tanzania?",
    answer:
      "Yes. Most nationalities (including US, UK, EU, Canada, and Australia) require a tourist visa. You can obtain an electronic visa (eVisa) online prior to departure through the official Tanzanian Immigration portal (immigration.go.tz), or obtain a visa upon arrival at Kilimanjaro (JRO), Dar es Salaam (DAR), or Zanzibar (ZNZ) international airports. The standard single-entry tourist visa is $50 USD for most citizens, and $100 USD for US citizens (multiple-entry 1-year). Ensure your passport has at least 6 months validity beyond your planned departure date.",
    category: "visas",
  },
  {
    question: "What vaccinations and health precautions are required?",
    answer:
      "Tanzania requires a Yellow Fever vaccination certificate ONLY if you are arriving from or transiting for more than 12 hours through a country with risk of yellow fever transmission (such as Kenya, Uganda, or Ethiopia). If flying directly from Europe, North America, or the Middle East, it is not required. Malaria prophylaxis (such as Atovaquone/Proguanil or Doxycycline) is strongly recommended for all safari destinations. All Macho Halisi luxury camps provide purified drinking water, hot showers, and mosquito netting.",
    category: "health",
  },
  {
    question: "What is the luggage weight limit for internal bush flights?",
    answer:
      "Internal scheduled bush flights (operated by light aircraft like the Cessna Grand Caravan 208B) impose a strict weight limit of 15 kg (33 lbs) per passenger, inclusive of camera gear and hand luggage. Crucially, luggage MUST be soft-sided duffel bags without rigid frames or hard wheels so they can fit into the small curved aircraft luggage pods beneath the fuselage. If you have excess baggage, Macho Halisi can arrange complimentary secure luggage storage at our base in Arusha/Karatu while you are on safari.",
    category: "gear",
  },
  {
    question: "Why must US dollar bills be printed in 2009 or later?",
    answer:
      "Due to historical counterfeiting concerns across East Africa, Tanzanian banks, hotels, and national park authorities strictly reject all US dollar banknotes with a series date prior to 2009. Please check every bill before traveling to ensure they are crisp, clean, tear-free, and printed in 2009 or newer.",
    category: "money",
  },
  {
    question: "What is the customary tipping etiquette on safari?",
    answer:
      "Tipping is discretionary but deeply appreciated in Tanzania, where tourism directly sustains families and communities. As a guideline: for your dedicated Private Naturalist Safari Guide, $20 to $30 USD per day total from the travel party is customary. For general luxury lodge and tented camp staff (chefs, housekeepers, tent attendants), $15 to $20 USD per room per day placed into the communal staff tip box is standard.",
    category: "money",
  },
  {
    question: "Are drones permitted inside Tanzania's national parks?",
    answer:
      "No. Recreational drones are strictly prohibited in all Tanzanian National Parks (TANAPA), Ngorongoro Conservation Area (NCAA), and game reserves. Flying unauthorized drones carries severe penalties, confiscation, and heavy fines. Filming permits for commercial documentaries require complex advance clearance through the Tanzania Film Board, Ministry of Defense, and TANAPA.",
    category: "etiquette",
  },
  {
    question: "Is emergency medical evacuation included?",
    answer:
      "Yes. Every Macho Halisi guest traveling on our remote safaris is automatically enrolled in AMREF Flying Doctors emergency medical evacuation coverage. In the unlikely event of a medical emergency in remote wilderness, an air ambulance aircraft with emergency medical doctors will airlift you directly to Nairobi or Dar es Salaam for tertiary care. You should also maintain comprehensive personal travel insurance covering international medical repatriation.",
    category: "health",
  },
];
