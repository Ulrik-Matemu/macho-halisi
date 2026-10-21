/**
 * Static content for the About page (app/about/page.tsx). Copy is the
 * client's About Us document (about-us.rtf), in the same order and under the
 * same headings — keep it in step with that document and lib/site.ts.
 */

export interface AboutSubsection {
  heading: string;
  body: string;
}

export interface AboutSection {
  heading: string;
  /** Intro paragraphs, shown under the section heading. */
  paragraphs: string[];
  /** Titled sub-points, shown after the intro. */
  subsections?: AboutSubsection[];
}

export const aboutHero = {
  title: "ABOUT US",
  image: {
    url: "/media/about/fleet/fleet-lineup-golden.jpg",
    alt: "The Macho Halisi fleet lined up at golden hour",
  },
};

/** Closing "Our Fleet" section — the fleet figures are from the document. */
export const aboutFleet = {
  heading: "Our Fleet",
  body:
    "A fleet of 20 custom-built safari vehicles, designed for optimal wildlife viewing.",
  image: {
    url: "/media/about/fleet/fleet-lineup-grass.jpg",
    alt: "Four Macho Halisi safari Land Cruisers lined up in the grass at golden hour",
  },
};

export const aboutSections: AboutSection[] = [
  {
    heading: "THE BEGINNING",
    paragraphs: [
      "Macho Halisi has been creating unforgettable safari experiences and authentic African adventures for more than seventeen years. Founded by Dawson Minja, a passionate Tanzanian tourism visionary based in Karatu, Macho Halisi was built on a simple idea to offer travelers safe, exciting, and professionally guided safaris that deliver exceptional value while showcasing the true beauty of Tanzania.",
      "What began as a small dream has grown into one of Tanzania’s trusted safari companies. Today, Macho Halisi operates a fleet of 20 custom-built safari vehicles designed for optimal wildlife viewing and is supported by a team of experienced, knowledgeable guides who work year-round to deliver extraordinary journeys across East Africa.",
      "From the endless plains of the Serengeti to the majestic Ngorongoro Crater, the summit of Kilimanjaro, and the turquoise shores of Zanzibar Island, we craft journeys that connect travelers to Africa’s landscapes, wildlife, and cultures in a meaningful and authentic way.",
    ],
  },
  {
    heading: "Our Mission",
    paragraphs: [
      "At Macho Halisi, our mission is to create exceptional safari experiences while contributing positively to Tanzania, its people, and its natural heritage.",
    ],
    subsections: [
      {
        heading: "Service",
        body: "We are committed to delivering impeccable services and ensuring every client enjoys a seamless and memorable travel experience.",
      },
      {
        heading: "Innovation",
        body: "We continuously strive to bring creativity, innovation, and fresh ideas to every safari we design.",
      },
      {
        heading: "Inclusiveness",
        body: "We build knowledgeable, responsible, and passionate teams because we believe our people are the foundation of our success.",
      },
      {
        heading: "Empowerment",
        body: "Through tourism, we aim to improve the welfare of Tanzanian communities and create meaningful opportunities for local people.",
      },
      {
        heading: "Development",
        body: "We carefully identify and develop markets that align with our vision for sustainable and responsible tourism.",
      },
      {
        heading: "Relationships",
        body: "We value long-term relationships with our clients, partners, and service providers built on trust, professionalism, and excellence.",
      },
    ],
  },
  {
    heading: "Why Travel with Macho Halisi",
    paragraphs: [],
    subsections: [
      {
        heading: "We Know TANZANIA",
        body: "Our team has years of firsthand experience exploring Tanzania and East Africa. We take you beyond the ordinary tourist routes to discover authentic destinations, hidden gems, and remarkable wildlife encounters.",
      },
      {
        heading: "Tailor-Made Experiences",
        body: "Every traveler is different, which is why every itinerary we create is carefully designed to match your travel style, interests, and expectations whether it’s luxury safaris, cultural experiences, mountain trekking, or beach escapes we cater for all.",
      },
      {
        heading: "Exceptional Guides & Service",
        body: "Your comfort, safety, and experience are our priority. From expert safari guides and carefully selected accommodations to private transfers and personalized attention, we take care of every detail so you can fully enjoy your journey.",
      },
      {
        heading: "Responsible Tourism",
        body: "We believe tourism should protect nature and support local communities. Macho Halisi promotes eco-friendly travel practices, supports conservation initiatives, reduces plastic waste on safari, and contributes to community development programs.",
      },
      {
        heading: "Safety",
        body: "We understand that travelling to Africa is a significant investment. That’s why we provide reliable vehicles, trusted partners, comprehensive tour operator insurance, passenger liability coverage, and with minimum extra costs Flying Doctors emergency evacuation support for added peace of mind.",
      },
    ],
  },
  {
    heading: "The Macho Halisi Experience",
    paragraphs: [
      "At Macho Halisi, we believe Tanzania is more than a destination it is an experience that stays with you forever. Every safari is unique, shaped by breathtaking landscapes, extraordinary wildlife, vibrant cultures, and unforgettable moments shared in the heart of the wilderness.",
      "Whether you dream of witnessing the Great Migration in the Serengeti, climbing Mount Kilimanjaro, exploring remote cultural communities, or relaxing on the Zanzibar beaches, our team is here to help you create your own extraordinary African story.",
      "We provide the experience. You create the memories.",
    ],
  },
];

