export interface PlanningStage {
  number: string;
  stepName: string;
  headline: string;
  lead: string;
  description: string;
  deliverable: string;
  quote: string;
  author: string;
  image: {
    url: string;
    alt: string;
  };
}

export interface ComparisonDimension {
  title: string;
  commercialTour: string;
  machoHalisi: string;
  highlight: string;
}

export interface VehicleHotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
}

export const PLANNING_STAGES: PlanningStage[] = [
  {
    number: "01",
    stepName: "The Discovery Dialogue",
    headline: "We begin not with a price sheet, but with your imagination.",
    lead: "Every conversation starts with questions most tour operators never think to ask.",
    description:
      "Do you crave the breathless pulse of predator ambushes at riverbanks, or long, silent afternoons under umbrella acacias observing elephant herd dynamics? Are you celebrating a private milestone, traveling with multiple generations, or pursuing fine-art wildlife photography? We listen to your travel pace, your sensory preferences, and what Africa means to you before drawing a single line on the map.",
    deliverable: "Personalized Travel Profile & Wilderness Vision Document",
    quote: "True luxury is not having more things packed into a day; it is having the right hours given to what moves you.",
    author: "Macho Halisi Head Naturalist",
    image: {
      url: "/media/about/team/guide-portrait.jpg",
      alt: "Safari specialist conversing with guests overlooking the Serengeti plains",
    },
  },
  {
    number: "02",
    stepName: "The Ecological Canvas",
    headline: "Synchronizing your dates with the living pulse of Tanzania.",
    lead: "Animals follow rain, sweet grasses, and ancient instinct — never human itineraries.",
    description:
      "Tanzania's ecosystems shift every month. We calculate exact migration herd locations, predator movement patterns, dry-season waterhole concentrations in Tarangire, and water clarity on the Zanzibar reef. Rather than rushing you across long dusty transits, we sequence your route so that every flight and game drive connects naturally, maximizing your time immersed in the wild.",
    deliverable: "Private Route Schematic & Seasonal Wildlife Correlation",
    quote: "The secret of a memorable safari is never chasing animals, but positioning yourself where life unfolds naturally.",
    author: "Senior Expedition Coordinator, Karatu",
    image: {
      url: "/media/serengeti/great-m-1.jpg",
      alt: "Wildebeest migration moving across golden plains during morning light",
    },
  },
  {
    number: "03",
    stepName: "Private Sanctuaries & Canvas",
    headline: "Intimate camps where the wilderness stays outside your canvas.",
    lead: "We partner exclusively with low-impact, owner-managed sanctuaries and tented reserves.",
    description:
      "Mass safari lodges with hundreds of rooms erode the romance of the African night. We place our travelers in boutique canvas camps, caldera rim havens, and private concessions where lanterns flicker beneath the southern cross, hot bucket showers are drawn upon your return from dusty drives, and lion roars echo across your veranda while you dine.",
    deliverable: "Curated Camp Portfolio with Room Specs & Concession Access",
    quote: "When you sleep under canvas, your ears never stop listening to the heartbeat of the bush.",
    author: "Wilderness Lodging Director",
    image: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
      alt: "Luxury tented camp in the Serengeti lit by warm lanterns at twilight",
    },
  },
  {
    number: "04",
    stepName: "Master Naturalist Pairing",
    headline: "Your guide is the soul, storyteller, and safety of your safari.",
    lead: "Our guides are certified Level-3 native naturalists with lifetimes in the Tanzanian bush.",
    description:
      "A great safari guide does not simply spot an animal; they decode bird alarm calls, read wind direction, anticipate lion stalking trajectories, and share the cultural heritage of their ancestral lands. We pair you with a naturalist matched specifically to your party's interests — whether you are an avid birder, an optical photographer, or parents introducing children to nature.",
    deliverable: "Dedicated Private Guide Bio & Vehicle Clearance",
    quote: "Anyone can point at a lion. A naturalist shows you the drama that began twenty minutes before the pride moved.",
    author: "Lead Safari Guide, Ngorongoro",
    image: {
      url: "/media/about/team/guide-fleet.jpg",
      alt: "Macho Halisi native safari guide tracking animal spoor in the bush",
    },
  },
  {
    number: "05",
    stepName: "Flawless Bush Concierge",
    headline: "Unseen precision behind every bush airstrip landing and cold drink.",
    lead: "From VIP tarmac greetings at Kilimanjaro (JRO) to charter flights into remote airstrips.",
    description:
      "Behind your peaceful safari stands a synchronized ground operations desk in Karatu and Arusha. We oversee every park entry permit, domestic bush flight manifest, dietary preference, and luggage transfer. If weather shifts, our team rearranges routes seamlessly without interrupting your morning espresso.",
    deliverable: "Turnkey Travel Dossier & 24/7 Satellite Concierge Liaison",
    quote: "You will never see the logistics. You will only feel the effortless grace of Africa.",
    author: "Operations Director, Macho Halisi",
    image: {
      url: "/media/about/fleet/fleet-lineup-rear.jpg",
      alt: "Scenic bush flight landing on a remote safari airstrip in Tanzania",
    },
  },
];

