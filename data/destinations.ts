export type DestinationCategory =
  | "national-park"
  | "conservation-area"
  | "game-reserve"
  | "island"
  | "mountain"
  | "natural-wonder"
  | "historic-site";

export interface DestinationQuickFact {
  label: string;
  value: string;
}

export interface DestinationHighlight {
  title: string;
  description: string;
  /** Optional accompanying photo for the highlights row layout. */
  image?: DestinationGalleryImage;
}

export interface DestinationChapter {
  title: string;
  text: string;
  image: DestinationGalleryImage;
}

export interface DestinationFaq {
  question: string;
  answer: string;
}

export interface DestinationGalleryImage {
  url: string;
  alt: string;
}

export interface DestinationBestTimeEntry {
  month: string;
  note: string;
  /** Drives the interactive strip's intensity indicator. */
  rating: "low" | "good" | "peak";
}

export interface Destination {
  slug: string;
  name: string;
  category: DestinationCategory;
  categoryLabel: string;
  region: string;
  tagline: string;
  heroImage: string;
  heroImageAlt: string;
  gallery: DestinationGalleryImage[];
  leadParagraph: string;
  bodyParagraphs: string[];
  quickFacts: DestinationQuickFact[];
  highlights: DestinationHighlight[];
  /** Present for safari-style destinations; omitted for Kilimanjaro & Zanzibar. */
  wildlife?: string[];
  activitiesHeading: string;
  activities: string[];
  bestTimeToVisit: DestinationBestTimeEntry[];
  location: { lat: number; lng: number; zoom: number };
  faqs: DestinationFaq[];
  seoDescription: string;
  relatedSlugs: string[];
  /** Scrollytelling chapters — "the park/place in parts". Falls back to derived content when omitted. */
  regionChapters?: DestinationChapter[];
  /** Scrollytelling chapters — "how it is travelled". Falls back to derived content when omitted. */
  travelChapters?: DestinationChapter[];
  /** Overrides `tagline` in the full-bleed quote band when set. */
  pullQuote?: string;
  /** [left image, right image, caption] for the parallax diptych. Falls back to derived content when omitted. */
  diptych?: [DestinationGalleryImage, DestinationGalleryImage, string];
}

