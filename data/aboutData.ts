/**
 * Static content for the About page (app/about/page.tsx). Follows the same
 * data-file pattern as planningData.ts / travelInfoData.ts — copy lives here,
 * layout lives in the page and components/public/about/*.
 *
 * Narrative reworks the original machohalisi.com "Our Company" founder story
 * and "Why Book with Us" ethos into this project's luxury, native-specialist
 * voice. Founder facts (Dawson Minja, Kudu Lodge origin, Karatu base, 14+
 * years, 15 vehicles, year-round guides) are real and kept accurate.
 */

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutStoryChapter {
  eyebrow: string;
  heading: string;
  body: string;
}

export interface ValuePillar {
  /** lucide-react icon name, resolved in the component. */
  icon: string;
  title: string;
  description: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  location: string;
  portrait: { url: string; alt: string };
  quote: string;
  paragraphs: string[];
}

export interface GuidePrinciple {
  title: string;
  description: string;
}

export const aboutHero = {
  eyebrow: "About Macho Halisi",
  title: "Genuine Eyes on the Wild",
  lead:
    "“Macho Halisi” is Swahili for “genuine eyes.” For more than fourteen years we have shown travellers the real Tanzania — not a packaged version of it — through the eyes of the people who were born to this land and have never stopped reading it.",
  image: {
    url: "/media/serengeti/macho-serengeti.jpg",
    alt: "Golden light over the Serengeti plains at dawn",
  },
};

export const aboutStats: AboutStat[] = [
  { value: "14+", label: "Years crafting Tanzanian journeys" },
  { value: "15", label: "Vehicles outfitted for wildlife viewing" },
  { value: "365", label: "Days a year in the field" },
  { value: "100%", label: "Tanzanian owned & led" },
];

export const aboutStory: AboutStoryChapter[] = [
  {
    eyebrow: "Our Origin",
    heading: "It began at a campsite on the northern circuit",
    body:
      "Long before the bespoke itineraries and the fleet of Land Cruisers, there was a single stop on the road north — Kudu Lodge & Campsite in Karatu, a resting place for travellers on their way to the Ngorongoro Crater and the Serengeti beyond. Watching guests arrive road-weary and leave transformed, our founder saw what was missing: a safari that was genuinely safe, genuinely exciting, and genuinely worth the value placed on it.",
  },
  {
    eyebrow: "How We Grew",
    heading: "From a single game drive to the whole of Tanzania",
    body:
      "What started as game drives into the parks next door grew, one honest journey at a time, into full expeditions across the country — the Serengeti, Ngorongoro, Tarangire and Lake Manyara; the summits of Kilimanjaro, Meru and Ol’Doinyo Lengai; and the turquoise calm of Zanzibar and the Swahili Coast. Today travellers from across America, the UK and Europe plan their once-in-a-lifetime journeys with us, and many return.",
  },
  {
    eyebrow: "Why It Matters",
    heading: "A safari cannot be bought off a conveyor belt",
    body:
      "We have never believed a true African safari can be mass-produced. It has to be drawn around your rhythm, your curiosity, and the seasonal movement of wildlife across the plains. That conviction — that every journey is built from scratch, by people who live here — is what makes Macho Halisi the one travellers trust.",
  },
];

export const founder: FounderProfile = {
  name: "Dawson Minja",
  role: "Founder & Managing Director",
  location: "Karatu, Tanzania",
  portrait: {
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85",
    alt: "Portrait of a Tanzanian safari guide at golden hour",
  },
  quote:
    "You arrive as a guest, and you leave as a friend. That has been the promise since the very first drive.",
  paragraphs: [
    "Dawson Minja founded Macho Halisi on a simple idea: that the people who know Tanzania best are the people who come from it. Born and raised in the north, he built the company from Kudu Lodge & Campsite in Karatu into a full safari operation, without ever handing the storytelling to anyone who hadn’t grown up under these skies.",
    "He still lives in Karatu with his wife and their three children, a short drive from the crater rim, and he still treats every itinerary as a personal introduction to his home. Under his direction, Macho Halisi has grown to a fleet of fifteen vehicles purpose-built for wildlife viewing and a team of naturalist guides working the field every day of the year.",
    "His measure of success has never changed: not the size of the group, but whether a traveller leaves having seen the real Tanzania — and wanting to come back.",
  ],
};

export const whyBookPillars: ValuePillar[] = [
  {
    icon: "Eye",
    title: "Native Eyes, Real Access",
    description:
      "Every journey is led by Tanzanian naturalist guides who read the bush the way you read a page — tracking, behaviour, birdsong and the small signs a visitor would never catch.",
  },
  {
    icon: "Compass",
    title: "Built From Scratch",
    description:
      "Nothing is pulled off a shelf. Your route, your pace and your camps are drawn around you and the season’s wildlife movements — a private expedition, never a fixed package.",
  },
  {
    icon: "Truck",
    title: "A Fleet Built for the Field",
    description:
      "Fifteen vehicles, each outfitted for optimum wildlife viewing and meticulously maintained — open hatches, long sightlines and the reliability a remote bush track demands.",
  },
  {
    icon: "HeartHandshake",
    title: "Guest to Friend",
    description:
      "From the first message to the last farewell you deal with real people who care how your journey goes — personal attention end to end, backed by the travellers who keep returning.",
  },
];

export const guidesEthos = {
  eyebrow: "The Soul of Every Expedition",
  heading: "Master naturalist guides",
  lead:
    "A vehicle gets you to the wildlife. A great guide is the reason you understand what you are looking at. Our guides are the heart of Macho Halisi — certified, endlessly curious, and native to the ground they interpret.",
  principles: [
    {
      title: "Certified & seasoned",
      description:
        "Professionally certified guides with years in the field, chosen as much for how they teach as for what they know.",
    },
    {
      title: "Fluent in the bush",
      description:
        "Animal behaviour, tracking, ecology, bird calls and the rhythms of the migration — turning a game drive into a masterclass.",
    },
    {
      title: "Born to this land",
      description:
        "Tanzanian to the core, sharing their home with the pride of people who genuinely want you to fall for it too.",
    },
  ] as GuidePrinciple[],
  image: {
    url: "/media/about/4X4-Safari-Vehicle-Macho-Halisi2.jpg",
    alt: "A safari guide scanning the horizon from an open vehicle",
  },
};

export const conservation = {
  eyebrow: "Impact & Responsibility",
  heading: "Genuine eyes look after what they see",
  body:
    "Showing travellers the real Tanzania comes with a duty to protect it. A share of every journey supports the wildlife corridors we travel and the communities we belong to — because a safari operator native to this land has every reason to keep it wild for the next generation.",
};

export const aboutCta = {
  eyebrow: "Begin the Conversation",
  heading: "Come and see it through genuine eyes",
  body:
    "Tell us how you like to travel and what you long to see. Our team in Karatu will draw a bespoke Tanzanian journey around you — and there is no better introduction to this country than the people who call it home.",
  primary: { label: "Start Planning Your Journey", href: "/enquire" },
  secondary: { label: "See How We Plan", href: "/how-we-plan" },
};