/**
 * "Our Team & Fleet" — the client's OUR-TEAM-AND-FLEET.rtf document, in its
 * order and under its headings. Shown below the Our Fleet photo band.
 */
export interface TeamFleetPoint {
  title: string;
  body: string;
}

export const aboutTeamFleet = {
  heading: "Our Team & Fleet",
  intro:
    "Ask any seasoned traveler about their safari, and the conversation invariably begins with their guide. At Macho Halisi, we don’t just provide driver-guides — we provide master storytellers, expert tracking strategists, and dedicated guardians of the African wilderness.",
  guides: {
    heading: "Bush Masters: Our Guides",
    intro:
      "Our team is the heartbeat of every expedition. Built on deep loyalty, mutual respect, and an extraordinary passion for the wild, many of our lead guides have been navigating the Northern Circuit with us since our very first sunrise.",
    points: [
      {
        title: "Expertly Educated & Fluent Communicators",
        body: "Every guide holds professional wilderness tourism qualifications and is fluent in English, seamlessly bridging the gap between you and the deep secrets of the savannah. They act as cultural ambassadors, wildlife scholars, and intuitive hosts.",
      },
      {
        title: "Certified Wilderness First Responders",
        body: "Your safety and peace of mind are non-negotiable. Every Macho Halisi guide undergoes rigorous medical and field safety training, maintaining full certification as a Wilderness First Responder (WFR). Whether navigating remote tracks or managing unexpected situations, they act with professional calm and absolute competence.",
      },
      {
        title: "Passionate & Instinctive Naturalists",
        body: "Far beyond driving, our team reads the bush like an open book. From interpreting subtle alarm calls in the acacia canopy to tracking a solitary leopard by a faint footprint in the dusk soil, their sharp eyes and deep ecological insight turn every game drive into an immersive masterclass.",
      },
      {
        title: "Tailored Guest Connections",
        body: "Our guides excel at reading guest preferences — whether accommodating wildlife photographers needing precise light angles and patient positioning, or engaging families with captivating lore of the bush.",
      },
    ] as TeamFleetPoint[],
  },
  fleet: {
    heading: "Engineered for Discovery: Our Custom 4x4 Fleet",
    intro:
      "The rugged terrain of Northern Tanzania — from the dust of Tarangire to the volcanic tracks of Ngorongoro and the vast plains of the Serengeti — demands absolute respect. We own and operate our own custom-built fleet of 20 heavy-duty 4x4 Toyota Land Cruisers, specifically modified for maximum terrain capability and guest luxury.",
    points: [
      {
        title: "Unrivaled Space & Panoramic Views",
        body: "Each vehicle is extended and custom-outfitted to seat up to seven guests comfortably, guaranteeing every passenger a direct “window to the wild.” Pop-up roofs open wide for 360-degree unobstructed views and optimal photography angles.",
      },
      {
        title: "Premium Comfort Upholstery",
        body: "Fitted with ergonomic, high-comfort seating, heavy-duty suspension, and multi-point seatbelt mechanisms, our vehicles turn long bush transits into smooth, relaxing journeys.",
      },
      {
        title: "On-Board Power & Modern Amenities",
        body: "Never miss a moment due to a dead battery. Every vehicle features in-vehicle electrical inverters and multi-plug charging points so you can keep camera gear, smartphones, and tablets charged on the go. High-capacity on-board refrigerators ensure ice-cold water and refreshing beverages are always at hand during warm afternoon drives.",
      },
      {
        title: "Meticulous Mechanical Reliability",
        body: "Every Land Cruiser undergoes strict preventative maintenance, pre-trip multi-point safety inspections, and continuous fleet monitoring. We take pride in self-maintaining our fleet so that your focus remains entirely on the adventure.",
      },
    ] as TeamFleetPoint[],
  },
  promise: {
    heading: "The Macho Halisi Promise",
    quote:
      "From the moment you step into your custom 4x4 to your final African sunset, we take every care to ensure your Tanzanian journey is seamless, safe, and deeply moving — turning a simple safari into the adventure of a lifetime.",
  },
};