export const destinations: Destination[] = [
  {
    slug: "serengeti",
    name: "Serengeti National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Northern Circuit",
    tagline: "The Endless Plains & The Great Migration",
    heroImage:
      "/media/serengeti/macho-serengeti.jpg",
    heroImageAlt: "Safari vehicle crossing the golden plains of the Serengeti at sunset",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        alt: "A safari vehicle crossing the golden Serengeti plains at sunset",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden acacia-dotted plains of the Serengeti at dusk",
      },
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
        alt: "A lion pair resting in the Serengeti bush",
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
        alt: "A safari lodge terrace at golden hour",
      },
      {
        url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1400&q=85",
        alt: "An elephant amid the Serengeti woodland",
      },
    ],
    leadParagraph:
      "The Serengeti is Tanzania's flagship wilderness — an unbroken sweep of golden grassland stretching to every horizon, and the stage for the single greatest wildlife spectacle left on Earth. Its name, from the Maasai word siringet, means \"the place where the land runs forever,\" and few places live up to their name so completely.",
    bodyParagraphs: [
      "Each year, roughly two million wildebeest, zebra and gazelle move in a vast clockwise circuit through the ecosystem, following the rains in search of fresh grazing — a journey that brings them through crocodile-infested river crossings, past waiting prides of lion, and across some of the most photographed landscapes in Africa. But the Serengeti is remarkable even outside migration season: its resident predator density is among the highest on the continent, with an estimated 3,000+ lions, healthy leopard and cheetah populations, and packs of endangered African wild dog in the northern reaches.",
      "At 14,750 km², the park is large enough that no two visits feel the same. The southern Seronera Valley holds game year-round and is famous for leopard sightings in its sausage trees; the western corridor follows the Grumeti River, where migrating herds face some of the largest crocodiles in Africa each May and June; and the far north, along the Mara River, is where the most dramatic crossing images of the migration are made between July and October.",
    ],
    quickFacts: [
      { label: "Size", value: "14,750 km²" },
      { label: "Established", value: "1951" },
      { label: "UNESCO status", value: "World Heritage Site (1981)" },
      { label: "Altitude", value: "920 – 1,850 m" },
      { label: "Nearest airstrip", value: "Seronera, Kogatende, Grumeti" },
      { label: "Getting there", value: "Scheduled bush flight or 5–6 hr drive from Arusha" },
    ],
    highlights: [
      {
        title: "The Great Migration",
        description:
          "Two million wildebeest and zebra circling the ecosystem year-round — calving on the southern plains in February, crossing the Grumeti and Mara rivers between May and October.",
        image: {
          url: "/media/serengeti/great-m-1.jpg",
          alt: "The wildebeest migration crossing the Serengeti plains",
        },
      },
      {
        title: "Seronera Valley",
        description:
          "The park's game-dense heartland, with permanent water drawing lion, leopard and elephant throughout the year, migration or not.",
        image: {
          url: "/media/serengeti/seronera-valley.jpg",
          alt: "Lion pair resting in the Seronera valley",
        },
      },
      {
        title: "Balloon safaris",
        description:
          "Dawn flights over the plains from Central and Northern Serengeti, ending with a champagne bush breakfast under an acacia.",
        image: {
          url: "/media/serengeti/sere-baloon.jpg",
          alt: "Golden acacia-dotted plains at dawn over the Serengeti",
        },
      },
      {
        title: "Kopjes & big cats",
        description:
          "Ancient granite outcrops rising from the grassland — favourite lion lookout posts and a defining feature of the Serengeti skyline.",
        image: {
          url: "/media/serengeti/sere-lion.jpg",
          alt: "Granite kopjes rising from the Serengeti grassland",
        },
      },
    ],
    wildlife: [
      "Lion (highest density in East Africa)",
      "Leopard, especially around Seronera's riverine forest",
      "Cheetah on the open short-grass plains",
      "African wild dog in the far north",
      "Wildebeest, zebra & Thomson's gazelle (migration herds)",
      "Elephant, giraffe, buffalo, hippo & crocodile",
      "500+ recorded bird species",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "Classic 4x4 game drives, morning and afternoon",
      "Hot air balloon safaris at sunrise",
      "Walking safaris with armed rangers (select areas)",
      "Migration river-crossing viewing (seasonal)",
      "Night game drives in designated concession areas",
      "Photographic safaris with specialist guides",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Short rains ease; herds gather on the southern plains.", rating: "good" },
      { month: "Feb", note: "Calving season — 500,000 wildebeest calves born within weeks.", rating: "peak" },
      { month: "Mar", note: "Predator action peaks around the vulnerable newborn herds.", rating: "peak" },
      { month: "Apr", note: "Long rains; fewer visitors, lush scenery, lower rates.", rating: "low" },
      { month: "May", note: "Herds begin moving north-west toward the Grumeti River.", rating: "good" },
      { month: "Jun", note: "Grumeti River crossings begin in the Western Corridor.", rating: "good" },
      { month: "Jul", note: "Herds push into the north; first Mara River crossings.", rating: "peak" },
      { month: "Aug", note: "Peak Mara River crossing season in Northern Serengeti.", rating: "peak" },
      { month: "Sep", note: "Crossings continue; dry, dusty, dramatic conditions.", rating: "peak" },
      { month: "Oct", note: "Herds linger in the north before turning south again.", rating: "good" },
      { month: "Nov", note: "Short rains begin; herds start the journey south.", rating: "good" },
      { month: "Dec", note: "Green season begins; herds return to the southern plains.", rating: "good" },
    ],
    location: { lat: -2.3333, lng: 34.8333, zoom: 8 },
    faqs: [
      {
        question: "When is the best time to see the wildebeest migration in the Serengeti?",
        answer:
          "There is no single \"migration season\" — the herds are somewhere in the ecosystem year-round. For river crossings, aim for July–October in the north; for calving season and the densest predator action, visit the southern plains in February–March.",
      },
      {
        question: "How many days should I spend in the Serengeti?",
        answer:
          "Three to four nights lets you properly explore one region (Seronera, the Western Corridor, or the North) without rushing. Longer stays of 5+ nights allow a fly-in circuit covering multiple areas as the migration moves.",
      },
      {
        question: "Is the Serengeti safe to visit?",
        answer:
          "Yes. All game viewing is conducted with licensed guides in vehicles or on ranger-led walks, and camps operate to strict safety protocols. The Serengeti has an excellent, well-established safety record for visitors.",
      },
      {
        question: "Can the Serengeti be combined with other destinations?",
        answer:
          "Yes — it's most commonly paired with Ngorongoro Crater and Tarangire on a Northern Circuit itinerary, or with Zanzibar for a bush-to-beach combination.",
      },
    ],
    seoDescription:
      "Plan your Serengeti National Park safari with Macho Halisi — the Great Migration, Big Five game drives, balloon safaris & the best months to visit Tanzania's iconic plains.",
    relatedSlugs: ["ngorongoro", "tarangire", "manyara"],
    pullQuote: "Nowhere else does the ground itself seem to be moving.",
    regionChapters: [
      {
        title: "The southern plains",
        text: "Grass so short it reads as a lawn from the air, laid over volcanic ash blown from Ngorongoro. Nothing interrupts the horizon, which is precisely why the wildebeest calve here — a predator has nowhere to hide either.",
        image: {
          url: "/media/serengeti/southern-plains.jpg",
          alt: "The short-grass plains of the southern Serengeti",
        },
      },
      {
        title: "Kopjes and woodland",
        text: "Granite islands push up through the centre of the park, each one a self-contained world of shade, water and vantage. Prides hold the same rocks for generations; leopard take the sausage trees along the Seronera river below.",
        image: {
          url: "/media/serengeti/sere-lion-couple.jpg",
          alt: "Granite kopjes and woodland in the central Serengeti",
        },
      },
      {
        title: "The northern river country",
        text: "Rolling hills, denser bush and the Mara River cutting through it — the stage for the crossings. Further from the airstrips, harder to reach, and for three months of the year the most compelling ground in East Africa.",
        image: {
          url: "/media/serengeti/northern-river-country.jpg",
          alt: "The Mara River cutting through the northern Serengeti",
        },
      },
    ],
    travelChapters: [
      {
        title: "Where you sleep",
        text: "Mobile camps that move with the seasons, permanent lodges on the kopjes, and a handful of private houses. The choice is less about luxury tiers than about standing in the right place in the right month.",
        image: {
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
          alt: "A safari camp at dusk in the Serengeti",
        },
      },
      {
        title: "Your guide and vehicle",
        text: "One private 4×4, roof open, and a Tanzanian guide who has worked these tracks for years. No shared departures, no fixed timetable — the day is planned each morning around what the radio and the ground are saying.",
        image: {
          url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
          alt: "A guide and open safari vehicle on the Serengeti plains",
        },
      },
      {
        title: "Getting in and around",
        text: "Light aircraft from Arusha onto Seronera, Kogatende or Grumeti — an hour instead of eight on the road. Between sectors you fly again, so nights are spent in camp rather than in transit.",
        image: {
          url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=85",
          alt: "A light aircraft on a bush airstrip near the Serengeti",
        },
      },
    ],
    diptych: [
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=85",
        alt: "Detail of a lion resting in the Seronera valley",
      },
      {
        url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=85",
        alt: "Detail of an elephant in the Serengeti woodland",
      },
      "Dry season, Seronera valley — the hour before the vehicles arrive.",
    ],
  },
  {
    slug: "ngorongoro",
    name: "Ngorongoro Crater",
    category: "conservation-area",
    categoryLabel: "Conservation Area",
    region: "Northern Circuit",
    tagline: "The Eighth Wonder of the World",
    heroImage:
      "/media/ngorongoro/ngorongoro-hero.jpg",
    heroImageAlt: "Golden highland plains of the Ngorongoro Conservation Area at sunrise",
    gallery: [
      {
        url: "/media/ngorongoro/ngoro-ariel.jpg",
        alt: "Golden plains beneath the Ngorongoro highlands",
      },
      {
        url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1400&q=85",
        alt: "Elephants at sunset near the crater's grasslands",
      },
      {
        url: "/media/ngorongoro/ngoro-maasai.jpg",
        alt: "A luxury lodge terrace overlooking the highlands",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary acacia tree on the Ngorongoro highlands",
      },
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A trekking trail through the highlands near Ngorongoro",
      },
    ],
    leadParagraph:
      "Ngorongoro is the world's largest intact, unflooded volcanic caldera — a collapsed volcano whose walls now enclose a self-contained wildlife theatre roughly 20 km across and 600 metres deep. Nowhere else on the safari circuit packs such a density of animals into so small and dramatic a stage.",
    bodyParagraphs: [
      "An estimated 25,000 large mammals live permanently on the crater floor, drawn by year-round water from the Lerai Forest springs and Lake Magadi. It holds one of Tanzania's best chances of spotting the endangered black rhino, alongside dense lion prides, spotted hyena clans, and vast herds of wildebeest, zebra and buffalo — all viewable in a single day's descent, which makes the crater one of the most efficient and rewarding game drives in Africa.",
      "Beyond the crater itself, the wider 8,292 km² Ngorongoro Conservation Area is unique in Tanzania as a multiple land-use zone, where Maasai communities graze livestock alongside protected wildlife — visitors can combine crater game drives with cultural visits to Maasai bomas, and the area also encompasses Olduvai Gorge, the \"Cradle of Mankind,\" where some of the earliest hominin fossils were discovered.",
    ],
    quickFacts: [
      { label: "Crater diameter", value: "~19 km" },
      { label: "Crater depth", value: "~600 m" },
      { label: "Conservation area", value: "8,292 km²" },
      { label: "UNESCO status", value: "World Heritage Site (1979)" },
      { label: "Altitude (rim)", value: "2,286 m" },
      { label: "Getting there", value: "3 hr drive from Arusha; short hop from Serengeti airstrips" },
    ],
    highlights: [
      {
        title: "The crater floor descent",
        description:
          "A single winding road drops 600m onto the caldera floor — a self-contained ecosystem where predator and prey densities are among the highest recorded anywhere in Africa.",
      },
      {
        title: "Black rhino tracking",
        description:
          "One of the most reliable places in East Africa to see critically endangered black rhino in the wild, alongside all of the rest of the Big Five.",
      },
      {
        title: "Olduvai Gorge",
        description:
          "The archaeological site where the Leakeys uncovered 1.9-million-year-old hominin remains — an optional detour into human origins.",
      },
      {
        title: "Maasai cultural visits",
        description:
          "Respectful, community-led visits to traditional bomas within the Conservation Area, a rare chance to meet the crater's human neighbours.",
      },
    ],
    wildlife: [
      "Black rhino (one of the best sighting locations in Tanzania)",
      "Dense resident lion prides",
      "Spotted hyena (largest documented density in Africa)",
      "Elephant bulls, wildebeest, zebra & buffalo",
      "Flamingo flocks on Lake Magadi (seasonal)",
      "Golden and black-backed jackal",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "Full-day crater floor game drive",
      "Crater rim nature walks with an armed ranger",
      "Maasai boma cultural visits",
      "Olduvai Gorge museum & archaeological site visit",
      "Guided walks to Empakaai Crater (multi-day trekkers)",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Dry, clear crater views; great for photography.", rating: "peak" },
      { month: "Feb", note: "Warm and dry; excellent game viewing continues.", rating: "peak" },
      { month: "Mar", note: "Rains begin; crater floor turns lush green.", rating: "good" },
      { month: "Apr", note: "Long rains; fewer visitors, dramatic cloud-wrapped rim.", rating: "low" },
      { month: "May", note: "Rains ease; landscape still vividly green.", rating: "good" },
      { month: "Jun", note: "Dry season begins; comfortable cooler temperatures.", rating: "peak" },
      { month: "Jul", note: "Peak dry season, crowds higher but conditions ideal.", rating: "peak" },
      { month: "Aug", note: "Consistently excellent game viewing on the crater floor.", rating: "peak" },
      { month: "Sep", note: "Dry, dusty and reliably good for predator sightings.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering; still very reliable.", rating: "peak" },
      { month: "Nov", note: "Short rains arrive; landscape greens quickly.", rating: "good" },
      { month: "Dec", note: "Warm, intermittent showers; good value season.", rating: "good" },
    ],
    location: { lat: -3.2, lng: 35.5833, zoom: 10 },
    faqs: [
      {
        question: "Is one day enough for the Ngorongoro Crater?",
        answer:
          "A full day's descent covers the crater floor thoroughly — it's one of the most concentrated game drives in Africa. Most itineraries pair one night at the rim with a full-day floor visit before continuing to the Serengeti.",
      },
      {
        question: "Can you see the Big Five in Ngorongoro Crater?",
        answer:
          "Yes — it's one of the few places in Tanzania where sighting all five (lion, leopard, elephant, buffalo and the elusive black rhino) in a single visit is realistic, thanks to the crater's closed, high-density ecosystem.",
      },
      {
        question: "How cold does it get on the crater rim at night?",
        answer:
          "The rim sits at 2,286m and nights can drop below 10°C year-round, even though the crater floor below is mild — pack a warm layer for rim lodges and early-morning descents.",
      },
    ],
    seoDescription:
      "Discover Ngorongoro Crater with Macho Halisi — black rhino, dense lion prides and the Big Five inside the world's largest intact volcanic caldera in Tanzania.",
    relatedSlugs: ["serengeti", "manyara", "tarangire"],
  },
  {
    slug: "tarangire",
    name: "Tarangire National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Northern Circuit",
    tagline: "The Kingdom of Elephants & Ancient Baobabs",
    heroImage:
      "/media/tarangire/tara-hero.jpg",
    heroImageAlt: "Elephants at sunset in Tarangire National Park",
    gallery: [
      {
        url: "/media/tarangire/tara-cheetah.jpg",
        alt: "An elephant amid Tarangire's woodland",
      },
      {
        url: "/media/tarangire/tara-river.jpg",
        alt: "A safari vehicle crossing Tarangire's golden grassland",
      },
      {
        url: "/media/tarangire/ashy-starling.jpg",
        alt: "Acacia-studded plains of Tarangire at dusk",
      },
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
        alt: "A lion pair resting during Tarangire's dry season",
      },
    ],
    leadParagraph:
      "Tarangire is Tanzania's elephant stronghold — a river-fed sanctuary of golden grassland and ancient, swollen baobab trees where dry-season herds gather in numbers rarely matched anywhere else on the continent. It is the quieter, wilder counterpart to the Serengeti, and rewards travellers who want big landscapes without the crowds.",
    bodyParagraphs: [
      "The Tarangire River is the park's lifeline: as the dry season tightens its grip between June and October, wildlife converges on its banks in extraordinary density, with elephant family groups of 20 to 300 animals a defining sight, alongside wildebeest, zebra, buffalo, giraffe and eland pushed in from the surrounding Maasai Steppe. It is also one of the best parks in Tanzania for tree-climbing pythons, and its baobab-studded horizon is instantly recognisable — some individual trees are estimated to be over a thousand years old.",
      "Beyond the big herds, Tarangire is an outstanding birding destination, with over 550 species recorded, including the striking yellow-collared lovebird and the endangered Ashy Starling, found almost nowhere else on Earth. Its comparatively low visitor numbers, even in peak season, make it a favourite add-on for travellers wanting a genuinely wild, uncrowded Northern Circuit stop.",
    ],
    quickFacts: [
      { label: "Size", value: "2,850 km²" },
      { label: "Established", value: "1970" },
      { label: "Altitude", value: "1,000 – 1,500 m" },
      { label: "Known for", value: "Largest elephant concentrations in Tanzania" },
      { label: "Getting there", value: "2 hr drive from Arusha" },
    ],
    highlights: [
      {
        title: "Elephant super-herds",
        description:
          "Dry-season gatherings along the Tarangire River can number in the hundreds — among the largest elephant concentrations anywhere in Africa.",
      },
      {
        title: "Ancient baobabs",
        description:
          "Some of the park's iconic baobab trees are estimated to be over 1,000 years old, giving the landscape its unmistakable silhouette.",
      },
      {
        title: "Tree-climbing pythons",
        description:
          "The riverine forest along the Tarangire River is one of the most reliable places in Tanzania to spot African rock pythons draped in the canopy.",
      },
      {
        title: "Uncrowded game viewing",
        description:
          "A fraction of the Serengeti's visitor numbers, even in peak dry season — wide open plains often shared with just your own vehicle.",
      },
    ],
    wildlife: [
      "Elephant (largest herds in Tanzania, dry season)",
      "Lion, leopard & occasional cheetah",
      "Wildebeest, zebra, buffalo, giraffe & eland",
      "Fringe-eared oryx & gerenuk (dry-country specialists)",
      "550+ recorded bird species incl. Ashy Starling",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "Morning and afternoon 4x4 game drives",
      "Walking safaris with armed rangers",
      "Night game drives (select concessions)",
      "Specialist birding drives",
      "Cultural visits to nearby Maasai communities",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and mostly dry; herds still dispersed.", rating: "good" },
      { month: "Feb", note: "Short dry spell; good general game viewing.", rating: "good" },
      { month: "Mar", note: "Rains begin; park turns lush and green.", rating: "low" },
      { month: "Apr", note: "Long rains; herds dispersed across the wider ecosystem.", rating: "low" },
      { month: "May", note: "Rains ease; landscape still green and quiet.", rating: "low" },
      { month: "Jun", note: "Dry season begins; herds start converging on the river.", rating: "good" },
      { month: "Jul", note: "Elephant concentrations building along the river.", rating: "peak" },
      { month: "Aug", note: "Peak dry season — massive elephant herds at the river.", rating: "peak" },
      { month: "Sep", note: "Exceptional game density; dusty golden landscapes.", rating: "peak" },
      { month: "Oct", note: "Height of the dry season; outstanding predator action.", rating: "peak" },
      { month: "Nov", note: "Short rains begin; herds start to disperse again.", rating: "good" },
      { month: "Dec", note: "Green season returns; excellent birding begins.", rating: "good" },
    ],
    location: { lat: -3.8333, lng: 35.9333, zoom: 9 },
    faqs: [
      {
        question: "Why is Tarangire famous for elephants?",
        answer:
          "The Tarangire River is one of the only permanent water sources in the region during the dry season, drawing elephant family groups from across the wider ecosystem into some of the largest herds found anywhere in Tanzania.",
      },
      {
        question: "Is Tarangire worth visiting outside elephant season?",
        answer:
          "Yes — the green season (November to May) brings migratory birds, newborn wildlife and dramatically fewer visitors, though herds are more dispersed than the June–October peak.",
      },
      {
        question: "How does Tarangire compare to the Serengeti?",
        answer:
          "Tarangire is smaller, quieter and elephant-focused, while the Serengeti is vast and migration-focused. Many itineraries combine the two, often visiting Tarangire first as an uncrowded introduction to the Northern Circuit.",
      },
    ],
    seoDescription:
      "Explore Tarangire National Park with Macho Halisi — Tanzania's largest elephant herds, ancient baobabs and uncrowded dry-season game drives on the Northern Circuit.",
    relatedSlugs: ["manyara", "serengeti", "ngorongoro"],
  },
  {
    slug: "kilimanjaro",
    name: "Mount Kilimanjaro",
    category: "mountain",
    categoryLabel: "Mountain",
    region: "Kilimanjaro Region",
    tagline: "The Roof of Africa (5,895m)",
    heroImage:
      "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A trekker on Kilimanjaro's high-altitude mountain trail",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "The rugged high-altitude trail toward Kilimanjaro's summit",
      },
      {
        url: "/media/kilimanjaro/kili-ariel.jpg",
        alt: "Golden light over the foothills en route to Kilimanjaro",
      },
      {
        url: "/media/kilimanjaro/lemosho.jpg",
        alt: "Sunrise light over the plains near Kilimanjaro",
      },
    ],
    leadParagraph:
      "Kilimanjaro is the world's tallest free-standing mountain and the highest point on the African continent — a single volcanic massif rising from coastal savanna to glaciated summit through five distinct climate zones in less than a week's walk. No technical climbing skill is required to reach Uhuru Peak, only fitness, the right pacing, and respect for the altitude.",
    bodyParagraphs: [
      "What makes Kilimanjaro extraordinary is the compressed journey through ecosystems: trekkers pass through cultivated farmland and lush rainforest, alpine moorland studded with giant lobelia and senecio, a stark high-altitude desert, and finally an arctic summit zone of ice and scree — a botanical and climatic transect equivalent to travelling from the equator to the Arctic Circle in five days.",
      "Several official routes ascend the mountain, each with a different character and success rate. The Lemosho and Machame routes are the most scenic and allow better acclimatisation over 7–8 days; the Marangu route is the only one with hut accommodation; and the Rongai route approaches from the quieter northern side. Whichever route, proper acclimatisation days are the single biggest factor in reaching the summit safely and comfortably.",
    ],
    quickFacts: [
      { label: "Summit", value: "Uhuru Peak, 5,895 m" },
      { label: "Type", value: "Dormant stratovolcano" },
      { label: "Main routes", value: "Lemosho, Machame, Marangu, Rongai" },
      { label: "Typical duration", value: "6–9 days" },
      { label: "UNESCO status", value: "World Heritage Site (1987)" },
      { label: "Getting there", value: "1 hr drive from Kilimanjaro International Airport" },
    ],
    highlights: [
      {
        title: "Five climate zones in one climb",
        description:
          "From cultivated farmland through rainforest, moorland and alpine desert to an arctic summit — a full climatic transect in under a week.",
      },
      {
        title: "Uhuru Peak sunrise",
        description:
          "Most ascents summit before dawn to watch sunrise break over the curvature of the earth from Africa's highest point.",
      },
      {
        title: "No technical climbing required",
        description:
          "Kilimanjaro is a high-altitude trek, not a technical mountaineering ascent — success depends on fitness, pacing and acclimatisation, not ropes or crampons.",
      },
      {
        title: "Shrinking equatorial glaciers",
        description:
          "The summit's ice fields, among the last remaining on the equator, are a rare and diminishing sight worth witnessing firsthand.",
      },
    ],
    activitiesHeading: "Climbing routes",
    activities: [
      "Lemosho Route (7–8 days) — most scenic, best acclimatisation",
      "Machame Route (6–7 days) — the popular \"Whiskey Route\"",
      "Marangu Route (5–6 days) — hut accommodation, gentler gradient",
      "Rongai Route (6–7 days) — quieter northern approach",
      "Acclimatisation day hikes on Mount Meru (pre-climb)",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Dry, clear, one of the two prime climbing windows.", rating: "peak" },
      { month: "Feb", note: "Excellent visibility and stable weather continue.", rating: "peak" },
      { month: "Mar", note: "Rains begin; conditions deteriorate on upper slopes.", rating: "low" },
      { month: "Apr", note: "Long rains; not recommended for summit attempts.", rating: "low" },
      { month: "May", note: "Rains easing late month; trails still very wet.", rating: "low" },
      { month: "Jun", note: "Dry season begins; cold but clear at altitude.", rating: "good" },
      { month: "Jul", note: "Peak climbing season; cold nights, excellent visibility.", rating: "peak" },
      { month: "Aug", note: "Prime conditions; busiest month on the mountain.", rating: "peak" },
      { month: "Sep", note: "Dry, stable and clear — ideal climbing weather.", rating: "peak" },
      { month: "Oct", note: "Still favourable, shoulder-season quieter trails.", rating: "good" },
      { month: "Nov", note: "Short rains arrive; increasing cloud cover.", rating: "low" },
      { month: "Dec", note: "Short dry window before Christmas crowds build.", rating: "good" },
    ],
    location: { lat: -3.0674, lng: 37.3556, zoom: 10 },
    faqs: [
      {
        question: "Do I need climbing experience to summit Kilimanjaro?",
        answer:
          "No technical climbing skills are needed — Kilimanjaro is a high-altitude trek on well-established trails. Good physical fitness and, above all, slow, well-paced acclimatisation are what determine summit success.",
      },
      {
        question: "What is the Kilimanjaro summit success rate?",
        answer:
          "Success rates vary widely by route and itinerary length — routes of 7 days or longer with proper acclimatisation days see success rates well above those of rushed 5-day climbs, where altitude sickness is the primary reason climbers turn back.",
      },
      {
        question: "Which Kilimanjaro route is best for first-time trekkers?",
        answer:
          "The Lemosho route is widely regarded as the best balance of scenery, crowd levels and acclimatisation profile for first-time high-altitude trekkers, typically run over 7–8 days.",
      },
      {
        question: "Can a Kilimanjaro climb be combined with a safari?",
        answer:
          "Yes — Kilimanjaro pairs naturally with a Northern Circuit safari (Serengeti, Ngorongoro, Tarangire) either before or after the climb, and Kilimanjaro International Airport serves both.",
      },
    ],
    seoDescription:
      "Climb Mount Kilimanjaro with Macho Halisi — route options, best climbing months and what to expect trekking Africa's highest peak, the Roof of Africa.",
    relatedSlugs: ["serengeti", "manyara", "ngorongoro"],
  },
  {
    slug: "zanzibar",
    name: "Zanzibar Archipelago",
    category: "island",
    categoryLabel: "Island",
    region: "Indian Ocean Coast",
    tagline: "Spice Island & Turquoise Indian Ocean",
    heroImage:
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A tropical poolside terrace overlooking the turquoise Indian Ocean",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2200&q=85",
        alt: "A tropical seaside terrace overlooking the ocean",
      },
      {
        url: "/media/zanzibar/stone-town.jpg",
        alt: "A private beachfront resort pool at night",
      },
      {
        url: "/media/zanzibar/mnemba-atoll.jpg",
        alt: "Aerial view of a coastal resort among turquoise waters",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A tranquil sunset silhouette along the Zanzibar coast",
      },
    ],
    leadParagraph:
      "Zanzibar is Tanzania's Indian Ocean counterpoint to safari — a spice-scented archipelago of powder-white beaches, coral reefs and a UNESCO-listed old town, where centuries of Swahili, Arab, Persian and European trade have layered into a culture found nowhere else on the coast of Africa.",
    bodyParagraphs: [
      "At its heart is Stone Town, a UNESCO World Heritage Site of narrow coral-stone alleys, ornately carved wooden doors, rooftop cafés and centuries-old spice markets — once the beating commercial heart of the Indian Ocean slave and spice trade, and today a living museum best explored on foot with a local guide. Beyond the town, the island's coastline splits into distinct characters: the northern beaches around Nungwi and Kendwa offer swimmable water year-round unaffected by tides, the east coast's Paje and Jambiani are the kitesurfing capital of East Africa, and the south holds quieter, more remote stretches of sand.",
      "Offshore, Zanzibar's reefs rank among the richest in the western Indian Ocean, with Mnemba Atoll a standout for diving and snorkelling alongside dolphins, turtles and reef sharks. Inland, spice farm tours trace the island's namesake trade in cloves, nutmeg, cinnamon and vanilla — still grown much as they were two centuries ago — making Zanzibar as rewarding for culture and cuisine as it is for the beach.",
    ],
    quickFacts: [
      { label: "Main island", value: "Unguja, ~1,464 km²" },
      { label: "Capital", value: "Zanzibar City (Stone Town)" },
      { label: "UNESCO status", value: "Stone Town, World Heritage Site (2000)" },
      { label: "Climate", value: "Tropical, 25–32°C year-round" },
      { label: "Getting there", value: "Direct flights to Zanzibar (ZNZ), or 20 min hop from Dar es Salaam" },
    ],
    highlights: [
      {
        title: "Stone Town",
        description:
          "A UNESCO World Heritage old town of coral-stone architecture, carved doors and spice markets — the historic heart of the Swahili coast's trading past.",
      },
      {
        title: "Mnemba Atoll",
        description:
          "A private coral atoll off the north-east coast, widely regarded as Zanzibar's finest diving and snorkelling site, home to dolphins and vivid reef life.",
      },
      {
        title: "Spice farm tours",
        description:
          "Guided walks through working plantations growing clove, nutmeg, cinnamon and vanilla — the trade that gave the \"Spice Island\" its name.",
      },
      {
        title: "Kitesurfing at Paje",
        description:
          "Consistent trade winds and shallow lagoons make the east coast one of the best kitesurfing destinations in the world.",
      },
    ],
    activitiesHeading: "Beaches & activities",
    activities: [
      "Stone Town walking tours & spice market visits",
      "Snorkelling and scuba diving at Mnemba Atoll",
      "Sunset dhow cruises",
      "Kitesurfing lessons at Paje and Jambiani",
      "Spice farm tours",
      "Jozani Forest visit (red colobus monkeys)",
      "Deep-sea fishing charters",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Hot, dry and sunny — ideal beach weather.", rating: "peak" },
      { month: "Feb", note: "Peak dry season continues; warm, calm seas.", rating: "peak" },
      { month: "Mar", note: "Long rains begin late in the month.", rating: "low" },
      { month: "Apr", note: "Heaviest rains; many beach resorts scale back.", rating: "low" },
      { month: "May", note: "Rains easing; quiet, lush, excellent value.", rating: "low" },
      { month: "Jun", note: "Dry season returns; comfortable temperatures.", rating: "good" },
      { month: "Jul", note: "Dry, breezy — strong winds favour kitesurfers.", rating: "peak" },
      { month: "Aug", note: "Consistently dry with reliable trade winds.", rating: "peak" },
      { month: "Sep", note: "Excellent diving visibility and dry conditions.", rating: "peak" },
      { month: "Oct", note: "Warm and dry, shoulder season with fewer crowds.", rating: "good" },
      { month: "Nov", note: "Short rains bring brief afternoon showers.", rating: "good" },
      { month: "Dec", note: "Festive season; hot, dry and busy.", rating: "peak" },
    ],
    location: { lat: -6.1659, lng: 39.2026, zoom: 10 },
    faqs: [
      {
        question: "Is Zanzibar good to combine with a Tanzania safari?",
        answer:
          "Very much so — it's the classic \"bush to beach\" pairing. Most itineraries follow a Northern Circuit safari with 3–5 nights in Zanzibar, connected by a short domestic flight from Arusha or Kilimanjaro.",
      },
      {
        question: "Which part of Zanzibar has the best beaches?",
        answer:
          "The north (Nungwi, Kendwa) has swimmable water at any tide; the east coast (Paje, Jambiani) is better for kitesurfing but affected by tidal swings; the south and west offer quieter, more secluded stretches.",
      },
      {
        question: "Do I need a visa for Zanzibar?",
        answer:
          "Zanzibar shares Tanzania's visa policy — most nationalities can obtain an eVisa or visa on arrival for mainland Tanzania and Zanzibar together, valid for both.",
      },
    ],
    seoDescription:
      "Plan a Zanzibar beach escape with Macho Halisi — Stone Town, Mnemba Atoll diving, spice tours and the best time to visit Tanzania's Indian Ocean archipelago.",
    relatedSlugs: ["serengeti", "kilimanjaro", "southern-circuit"],
  },
  {
    slug: "manyara",
    name: "Lake Manyara National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Northern Circuit",
    tagline: "Tree-Climbing Lions & Pink Flamingo Shores",
    heroImage:
      "/media/manyara/manyara-hero.jpg",
    heroImageAlt: "An elephant deep in Lake Manyara's groundwater forest",
    gallery: [
      {
        url: "/media/manyara/flamingo.jpg",
        alt: "An elephant amid Manyara's groundwater forest",
      },
      {
        url: "/media/manyara/manyara-lion.jpg",
        alt: "Golden woodland fringing Lake Manyara",
      },
      {
        url: "/media/manyara/elephant.jpg",
        alt: "Elephants near the lake shore at sunset",
      },
    ],
    leadParagraph:
      "Lake Manyara sits dramatically beneath the wall of the Great Rift Valley, a compact park where dense groundwater forest gives way to open floodplain and a soda lake that, in the right season, turns pink with thousands of flamingos. Ernest Hemingway once called it \"the loveliest I had seen in Africa\" — and its scale makes it perfect for a half-day add-on to a longer safari.",
    bodyParagraphs: [
      "The park's defining curiosity is its tree-climbing lions — one of only a handful of populations in Africa known to regularly rest in the branches of acacia and fig trees, a behaviour still debated by researchers but reliably spotted here. Manyara's groundwater forest, fed by underground springs from the escarpment above, supports troops of baboon and blue monkey, while the alkaline lake itself draws vast numbers of flamingo, pelican and other waterbirds depending on water levels.",
      "Because roughly two-thirds of the park is lake, Manyara rewards a slower pace: canopy walkways through the forest, escarpment-view picnic sites, and short game drives make it an easy, scenic day rather than a multi-day base — most visitors combine it with Ngorongoro or Tarangire on a Northern Circuit route.",
    ],
    quickFacts: [
      { label: "Size", value: "330 km² (of which ~200 km² is lake)" },
      { label: "Established", value: "1960" },
      { label: "Altitude", value: "960 – 1,830 m" },
      { label: "Known for", value: "Tree-climbing lions, flamingos, canopy walkway" },
      { label: "Getting there", value: "1.5 hr drive from Arusha" },
    ],
    highlights: [
      {
        title: "Tree-climbing lions",
        description:
          "One of the few known populations in Africa to regularly rest in acacia and fig trees — a genuine Manyara speciality rarely seen elsewhere.",
      },
      {
        title: "Flamingo shores",
        description:
          "Lake Manyara's alkaline waters attract flocks of lesser and greater flamingo, best viewed when water levels concentrate them near the shore.",
      },
      {
        title: "Groundwater forest canopy walk",
        description:
          "Africa's first suspended canopy walkway, threading through the escarpment-fed forest canopy above troops of baboon and blue monkey.",
      },
      {
        title: "Rift Valley escarpment views",
        description:
          "The park sits beneath a dramatic 600m wall of the Great Rift Valley, offering some of the Northern Circuit's most striking backdrops.",
      },
    ],
    wildlife: [
      "Tree-climbing lion",
      "Large elephant herds along the lake shore",
      "Flamingo, pelican & other waterbirds (seasonal)",
      "Olive baboon & blue monkey troops",
      "Hippo pods in the lake shallows",
      "380+ recorded bird species",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "Half or full-day game drives",
      "Canopy walkway through the groundwater forest",
      "Escarpment picnic sites with lake views",
      "Cultural visits to nearby Mto wa Mbu village",
      "Bird-watching along the lake shore",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and mostly dry; good general game viewing.", rating: "good" },
      { month: "Feb", note: "Dry spell continues; flamingos often visible.", rating: "good" },
      { month: "Mar", note: "Rains begin; forest and floodplain turn lush.", rating: "low" },
      { month: "Apr", note: "Long rains; some tracks may be impassable.", rating: "low" },
      { month: "May", note: "Rains easing; green, quiet and scenic.", rating: "low" },
      { month: "Jun", note: "Dry season begins; wildlife concentrates near water.", rating: "good" },
      { month: "Jul", note: "Reliable game viewing and clear escarpment views.", rating: "peak" },
      { month: "Aug", note: "Peak dry season; strong lake-shore game viewing.", rating: "peak" },
      { month: "Sep", note: "Excellent visibility, dry trails throughout the park.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering; still very reliable.", rating: "good" },
      { month: "Nov", note: "Short rains bring flamingos back to the shallows.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers; good value season.", rating: "good" },
    ],
    location: { lat: -3.4, lng: 35.8167, zoom: 10 },
    faqs: [
      {
        question: "Are tree-climbing lions guaranteed at Lake Manyara?",
        answer:
          "No sighting in the wild is ever guaranteed, but Manyara is one of the most consistent places in Africa to look for this unusual lion behaviour, particularly in the acacia woodland south of the park entrance.",
      },
      {
        question: "How long should I spend at Lake Manyara?",
        answer:
          "Half a day to a full day is typical — most travellers visit as a scenic stop en route between Tarangire and the Ngorongoro Crater or Serengeti, rather than as a standalone multi-night base.",
      },
      {
        question: "Is Lake Manyara good for bird-watching?",
        answer:
          "Yes — with over 380 recorded species and its mix of forest, floodplain and alkaline lake habitats, it's one of the most productive birding stops on the Northern Circuit.",
      },
    ],
    seoDescription:
      "Visit Lake Manyara National Park with Macho Halisi — tree-climbing lions, flamingo-lined shores and a canopy walkway beneath the Great Rift Valley escarpment.",
    relatedSlugs: ["tarangire", "ngorongoro", "serengeti"],
  },
  {
    slug: "southern-circuit",
    name: "Ruaha & Nyerere (Selous)",
    category: "game-reserve",
    categoryLabel: "Game Reserve",
    region: "Southern Circuit",
    tagline: "The Wild Southern Circuit",
    heroImage:
      "/media/ruaha-selous/ruaha-hero.jpg",
    heroImageAlt: "Elephants at sunset in Tanzania's southern wilderness",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1400&q=85",
        alt: "Elephants at dusk in the southern reserves",
      },
      {
        url: "/media/ruaha-selous/ruaha-hero.jpg",
        alt: "Golden bushland of Tanzania's Southern Circuit",
      },
      {
        url: "/media/ruaha-selous/ruaha-el.jpg",
        alt: "An elephant in the riverine forest of the southern reserves",
      },
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
        alt: "A lion pair resting in the remote southern bush",
      },
    ],
    leadParagraph:
      "Tanzania's Southern Circuit — anchored by Ruaha National Park and the vast Nyerere National Park (formerly Selous Game Reserve) — is raw, remote wilderness at a scale the Northern Circuit cannot match, seeing a fraction of the visitors of the Serengeti while holding some of Africa's last great populations of lion, wild dog and elephant.",
    bodyParagraphs: [
      "Ruaha, Tanzania's largest national park at over 20,000 km², sits at a biological crossroads where East and Southern African species overlap — greater and lesser kudu, sable and roan antelope alongside classic savanna wildlife, all supported by one of the largest lion populations left in Africa, and healthy numbers of endangered African wild dog. Nyerere, split by the Rufiji River into a game-drive northern sector and a photographic-boating southern sector, adds a activity no Northern Circuit park offers at scale: boat safaris drifting past hippo pods, crocodile and elephant herds coming down to drink.",
      "What defines the Southern Circuit most is solitude — camps here are few, small and often exclusive-use, vehicle-to-wildlife ratios are a fraction of the north's, and the remoteness that once made this region hard to reach is now precisely its appeal for travellers who have done the classic safari and want something wilder.",
    ],
    quickFacts: [
      { label: "Ruaha size", value: "20,226 km² — Tanzania's largest national park" },
      { label: "Nyerere size", value: "~30,000 km²" },
      { label: "Known for", value: "Low visitor density, wild dog, boat safaris" },
      { label: "Getting there", value: "Scheduled fly-in from Dar es Salaam or Arusha" },
      { label: "Best paired with", value: "Zanzibar (short connecting flight)" },
    ],
    highlights: [
      {
        title: "Genuine remoteness",
        description:
          "A fraction of the vehicle density found in the Serengeti or Ngorongoro — sightings here are often experienced alone, not shared with a dozen other vehicles.",
      },
      {
        title: "Boat safaris on the Rufiji",
        description:
          "Nyerere's southern sector offers river-based game viewing found nowhere on the Northern Circuit — hippo, crocodile and elephant seen from the water.",
      },
      {
        title: "African wild dog strongholds",
        description:
          "Both Ruaha and Nyerere hold significant populations of the endangered African wild dog, among the largest remaining in the world.",
      },
      {
        title: "East-meets-south wildlife",
        description:
          "Ruaha's location at a biogeographic crossroads brings species like greater kudu and sable antelope alongside classic savanna game.",
      },
    ],
    wildlife: [
      "Large, healthy lion populations",
      "African wild dog (one of the largest remaining populations)",
      "Elephant herds along the Rufiji & Great Ruaha rivers",
      "Greater & lesser kudu, sable and roan antelope",
      "Hippo and crocodile (Rufiji River boat safaris)",
      "Leopard and spotted hyena",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "4x4 game drives, including night drives in Ruaha",
      "Boat safaris on the Rufiji River (Nyerere)",
      "Walking safaris with armed rangers",
      "Fly-camping in remote sectors",
      "Fishing safaris (select Rufiji River camps)",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and increasingly wet; lush, quiet season begins.", rating: "low" },
      { month: "Feb", note: "Green season continues; excellent birding.", rating: "low" },
      { month: "Mar", note: "Peak rains; many camps close for the season.", rating: "low" },
      { month: "Apr", note: "Heaviest rains; most camps remain closed.", rating: "low" },
      { month: "May", note: "Rains ease; camps begin reopening late month.", rating: "low" },
      { month: "Jun", note: "Dry season begins; wildlife concentrates at rivers.", rating: "good" },
      { month: "Jul", note: "Excellent game viewing as rivers draw in herds.", rating: "peak" },
      { month: "Aug", note: "Peak dry season; outstanding predator action.", rating: "peak" },
      { month: "Sep", note: "Prime boat safari conditions on the Rufiji.", rating: "peak" },
      { month: "Oct", note: "Height of dry season; wildlife density peaks.", rating: "peak" },
      { month: "Nov", note: "Short rains begin; still strong game viewing.", rating: "good" },
      { month: "Dec", note: "Warm with building rains; quieter, greener landscapes.", rating: "good" },
    ],
    location: { lat: -7.5, lng: 35.0, zoom: 7 },
    faqs: [
      {
        question: "What's the difference between Ruaha and Nyerere (Selous)?",
        answer:
          "Ruaha is Tanzania's largest national park, known for classic game drives and a striking mix of East and Southern African wildlife. Nyerere (the former Selous Game Reserve) is larger still and centred on the Rufiji River, adding boat safaris alongside game drives.",
      },
      {
        question: "Is the Southern Circuit good for first-time safari-goers?",
        answer:
          "It can be, but it particularly rewards travellers who have already done a Northern Circuit safari and want lower visitor density, more exclusive camps and a wilder, slower pace.",
      },
      {
        question: "When do Southern Circuit camps close for the rainy season?",
        answer:
          "Many camps in Ruaha and Nyerere close or scale back operations from around March to May during the heaviest rains, reopening as roads dry out from late May or June.",
      },
    ],
    seoDescription:
      "Discover Tanzania's Southern Circuit with Macho Halisi — Ruaha and Nyerere (Selous) offer wild dog, Rufiji River boat safaris and remote, uncrowded game viewing.",
    relatedSlugs: ["zanzibar", "ruaha", "serengeti"],
  },
  {
    slug: "arusha",
    name: "Arusha National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Northern Circuit",
    tagline: "Giraffes, Crater Walks & the Foothills of Meru",
    heroImage:
      "https://images.unsplash.com/photo-1549854233-ca0baec6fa74?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A giraffe standing in the grassland of Arusha National Park",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1626548307930-deac221f87d9?auto=format&fit=crop&w=1400&q=85",
        alt: "A giraffe silhouetted against the sky near Arusha",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden acacia plains beneath Mount Meru",
      },
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A trekking trail on the lower slopes of Mount Meru",
      },
    ],
    leadParagraph:
      "Tiny by Tanzanian standards and often overlooked in favour of the Serengeti, Arusha National Park packs an outsized variety into just 137 km² — alkaline lakes, a miniature crater, montane forest, and the dramatic ash cone of Mount Meru rising over it all. It's the closest park to Arusha town, making it a rewarding half-day or full-day safari for travellers arriving or departing on a tight schedule.",
    bodyParagraphs: [
      "The Momella Lakes, a chain of shallow alkaline lakes fed by underground streams, are the park's signature feature — each a different shade of green or blue depending on its mineral content, and often dotted with flamingo, pelican and hippo. Ngurdoto Crater, a smaller echo of Ngorongoro, holds a swampy floor visible only from the rim walking trails that circle it. Arusha is also one of the very few Tanzanian parks where walking safaris and canoeing are routinely permitted, since it has no resident lion population — making close encounters with giraffe, buffalo and colobus monkey on foot a real possibility.",
      "For climbers, Arusha National Park is the gateway to Mount Meru — Africa's fifth-highest peak lies entirely within the park's boundaries, and most Meru ascents begin from the Momella Gate here before continuing to their own dedicated trailhead.",
    ],
    quickFacts: [
      { label: "Size", value: "137 km²" },
      { label: "Established", value: "1960" },
      { label: "Altitude", value: "1,388 – 4,566 m (incl. Mount Meru)" },
      { label: "Known for", value: "Giraffes, Momella Lakes, walking safaris" },
      { label: "Getting there", value: "45 min drive from Arusha town" },
    ],
    highlights: [
      {
        title: "The Momella Lakes",
        description:
          "A chain of shallow alkaline lakes, each a different colour, drawing flamingo and pelican against a backdrop of Mount Meru.",
      },
      {
        title: "Walking safaris",
        description:
          "One of Tanzania's few parks where ranger-led walks are routine rather than exceptional, thanks to the absence of resident lion.",
      },
      {
        title: "Ngurdoto Crater",
        description:
          "A miniature, forested echo of Ngorongoro, explored entirely from rim-side walking trails rather than a vehicle descent.",
      },
      {
        title: "Gateway to Mount Meru",
        description:
          "Nearly every Meru ascent begins at this park's Momella Gate, making it a natural first or last stop on a climbing itinerary.",
      },
    ],
    wildlife: [
      "Giraffe (some of the highest densities in Tanzania)",
      "Black-and-white colobus monkey",
      "Buffalo, warthog & bushbuck",
      "Flamingo and pelican on the Momella Lakes",
      "Elephant (seasonal)",
      "400+ recorded bird species",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "Half or full-day game drives",
      "Ranger-led walking safaris",
      "Canoeing on the Momella Lakes",
      "Rim walks around Ngurdoto Crater",
      "Day-hikes on the lower slopes of Mount Meru",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Dry and warm; good general game viewing.", rating: "good" },
      { month: "Feb", note: "Dry spell continues; clear Meru views.", rating: "good" },
      { month: "Mar", note: "Rains begin; forest turns lush green.", rating: "low" },
      { month: "Apr", note: "Long rains; trails can be muddy.", rating: "low" },
      { month: "May", note: "Rains easing; quiet and scenic.", rating: "low" },
      { month: "Jun", note: "Dry season begins; comfortable temperatures.", rating: "good" },
      { month: "Jul", note: "Reliable dry conditions for walking safaris.", rating: "peak" },
      { month: "Aug", note: "Clear skies, excellent Meru photography.", rating: "peak" },
      { month: "Sep", note: "Dry and pleasant throughout.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering; still reliable.", rating: "good" },
      { month: "Nov", note: "Short rains begin; landscape greens quickly.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -3.2521, lng: 36.8697, zoom: 10 },
    faqs: [
      {
        question: "Is Arusha National Park worth visiting on its own?",
        answer:
          "Yes — it's an easy half or full-day trip from Arusha town, ideal for a short safari on an arrival or departure day, and one of the few parks where you can walk rather than only drive.",
      },
      {
        question: "Can I see the Big Five in Arusha National Park?",
        answer:
          "No — there's no resident lion or rhino population, and leopard sightings are rare. The draw here is giraffe, colobus monkey and scenery rather than the Big Five.",
      },
      {
        question: "Do I climb Mount Meru from inside this park?",
        answer:
          "Yes — the standard Momella Route begins at this park's gate and climbs through its forest and moorland before reaching Meru's own summit ridge.",
      },
    ],
    seoDescription:
      "Visit Arusha National Park with Macho Halisi — giraffe walking safaris, the colourful Momella Lakes and the gateway to climbing Mount Meru.",
    relatedSlugs: ["meru", "kilimanjaro", "tarangire"],
  },
  {
    slug: "mikumi",
    name: "Mikumi National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Southern Circuit",
    tagline: "The Accessible Mini-Serengeti",
    heroImage:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Elephants at sunset on Mikumi's open Mkata floodplain",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
        alt: "A lion pair resting on the Mkata floodplain",
      },
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        alt: "A safari vehicle crossing Mikumi's open grassland",
      },
      {
        url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1400&q=85",
        alt: "An elephant amid Mikumi's woodland",
      },
    ],
    leadParagraph:
      "Mikumi is the most accessible of Tanzania's southern parks — a paved road connects it directly to Dar es Salaam in around four hours, making it the easiest way to combine a genuine safari with a beach holiday without a bush flight. Its open Mkata floodplain, ringed by the Uluguru and Rubeho mountains, is often described as a mini-Serengeti for its similar grassland game viewing.",
    bodyParagraphs: [
      "The floodplain supports large herds of buffalo, zebra, wildebeest and impala, with resident lion prides that — like their cousins in Manyara — are occasionally seen resting in the branches of acacia and baobab trees. Elephant and giraffe are common along the park's watercourses, and a fenced black rhino sanctuary protects a small breeding population. Mikumi shares an unfenced boundary with the vast Nyerere National Park to the south, effectively forming part of one of Africa's largest continuous protected ecosystems.",
    ],
    quickFacts: [
      { label: "Size", value: "3,230 km²" },
      { label: "Established", value: "1964" },
      { label: "Known for", value: "Easy road access from Dar es Salaam" },
      { label: "Getting there", value: "4 hr drive from Dar es Salaam (paved road)" },
    ],
    highlights: [
      {
        title: "The Mkata floodplain",
        description:
          "Open grassland ringed by mountains, drawing large herds of buffalo, zebra and wildebeest in classic Serengeti-style scenery.",
      },
      {
        title: "Easy road access",
        description:
          "The only major Tanzanian safari park reachable by paved road from Dar es Salaam, no bush flight required.",
      },
      {
        title: "Tree-climbing lions",
        description:
          "Like Lake Manyara, Mikumi's lions are occasionally spotted resting in acacia and baobab branches.",
      },
      {
        title: "Black rhino sanctuary",
        description:
          "A protected, fenced sanctuary supports one of Tanzania's few breeding black rhino populations outside Ngorongoro.",
      },
    ],
    wildlife: [
      "Lion, including occasional tree-climbers",
      "Elephant, buffalo, zebra & wildebeest",
      "Giraffe and eland",
      "Sable antelope (Southern Circuit specialist)",
      "Black rhino (fenced sanctuary)",
      "Hippo pools along the Mkata River",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "Morning and afternoon game drives",
      "Walking safaris with armed rangers",
      "Bird-watching along the Mkata floodplain",
      "Combined day-trip stopovers en route south",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm with scattered showers; herds dispersed.", rating: "good" },
      { month: "Feb", note: "Green season continues; good birding.", rating: "good" },
      { month: "Mar", note: "Rains build; fewer visitors.", rating: "low" },
      { month: "Apr", note: "Peak rains; some tracks difficult.", rating: "low" },
      { month: "May", note: "Rains ease; landscape lush and green.", rating: "low" },
      { month: "Jun", note: "Dry season begins; game concentrates at water.", rating: "good" },
      { month: "Jul", note: "Reliable game viewing on the floodplain.", rating: "peak" },
      { month: "Aug", note: "Peak dry season; excellent visibility.", rating: "peak" },
      { month: "Sep", note: "Dry and dusty; strong predator sightings.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering; still very good.", rating: "good" },
      { month: "Nov", note: "Short rains begin; landscape greens quickly.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -7.3833, lng: 37.0, zoom: 9 },
    faqs: [
      {
        question: "Can Mikumi be visited without a bush flight?",
        answer:
          "Yes — it's the one major Southern Circuit park reachable by paved road, about four hours from Dar es Salaam, making it easy to combine with a Zanzibar beach stay.",
      },
      {
        question: "Is Mikumi as good as the Serengeti?",
        answer:
          "It's smaller and less famous, but the open Mkata floodplain offers genuinely similar grassland game viewing at a fraction of the visitor numbers and travel cost.",
      },
    ],
    seoDescription:
      "Discover Mikumi National Park with Macho Halisi — Tanzania's most accessible safari park, four hours from Dar es Salaam, with tree-climbing lions and open plains.",
    relatedSlugs: ["ruaha", "udzungwa", "saadani"],
  },
  {
    slug: "katavi",
    name: "Katavi National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Western Circuit",
    tagline: "Tanzania's Wildest, Least-Visited Wilderness",
    heroImage:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A safari vehicle crossing Katavi's remote floodplain at sunset",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1400&q=85",
        alt: "Elephants at sunset on Katavi's remote plains",
      },
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
        alt: "A lion pair resting in Katavi's bush",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary acacia tree on Katavi's plains",
      },
    ],
    leadParagraph:
      "Katavi is Tanzania's third-largest national park and among its least visited — a genuinely remote Western Circuit wilderness where dry-season wildlife congregations rival anything on the Northern Circuit, seen by a tiny fraction of the visitors. For travellers who have done the classic safari and want somewhere truly wild, Katavi is as close as Tanzania gets to untouched.",
    bodyParagraphs: [
      "As the dry season advances, the Katuma River and its floodplain lakes shrink into a handful of pools, forcing hundreds of hippo and enormous Nile crocodile into crowded, dramatic congregations, while some of Tanzania's largest buffalo herds — numbering in the thousands — gather on the receding floodplain grass. Lion prides here are known for unusually large numbers, preying on the concentrated herds, and the park's isolation means sightings are often made without another vehicle in view all day.",
    ],
    quickFacts: [
      { label: "Size", value: "4,471 km²" },
      { label: "Established", value: "1974" },
      { label: "Known for", value: "Dry-season hippo & crocodile congregations" },
      { label: "Getting there", value: "Scheduled fly-in from Arusha or Dar es Salaam" },
    ],
    highlights: [
      {
        title: "Dry-season hippo congregations",
        description:
          "As pools shrink, hundreds of hippo and giant crocodile crowd into the last remaining water — one of Africa's most dramatic dry-season spectacles.",
      },
      {
        title: "Enormous buffalo herds",
        description:
          "Some of Tanzania's largest buffalo herds, numbering in the thousands, gather on the receding Katuma floodplain.",
      },
      {
        title: "True solitude",
        description:
          "Among the least-visited major parks in Tanzania — days can pass with sightings shared with no other vehicle.",
      },
      {
        title: "Big, healthy lion prides",
        description:
          "Unusually large lion prides thrive here, drawn by the concentrated dry-season herds along the floodplain.",
      },
    ],
    wildlife: [
      "Large lion prides",
      "Buffalo herds numbering in the thousands",
      "Hippo and Nile crocodile (dry-season congregations)",
      "Elephant and giraffe",
      "Roan and sable antelope",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "4x4 game drives",
      "Walking safaris with armed rangers",
      "Fly-camping in remote sectors",
      "Boat viewing of hippo pools (seasonal)",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Green season; camps largely closed.", rating: "low" },
      { month: "Feb", note: "Rains continue; very quiet.", rating: "low" },
      { month: "Mar", note: "Peak rains; most camps closed.", rating: "low" },
      { month: "Apr", note: "Heaviest rains; access very limited.", rating: "low" },
      { month: "May", note: "Rains ease; camps begin reopening.", rating: "low" },
      { month: "Jun", note: "Dry season begins; water sources shrink.", rating: "good" },
      { month: "Jul", note: "Hippo and buffalo congregations building.", rating: "peak" },
      { month: "Aug", note: "Peak dry season; dramatic wildlife density.", rating: "peak" },
      { month: "Sep", note: "Height of the hippo/crocodile spectacle.", rating: "peak" },
      { month: "Oct", note: "Extreme dry season; outstanding predator action.", rating: "peak" },
      { month: "Nov", note: "Short rains begin; still strong game viewing.", rating: "good" },
      { month: "Dec", note: "Rains building; camps begin closing.", rating: "low" },
    ],
    location: { lat: -6.75, lng: 31.0, zoom: 8 },
    faqs: [
      {
        question: "Why is Katavi so much less visited than the Serengeti?",
        answer:
          "It's remote — reached only by light aircraft on Tanzania's Western Circuit — and has very few camps, which is exactly what preserves its wild, uncrowded character.",
      },
      {
        question: "When is the best time to see Katavi's hippo congregations?",
        answer:
          "Late in the dry season, from around August to October, when shrinking water forces hundreds of hippo and large crocodile into the last remaining pools.",
      },
    ],
    seoDescription:
      "Discover Katavi National Park with Macho Halisi — Tanzania's remote Western Circuit wilderness, famous for massive dry-season hippo congregations and huge buffalo herds.",
    relatedSlugs: ["mahale", "gombe", "ruaha"],
  },
  {
    slug: "mahale",
    name: "Mahale Mountains National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Western Circuit",
    tagline: "Chimpanzee Trekking on the Shores of Lake Tanganyika",
    heroImage:
      "https://images.unsplash.com/photo-1742328114651-f4dbd710cd5d?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A chimpanzee resting in the forest of the Mahale Mountains",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
        alt: "A lakeshore lodge terrace on Lake Tanganyika",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the hills near Mahale",
      },
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A trekking trail through Mahale's forested mountains",
      },
    ],
    leadParagraph:
      "There are no roads into Mahale — only a boat across Lake Tanganyika or a light aircraft to a bush strip, followed by a walk into the forest. That inaccessibility is precisely what has kept this one of the world's great chimpanzee-trekking destinations so untouched, with around 800 wild chimpanzees living in the forested mountains above one of Africa's most beautiful freshwater lakes.",
    bodyParagraphs: [
      "The habituated M-group, studied continuously by Kyoto University researchers since 1965, is the park's main draw — trackers set out at dawn to locate the group, and once found, visitors are permitted an hour in their presence, watching grooming, feeding and social behaviour at close range in dense forest. Beyond the chimps, Mahale's setting is extraordinary in its own right: powder-white beaches on crystal-clear Lake Tanganyika sit directly below the forest, and most camps offer swimming and kayaking alongside the trekking, an unusual pairing of primate trekking and lake beach holiday in a single, very remote destination.",
    ],
    quickFacts: [
      { label: "Size", value: "1,613 km²" },
      { label: "Established", value: "1985" },
      { label: "Chimpanzee population", value: "~800 in the park; habituated M-group trekked" },
      { label: "Getting there", value: "Boat or light aircraft only — no road access" },
    ],
    highlights: [
      {
        title: "Habituated chimpanzee trekking",
        description:
          "The M-group has been studied since 1965, offering close, ethically managed encounters with wild chimpanzees in dense forest.",
      },
      {
        title: "Beaches on Lake Tanganyika",
        description:
          "Powder-white sand and clear freshwater directly below the forest — a rare combination of primate trekking and lake swimming.",
      },
      {
        title: "No roads, no crowds",
        description:
          "Reachable only by boat or light aircraft, keeping visitor numbers — and camp counts — extremely low.",
      },
      {
        title: "Pristine montane forest",
        description:
          "The Mahale range's forested peaks rise directly from the lakeshore, home to red colobus, blue monkey and forest birdlife alongside the chimps.",
      },
    ],
    wildlife: [
      "Chimpanzee (~800 in the park)",
      "Red colobus and blue monkey",
      "Forest elephant and bushpig",
      "Lake Tanganyika's endemic cichlid fish (snorkelling)",
    ],
    activitiesHeading: "Activities",
    activities: [
      "Guided chimpanzee trekking",
      "Swimming and kayaking on Lake Tanganyika",
      "Forest walks and birding",
      "Snorkelling among endemic cichlid fish",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Rains ongoing; forest lush, trekking harder.", rating: "low" },
      { month: "Feb", note: "Wet season continues; fewer visitors.", rating: "low" },
      { month: "Mar", note: "Peak rains; some camps close.", rating: "low" },
      { month: "Apr", note: "Heaviest rains; limited access.", rating: "low" },
      { month: "May", note: "Rains ease; camps reopening.", rating: "low" },
      { month: "Jun", note: "Dry season begins; excellent trekking conditions.", rating: "good" },
      { month: "Jul", note: "Prime chimpanzee trekking season.", rating: "peak" },
      { month: "Aug", note: "Dry, clear and ideal for trekking.", rating: "peak" },
      { month: "Sep", note: "Excellent conditions continue.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering; still very good.", rating: "peak" },
      { month: "Nov", note: "Short rains begin; forest greening.", rating: "good" },
      { month: "Dec", note: "Warm with building rains.", rating: "good" },
    ],
    location: { lat: -6.35, lng: 29.9167, zoom: 9 },
    faqs: [
      {
        question: "How difficult is chimpanzee trekking at Mahale?",
        answer:
          "Treks range from a short walk to several hours over steep forest terrain, depending on where the M-group is found that morning — a reasonable level of fitness is recommended.",
      },
      {
        question: "How do I get to Mahale Mountains National Park?",
        answer:
          "There are no roads — access is by scheduled light aircraft to a bush airstrip followed by a boat transfer, or by boat directly from Kigoma, making it one of Tanzania's most remote parks.",
      },
    ],
    seoDescription:
      "Trek wild chimpanzees at Mahale Mountains National Park with Macho Halisi — remote forest trekking above the white-sand beaches of Lake Tanganyika.",
    relatedSlugs: ["gombe", "katavi", "lake-tanganyika"],
  },
  {
    slug: "gombe",
    name: "Gombe Stream National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Western Circuit",
    tagline: "Jane Goodall's Chimpanzee Research Home",
    heroImage:
      "https://images.unsplash.com/photo-1742328114651-f4dbd710cd5d?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A chimpanzee resting in the forest of Gombe Stream National Park",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A forest trekking trail above Lake Tanganyika at Gombe",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary tree on the hills above Gombe",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the hills near Lake Tanganyika",
      },
    ],
    leadParagraph:
      "Tanzania's smallest national park is also its most scientifically famous — Gombe Stream is where Jane Goodall began her chimpanzee research in 1960, work that overturned assumptions about the line between humans and animals and continues today as one of the longest-running wildlife studies on Earth.",
    bodyParagraphs: [
      "At just 52 km², a narrow strip of forested hills running along the shore of Lake Tanganyika, Gombe is compact enough that trekking to find a chimpanzee group typically takes less time than at larger parks — though the terrain is steep. The habituated communities here descend from the very groups Goodall first studied, and rangers and researchers still track them daily, giving visitors both a wildlife encounter and a direct link to one of primatology's foundational research sites.",
    ],
    quickFacts: [
      { label: "Size", value: "52 km² — Tanzania's smallest national park" },
      { label: "Established", value: "1968" },
      { label: "Known for", value: "Jane Goodall's chimpanzee research since 1960" },
      { label: "Getting there", value: "Boat from Kigoma only — no road access" },
    ],
    highlights: [
      {
        title: "The birthplace of chimpanzee research",
        description:
          "Jane Goodall began her groundbreaking studies here in 1960; researchers still track the same chimpanzee lineages today.",
      },
      {
        title: "Compact, intensive trekking",
        description:
          "Gombe's small size means shorter treks to find habituated chimpanzee communities than at larger parks like Mahale.",
      },
      {
        title: "Lakeshore forest scenery",
        description:
          "A narrow strip of steep, forested hills dropping straight into Lake Tanganyika's clear water.",
      },
    ],
    wildlife: [
      "Chimpanzee (multiple habituated communities)",
      "Olive baboon",
      "Red colobus and red-tailed monkey",
      "200+ recorded bird species",
    ],
    activitiesHeading: "Activities",
    activities: [
      "Guided chimpanzee trekking",
      "Visits to the Jane Goodall research area",
      "Swimming in Lake Tanganyika",
      "Forest birding walks",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Wet season; forest lush, trekking harder.", rating: "low" },
      { month: "Feb", note: "Rains continue.", rating: "low" },
      { month: "Mar", note: "Peak rains.", rating: "low" },
      { month: "Apr", note: "Heaviest rains; limited access.", rating: "low" },
      { month: "May", note: "Rains ease.", rating: "low" },
      { month: "Jun", note: "Dry season begins; good trekking conditions.", rating: "good" },
      { month: "Jul", note: "Prime trekking season.", rating: "peak" },
      { month: "Aug", note: "Dry and clear.", rating: "peak" },
      { month: "Sep", note: "Excellent conditions continue.", rating: "peak" },
      { month: "Oct", note: "Still very good, dry conditions.", rating: "peak" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with building rains.", rating: "good" },
    ],
    location: { lat: -4.6667, lng: 29.6167, zoom: 10 },
    faqs: [
      {
        question: "Can I combine Gombe and Mahale in one trip?",
        answer:
          "Yes — both are reached via Kigoma and are commonly combined, giving two distinct chimpanzee-trekking experiences on the same Lake Tanganyika trip.",
      },
      {
        question: "Is Gombe suitable for a short visit?",
        answer:
          "Yes — its small size makes it possible to trek chimpanzees and see the research area in a single full day, unlike the multi-day commitment Mahale usually needs.",
      },
    ],
    seoDescription:
      "Visit Gombe Stream National Park with Macho Halisi — the birthplace of Jane Goodall's chimpanzee research on the shores of Lake Tanganyika.",
    relatedSlugs: ["mahale", "katavi", "lake-tanganyika"],
  },
  {
    slug: "rubondo",
    name: "Rubondo Island National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Lake Victoria",
    tagline: "A Forested Island Sanctuary on Lake Victoria",
    heroImage:
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "An elephant amid Rubondo Island's forest on Lake Victoria",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1549854233-ca0baec6fa74?auto=format&fit=crop&w=1400&q=85",
        alt: "A giraffe among Rubondo Island's woodland",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary tree on Rubondo Island's shoreline",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over Rubondo's woodland at dusk",
      },
    ],
    leadParagraph:
      "Rubondo is an entire national park contained on one forested island in Africa's largest lake — a place where, between the 1960s and 1990s, conservationists deliberately introduced chimpanzee, giraffe, elephant and black rhino to a predator-free environment, creating one of Tanzania's strangest and most rewarding wildlife experiments.",
    bodyParagraphs: [
      "The result is a genuinely unusual safari: forest and papyrus-fringed shoreline instead of open savanna, giraffe browsing beneath tropical canopy, and a healthy population of sitatunga — a shy, swamp-dwelling antelope rarely seen elsewhere in East Africa. Rubondo is also one of Tanzania's best birding destinations, with African fish eagle, grey parrot and hundreds of migrant species, and its surrounding waters offer excellent Nile perch fishing. Very few visitors make it here, which is exactly the appeal for travellers seeking something entirely different from the standard safari circuit.",
    ],
    quickFacts: [
      { label: "Size", value: "457 km² (island + surrounding lake)" },
      { label: "Established", value: "1977" },
      { label: "Known for", value: "Introduced chimpanzee, giraffe & elephant populations" },
      { label: "Getting there", value: "Boat or light aircraft from Mwanza" },
    ],
    highlights: [
      {
        title: "A conservation experiment turned wilderness",
        description:
          "Chimpanzee, giraffe, elephant and black rhino were deliberately introduced here decades ago in a bid to create a predator-free island sanctuary.",
      },
      {
        title: "Sitatunga antelope",
        description:
          "One of the best places in East Africa to see this shy, swamp-dwelling antelope, rarely encountered on the mainland circuits.",
      },
      {
        title: "Outstanding birding",
        description:
          "Forest, papyrus swamp and open water habitats support African fish eagle, grey parrot and hundreds of migrant species.",
      },
    ],
    wildlife: [
      "Chimpanzee (introduced, semi-habituated)",
      "Giraffe and elephant (introduced populations)",
      "Sitatunga antelope",
      "Nile perch and tilapia in surrounding waters",
      "African fish eagle and grey parrot",
    ],
    activitiesHeading: "Activities",
    activities: [
      "Forest walks and chimpanzee tracking",
      "Sport fishing for Nile perch",
      "Birding boat trips through papyrus channels",
      "Sunset cruises on Lake Victoria",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and mostly dry.", rating: "good" },
      { month: "Feb", note: "Dry spell continues.", rating: "good" },
      { month: "Mar", note: "Rains begin; lush and green.", rating: "low" },
      { month: "Apr", note: "Long rains; limited access.", rating: "low" },
      { month: "May", note: "Rains ease.", rating: "low" },
      { month: "Jun", note: "Dry season begins.", rating: "good" },
      { month: "Jul", note: "Good conditions for walking and fishing.", rating: "peak" },
      { month: "Aug", note: "Dry and pleasant.", rating: "peak" },
      { month: "Sep", note: "Excellent conditions continue.", rating: "peak" },
      { month: "Oct", note: "Still good, dry conditions.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -2.3167, lng: 31.85, zoom: 10 },
    faqs: [
      {
        question: "Why are there giraffe and elephant on a Lake Victoria island?",
        answer:
          "They were deliberately introduced by conservationists between the 1960s and 1990s to establish a predator-free island wildlife sanctuary — an unusual experiment that has since matured into a genuine ecosystem.",
      },
      {
        question: "Is Rubondo good for fishing?",
        answer:
          "Yes — the surrounding waters of Lake Victoria are known for large Nile perch, and several camps offer dedicated sport-fishing trips.",
      },
    ],
    seoDescription:
      "Explore Rubondo Island National Park with Macho Halisi — a forested Lake Victoria sanctuary with introduced chimpanzee, giraffe and elephant, and superb birding.",
    relatedSlugs: ["lake-victoria", "serengeti", "katavi"],
  },
  {
    slug: "saadani",
    name: "Saadani National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Coastal",
    tagline: "Where the Bush Meets the Indian Ocean",
    heroImage:
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A tropical coastline where Saadani National Park meets the Indian Ocean",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1400&q=85",
        alt: "Elephants at sunset near Saadani's coastline",
      },
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        alt: "A safari vehicle on Saadani's coastal plains",
      },
      {
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85",
        alt: "Aerial view of Saadani's coastal resort waters",
      },
    ],
    leadParagraph:
      "Saadani is the only place in East Africa where a genuine game drive and a swim in the Indian Ocean can happen within the same afternoon — a coastal park where the bush runs straight down to unspoiled beach, and elephant tracks are sometimes found in the sand.",
    bodyParagraphs: [
      "Wildlife density is lower than the Northern Circuit's flagship parks, but the setting is unmatched: game drives across open grassland and acacia woodland give way to mangrove-lined creeks and palm-backed beach, and boat safaris on the Wami River bring close sightings of hippo, crocodile and abundant waterbirds. Saadani sits conveniently between Dar es Salaam and Zanzibar, making it an easy addition to a beach-focused itinerary for travellers who still want a real safari without a long detour inland.",
    ],
    quickFacts: [
      { label: "Size", value: "1,100 km²" },
      { label: "Established", value: "2005" },
      { label: "Known for", value: "Tanzania's only beachfront national park" },
      { label: "Getting there", value: "3–4 hr drive from Dar es Salaam, or boat from Zanzibar" },
    ],
    highlights: [
      {
        title: "Bush meets beach",
        description:
          "The only national park in East Africa where a game drive and an ocean swim are both possible on the same day.",
      },
      {
        title: "Wami River boat safaris",
        description:
          "Boat trips along mangrove-lined creeks bring close encounters with hippo, crocodile and prolific birdlife.",
      },
      {
        title: "A convenient detour",
        description:
          "Sits directly between Dar es Salaam and Zanzibar, making it easy to slot a real safari into a beach-focused trip.",
      },
    ],
    wildlife: [
      "Elephant, giraffe & buffalo",
      "Lion (low density)",
      "Hippo and crocodile along the Wami River",
      "Green sea turtle nesting sites (seasonal)",
      "Abundant coastal and wetland birdlife",
    ],
    activitiesHeading: "Activities",
    activities: [
      "Game drives across coastal grassland",
      "Boat safaris on the Wami River",
      "Beach walks and swimming",
      "Turtle-nesting site visits (seasonal)",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Hot and dry; good beach weather.", rating: "good" },
      { month: "Feb", note: "Peak dry season continues.", rating: "peak" },
      { month: "Mar", note: "Long rains begin.", rating: "low" },
      { month: "Apr", note: "Heaviest rains.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season returns.", rating: "good" },
      { month: "Jul", note: "Reliable dry conditions.", rating: "peak" },
      { month: "Aug", note: "Excellent game viewing and beach weather.", rating: "peak" },
      { month: "Sep", note: "Dry and pleasant.", rating: "peak" },
      { month: "Oct", note: "Warm and dry, shoulder season.", rating: "good" },
      { month: "Nov", note: "Short rains bring brief showers.", rating: "good" },
      { month: "Dec", note: "Hot, dry and busy.", rating: "peak" },
    ],
    location: { lat: -5.9167, lng: 38.7667, zoom: 10 },
    faqs: [
      {
        question: "Can I really swim and go on a game drive at Saadani?",
        answer:
          "Yes — several camps sit directly on the beach with the park's bush immediately behind them, so a morning game drive followed by an afternoon swim is a genuine daily rhythm here.",
      },
      {
        question: "How does Saadani compare to the Serengeti for wildlife?",
        answer:
          "Wildlife density and variety are considerably lower — Saadani's appeal is its unique coastal setting and convenience, not competing with the Northern Circuit's game viewing.",
      },
    ],
    seoDescription:
      "Visit Saadani National Park with Macho Halisi — Tanzania's only beachfront national park, combining game drives, Wami River boat safaris and the Indian Ocean.",
    relatedSlugs: ["zanzibar", "mikumi", "bagamoyo"],
  },
  {
    slug: "udzungwa",
    name: "Udzungwa Mountains National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Southern Highlands",
    tagline: "Rainforest, Waterfalls & the African Galápagos",
    heroImage:
      "https://images.unsplash.com/photo-1747241118490-818d37b2bdae?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A waterfall cascading through Udzungwa's dense rainforest",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A forest trekking trail through the Udzungwa Mountains",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the foothills of the Udzungwa range",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary tree on the plains below the Udzungwa Mountains",
      },
    ],
    leadParagraph:
      "Udzungwa has no roads and no game drives — this is a park explored entirely on foot, a dense block of ancient rainforest in the Eastern Arc Mountains so biologically distinct from the rest of Tanzania that biologists call it Africa's Galápagos. Species found nowhere else on Earth live in its canopy, discovered only in the last few decades.",
    bodyParagraphs: [
      "Trails range from a half-day walk to the thundering 170-metre Sanje Falls to multi-day treks deep into the forest interior. The park's isolation over millions of years has produced remarkable endemism: the Sanje mangabey and Iringa red colobus monkey exist only here and in a handful of neighbouring forest fragments, alongside newly described species of shrew, chameleon and orchid still being catalogued. For travellers who have covered Tanzania's classic savanna parks and want dense, dripping rainforest and genuine hiking instead, Udzungwa is unlike anywhere else on the safari circuit.",
    ],
    quickFacts: [
      { label: "Size", value: "1,990 km²" },
      { label: "Established", value: "1992" },
      { label: "Known for", value: "Endemic primates, no road access — walking only" },
      { label: "Getting there", value: "6–7 hr drive from Dar es Salaam via Mikumi" },
    ],
    highlights: [
      {
        title: "Sanje Falls",
        description:
          "A 170-metre waterfall reached by a half-day forest hike, one of the park's most rewarding and accessible trails.",
      },
      {
        title: "Endemic primates",
        description:
          "The Sanje mangabey and Iringa red colobus exist almost nowhere else on Earth outside this forest.",
      },
      {
        title: "Walking-only exploration",
        description:
          "No roads or vehicle tracks exist inside the park — every visit is on foot, from short walks to multi-day treks.",
      },
    ],
    wildlife: [
      "Sanje mangabey (endemic)",
      "Iringa red colobus (endemic)",
      "Blue and vervet monkey",
      "400+ recorded bird species",
      "Elephant and buffalo (rarely seen, deep forest)",
    ],
    activitiesHeading: "Activities",
    activities: [
      "Guided forest hikes to Sanje Falls",
      "Multi-day treks into the interior",
      "Primate and birding walks",
      "Botanical and endemic-species walks",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and increasingly wet.", rating: "low" },
      { month: "Feb", note: "Green season continues.", rating: "low" },
      { month: "Mar", note: "Peak rains; trails slippery.", rating: "low" },
      { month: "Apr", note: "Heaviest rains.", rating: "low" },
      { month: "May", note: "Rains ease; forest lush and waterfalls full.", rating: "good" },
      { month: "Jun", note: "Dry season begins; good hiking conditions.", rating: "good" },
      { month: "Jul", note: "Reliable dry trails.", rating: "peak" },
      { month: "Aug", note: "Excellent hiking weather.", rating: "peak" },
      { month: "Sep", note: "Dry and clear.", rating: "peak" },
      { month: "Oct", note: "Still good, dry conditions.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with building rains.", rating: "good" },
    ],
    location: { lat: -7.85, lng: 36.9, zoom: 10 },
    faqs: [
      {
        question: "Do I need to be very fit to visit Udzungwa?",
        answer:
          "The Sanje Falls day-hike suits most reasonably active visitors, but multi-day treks into the interior require good fitness and a genuine interest in hiking rather than vehicle-based safari.",
      },
      {
        question: "Can I see primates on a short visit?",
        answer:
          "Yes — even the half-day trail to Sanje Falls regularly passes troops of blue and red colobus monkey, though the rarest endemics require more time and a specialist guide.",
      },
    ],
    seoDescription:
      "Hike Udzungwa Mountains National Park with Macho Halisi — rainforest waterfalls and endemic primates found nowhere else on Earth, explored entirely on foot.",
    relatedSlugs: ["mikumi", "ruaha", "usambara"],
  },
  {
    slug: "kitulo",
    name: "Kitulo National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Southern Highlands",
    tagline: "The Serengeti of Flowers",
    heroImage:
      "https://images.unsplash.com/photo-1783099994045-7243bccf2d5b?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A green highland trail through Kitulo's flower-covered plateau",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A trekking trail across the Kitulo Plateau",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the Southern Highlands near Kitulo",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary tree on the Kitulo highland plateau",
      },
    ],
    leadParagraph:
      "Kitulo was Tanzania's first national park created not for its animals but for its flowers — a high, cool volcanic plateau in the Southern Highlands that erupts each rainy season into one of the richest wildflower displays in tropical Africa, earning it the nickname \"Serengeti of Flowers.\"",
    bodyParagraphs: [
      "Between November and April, over 350 species of plants — including more than 45 species of orchid, some found nowhere else — carpet the 2,600-metre plateau in colour, drawing botanists and hikers rather than the usual safari crowd. There are no Big Five here; instead Kitulo offers cool-climate hiking through grassland dotted with granite outcrops, rare endemic birds like the Kipengere seedeater, and a genuinely different kind of Tanzanian landscape — closer to Scottish moorland than savanna.",
    ],
    quickFacts: [
      { label: "Size", value: "412.9 km²" },
      { label: "Established", value: "2005 — Tanzania's first park created for flora" },
      { label: "Altitude", value: "~2,600 m" },
      { label: "Known for", value: "350+ plant species, 45+ orchid species" },
    ],
    highlights: [
      {
        title: "The wildflower super-bloom",
        description:
          "From November to April, over 350 plant species including 45+ orchids transform the plateau into a sea of colour.",
      },
      {
        title: "Cool-climate hiking",
        description:
          "At 2,600m, Kitulo offers a refreshingly cool, moorland-like landscape unlike anywhere else on the Tanzanian safari circuit.",
      },
      {
        title: "Rare endemic birds",
        description:
          "Home to the Kipengere seedeater and other range-restricted highland species, a draw for dedicated birders.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Guided wildflower and orchid walks",
      "Highland hiking",
      "Specialist birding",
      "Photography (peak bloom November–April)",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Peak wildflower bloom.", rating: "peak" },
      { month: "Feb", note: "Bloom continues in full colour.", rating: "peak" },
      { month: "Mar", note: "Still excellent flowering.", rating: "peak" },
      { month: "Apr", note: "Bloom tapering; still very good.", rating: "good" },
      { month: "May", note: "Flowers fading; cool and green.", rating: "good" },
      { month: "Jun", note: "Dry, cool season; fewer flowers.", rating: "low" },
      { month: "Jul", note: "Cold and dry; good hiking, little bloom.", rating: "low" },
      { month: "Aug", note: "Dry season continues.", rating: "low" },
      { month: "Sep", note: "Dry; landscape browning.", rating: "low" },
      { month: "Oct", note: "Dry season tapering.", rating: "low" },
      { month: "Nov", note: "Rains return; bloom begins.", rating: "good" },
      { month: "Dec", note: "Bloom building toward peak.", rating: "good" },
    ],
    location: { lat: -9.25, lng: 33.9167, zoom: 10 },
    faqs: [
      {
        question: "When should I visit Kitulo for the flowers?",
        answer:
          "The wildflower display peaks between January and March, during and just after the short and long rains — outside this window the plateau is a quieter, drier highland landscape.",
      },
      {
        question: "Is there wildlife to see at Kitulo?",
        answer:
          "Kitulo has no Big Five game — it was established specifically to protect its exceptional flora and highland birdlife, so it suits hikers and botanists more than classic safari-goers.",
      },
    ],
    seoDescription:
      "Explore Kitulo National Park with Macho Halisi — Tanzania's 'Serengeti of Flowers,' a cool highland plateau with over 350 wildflower and orchid species.",
    relatedSlugs: ["udzungwa", "usambara", "ruaha"],
  },
  {
    slug: "ruaha",
    name: "Ruaha National Park",
    category: "national-park",
    categoryLabel: "National Park",
    region: "Southern Circuit",
    tagline: "Tanzania's Largest Park, at a Crossroads of Wildlife",
    heroImage:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Elephants at sunset in Ruaha National Park",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1400&q=85",
        alt: "A lion pair resting in Ruaha's bush",
      },
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        alt: "A safari vehicle crossing Ruaha's open plains",
      },
      {
        url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1400&q=85",
        alt: "An elephant amid Ruaha's riverine woodland",
      },
    ],
    leadParagraph:
      "At 20,226 km², Ruaha is Tanzania's largest national park by a wide margin — bigger than the Serengeti and Ngorongoro combined — and sits at a rare biological crossroads where East African savanna species overlap with dry-country Southern African wildlife, all seen by only a fraction of the Northern Circuit's visitor numbers.",
    bodyParagraphs: [
      "The Great Ruaha River is the park's lifeline, and its retreating dry-season pools concentrate wildlife into some of Tanzania's most reliable predator viewing: Ruaha holds one of Africa's largest lion populations, alongside healthy numbers of the endangered African wild dog. Its location at the meeting point of two ecosystems brings unusual species combinations — greater and lesser kudu, sable and roan antelope graze alongside classic plains game — and elephant numbers here represent a significant share of Tanzania's entire population. Despite its scale and wildlife density, Ruaha remains genuinely uncrowded, with camps that are few, small and often exclusive-use.",
    ],
    quickFacts: [
      { label: "Size", value: "20,226 km² — Tanzania's largest national park" },
      { label: "Known for", value: "Largest elephant & one of the largest lion populations in Tanzania" },
      { label: "Getting there", value: "Scheduled fly-in from Arusha or Dar es Salaam" },
      { label: "Best paired with", value: "Southern Circuit combination with Nyerere (Selous)" },
    ],
    highlights: [
      {
        title: "Tanzania's largest national park",
        description:
          "Bigger than the Serengeti and Ngorongoro combined, yet seeing only a fraction of their visitor numbers.",
      },
      {
        title: "A meeting point of ecosystems",
        description:
          "East African savanna species overlap here with dry, Southern African specialists like greater kudu and sable antelope.",
      },
      {
        title: "One of Africa's largest lion populations",
        description:
          "The Great Ruaha River's dry-season concentrations support exceptional predator density, including significant African wild dog numbers.",
      },
      {
        title: "Tanzania's largest elephant population",
        description:
          "Ruaha holds a substantial share of the country's entire elephant population, especially along the riverine woodland.",
      },
    ],
    wildlife: [
      "Lion (one of Africa's largest populations)",
      "African wild dog",
      "Elephant (largest population of any Tanzanian park)",
      "Greater & lesser kudu, sable and roan antelope",
      "Leopard and spotted hyena",
      "Hippo and crocodile along the Great Ruaha River",
    ],
    activitiesHeading: "Safari activities",
    activities: [
      "4x4 game drives, including night drives",
      "Walking safaris with armed rangers",
      "Fly-camping in remote sectors",
      "Birding along the Great Ruaha River",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Green season begins; herds dispersed.", rating: "low" },
      { month: "Feb", note: "Lush landscape, quieter camps.", rating: "low" },
      { month: "Mar", note: "Peak rains; many camps close.", rating: "low" },
      { month: "Apr", note: "Heaviest rains.", rating: "low" },
      { month: "May", note: "Rains ease; camps reopening.", rating: "low" },
      { month: "Jun", note: "Dry season begins; game concentrates at the river.", rating: "good" },
      { month: "Jul", note: "Excellent game viewing builds.", rating: "peak" },
      { month: "Aug", note: "Peak dry season; outstanding predator action.", rating: "peak" },
      { month: "Sep", note: "Height of the dry season; superb density.", rating: "peak" },
      { month: "Oct", note: "Extreme dry season; wildlife concentrated at water.", rating: "peak" },
      { month: "Nov", note: "Short rains begin; still strong viewing.", rating: "good" },
      { month: "Dec", note: "Rains building; landscape greening.", rating: "good" },
    ],
    location: { lat: -7.65, lng: 34.5, zoom: 8 },
    faqs: [
      {
        question: "Is Ruaha bigger than the Serengeti?",
        answer:
          "Yes, considerably — at 20,226 km² Ruaha is Tanzania's largest national park, more than a third larger than the Serengeti, though it receives far fewer visitors.",
      },
      {
        question: "How does Ruaha compare to Nyerere (Selous)?",
        answer:
          "Both are Southern Circuit giants, but Ruaha is drier and known for its lion and kudu/sable mix, while Nyerere's Rufiji River adds boat safaris. Many itineraries combine the two.",
      },
    ],
    seoDescription:
      "Discover Ruaha National Park with Macho Halisi — Tanzania's largest national park, with one of Africa's biggest lion populations and uncrowded, wild game viewing.",
    relatedSlugs: ["southern-circuit", "katavi", "mikumi"],
  },
  {
    slug: "mkomazi",
    name: "Mkomazi National Park",
    category: "conservation-area",
    categoryLabel: "Conservation Area",
    region: "Northern Tanzania",
    tagline: "A Rhino & Wild Dog Sanctuary on the Kenyan Border",
    heroImage:
      "https://images.unsplash.com/photo-1544211413-16597c1a40b4?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A black rhino grazing in Mkomazi National Park",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden semi-arid plains of Mkomazi National Park",
      },
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        alt: "A safari vehicle crossing Mkomazi's dry landscape",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary acacia tree on Mkomazi's semi-arid plains",
      },
    ],
    leadParagraph:
      "Mkomazi sits on Tanzania's border with Kenya's famous Tsavo ecosystem, a semi-arid stretch of the Maasai Steppe that has become one of East Africa's most important conservation success stories — home to a fenced black rhino sanctuary and one of the region's few dedicated African wild dog breeding programmes.",
    bodyParagraphs: [
      "By the 1980s, poaching had wiped out Mkomazi's rhino and severely reduced its wild dog; a long-running conservation project has since rebuilt both populations from protected breeding sanctuaries, releasing animals gradually back into the wider ecosystem. The surrounding landscape is dry, open and dramatic — acacia scrub and rocky outcrops beneath the Pare and Usambara Mountains — and because visitor numbers remain low, Mkomazi rewards travellers with a genuine sense of frontier conservation rather than a polished safari circuit.",
    ],
    quickFacts: [
      { label: "Size", value: "3,245 km²" },
      { label: "Established", value: "1951 (reserve); national park since 2006" },
      { label: "Known for", value: "Black rhino sanctuary, wild dog breeding programme" },
      { label: "Getting there", value: "Drive from Moshi or Same, near the Usambara foothills" },
    ],
    highlights: [
      {
        title: "Black rhino sanctuary",
        description:
          "A protected breeding sanctuary has rebuilt Mkomazi's rhino population after it was wiped out by poaching in the 1980s.",
      },
      {
        title: "African wild dog breeding programme",
        description:
          "One of the region's few dedicated efforts to breed and release this endangered predator back into the wild.",
      },
      {
        title: "Dramatic semi-arid scenery",
        description:
          "Open Maasai Steppe scrub and rocky outcrops beneath the Pare and Usambara Mountains, part of the wider Tsavo ecosystem.",
      },
    ],
    wildlife: [
      "Black rhino (fenced sanctuary)",
      "African wild dog (breeding programme)",
      "Oryx, gerenuk and lesser kudu (dry-country specialists)",
      "Elephant and giraffe",
    ],
    activitiesHeading: "Activities",
    activities: [
      "Game drives across the Maasai Steppe",
      "Rhino sanctuary visits",
      "Birding in the acacia scrub",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and dry.", rating: "good" },
      { month: "Feb", note: "Dry spell continues.", rating: "good" },
      { month: "Mar", note: "Rains begin.", rating: "low" },
      { month: "Apr", note: "Long rains; limited access.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season begins.", rating: "good" },
      { month: "Jul", note: "Reliable dry conditions.", rating: "peak" },
      { month: "Aug", note: "Clear and dry.", rating: "peak" },
      { month: "Sep", note: "Excellent visibility.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -3.9833, lng: 38.0, zoom: 9 },
    faqs: [
      {
        question: "Can visitors see the rhino sanctuary at Mkomazi?",
        answer:
          "Yes — guided visits to the protected sanctuary area are possible and are one of the park's main draws, alongside its wild dog conservation work.",
      },
      {
        question: "Is Mkomazi part of a bigger ecosystem?",
        answer:
          "Yes — it borders Kenya's Tsavo West National Park, forming one contiguous cross-border wilderness even though the two are managed separately.",
      },
    ],
    seoDescription:
      "Visit Mkomazi National Park with Macho Halisi — a black rhino sanctuary and wild dog breeding programme on the dramatic Maasai Steppe near Kenya's Tsavo.",
    relatedSlugs: ["usambara", "arusha", "kilimanjaro"],
  },
  {
    slug: "meru",
    name: "Mount Meru",
    category: "mountain",
    categoryLabel: "Mountain",
    region: "Arusha Region",
    tagline: "Africa's Fifth-Highest Peak & Kilimanjaro's Best Acclimatiser",
    heroImage:
      "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A trekker on the high-altitude trail of Mount Meru",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the foothills of Mount Meru",
      },
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=85",
        alt: "Sunrise light over the plains near Mount Meru",
      },
      {
        url: "https://images.unsplash.com/photo-1549854233-ca0baec6fa74?auto=format&fit=crop&w=1400&q=85",
        alt: "A giraffe on Mount Meru's lower slopes",
      },
    ],
    leadParagraph:
      "Mount Meru is Africa's fifth-highest peak and, in the shadow of its far more famous neighbour Kilimanjaro, one of the continent's most underrated climbs — a dramatic, horseshoe-shaped volcanic peak whose crater rim trail delivers some of East Africa's most spectacular ridge walking, with views across to Kilimanjaro itself on a clear morning.",
    bodyParagraphs: [
      "Unlike Kilimanjaro, Meru's lower slopes pass through genuine wildlife habitat inside Arusha National Park, so climbs here begin with an armed ranger escort past giraffe, buffalo and colobus monkey before the trail climbs into montane forest, heath and finally a stark volcanic summit ridge. The ascent typically takes 3–4 days via the Momella Route, culminating in a pre-dawn push along a narrow, exposed rim to Socialist Peak at 4,566m — technically undemanding but genuinely thrilling, and widely regarded as the best possible altitude preparation for a Kilimanjaro climb.",
    ],
    quickFacts: [
      { label: "Summit", value: "Socialist Peak, 4,566 m" },
      { label: "Type", value: "Active stratovolcano" },
      { label: "Typical duration", value: "3–4 days" },
      { label: "Rank", value: "Africa's 5th-highest peak" },
      { label: "Getting there", value: "Via Arusha National Park's Momella Gate" },
    ],
    highlights: [
      {
        title: "A dramatic crater rim trail",
        description:
          "The final push to the summit follows a narrow, exposed ridge around a horseshoe-shaped ash cone — one of the most thrilling summit trails in East Africa.",
      },
      {
        title: "Wildlife on the lower slopes",
        description:
          "Climbs begin with an armed ranger escort through genuine game habitat, passing giraffe and buffalo before the trail climbs into forest.",
      },
      {
        title: "The ideal Kilimanjaro warm-up",
        description:
          "Widely used as acclimatisation training before a Kilimanjaro attempt, with views across to Kilimanjaro from the summit on clear days.",
      },
    ],
    activitiesHeading: "Climbing routes",
    activities: [
      "Momella Route (3–4 days) — the standard ascent",
      "Day hikes on the lower forested slopes",
      "Acclimatisation climbs paired with a Kilimanjaro itinerary",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Dry and clear; excellent climbing conditions.", rating: "peak" },
      { month: "Feb", note: "Stable weather continues.", rating: "peak" },
      { month: "Mar", note: "Rains begin; conditions deteriorate.", rating: "low" },
      { month: "Apr", note: "Long rains; not recommended.", rating: "low" },
      { month: "May", note: "Rains easing late month.", rating: "low" },
      { month: "Jun", note: "Dry season begins; cold but clear.", rating: "good" },
      { month: "Jul", note: "Peak climbing season.", rating: "peak" },
      { month: "Aug", note: "Excellent visibility.", rating: "peak" },
      { month: "Sep", note: "Dry, stable conditions.", rating: "peak" },
      { month: "Oct", note: "Still favourable, quieter trails.", rating: "good" },
      { month: "Nov", note: "Short rains arrive.", rating: "low" },
      { month: "Dec", note: "Short dry window before year-end crowds.", rating: "good" },
    ],
    location: { lat: -3.2333, lng: 36.75, zoom: 11 },
    faqs: [
      {
        question: "Is Mount Meru a good warm-up for Kilimanjaro?",
        answer:
          "Yes — it's widely considered the single best acclimatisation climb before Kilimanjaro, reaching high altitude over a shorter, more affordable trip while genuinely improving summit odds on Kilimanjaro afterward.",
      },
      {
        question: "Is Mount Meru dangerous to climb?",
        answer:
          "It's technically straightforward — no ropes or climbing gear needed — but the exposed summit ridge requires a steady head for heights, and an armed ranger accompanies every climb due to wildlife on the lower slopes.",
      },
    ],
    seoDescription:
      "Climb Mount Meru with Macho Halisi — Africa's fifth-highest peak and the ideal Kilimanjaro acclimatisation trek, with wildlife on the lower slopes.",
    relatedSlugs: ["kilimanjaro", "arusha", "ngorongoro"],
  },
  {
    slug: "usambara",
    name: "Usambara Mountains",
    category: "mountain",
    categoryLabel: "Mountain",
    region: "Northeastern Tanzania",
    tagline: "Cool Highland Forest, Waterfalls & the Birthplace of African Violets",
    heroImage:
      "https://images.unsplash.com/photo-1747241118490-818d37b2bdae?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A waterfall in the forested Usambara Mountains",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A hiking trail through the Usambara highlands",
      },
      {
        url: "https://images.unsplash.com/photo-1783099994045-7243bccf2d5b?auto=format&fit=crop&w=1400&q=85",
        alt: "A green hillside trail in the Usambara Mountains",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the Usambara foothills",
      },
    ],
    leadParagraph:
      "A cool, forested escape from the safari heat, the Usambara Mountains in northeastern Tanzania are part of the ancient Eastern Arc range — older than the Alps or the Himalayas — and hold such concentrated biodiversity that the African violet, one of the world's most popular houseplants, was first discovered growing wild here in the 1890s.",
    bodyParagraphs: [
      "The hill town of Lushoto, a former German colonial retreat, is the gateway to a network of walking trails through terraced farmland, cloud forest and viewpoints like Irente, where the escarpment drops away to reveal the plains far below. Waterfalls, small Sambaa villages and a genuinely different pace from the safari circuit make the Usambaras a rewarding two- or three-day detour — cool nights, mist-wrapped mornings and forest walks are the draw here, not wildlife.",
    ],
    quickFacts: [
      { label: "Range", value: "Eastern Arc Mountains" },
      { label: "Gateway town", value: "Lushoto" },
      { label: "Altitude", value: "~1,200 – 2,300 m" },
      { label: "Known for", value: "Endemic flora, birthplace of the African violet" },
      { label: "Getting there", value: "3–4 hr drive from Moshi or Tanga" },
    ],
    highlights: [
      {
        title: "Birthplace of the African violet",
        description:
          "The genus Saintpaulia, now a houseplant found worldwide, was first discovered growing wild in these forests in the 1890s.",
      },
      {
        title: "Irente Viewpoint",
        description:
          "A dramatic escarpment edge near Lushoto with views stretching across the plains far below.",
      },
      {
        title: "Ancient Eastern Arc forest",
        description:
          "Older than the Himalayas, this isolated range holds exceptional levels of plant and amphibian endemism.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Guided village and forest walking trails",
      "Waterfall hikes",
      "Birding and botanical walks",
      "Visits to Irente Viewpoint",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and mostly dry.", rating: "good" },
      { month: "Feb", note: "Dry spell continues.", rating: "good" },
      { month: "Mar", note: "Rains begin; lush and green.", rating: "low" },
      { month: "Apr", note: "Long rains; trails muddy.", rating: "low" },
      { month: "May", note: "Rains easing; waterfalls full.", rating: "good" },
      { month: "Jun", note: "Dry season begins; cool and clear.", rating: "good" },
      { month: "Jul", note: "Reliable hiking conditions.", rating: "peak" },
      { month: "Aug", note: "Cool, dry and clear.", rating: "peak" },
      { month: "Sep", note: "Excellent hiking weather.", rating: "peak" },
      { month: "Oct", note: "Still good, dry conditions.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with building rains.", rating: "good" },
    ],
    location: { lat: -4.7833, lng: 38.35, zoom: 10 },
    faqs: [
      {
        question: "Is the Usambara Mountains trip good for families?",
        answer:
          "Yes — the walking is gentle compared to Kilimanjaro or Meru, trails pass through villages and farmland, and the cool climate is a welcome break from the heat of the safari circuit.",
      },
      {
        question: "Can I see wildlife in the Usambaras?",
        answer:
          "The draw here is flora, birdlife and scenery rather than big game — chameleons, endemic amphibians and forest birds are the highlights, not lion or elephant.",
      },
    ],
    seoDescription:
      "Explore the Usambara Mountains with Macho Halisi — cool cloud forest hiking, waterfalls and the birthplace of the African violet in northeastern Tanzania.",
    relatedSlugs: ["mkomazi", "udzungwa", "kilimanjaro"],
  },
  {
    slug: "pemba",
    name: "Pemba Island",
    category: "island",
    categoryLabel: "Island",
    region: "Zanzibar Archipelago",
    tagline: "The Green Island — Tanzania's Best-Kept Diving Secret",
    heroImage:
      "https://images.unsplash.com/photo-1664552348837-367b555cfaa9?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "A snorkeller over the coral reefs of Pemba Island",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
        alt: "A tropical seaside terrace overlooking Pemba's coastline",
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
        alt: "A private beachfront resort pool at night",
      },
      {
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85",
        alt: "Aerial view of a coastal resort among turquoise waters",
      },
    ],
    leadParagraph:
      "Quieter, greener and far less developed than its famous neighbour Unguja, Pemba Island is the Zanzibar Archipelago's best-kept secret — known locally as \"the Green Island\" for its dense clove plantations, and internationally among divers for some of the finest, least-crowded reef diving in the Indian Ocean.",
    bodyParagraphs: [
      "Steep coral walls plunge into the Pemba Channel just offshore, creating dramatic drop-off diving with strong biodiversity and minimal crowds compared to dive sites elsewhere in East Africa. On land, Pemba was once the world's largest producer of cloves, and its rolling hills are still thick with plantations, alongside mangrove creeks and the pristine, uninhabited Misali Island marine reserve just off the west coast. With very little large-scale tourism development, Pemba suits travellers who have already experienced Zanzibar's main island and want something more traditional and untouched.",
    ],
    quickFacts: [
      { label: "Size", value: "~980 km²" },
      { label: "Known for", value: "World-class reef diving, clove plantations" },
      { label: "Marine reserve", value: "Misali Island Conservation Area" },
      { label: "Getting there", value: "Short flight or ferry from Zanzibar (Unguja)" },
    ],
    highlights: [
      {
        title: "World-class drop-off diving",
        description:
          "Steep coral walls in the Pemba Channel offer some of the Indian Ocean's best diving, with far fewer visitors than typical dive destinations.",
      },
      {
        title: "Misali Island marine reserve",
        description:
          "A pristine, uninhabited island reserve just offshore, protected for its coral reefs and nesting sea turtles.",
      },
      {
        title: "Historic clove plantations",
        description:
          "Once the world's largest clove producer, Pemba's hills are still fragrant with working plantations open to visitors.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Scuba diving and snorkelling",
      "Clove plantation tours",
      "Boat trips to Misali Island",
      "Traditional dhow sailing",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Hot and dry; excellent diving visibility.", rating: "peak" },
      { month: "Feb", note: "Peak dry season continues.", rating: "peak" },
      { month: "Mar", note: "Long rains begin.", rating: "low" },
      { month: "Apr", note: "Heaviest rains; diving disrupted.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season returns.", rating: "good" },
      { month: "Jul", note: "Good diving conditions.", rating: "peak" },
      { month: "Aug", note: "Dry and clear.", rating: "peak" },
      { month: "Sep", note: "Excellent visibility for diving.", rating: "peak" },
      { month: "Oct", note: "Warm and dry, shoulder season.", rating: "good" },
      { month: "Nov", note: "Short rains bring brief showers.", rating: "good" },
      { month: "Dec", note: "Hot, dry and pleasant.", rating: "peak" },
    ],
    location: { lat: -5.1667, lng: 39.75, zoom: 10 },
    faqs: [
      {
        question: "How is Pemba different from Zanzibar's main island?",
        answer:
          "Pemba is far less developed and less visited, with a slower pace, traditional clove-farming culture, and diving many consider superior to Unguja's — at the cost of fewer resorts and flight options.",
      },
      {
        question: "Do I need diving experience to visit Pemba?",
        answer:
          "No — snorkelling and beginner dive courses are widely available, though experienced divers get the most from Pemba's dramatic wall dives.",
      },
    ],
    seoDescription:
      "Discover Pemba Island with Macho Halisi — world-class reef diving, historic clove plantations and the quiet, traditional side of the Zanzibar Archipelago.",
    relatedSlugs: ["zanzibar", "mafia", "bagamoyo"],
  },
  {
    slug: "mafia",
    name: "Mafia Island",
    category: "island",
    categoryLabel: "Island",
    region: "Indian Ocean Coast",
    tagline: "Swim with Whale Sharks in Tanzania's First Marine Park",
    heroImage:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Aerial view of Mafia Island's turquoise marine park waters",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1664552348837-367b555cfaa9?auto=format&fit=crop&w=1400&q=85",
        alt: "A snorkeller over Mafia Island's coral reefs",
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
        alt: "A private beachfront resort pool at night",
      },
      {
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
        alt: "A tropical seaside terrace overlooking the ocean",
      },
    ],
    leadParagraph:
      "South of Zanzibar and largely bypassed by mass tourism, Mafia Island protects Tanzania's first marine park — established in 1995 — and one of the most reliable places on Earth to snorkel alongside whale sharks, the world's largest fish, in their natural feeding grounds.",
    bodyParagraphs: [
      "Between October and March, plankton blooms draw whale sharks into the shallow waters off Kilindoni, and licensed operators run closely regulated snorkel encounters that prioritise the animals' welfare over crowds. Beyond the whale sharks, Chole Bay's coral gardens rank among the healthiest in East Africa, supporting turtles, dolphins and over 400 fish species, while Mafia's slow pace, historic dhow-building traditions and near-total absence of large resorts make it feel like Zanzibar did decades ago.",
    ],
    quickFacts: [
      { label: "Marine park", value: "Established 1995 — Tanzania's first" },
      { label: "Known for", value: "Whale shark snorkelling (Oct–Mar)" },
      { label: "Getting there", value: "Short flight from Dar es Salaam or Zanzibar" },
    ],
    highlights: [
      {
        title: "Whale shark encounters",
        description:
          "Between October and March, plankton blooms reliably draw whale sharks into shallow water for closely regulated snorkelling encounters.",
      },
      {
        title: "Chole Bay's coral gardens",
        description:
          "Among the healthiest reef systems in East Africa, protected within Tanzania's first marine park.",
      },
      {
        title: "Untouched, unhurried pace",
        description:
          "With very little large-scale development, Mafia retains a traditional, slow rhythm increasingly rare on the East African coast.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Whale shark snorkelling (seasonal)",
      "Scuba diving in Chole Bay",
      "Sea turtle nesting site visits",
      "Traditional dhow sailing and village visits",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Hot and dry; whale shark season continues.", rating: "peak" },
      { month: "Feb", note: "Excellent whale shark encounters.", rating: "peak" },
      { month: "Mar", note: "Last of the whale shark season; rains begin.", rating: "good" },
      { month: "Apr", note: "Heaviest rains; low season.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season returns.", rating: "good" },
      { month: "Jul", note: "Good diving conditions, no whale sharks yet.", rating: "good" },
      { month: "Aug", note: "Dry and clear.", rating: "good" },
      { month: "Sep", note: "Excellent visibility for diving.", rating: "good" },
      { month: "Oct", note: "Whale shark season begins.", rating: "peak" },
      { month: "Nov", note: "Strong whale shark sightings.", rating: "peak" },
      { month: "Dec", note: "Whale shark season continues.", rating: "peak" },
    ],
    location: { lat: -7.9167, lng: 39.75, zoom: 10 },
    faqs: [
      {
        question: "When is the best time to see whale sharks at Mafia?",
        answer:
          "October through March, when plankton blooms draw them into shallow water off Kilindoni — sightings are seasonal and never guaranteed, but this is one of the most reliable locations worldwide.",
      },
      {
        question: "Is Mafia Island good for a quiet beach holiday?",
        answer:
          "Yes — with very few large resorts and low visitor numbers year-round, Mafia suits travellers seeking an unhurried, traditional island experience rather than a resort-style holiday.",
      },
    ],
    seoDescription:
      "Swim with whale sharks at Mafia Island with Macho Halisi — Tanzania's first marine park, pristine coral reefs and an unhurried, traditional island escape.",
    relatedSlugs: ["zanzibar", "pemba", "saadani"],
  },
  {
    slug: "lake-natron",
    name: "Lake Natron & Ol Doinyo Lengai",
    category: "natural-wonder",
    categoryLabel: "Natural Wonder",
    region: "Northern Rift Valley",
    tagline: "A Blood-Red Soda Lake Beneath an Active Volcano",
    heroImage:
      "https://images.unsplash.com/photo-1559617350-6eee0f8b702a?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Flamingos wading in the pink waters of Lake Natron",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1758881534639-709146239bd1?auto=format&fit=crop&w=1400&q=85",
        alt: "The arid landscape surrounding Lake Natron and Ol Doinyo Lengai",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the plains near Lake Natron",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary tree in the arid country near Lake Natron",
      },
    ],
    leadParagraph:
      "Few landscapes on Earth are as alien as Lake Natron — a shallow, caustic soda lake in the far north of Tanzania's Rift Valley that turns blood-red with salt-loving microorganisms, hot enough in places to scald bare skin, and yet the single most important breeding site on the planet for East Africa's 2.5 million lesser flamingos, who nest safely on its crust precisely because almost nothing else can survive there.",
    bodyParagraphs: [
      "Rising directly above the lake is Ol Doinyo Lengai — \"Mountain of God\" to the Maasai — an active volcano and the only one on Earth known to erupt natrocarbonatite lava, a rare, unusually cool black lava that turns white within days of exposure to air. Fit, well-prepared trekkers can climb through the night to reach the crater rim by sunrise, a demanding but extraordinary ascent. This is among the most remote, least-visited corners of Tanzania's northern safari zone — no crowds, no lodges beyond a handful of simple camps, just flamingos, volcanic rock and Maasai settlements largely unchanged for generations.",
    ],
    quickFacts: [
      { label: "Lake area", value: "~1,040 km² (seasonal)" },
      { label: "Volcano", value: "Ol Doinyo Lengai, 2,962 m" },
      { label: "Known for", value: "2.5 million breeding lesser flamingos" },
      { label: "Getting there", value: "3–4 hr drive from Ngorongoro or Lake Manyara" },
    ],
    highlights: [
      {
        title: "The world's key flamingo breeding site",
        description:
          "Lake Natron's caustic conditions keep predators away, making it the primary breeding ground for East Africa's entire lesser flamingo population.",
      },
      {
        title: "Ol Doinyo Lengai's rare lava",
        description:
          "The only volcano on Earth known to erupt natrocarbonatite lava — unusually cool, black lava that turns white within days.",
      },
      {
        title: "An overnight summit trek",
        description:
          "A demanding night climb to the crater rim rewards fit trekkers with sunrise views over the Rift Valley and Lake Natron below.",
      },
      {
        title: "True Rift Valley remoteness",
        description:
          "One of northern Tanzania's least-visited corners, with Maasai communities and landscapes little changed for generations.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Overnight trek to Ol Doinyo Lengai's crater rim",
      "Flamingo viewing from the lakeshore",
      "Maasai village visits",
      "Waterfall hikes in the nearby Engare Sero gorge",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Dry and hot; good flamingo numbers.", rating: "good" },
      { month: "Feb", note: "Peak flamingo breeding season.", rating: "peak" },
      { month: "Mar", note: "Rains begin; access can be difficult.", rating: "low" },
      { month: "Apr", note: "Long rains; roads often impassable.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season begins.", rating: "good" },
      { month: "Jul", note: "Good conditions for the Lengai climb.", rating: "peak" },
      { month: "Aug", note: "Dry, clear climbing conditions.", rating: "peak" },
      { month: "Sep", note: "Excellent visibility.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -2.4167, lng: 35.9167, zoom: 9 },
    faqs: [
      {
        question: "Is it safe to swim in Lake Natron?",
        answer:
          "No — the water is highly caustic (pH up to 10.5) and can be scalding hot in places. Visitors view the lake from the shore rather than entering it; nearby freshwater springs and waterfalls are used for swimming instead.",
      },
      {
        question: "How hard is the Ol Doinyo Lengai climb?",
        answer:
          "It's a genuinely demanding overnight trek on loose volcanic scree, typically starting at midnight to reach the rim by sunrise — good fitness and a head for steep, unstable terrain are essential.",
      },
    ],
    seoDescription:
      "Visit Lake Natron and climb Ol Doinyo Lengai with Macho Halisi — a blood-red soda lake, millions of flamingos and Africa's most unusual active volcano.",
    relatedSlugs: ["ngorongoro", "serengeti", "olduvai-gorge"],
  },
  {
    slug: "lake-victoria",
    name: "Lake Victoria & Mwanza",
    category: "natural-wonder",
    categoryLabel: "Natural Wonder",
    region: "Lake Victoria Basin",
    tagline: "Africa's Largest Lake & the Rock City of Mwanza",
    heroImage:
      "https://images.unsplash.com/photo-1736091852588-668e092d1e9f?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Granite boulders balanced on the shore of Lake Victoria",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1740824570732-f2a2d2557dd5?auto=format&fit=crop&w=1400&q=85",
        alt: "Traditional fishing boats on the shore of Lake Victoria",
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
        alt: "A lakeside lodge terrace overlooking Lake Victoria",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the plains near Lake Victoria",
      },
    ],
    leadParagraph:
      "Lake Victoria is Africa's largest lake by surface area and the source of the White Nile, and its Tanzanian shore is anchored by Mwanza — the country's second city, built around massive balancing granite boulders that have earned it the nickname \"Rock City.\"",
    bodyParagraphs: [
      "Bismarck Rock, an improbably stacked formation rising straight from the lakeshore, is Mwanza's signature landmark and best seen at sunset from a boat on the water. The lake itself is a place of striking contrasts: it holds the world's largest freshwater fishery, built on Nile perch — a species introduced in the 1950s that transformed the local economy but devastated hundreds of endemic cichlid fish species found nowhere else, one of the most studied cases of ecological disruption anywhere on Earth. For travellers, Mwanza serves mainly as a practical and scenic gateway — to the Serengeti's less-visited western corridor, and by boat to Rubondo Island's forested wildlife sanctuary further out on the lake.",
    ],
    quickFacts: [
      { label: "Lake area", value: "~68,800 km² — Africa's largest lake" },
      { label: "Gateway city", value: "Mwanza" },
      { label: "Known for", value: "Bismarck Rock, Nile perch fishery" },
      { label: "Getting there", value: "Flight to Mwanza, or drive via the Serengeti's western corridor" },
    ],
    highlights: [
      {
        title: "Bismarck Rock",
        description:
          "An iconic formation of massive balancing granite boulders rising from the lakeshore, best seen by boat at sunset.",
      },
      {
        title: "Africa's largest lake",
        description:
          "Source of the White Nile and the world's largest tropical lake, shared by Tanzania, Uganda and Kenya.",
      },
      {
        title: "Gateway to the western Serengeti",
        description:
          "Mwanza is the practical jumping-off point for the Serengeti's quieter western corridor and for boat access to Rubondo Island.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Sunset boat trips to Bismarck Rock",
      "Sukuma cultural and museum visits",
      "Gateway stopover for western Serengeti or Rubondo Island itineraries",
      "Local fish market and lakeside city walks",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Warm and mostly dry.", rating: "good" },
      { month: "Feb", note: "Dry spell continues.", rating: "good" },
      { month: "Mar", note: "Rains begin.", rating: "low" },
      { month: "Apr", note: "Long rains.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season begins.", rating: "good" },
      { month: "Jul", note: "Pleasant, dry conditions.", rating: "good" },
      { month: "Aug", note: "Dry and clear.", rating: "good" },
      { month: "Sep", note: "Excellent conditions continue.", rating: "good" },
      { month: "Oct", note: "Still good, dry conditions.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -2.5164, lng: 32.9, zoom: 11 },
    faqs: [
      {
        question: "Is Mwanza worth visiting on its own?",
        answer:
          "It's primarily a practical and scenic gateway rather than a standalone destination — most travellers pass through en route to the western Serengeti or Rubondo Island, pausing for Bismarck Rock and the lakeside city.",
      },
      {
        question: "Can I visit Rubondo Island from Mwanza?",
        answer:
          "Yes — Mwanza is the main gateway for both flights and boat transfers to Rubondo Island National Park further out on Lake Victoria.",
      },
    ],
    seoDescription:
      "Explore Lake Victoria and Mwanza with Macho Halisi — Africa's largest lake, the iconic Bismarck Rock, and the gateway to the western Serengeti and Rubondo Island.",
    relatedSlugs: ["rubondo", "serengeti", "lake-tanganyika"],
  },
  {
    slug: "lake-tanganyika",
    name: "Lake Tanganyika & Kigoma",
    category: "natural-wonder",
    categoryLabel: "Natural Wonder",
    region: "Western Tanzania",
    tagline: "The World's Longest Freshwater Lake & a Historic Meeting Point",
    heroImage:
      "https://images.unsplash.com/photo-1740824570732-f2a2d2557dd5?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Traditional fishing boats on the shore of Lake Tanganyika",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1736091852588-668e092d1e9f?auto=format&fit=crop&w=1400&q=85",
        alt: "Granite rocks on the shore of Lake Tanganyika",
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
        alt: "A lakeside lodge terrace on Lake Tanganyika",
      },
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1400&q=85",
        alt: "A trail through the mountains above Lake Tanganyika",
      },
    ],
    leadParagraph:
      "The world's longest freshwater lake and its second-deepest, Lake Tanganyika stretches along Tanzania's entire western border, holding roughly a sixth of all the fresh water on Earth's surface in astonishingly clear, cichlid-filled depths. The lakeside town of Kigoma is both the practical gateway to Mahale and Gombe's chimpanzee treks and a place of genuine historical weight in its own right.",
    bodyParagraphs: [
      "A few kilometres south of Kigoma lies Ujiji, the harbour town where, in 1871, the journalist Henry Morton Stanley found the long-missing explorer David Livingstone and reportedly greeted him with the now-famous words \"Dr. Livingstone, I presume?\" — a meeting commemorated today at a small museum and monument near the original mango tree. Beyond its history, Tanganyika's clear water and hundreds of vividly coloured, mostly endemic cichlid fish species make it a superb — and still largely undiscovered — snorkelling destination, best combined with a chimpanzee trek at Mahale or Gombe further down the shore.",
    ],
    quickFacts: [
      { label: "Length", value: "~673 km — the world's longest freshwater lake" },
      { label: "Depth", value: "1,470 m — the world's second-deepest lake" },
      { label: "Known for", value: "Endemic cichlid fish, the Stanley–Livingstone meeting site" },
      { label: "Getting there", value: "Flight to Kigoma from Arusha or Dar es Salaam" },
    ],
    highlights: [
      {
        title: "The Stanley–Livingstone meeting site",
        description:
          "At Ujiji, near Kigoma, a monument marks the spot of the famous 1871 encounter between the two explorers.",
      },
      {
        title: "Exceptional freshwater clarity",
        description:
          "Among the clearest lake water in the world, supporting hundreds of endemic, brilliantly coloured cichlid fish.",
      },
      {
        title: "Gateway to Mahale & Gombe",
        description:
          "Kigoma is the practical starting point for boat transfers to both of Tanzania's premier chimpanzee-trekking parks.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Snorkelling among endemic cichlid fish",
      "Ujiji historic site and museum visit",
      "Kigoma old town and market walks",
      "Boat transfers onward to Mahale or Gombe",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Wet season; lush and quiet.", rating: "low" },
      { month: "Feb", note: "Rains continue.", rating: "low" },
      { month: "Mar", note: "Peak rains.", rating: "low" },
      { month: "Apr", note: "Heaviest rains.", rating: "low" },
      { month: "May", note: "Rains ease.", rating: "low" },
      { month: "Jun", note: "Dry season begins.", rating: "good" },
      { month: "Jul", note: "Good conditions for lake activities.", rating: "peak" },
      { month: "Aug", note: "Dry and clear.", rating: "peak" },
      { month: "Sep", note: "Excellent visibility for snorkelling.", rating: "peak" },
      { month: "Oct", note: "Still good, dry conditions.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with building rains.", rating: "good" },
    ],
    location: { lat: -4.8767, lng: 29.6267, zoom: 10 },
    faqs: [
      {
        question: "What is the historical significance of Ujiji?",
        answer:
          "Ujiji, near Kigoma, is where journalist Henry Morton Stanley found the explorer David Livingstone in 1871 after a long search — one of the most famous meetings in African exploration history, marked today by a small museum.",
      },
      {
        question: "Can I combine Lake Tanganyika with chimpanzee trekking?",
        answer:
          "Yes — Kigoma is the standard gateway for both Mahale Mountains and Gombe Stream, so a Lake Tanganyika visit is usually paired with one or both parks.",
      },
    ],
    seoDescription:
      "Discover Lake Tanganyika and Kigoma with Macho Halisi — the world's longest freshwater lake, the historic Stanley-Livingstone meeting site, and gateway to chimpanzee trekking.",
    relatedSlugs: ["mahale", "gombe", "katavi"],
  },
  {
    slug: "bagamoyo",
    name: "Bagamoyo",
    category: "historic-site",
    categoryLabel: "Historic Site",
    region: "Coastal Tanzania",
    tagline: "A Historic Swahili Port at the Heart of East African History",
    heroImage:
      "https://images.unsplash.com/photo-1771787603786-c7b212b9a198?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "Historic stone ruins along the coast at Bagamoyo",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1400&q=85",
        alt: "A tropical seaside terrace overlooking the ocean near Bagamoyo",
      },
      {
        url: "https://images.unsplash.com/photo-1740824570732-f2a2d2557dd5?auto=format&fit=crop&w=1400&q=85",
        alt: "Traditional fishing boats in Bagamoyo's historic harbour",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the coastal plains near Bagamoyo",
      },
    ],
    leadParagraph:
      "An hour's drive north of Dar es Salaam, Bagamoyo carries more historical weight than almost anywhere else on the Tanzanian coast — a former capital of German East Africa and, before that, one of the Indian Ocean's most significant 19th-century ports for the ivory and slave trade, a legacy still visible in its weathered coral-stone architecture today.",
    bodyParagraphs: [
      "The town's name is widely said to derive from the Swahili \"bwaga moyo\" — \"lay down your heart\" — reflecting the grief of enslaved people held here before being shipped onward, a sobering history documented at the Old Fort (Boma) and the nearby Caravan-Serai. A few kilometres south, the Kaole Ruins preserve the remains of a 13th–15th century Swahili settlement, including one of the oldest mosques on the East African coast. Bagamoyo is also home to a respected arts college known for traditional dance, drumming and sculpture, making it a rewarding half or full-day cultural detour for travellers based in Dar es Salaam or en route to Saadani.",
    ],
    quickFacts: [
      { label: "Founded", value: "c. 18th century; German East Africa capital 1888–1891" },
      { label: "UNESCO status", value: "On the World Heritage Tentative List" },
      { label: "Known for", value: "Slave trade history, coral-stone architecture, arts college" },
      { label: "Getting there", value: "1 hr drive from Dar es Salaam" },
    ],
    highlights: [
      {
        title: "The Old Fort (Boma)",
        description:
          "A 19th-century coral-stone fortification that once controlled the town's port, now open to visitors and central to Bagamoyo's preserved old quarter.",
      },
      {
        title: "Kaole Ruins",
        description:
          "The remains of a 13th–15th century Swahili settlement, including one of the oldest mosques on the East African coast.",
      },
      {
        title: "A weighty slave-trade history",
        description:
          "Once one of East Africa's largest slave and ivory ports, with sites and museums that document this history directly.",
      },
      {
        title: "A living arts tradition",
        description:
          "Bagamoyo's College of Arts keeps traditional Swahili dance, drumming and sculpture alive for visitors and students alike.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Old Fort and old town walking tours",
      "Kaole Ruins visit",
      "Bagamoyo College of Arts performances",
      "Beach time on the town's quieter shoreline",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Hot and dry; good for walking tours.", rating: "good" },
      { month: "Feb", note: "Dry spell continues.", rating: "good" },
      { month: "Mar", note: "Rains begin.", rating: "low" },
      { month: "Apr", note: "Heaviest rains.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season returns.", rating: "good" },
      { month: "Jul", note: "Pleasant, dry conditions.", rating: "good" },
      { month: "Aug", note: "Dry and comfortable.", rating: "good" },
      { month: "Sep", note: "Dry conditions continue.", rating: "good" },
      { month: "Oct", note: "Warm and dry.", rating: "good" },
      { month: "Nov", note: "Short rains bring brief showers.", rating: "good" },
      { month: "Dec", note: "Hot and dry.", rating: "good" },
    ],
    location: { lat: -6.4333, lng: 38.9, zoom: 12 },
    faqs: [
      {
        question: "Is Bagamoyo worth a day trip from Dar es Salaam?",
        answer:
          "Yes — it's about an hour's drive and combines significant history (the Old Fort, Kaole Ruins) with a quieter stretch of coastline, easily filling a half or full day.",
      },
      {
        question: "Can Bagamoyo be combined with Saadani National Park?",
        answer:
          "Yes — the two sit on the same stretch of coast north of Dar es Salaam and are commonly combined into one itinerary covering history and a beach-safari park together.",
      },
    ],
    seoDescription:
      "Visit historic Bagamoyo with Macho Halisi — a former capital of German East Africa and 19th-century Swahili trading port, an hour from Dar es Salaam.",
    relatedSlugs: ["saadani", "zanzibar", "olduvai-gorge"],
  },
  {
    slug: "olduvai-gorge",
    name: "Olduvai Gorge & Oldupai Museum",
    category: "historic-site",
    categoryLabel: "Historic Site",
    region: "Ngorongoro Conservation Area",
    tagline: "The Cradle of Mankind",
    heroImage:
      "https://images.unsplash.com/photo-1758881534639-709146239bd1?auto=format&fit=crop&w=2200&q=85",
    heroImageAlt: "The arid Rift Valley landscape surrounding Olduvai Gorge",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1616398534527-312eba971979?auto=format&fit=crop&w=1400&q=85",
        alt: "A dirt road crossing the plains near Olduvai Gorge",
      },
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1400&q=85",
        alt: "Golden light over the plains near Olduvai Gorge",
      },
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85",
        alt: "A solitary tree on the plains near Olduvai Gorge",
      },
    ],
    leadParagraph:
      "A 48-kilometre ravine cut into the floor of the Great Rift Valley, Olduvai Gorge (more accurately Oldupai, after the Maasai word for the wild sisal growing there) is one of the most important palaeoanthropological sites on Earth — the place where discoveries by Louis and Mary Leakey rewrote the story of human origins and confirmed Africa as the cradle of humankind.",
    bodyParagraphs: [
      "In 1959, Mary Leakey uncovered the 1.75-million-year-old skull of Paranthropus boisei — nicknamed \"Nutcracker Man\" for its massive jaw — followed by finds of Homo habilis, among the earliest known members of our own genus. The gorge's exposed, stratified walls make the passage of nearly two million years of geological and evolutionary history visible in a single glance, explained today at the on-site Oldupai Museum. A short drive away at Laetoli, Mary Leakey's 1976 discovery of 3.6-million-year-old hominin footprints — preserved in solidified volcanic ash — remains one of the most direct physical traces of early human ancestors walking upright ever found. Most visitors stop here for an hour or two en route between Ngorongoro and the Serengeti, but for anyone interested in human origins, it's a genuinely moving detour.",
    ],
    quickFacts: [
      { label: "Length", value: "~48 km gorge" },
      { label: "Key discovery", value: "Paranthropus boisei, 1959 (Louis & Mary Leakey)" },
      { label: "Nearby site", value: "Laetoli — 3.6-million-year-old hominin footprints" },
      { label: "Getting there", value: "En route between Ngorongoro Crater and the Serengeti" },
    ],
    highlights: [
      {
        title: "The 1959 \"Nutcracker Man\" discovery",
        description:
          "Mary Leakey's find of a 1.75-million-year-old Paranthropus boisei skull here transformed scientific understanding of human evolution.",
      },
      {
        title: "The Oldupai Museum",
        description:
          "An on-site museum explains the gorge's fossil finds, stone tools and geological layers spanning nearly two million years.",
      },
      {
        title: "Laetoli's ancient footprints",
        description:
          "A short drive away, 3.6-million-year-old hominin footprints preserved in volcanic ash offer a direct physical trace of early human ancestors.",
      },
    ],
    activitiesHeading: "Activities",
    activities: [
      "Guided museum and gorge-rim visits",
      "Talks on the Leakeys' discoveries and human origins",
      "Optional detour to the Laetoli footprint site",
    ],
    bestTimeToVisit: [
      { month: "Jan", note: "Dry and clear; good visiting conditions.", rating: "good" },
      { month: "Feb", note: "Dry spell continues.", rating: "good" },
      { month: "Mar", note: "Rains begin.", rating: "low" },
      { month: "Apr", note: "Long rains; access can be difficult.", rating: "low" },
      { month: "May", note: "Rains easing.", rating: "low" },
      { month: "Jun", note: "Dry season begins.", rating: "good" },
      { month: "Jul", note: "Reliable dry conditions.", rating: "peak" },
      { month: "Aug", note: "Clear and dry.", rating: "peak" },
      { month: "Sep", note: "Excellent visiting conditions.", rating: "peak" },
      { month: "Oct", note: "Dry season tapering.", rating: "good" },
      { month: "Nov", note: "Short rains begin.", rating: "good" },
      { month: "Dec", note: "Warm with occasional showers.", rating: "good" },
    ],
    location: { lat: -2.9967, lng: 35.3514, zoom: 12 },
    faqs: [
      {
        question: "Is Olduvai Gorge worth stopping at on the way to the Serengeti?",
        answer:
          "Yes — it sits directly on the standard route between Ngorongoro Crater and the Serengeti, and an hour or two at the museum and gorge rim adds genuine depth to a Northern Circuit safari.",
      },
      {
        question: "What was found at Olduvai Gorge?",
        answer:
          "Most famously the 1.75-million-year-old Paranthropus boisei skull found by Mary Leakey in 1959, along with early Homo habilis remains and stone tools spanning nearly two million years of human evolution.",
      },
    ],
    seoDescription:
      "Visit Olduvai Gorge and the Oldupai Museum with Macho Halisi — the site of the Leakeys' landmark discoveries and the Cradle of Mankind, en route to the Serengeti.",
    relatedSlugs: ["ngorongoro", "serengeti", "lake-natron"],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getAllDestinationSlugs(): string[] {
  return destinations.map((d) => d.slug);
}
