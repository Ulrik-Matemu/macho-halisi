/**
 * Static content for the About page (app/about/page.tsx). Follows the same
 * data-file pattern as planningData.ts / travelInfoData.ts — copy lives here,
 * layout lives in the page and components/public/about/*.
 *
 * Narrative reworks the original machohalisi.com "Our Company" founder story
 * and "Why Book with Us" ethos into this project's luxury, native-specialist
 * voice, and carries every point of the client's About Us document
 * (about-us.rtf): The Beginning, Our Mission, Why Travel with Macho Halisi
 * and The Macho Halisi Experience. Founder facts (Dawson Minja, Kudu Lodge
 * origin, Karatu base, 17+ years, 20 vehicles, year-round guides) must stay
 * in step with lib/site.ts.
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
    "“Macho Halisi” is Swahili for “genuine eyes.” For more than seventeen years we have shown travellers the real Tanzania — not a packaged version of it — through the eyes of the people who were born to this land and have never stopped reading it.",
  // The full-bleed 70vh hero needs real vertical resolution; the previous
  // Serengeti panorama was only 611px tall and upscaled badly here. This is
  // the highest-resolution asset we own (5563x3709) and is authentically
  // ours — the company's own fleet at golden hour.
  image: {
    url: "/media/about/fleet/fleet-lineup-golden.jpg",
    alt: "The Macho Halisi fleet lined up at golden hour",
  },
};

export const aboutStats: AboutStat[] = [
  { value: "17+", label: "Years crafting Tanzanian journeys" },
  { value: "20", label: "Custom-built safari vehicles" },
  { value: "365", label: "Days a year in the field" },
  { value: "100%", label: "Tanzanian owned & led" },
];

export const aboutStory: AboutStoryChapter[] = [
  {
    eyebrow: "The Beginning",
    heading: "A simple idea, seventeen years ago",
    body:
      "Macho Halisi has been creating unforgettable safari experiences and authentic African adventures for more than seventeen years. Founded by Dawson Minja, a passionate Tanzanian tourism visionary based in Karatu, it was built on a simple idea: to offer travellers safe, exciting and professionally guided safaris that deliver exceptional value while showcasing the true beauty of Tanzania.",
  },
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
      "What started as game drives into the parks next door grew, one honest journey at a time, into full expeditions across the country — the Serengeti, Ngorongoro, Tarangire and Lake Manyara; the summits of Kilimanjaro, Meru and Ol’Doinyo Lengai; and the turquoise calm waters of Zanzibar and the Swahili Coast. Today travellers from across America, the UK and Europe plan their once-in-a-lifetime journeys with us, and many return.",
  },
  {
    eyebrow: "A Trusted Name",
    heading: "From a small dream to a fleet of twenty",
    body:
      "What began as a small dream has grown into one of Tanzania’s trusted safari companies. Today, Macho Halisi operates a fleet of 20 custom-built safari vehicles designed for optimal wildlife viewing, supported by a team of experienced, knowledgeable guides who work year-round to deliver extraordinary journeys across East Africa.",
  },
  {
    eyebrow: "Our Journeys",
    heading: "From the Serengeti to the shores of Zanzibar",
    body:
      "From the endless plains of the Serengeti to the majestic Ngorongoro Crater, the summit of Kilimanjaro and the turquoise shores of Zanzibar Island, we craft journeys that connect travellers to Africa’s landscapes, wildlife and cultures in a meaningful and authentic way.",
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
  // A real photo of the company's own fleet, not a portrait of the founder:
  // we don't have a confirmed photograph of Dawson Minja, and captioning a
  // person's face with his name would misattribute a real person. The
  // founder is named in the prose below (sourced), not pinned to a face —
  // see FounderStory.tsx, which renders this without a name caption.
  portrait: {
    url: "/media/about/fleet/fleet-lineup-rear.jpg",
    alt: "The Macho Halisi safari fleet lined up in the bush, Kudu Lodge Karatu on the spare wheel covers",
  },
  quote:
    "You arrive as a guest, and you leave as a friend. That has been the promise since the very first drive.",
  paragraphs: [
    "Dawson Minja, a passionate Tanzanian tourism visionary based in Karatu, founded Macho Halisi on a simple idea: that the people who know Tanzania best are the people who come from it. Born and raised in the north, he built the company from Kudu Lodge & Campsite in Karatu into a full safari operation, without ever handing the storytelling to anyone who hadn’t grown up under these skies.",
    "He still lives in Karatu with his wife and their three children, a short drive from the crater rim, and he still treats every itinerary as a personal introduction to his home. Under his direction, Macho Halisi has grown to a fleet of twenty custom-built vehicles purpose-built for wildlife viewing and a team of experienced, knowledgeable guides working the field every day of the year.",
    "His measure of success has never changed: not the size of the group, but whether a traveller leaves having seen the real Tanzania — and wanting to come back.",
  ],
};

export const whyBookPillars: ValuePillar[] = [
  {
    icon: "Compass",
    title: "We Know Tanzania",
    description:
      "Our team has years of firsthand experience exploring Tanzania and East Africa. We take you beyond the ordinary tourist routes to discover authentic destinations, hidden gems and remarkable wildlife encounters.",
  },
  {
    icon: "Eye",
    title: "Native Eyes, Real Access",
    description:
      "Every journey is led by Tanzanian naturalist guides who read the bush the way you read a page — tracking, behaviour, birdsong and the small signs a visitor would never catch.",
  },
  {
    icon: "Compass",
    title: "Tailor-Made, Built From Scratch",
    description:
      "Nothing is pulled off a shelf. Every traveller is different, so your route, pace and camps are drawn around your travel style, interests and the season’s wildlife movements — whether it’s a luxury safari, cultural experience, mountain trek or beach escape, we cater for all.",
  },
  {
    icon: "Truck",
    title: "A Fleet Built for the Field",
    description:
      "Twenty custom-built vehicles, each outfitted for optimum wildlife viewing and meticulously maintained — open hatches, long sightlines and the reliability a remote bush track demands.",
  },
  {
    icon: "HeartHandshake",
    title: "Exceptional Service, Guest to Friend",
    description:
      "Your comfort, safety and experience are our priority. From expert safari guides and carefully selected accommodations to private transfers and personalised attention, we take care of every detail — and deal with real people who care how your journey goes, from the first message to the last farewell.",
  },
  {
    icon: "ShieldCheck",
    title: "Safety You Can Rely On",
    description:
      "Travelling to Africa is a significant investment. We provide reliable vehicles, trusted partners, comprehensive tour operator insurance and passenger liability coverage, plus Flying Doctors emergency evacuation support at minimal extra cost.",
  },
  {
    icon: "Leaf",
    title: "Responsible Tourism",
    description:
      "Tourism should protect nature and support local communities. We promote eco-friendly travel practices, support conservation initiatives, reduce plastic waste on safari and contribute to community development programmes.",
  },
];

export const mission = {
  eyebrow: "Our Mission",
  statement:
    "To create exceptional safari experiences while contributing positively to Tanzania, its people, and its natural heritage.",
  values: [
    { title: "Service", description: "We are committed to delivering impeccable services and ensuring every client enjoys a seamless and memorable travel experience." },
    { title: "Innovation", description: "We continuously strive to bring creativity, innovation and fresh ideas to every safari we design." },
    { title: "Inclusiveness", description: "We build knowledgeable, responsible and passionate teams because we believe our people are the foundation of our success." },
    { title: "Empowerment", description: "Through tourism, we aim to improve the welfare of Tanzanian communities and create meaningful opportunities for local people." },
    { title: "Development", description: "We carefully identify and develop markets that align with our vision for sustainable and responsible tourism." },
    { title: "Relationships", description: "We value long-term relationships with our clients, partners and service providers built on trust, professionalism and excellence." },
  ],
};

export const guidesEthos = {
  eyebrow: "The Soul of Every Expedition",
  heading: "Master naturalist guides",
  lead:
    "A vehicle gets you to the wildlife. A great guide is the reason you understand what you are looking at. Our guides are the heart of Macho Halisi — certified, endlessly curious, and native to the ground they interpret.",
  principles: [
    {
      title: "Certified & seasoned",
      description:
        "Professionally certified, experienced and knowledgeable guides with years in the field, working year-round and chosen as much for how they teach as for what they know.",
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
    url: "/media/about/team/guide-golden-hour.jpg",
    alt: "A Macho Halisi naturalist guide beside the fleet at golden hour",
  },
};

export const conservation = {
  eyebrow: "Impact & Responsibility",
  heading: "Genuine eyes look after what they see",
  body:
    "Showing travellers the real Tanzania comes with a duty to protect it. Through tourism we aim to improve the welfare of Tanzanian communities, support conservation initiatives and reduce plastic waste on safari — because a safari operator native to this land has every reason to keep it wild for the next generation.",
};

export const aboutCta = {
  eyebrow: "The Macho Halisi Experience",
  heading: "We provide the experience. You create the memories.",
  body:
    "Tanzania is more than a destination — it is an experience that stays with you forever. Whether you dream of witnessing the Great Migration in the Serengeti, climbing Mount Kilimanjaro, exploring remote cultural communities or relaxing on the Zanzibar beaches, our team is here to help you create your own extraordinary African story.",
  primary: { label: "Start Planning Your Journey", href: "/enquire" },
  secondary: { label: "See How We Plan", href: "/how-we-plan" },
};
