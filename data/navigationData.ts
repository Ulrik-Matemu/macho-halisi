export interface NavSubItem {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  href: string;
  image: string;
  badge?: string;
  highlights?: string[];
}

export interface NavCategory {
  id: string;
  title: string;
  href: string;
  featuredDefaultId: string;
  subItems: NavSubItem[];
}

export const navigationData: NavCategory[] = [
  {
    id: "destinations",
    title: "DESTINATIONS",
    href: "/destinations",
    featuredDefaultId: "serengeti",
    subItems: [
      {
        id: "serengeti",
        title: "SERENGETI NATIONAL PARK",
        tagline: "The Endless Plains & The Great Migration",
        description:
          "Witness millions of wildebeest and zebras crossing treacherous crocodile-infested waters in Africa's most iconic wildlife sanctuary.",
        href: "/destinations/serengeti",
        image:
          "/media/serengeti/macho-serengeti.jpg",
        badge: "UNESCO World Heritage",
        highlights: ["The Great Migration", "Big Five Encounters", "Endless Savannas"],
      },
      {
        id: "ngorongoro",
        title: "NGORONGORO CRATER",
        tagline: "The Eighth Wonder of the World",
        description:
          "Descend into an ancient intact volcanic caldera harboring one of the highest densities of predators, elephants, and endangered black rhinos on Earth.",
        href: "/destinations/ngorongoro",
        image:
          "/media/ngorongoro/ngorongoro-hero.jpg",
        badge: "Natural Wonder",
        highlights: ["Black Rhino Haven", "Intact Caldera", "Hippo Pools"],
      },
      {
        id: "tarangire",
        title: "TARANGIRE NATIONAL PARK",
        tagline: "The Kingdom of Elephants & Ancient Baobabs",
        description:
          "Traverse dry riverbeds flanked by colossal baobab trees where massive breeding herds of elephants gather during dry season spectacles.",
        href: "/destinations/tarangire",
        image:
          "/media/tarangire/tara-hero.jpg",
        badge: "Elephant Haven",
        highlights: ["500+ Bird Species", "Ancient Baobabs", "Silale Swamps"],
      },
      {
        id: "kilimanjaro",
        title: "MOUNT KILIMANJARO",
        tagline: "The Roof of Africa (5,895m)",
        description:
          "Ascend the world's highest free-standing mountain across five ecological climate zones, culminating at Uhuru Peak's glaciated rim.",
        href: "/destinations/kilimanjaro",
        image:
          "/media/kilimanjaro/kili-ariel.jpg",
        badge: "Highest Peak in Africa",
        highlights: ["Uhuru Peak", "Lemosho & Machame Routes", "Alpine Glaciers"],
      },
      {
        id: "zanzibar",
        title: "ZANZIBAR ARCHIPELAGO",
        tagline: "Spice Island & Turquoise Indian Ocean",
        description:
          "Unwind along powdery white-sand coastlines, dive pristine coral reefs, and wander the sensory spice-scented alleyways of historic Stone Town.",
        href: "/destinations/zanzibar",
        image:
          "/media/zanzibar/mnemba-atoll.jpg",
        badge: "Tropical Sanctuary",
        highlights: ["Stone Town UNESCO", "Coral Reef Diving", "Private Islands"],
      },
      {
        id: "manyara",
        title: "LAKE MANYARA",
        tagline: "Tree-Climbing Lions & Pink Flamingo Shores",
        description:
          "Nestled beneath the Great Rift Valley escarpment, a lush groundwater forest brimming with baboons, hippos, and flocks of flamingos.",
        href: "/destinations/manyara",
        image:
          "/media/manyara/manyara-hero.jpg",
        badge: "Rift Valley Eden",
        highlights: ["Canopy Treetop Walk", "Flamingo Flocks", "Hot Springs"],
      },
      {
        id: "ruaha",
        title: "RUAHA & NYERERE (SELOUS)",
        tagline: "The Wild Southern Circuit",
        description:
          "Venture into raw, remote wilderness unfettered by crowds. River safaris, apex lion prides, and wild dog tracking in Tanzania's untamed south.",
        href: "/destinations/southern-circuit",
        image:
          "/media/ruaha-selous/ruaha-hero.jpg",
        badge: "Raw Wilderness",
        highlights: ["Boat Safaris", "African Wild Dogs", "Immense Solitude"],
      },
      {
        id: "view-all-destinations",
        title: "VIEW ALL DESTINATIONS",
        tagline: "27 National Parks, Islands & Natural Wonders",
        description:
          "Browse every Tanzania destination we cover — national parks, conservation areas, mountains, islands and more — with search and category filters.",
        href: "/destinations",
        image:
          "/media/serengeti/sere-lion.jpg",
        highlights: [],
      },
    ],
  },
  {
    id: "experiences",
    title: "SAFARI EXPERIENCES",
    href: "/experiences",
    featuredDefaultId: "migration",
    subItems: [
      {
        id: "migration",
        title: "THE GREAT MIGRATION EXPEDITIONS",
        tagline: "The Greatest Wildlife Spectacle on Earth",
        description:
          "Follow two million hooves on the move through river crossings, predator ambushes, and calving season in the Ndutu plains.",
        href: "/experiences/great-migration",
        image:
          "/media/great-migration/gm-hero.jpg",
        badge: "Signature Journey",
        highlights: ["Mara River Crossings", "Predator Action", "Mobile Camps"],
      },
      {
        id: "hot-air-balloon",
        title: "SERENGETI HOT AIR BALLOON SAFARIS",
        tagline: "Dawn Flights Over the Savannah",
        description:
          "Float silently over the awakening plains at sunrise, observing herds from above before enjoying a champagne bush breakfast under an acacia tree.",
        href: "/experiences/balloon-safari",
        image:
          "/media/serengeti/sere-baloon.jpg",
        badge: "Aerial View",
        highlights: ["Sunrise Panorama", "Champagne Bush Breakfast", "Silent Flight"],
      },
      {
        id: "walking-safari",
        title: "GUIDED WALKING BUSH SAFARIS",
        tagline: "Track Africa's Wild on Foot",
        description:
          "Step into the bush accompanied by professional armed rangers. Learn ancient tracking techniques, medicinal botany, and the intimacy of wild encounters.",
        href: "/experiences/walking-safaris",
        image:
          "/media/tarangire/tara-river.jpg",
        badge: "Immersive Safari",
        highlights: ["Spoor Tracking", "Armed Expert Guide", "Senses Awakened"],
      },
      {
        id: "photo-safari",
        title: "PHOTOGRAPHIC EXPEDITIONS",
        tagline: "Golden Hour Mastery with Custom 4x4s",
        description:
          "Custom photographic vehicles with 360-degree open hatches, bean bags, low-angle mounts, and private expert guides attuned to optimal lighting.",
        href: "/experiences/photographic-safari",
        image:
          "/media/experiences/leopard-photographers.jpg",
        badge: "Pro Photographers",
        highlights: ["Modified Open Vehicles", "Prime Lighting Hours", "Expert Trackers"],
      },
      {
        id: "maasai-cultural",
        title: "AUTHENTIC MAASAI ENCOUNTERS",
        tagline: "Centuries of Pastoral Traditions",
        description:
          "Respectful, non-commercial cultural exchanges with Maasai elders and warriors in traditional bomas, celebrating age-old songs and stories.",
        href: "/experiences/cultural-encounters",
        image:
          "/media/ngorongoro/ngoro-maasai.jpg",
        badge: "Cultural Heritage",
        highlights: ["Traditional Bomas", "Elder Storytelling", "Direct Community Support"],
      },
    ],
  },
  {
    id: "camps-lodges",
    title: "CAMPS & LODGES",
    // Points at the live, database-backed accommodations catalog. The
    // sub-items below are curated marketing entries that all funnel into
    // the same filterable /accommodations page.
    href: "/accommodations",
    featuredDefaultId: "luxury-tented",
    subItems: [
      {
        id: "luxury-tented",
        title: "PRIVATE LUXURY TENTED CAMPS",
        tagline: "Under Canvas with Five-Star Luxury",
        description:
          "Handcrafted canvas suites with en-suite copper bathtubs, private viewing decks, and lanterns lit under the southern cross.",
        href: "/accommodations",
        image:
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85",
        badge: "Exclusive Wilderness",
        highlights: ["Fine Dining in Bush", "Butler Service", "Solar-Powered"],
      },
      {
        id: "crater-lodges",
        title: "CRATER RIM PANORAMA LODGES",
        tagline: "Perched Above the Volcanic Clouds",
        description:
          "Dramatic architectural wonders clinging to the edge of the Ngorongoro caldera with floor-to-ceiling panoramic glass windows and log fires.",
        href: "/accommodations",
        image:
          "/media/ngorongoro/ngoro-ariel.jpg",
        badge: "Caldera Vistas",
        highlights: ["Fireplace Suites", "Private Verandas", "Chilled Wine Cellars"],
      },
      {
        id: "beach-villas",
        title: "ZANZIBAR BEACHFRONT VILLAS",
        tagline: "Barefoot Elegance on the Swahili Coast",
        description:
          "Private ocean villas featuring plunge pools, private chefs, and direct access to powder sands and turquoise waves.",
        href: "/accommodations",
        image:
          "/media/zanzibar/mnemba-atoll.jpg",
        badge: "Coastal Bliss",
        highlights: ["Private Infinity Pools", "Spa & Wellness", "Sunset Dhow Cruises"],
      },
    ],
  },
  {
    id: "journeys",
    title: "BESPOKE JOURNEYS",
    // Mirrors the five collections in data/journeys.ts (not imported here —
    // this file ships in the client bundle via FullscreenNavMenu).
    href: "/journeys",
    featuredDefaultId: "signature-itineraries",
    subItems: [
      {
        id: "signature-itineraries",
        title: "SIGNATURE ITINERARIES",
        tagline: "Safari · Mountain · Coast",
        description:
          "Our most-travelled journeys across Tanzania. Every one is private, and every one is a starting point rather than a fixed programme.",
        href: "/journeys/signature-itineraries",
        image:
          "/media/serengeti/southern-plains.jpg",
        badge: "26 Journeys",
        highlights: ["Private Safaris", "North · South · Coast", "Always Tailor-made"],
      },
      {
        id: "kilimanjaro-routes",
        title: "KILIMANJARO ROUTES",
        tagline: "Uhuru Peak · 5,895 m",
        description:
          "Seven ways up the same mountain, each with its own forest, its own camps and its own summit night. The route matters more than the fitness.",
        href: "/journeys/kilimanjaro-routes",
        image:
          "/media/kilimanjaro/lemosho.jpg",
        badge: "7 Routes",
        highlights: ["Machame & Lemosho", "Northern Circuit", "≈ 95% Success, 8-day"],
      },
      {
        id: "kilimanjaro-climbing-itineraries",
        title: "KILIMANJARO CLIMBING ITINERARIES",
        tagline: "Fixed-departure & private",
        description:
          "Every route in the lengths we actually recommend, plus climbs paired with a safari or the coast. Private climbs start any day you choose.",
        href: "/journeys/kilimanjaro-climbing-itineraries",
        image:
          "/media/kilimanjaro/kili-ariel.jpg",
        badge: "15 Climbs",
        highlights: ["Daily Private Departures", "3 – 4 Crew per Climber", "Park & Rescue Fees Included"],
      },
      {
        id: "zanzibar-journeys",
        title: "ZANZIBAR JOURNEYS",
        tagline: "Indian Ocean · Spice Islands",
        description:
          "Stone Town alleys, reef lagoons and a slower clock. Take the island on its own or as the soft landing after the mountain or the plains.",
        href: "/journeys/zanzibar-journeys",
        image:
          "/media/zanzibar/stone-town.jpg",
        badge: "10 Journeys",
        highlights: ["Stone Town", "Pemba & Mafia", "Honeymoons"],
      },
      {
        id: "spice-tours",
        title: "ZANZIBAR SPICE TOURS",
        tagline: "Zanzibar farms & kitchens",
        description:
          "Cloves, vanilla, cardamom and nutmeg — walked, picked, cooked and eaten with the families who grow them.",
        href: "/journeys/spice-tours",
        image:
          "https://images.unsplash.com/photo-1740824570732-f2a2d2557dd5?auto=format&fit=crop&w=1400&q=85",
        badge: "6 Tours",
        highlights: ["Spice Farm Walks", "Swahili Cooking", "Private Pick-up"],
      },
      {
        id: "view-all-journeys",
        title: "VIEW ALL SAFARI ITINERARIES",
        tagline: "The Complete, Live Itinerary Catalog",
        description:
          "Browse every published Macho Halisi safari itinerary — day-by-day programs, pricing, and availability, updated as our specialists curate new journeys.",
        href: "/itineraries",
        image:
          "/media/serengeti/seronera-valley.jpg",
        highlights: [],
      },
    ],
  },
  
  {
    id: "about",
    title: "ABOUT MACHO HALISI",
    href: "/about",
    featuredDefaultId: "our-story",
    subItems: [
      {
        id: "our-story",
        title: "THE MACHO HALISI PHILOSOPHY",
        tagline: "Genuine Eyes on the Wild",
        description:
          "Founded by native Tanzanian safari specialists with over two decades of bush expertise. We reveal Africa with untamed honesty, luxury, and devotion.",
        href: "/about",
        image:
          "/media/about/team/guides-team.jpg",
        badge: "Native Born & Led",
        highlights: ["100% Tanzanian Owned", "20+ Years Bush Experience", "Bespoke Itineraries"],
      },
      {
        id: "our-guides",
        title: "MASTER NATURALIST GUIDES",
        tagline: "The Soul of Every Expedition",
        description:
          "Our certified guides have spent lifetimes studying animal behavior, bird calls, and tracking signs, transforming every drive into a masterclass.",
        href: "/about#guides",
        image:
          "/media/about/team/guide-golden-hour.jpg",
        badge: "Elite Naturalists",
        highlights: ["Level 3 Certified Guides", "Multi-lingual", "Wildlife Photographers"],
      },
      {
        id: "how-we-plan",
        title: "HOW WE PLAN SAFARIS",
        tagline: "Bespoke Safari Architecture",
        description:
          "Explore our five-stage planning blueprint — discovery dialogue, ecological canvas, intimate canvas sanctuaries, guide pairing, and on-ground concierge.",
        href: "/how-we-plan",
        image:
          "/media/about/fleet/cruiser-three-quarter.jpg",
        badge: "Our Process",
        highlights: ["100% Private Vehicles", "Zero Rigid Packages", "Bespoke Routes"],
      },
      {
        id: "when-to-travel",
        title: "WHEN TO TRAVEL",
        tagline: "12 Months in the Wild",
        description:
          "Month-by-month safari intelligence. Discover Great Migration positions, calving spectacles, dry season river crossings, and green season solitude.",
        href: "/when-to-travel",
        image:
          "/media/serengeti/great-m-1.jpg",
        badge: "Safari Seasons",
        highlights: ["Migration Scrubber", "Climate Patterns", "Wildlife Highlights"],
      },
      {
        id: "travel-information",
        title: "TRAVEL INFORMATION",
        tagline: "Visas, Packing & Bush Logistics",
        description:
          "Essential pre-departure field guide for Tanzania — entry visas, health and malaria, 15kg bush luggage limits, and interactive packing assistant.",
        href: "/travel-information",
        image:
          "/media/about/fleet/fleet-lineup-grass.jpg",
        badge: "Field Guide",
        highlights: ["Interactive Checklist", "USD 2009+ Rules", "AMREF Air Cover"],
      },
      {
        id: "enquire-studio",
        title: "TAILOR-MADE EXPEDITION STUDIO",
        tagline: "Begin Your Bespoke Consultation",
        description:
          "Design your custom Tanzanian journey with native safari specialists. Multi-step consultative planner with transparent pricing and direct director contact.",
        href: "/enquire",
        image:
          "/media/about/team/guide-welcome.jpg",
        badge: "Start Planning",
        highlights: ["24h Specialist Review", "Private 4x4 Cruiser", "Karatu Office Direct"],
      },
    ],
  },
];