export const PLANNING_COMPARISONS: ComparisonDimension[] = [
  {
    title: "Vehicle Exclusivity",
    commercialTour: "Shared minibuses or packed 7-seater vehicles with strangers; cramped middle seats.",
    machoHalisi: "100% Private, custom-stretched Land Cruiser. Guaranteed window seat, 360° roof hatch, photographic beanbag mounts.",
    highlight: "100% Private Vehicle",
  },
  {
    title: "Daily Departure & Pacing",
    commercialTour: "Strict set schedules, hurried meals, fixed 8:00 AM convoys alongside dozens of vehicles.",
    machoHalisi: "You set the rhythm. Depart at dawn for prime predator light, linger at a waterhole for two hours, or pause for champagne under an acacia.",
    highlight: "Unconstrained Freedom",
  },
  {
    title: "Guide Caliber & Dedication",
    commercialTour: "Drivers assigned randomly by the hotel desk; basic driving skills with minimal biological training.",
    machoHalisi: "Dedicated Level-3 certified Tanzanian Naturalist who stays with you throughout your expedition.",
    highlight: "Master Naturalist Guides",
  },
  {
    title: "Wilderness Concessions",
    commercialTour: "Restricted strictly to public tarmac and congested circuits within park gates; strict 6:00 PM curfew.",
    machoHalisi: "Access to private wilderness conservancies permitting off-road tracking, guided walking safaris, and night drives.",
    highlight: "Private Concession Access",
  },
  {
    title: "Safety & Communication",
    commercialTour: "Standard commercial vans without satellite backups or dedicated flight evacuation coverage.",
    machoHalisi: "AMREF Flying Doctors 100% emergency evacuation insurance included for every remote safari passenger; VHF radios & GPS tracking.",
    highlight: "Comprehensive Safety Net",
  },
];

// Coordinates are percentages of the blueprint viewport in
// SafariVehicleBlueprint.tsx, which renders
// /media/about/fleet/cruiser-three-quarter.jpg at aspect-[16/10] with
// object-cover. They are tuned to land on the actual part of that vehicle,
// so re-check them if the blueprint image is ever swapped.
export const VEHICLE_HOTSPOTS: VehicleHotspot[] = [
  {
    id: "roof",
    x: 32,
    y: 13,
    title: "Photographic Pop-Up Hatch",
    shortDesc: "Full-length 360° elevated viewing hatch",
    fullDesc:
      "Engineered with cushioned support rims and adjustable heavy-canvas weather shades, allowing all passengers to stand comfortably simultaneously without bumping lenses.",
    badge: "360° Field of View",
  },
  {
    id: "inverter",
    x: 46,
    y: 36,
    title: "On-Board Power Inverter",
    shortDesc: "230V / USB Multi-Socket Inverter System",
    fullDesc:
      "Silent dual-battery charging banks providing continuous 230V pure sine power for camera batteries, laptops, iPads, and phones even while the engine is off at sightings.",
    badge: "Continuous Power",
  },
  {
    id: "fridge",
    x: 18,
    y: 46,
    title: "Chilled On-Board Refrigerator",
    shortDesc: "Built-in 40L deep-cooling fridge",
    fullDesc:
      "Always stocked with chilled mineral water, local craft beers, wines, fresh fruit, and restorative drinks for midday bush toasts.",
    badge: "Always Chilled",
  },
  {
    id: "suspension",
    x: 41,
    y: 79,
    title: "Heavy-Duty Old Man Emu Suspension",
    shortDesc: "Upgraded shocks & long-travel springs",
    fullDesc:
      "Custom Australian off-road suspension tailored to absorb the corrugated gravel tracks of Ngorongoro and the black-cotton soils of the Serengeti with whisper smoothness.",
    badge: "Maximum Comfort",
  },
  {
    id: "comms",
    x: 82,
    y: 40,
    title: "Satellite Comms & VHF Long-Range",
    shortDesc: "Direct ranger & air evacuation link",
    fullDesc:
      "High-output VHF bush radio keeping our naturalists tuned to real-time ranger updates, paired with satellite emergency beacon for unconditional safety.",
    badge: "24/7 Bush Network",
  },
];
