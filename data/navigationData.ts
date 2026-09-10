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
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1400&q=85",
        badge: "Raw Wilderness",
        highlights: ["Boat Safaris", "African Wild Dogs", "Immense Solitude"],
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
          "https://images.unsplash.com/photo-1547970810-dc1eac8161a7?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
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
          "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        badge: "Cultural Heritage",
        highlights: ["Traditional Bomas", "Elder Storytelling", "Direct Community Support"],
      },
    ],
  },
  {
    id: "camps-lodges",
    title: "CAMPS & LODGES",
    href: "/camps-and-lodges",
    featuredDefaultId: "luxury-tented",
    subItems: [
      {
        id: "luxury-tented",
        title: "PRIVATE LUXURY TENTED CAMPS",
        tagline: "Under Canvas with Five-Star Luxury",
        description:
          "Handcrafted canvas suites with en-suite copper bathtubs, private viewing decks, and lanterns lit under the southern cross.",
        href: "/camps-and-lodges/luxury-tented",
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
        href: "/camps-and-lodges/crater-lodges",
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
        badge: "Caldera Vistas",
        highlights: ["Fireplace Suites", "Private Verandas", "Chilled Wine Cellars"],
      },
      {
        id: "beach-villas",
        title: "ZANZIBAR BEACHFRONT VILLAS",
        tagline: "Barefoot Elegance on the Swahili Coast",
        description:
          "Private ocean villas featuring plunge pools, private chefs, and direct access to powder sands and turquoise waves.",
        href: "/camps-and-lodges/beach-villas",
        image:
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
        badge: "Coastal Bliss",
        highlights: ["Private Infinity Pools", "Spa & Wellness", "Sunset Dhow Cruises"],
      },
    ],
  },
  {
    id: "journeys",
    title: "BESPOKE JOURNEYS",
    // Repointed at the live, dynamic itineraries index rather than the
    // fictional /journeys/* slugs below, which never resolved to a route —
    // every link in this category 404'd until the public itineraries
    // pages existed. The four sub-items shown here are illustrative
    // examples pending real per-itinerary slugs; until then they all route
    // to the same place a visitor can actually browse published journeys.
    href: "/itineraries",
    featuredDefaultId: "classic-northern",
    subItems: [
      {
        id: "classic-northern",
        title: "THE ULTIMATE NORTHERN CIRCUIT (8 DAYS)",
        tagline: "Serengeti, Ngorongoro, Tarangire & Manyara",
        description:
          "The quintessential luxury Tanzania expedition. Traverse the great parks by private 4WD safari vehicle with seasoned naturalist guides.",
        href: "/itineraries",
        image:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        badge: "Most Popular",
        highlights: ["8 Days / 7 Nights", "Private Naturalist Guide", "All Big Five"],
      },
      {
        id: "migration-river-trail",
        title: "MARA RIVER MIGRATION TRAIL (10 DAYS)",
        tagline: "Exclusive Front-Row to River Crossings",
        description:
          "Timed meticulously to intercept herds confronting the Mara River in northern Serengeti, staying in mobile luxury camps that move with the herds.",
        href: "/itineraries",
        image:
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        badge: "Seasonal Masterpiece",
        highlights: ["10 Days / 9 Nights", "Fly-In Bush Flights", "Predator Tracking"],
      },
      {
        id: "bush-to-beach",
        title: "BUSH TO BEACH: SAFARI & ZANZIBAR (12 DAYS)",
        tagline: "Thrilling Game Drives to Idyllic Turquoise Waters",
        description:
          "The best of both worlds: seven days tracking Tanzania's wildest animals followed by five days of serene barefoot indulgence in Zanzibar.",
        href: "/itineraries",
        image:
          "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
        badge: "Honeymoon Favorite",
        highlights: ["12 Days / 11 Nights", "Serengeti Safari", "Zanzibar Private Villa"],
      },
      {
        id: "view-all-journeys",
        title: "VIEW ALL SAFARI JOURNEYS",
        tagline: "The Complete, Live Itinerary Catalog",
        description:
          "Browse every published Macho Halisi safari itinerary — day-by-day programs, pricing, and availability, updated as our specialists curate new journeys.",
        href: "/itineraries",
        image:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        highlights: [],
      },
    ],
  },
  {
    id: "impact",
    title: "IMPACT & CONSERVATION",
    href: "/impact",
    featuredDefaultId: "wildlife-protection",
    subItems: [
      {
        id: "wildlife-protection",
        title: "ANTI-POACHING & WILDLIFE HABITATS",
        tagline: "Protecting Tanzania's Natural Heritage",
        description:
          "A portion of every safari booked directly funds anti-poaching ranger units and veterinary interventions in vulnerable wildlife corridors.",
        href: "/impact/wildlife-protection",
        image:
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1400&q=85",
        badge: "Conservation",
        highlights: ["Ranger Equipment", "Corridor Preservation", "Rhino Patrols"],
      },
      {
        id: "community-empowerment",
        title: "INDIGENOUS COMMUNITY PARTNERSHIPS",
        tagline: "Empowering Local Tanzanian Families",
        description:
          "Supporting local clean water projects, educational scholarships, and sustainable guide training academies for youth in rural villages.",
        href: "/impact/community",
        image:
          "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        badge: "Community",
        highlights: ["Water Wells", "Guide Scholarships", "Women Craft Collectives"],
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
        href: "/about/our-story",
        image:
          "https://images.unsplash.com/photo-1547970810-dc1eac8161a7?auto=format&fit=crop&w=1400&q=85",
        badge: "Native Born & Led",
        highlights: ["100% Tanzanian Owned", "20+ Years Bush Experience", "Bespoke Itineraries"],
      },
      {
        id: "our-guides",
        title: "MASTER NATURALIST GUIDES",
        tagline: "The Soul of Every Expedition",
        description:
          "Our certified guides have spent lifetimes studying animal behavior, bird calls, and tracking signs, transforming every drive into a masterclass.",
        href: "/about/our-guides",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
        badge: "Elite Naturalists",
        highlights: ["Level 3 Certified Guides", "Multi-lingual", "Wildlife Photographers"],
      },
    ],
  },
];
