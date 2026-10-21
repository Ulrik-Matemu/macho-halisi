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
    id: "about",
    title: "ABOUT MACHO HALISI",
    href: "/about",
    featuredDefaultId: "our-story",
    subItems: [
      {
        id: "our-story",
        title: "ABOUT US",
        tagline: "Genuine Eyes on the Wild",
        description:
          "A 100% Tanzanian-owned safari company founded by Dawson Minja in Karatu, creating authentic African adventures for more than seventeen years.",
        href: "/about",
        image:
          "/media/about/team/guides-team.jpg",
        badge: "Native Born & Led",
        highlights: ["100% Tanzanian Owned", "17+ Years", "Fleet of 20 Safari Vehicles"],
      },
      {
        id: "why-book",
        title: "WHY BOOK WITH US",
        tagline: "We Provide the Experience. You Create the Memories.",
        description:
          "We know Tanzania, tailor every itinerary, and look after safety and responsible tourism — so you can simply enjoy the journey.",
        href: "/why-book-with-us",
        image:
          "/media/about/fleet/cruiser-three-quarter.jpg",
        badge: "Why Macho Halisi",
        highlights: ["Tailor-Made Journeys", "Expert Guides", "Safety First"],
      },
      {
        id: "travel-information",
        title: "TRAVEL INFORMATION",
        tagline: "Visas, Packing & Bush Logistics",
        description:
          "Everything to prepare for a Tanzanian safari — visas, baggage limits, climate and clothing, photography, currency, park rules, tipping, and health and safety.",
        href: "/travel-information",
        image:
          "/media/about/fleet/fleet-lineup-grass.jpg",
        badge: "Field Guide",
        highlights: ["Visas & Baggage", "USD 2013+ Rules", "AMREF Air Cover"],
      },
    ],
  },
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
        id: "arusha",
        title: "ARUSHA NATIONAL PARK",
        tagline: "Giraffes, Crater Walks & the Foothills of Meru",
        description:
          "A compact park of Ngurdoto Crater, the Momella Lakes and Mount Meru's forested slopes — giraffe, colobus monkeys and flamingos within an hour of Arusha town.",
        href: "/destinations/arusha",
        image:
          "/media/arusha-national-park/fig-tree.jpg",
        badge: "Gateway Park",
        highlights: ["Walking Safaris", "Colobus Monkeys", "Momella Lakes"],
      },
     
    ],
  },
  {
    id: "experiences",
    title: "ACTIVITIES & EXPERIENCES",
    href: "/experiences",
    featuredDefaultId: "hot-air-balloon",
    subItems: [
      {
        id: "hot-air-balloon",
        title: "HOT AIR BALLOON SAFARIS",
        tagline: "Dawn Flights Over the Savannah",
        description:
          "Float silently over the awakening plains at sunrise, observing herds from above before enjoying a champagne bush breakfast under an acacia tree.",
        href: "/experiences/balloon-safari",
        image: "/media/serengeti/sere-baloon.jpg",
        badge: "Aerial View",
        highlights: ["Sunrise Panorama", "Champagne Bush Breakfast", "Silent Flight"],
      },
      {
        id: "maasai-hadzabe",
        title: "MAASAI & HADZABE CULTURAL EXPERIENCE",
        tagline: "Two Living Traditions, One Journey",
        description:
          "Respectful, non-commercial visits with Maasai herders in their bomas and with the Hadzabe hunter-gatherers at Lake Eyasi.",
        href: "/experiences/cultural-encounters",
        image: "/media/ngorongoro/ngoro-maasai.jpg",
        badge: "Cultural Heritage",
        highlights: ["Maasai Bomas", "Hadzabe Hunt Walk", "Direct Community Support"],
      },
      {
        id: "coffee-tours",
        title: "COFFEE TOURS",
        tagline: "From the Slopes to the Cup",
        description:
          "Walk the shaded coffee farms on the slopes of Kilimanjaro and Mount Meru, then roast, grind and taste the beans with local growers.",
        href: "/experiences/coffee-tours",
        image: "/media/kilimanjaro/lemosho.jpg",
        badge: "Farm to Cup",
        highlights: ["Farm Walk", "Roast & Grind", "Fresh Tasting"],
      },
      {
        id: "waterfall-hot-spring",
        title: "WATERFALL & HOT SPRING EXPERIENCE",
        tagline: "Cool Cascades, Warm Springs",
        description:
          "Hike to a forest waterfall on the Kilimanjaro foothills, then float in the clear, warm waters of a natural hot spring.",
        href: "/experiences/waterfall-hot-spring",
        image: "/media/kilimanjaro/kili-ariel.jpg",
        badge: "Nature Day Out",
        highlights: ["Waterfall Hike", "Natural Hot Spring", "Picnic Lunch"],
      },
      {
        id: "canoeing",
        title: "CANOEING",
        tagline: "Wildlife at Water Level",
        description:
          "Paddle the calm Momella Lakes in Arusha National Park with a ranger, among flamingos, hippos and buffalo.",
        href: "/experiences/canoeing",
        image: "/media/arusha-national-park/Arusha_National_Park_Momella_Lake_Flamingos_83.jpg",
        badge: "On the Water",
        highlights: ["Momella Lakes", "Ranger-Led", "Mount Meru Views"],
      },
      {
        id: "night-game-drives",
        title: "NIGHT GAME DRIVES",
        tagline: "The Bush After Sunset",
        description:
          "Search the dark with a spotlight for leopards, hyenas, civets and other animals that most guests never see by day.",
        href: "/experiences/night-game-drives",
        image: "/media/experiences/lion-resting.jpg",
        badge: "After Dark",
        highlights: ["Nocturnal Wildlife", "Expert Spotters", "Sundowners"],
      },
    ],
  },
  {
    id: "journeys",
    title: "BESPOKE JOURNEYS",
    // Mirrors the collections in data/journeys.ts (not imported here —
    // this file ships in the client bundle via FullscreenNavMenu).
    href: "/itineraries",
    featuredDefaultId: "view-all-journeys",
    subItems: [
      {
        id: "view-all-journeys",
        title: "SAFARI ITINERARIES",
        tagline: "7 · 9 · 10 · 12 · 15 Days",
        description:
          "Browse our 7, 9, 10, 12 and 15-day Macho Halisi itineraries — full day-by-day programmes with lodges and meal plans. Enquire and we tailor any of them to you.",
        href: "/itineraries",
        image:
          "/media/serengeti/seronera-valley.jpg",
        highlights: [],
      },
    ],
  },
  {
    id: "camps-lodges",
    title: "OUR LODGE",
    // Sub-items are not curated here: FullscreenNavMenu fills this
    // category from the published accommodations in the database.
    href: "/accommodations",
    featuredDefaultId: "",
    subItems: [],
  },
];
