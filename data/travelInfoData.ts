/**
 * Static content for the Travel Information page
 * (app/travel-information/page.tsx). Copy is the client's
 * TRAVEL-INFORMATION.rtf, in its order and under its headings — keep it in
 * step with that document.
 */

export interface TravelEntry {
  title?: string;
  body?: string;
  /** Nested points under this entry. */
  items?: TravelEntry[];
}

export interface TravelSection {
  id: string;
  /** The document's section number, e.g. "1". */
  number: string;
  title: string;
  /** Short label for the sticky index. */
  shortTitle: string;
  intro?: string;
  entries: TravelEntry[];
}

export interface TravelFaq {
  question: string;
  answer: string;
}

export const travelIntro = {
  title: "Travel Information",
  welcome:
    "Welcome to the Macho Halisi Travel Information portal. Preparing for a Tanzanian safari is an exciting journey, and having thorough, accurate details ensures your expedition is seamless, comfortable, and unforgettable. Explore our detailed travel guides below.",
};

export const TRAVEL_SECTIONS: TravelSection[] = [
  {
    id: "faqs",
    number: "1",
    title: "FAQ’S",
    shortTitle: "FAQ’s",
    entries: [
      {
        title: "Do I need a Visa to enter Tanzania?",
        body: "Yes, most foreign nationals require a tourist visa. You can apply easily online via the official Tanzania eVisa portal prior to departure, or obtain a Visa on Arrival at major ports of entry, including Kilimanjaro International Airport (JRO), Julius Nyerere International Airport (DAR), and the Namanga border post. Ensure your passport has at least 6 months of validity from your planned departure date and at least two blank pages.",
      },
      {
        title: "What is the baggage limit for domestic safari flights?",
        body: "If your itinerary includes domestic bush flights (e.g., Flying Medical Service, Auric Air, or Coastal Aviation between Serengeti, Manyara, and Zanzibar), strict baggage limits apply. Passengers are generally allowed 15 kg (33 lbs) per person, inclusive of hand luggage. Bags must be soft-sided (duffel bags) so they can fit into the aircraft’s cargo pods.",
      },
      {
        title: "Is Wi-Fi available during the safari?",
        body: "While we encourage guests to disconnect and immerse themselves in nature, most luxury lodges and permanent tented camps offer complimentary Wi-Fi in public lounge areas. Mobile cellular coverage (VodaCom / Airtel) is surprisingly good across much of the Northern Circuit, though it may be intermittent in deep remote sections of the Serengeti.",
      },
      {
        title: "Are safaris suitable for children?",
        body: "Absolutely! We specialize in tailored family safaris. Our private 4x4 Land Cruisers allow families to travel at their own pace without worrying about other guests, and our guides are exceptional at engaging young minds with animal tracking, bird calls, and bush stories.",
      },
    ],
  },
  {
    id: "climate",
    number: "2",
    title: "CLIMATE AND CLOTHING",
    shortTitle: "Climate",
    intro:
      "Tanzania’s climate varies across seasons and altitudes. Understanding temperatures across the Northern Circuit helps you pack efficiently:",
    entries: [
      {
        title: "Seasonal Breakdown",
        items: [
          {
            title: "Dry Season (June to October)",
            body: "Warm, sunny days (20°C to 28°C / 68°F to 82°F) with clear skies. Wildlife viewing is exceptional as animals concentrate around permanent water sources.",
          },
          {
            title: "Green / Calving Season (November to May)",
            body: "Short rains fall in November/December, followed by the main wet season from March to May. The landscape is lush, wild flowers bloom, and thousands of wildebeest calves are born in the Southern Serengeti (Ndutu).",
          },
        ],
      },
      {
        title: "High-Altitude Temperature Drops",
        body: "Regions like the Ngorongoro Crater Rim sit at over 2,200 meters (7,200 feet) above sea level. Early mornings and nights here can be brisk, with temperatures dropping below 10°C (50°F).",
      },
      {
        title: "Packing & Attire Recommendations",
        items: [
          {
            title: "Colors",
            body: "Wear neutral, earth-toned clothing (khaki, olive green, beige, or brown) to blend into the wilderness. Avoid bright colors, bright white (which draws attention and gathers dust), and dark blue or black (which attract tsetse flies in specific wooded areas).",
          },
          {
            title: "Layering Strategy",
            body: "Dress in layers. Combine lightweight, moisture-wicking shirts with a fleece sweater or windproof jacket for morning game drives, which can be unlayered as the afternoon sun warms the savannah.",
          },
          {
            title: "Footwear & Sun Protection",
            body: "Pack sturdy, broken-in walking shoes or trail sneakers, a wide-brimmed sun hat, polarized sunglasses, and high-SPF sunblock.",
          },
        ],
      },
    ],
  },
  {
    id: "guidelines",
    number: "3",
    title: "SAFARI GUIDELINES",
    shortTitle: "Guidelines",
    intro:
      "To ensure a respectful, safe, and enriching game viewing experience, Macho Halisi adheres to professional bush protocols:",
    entries: [
      {
        title: "Patience Rewarded",
        body: "Wildlife tracking in the wild requires time and observation. Spending 45 minutes silently watching a lioness in the grass often rewards you with a dramatic hunt or intimate family interaction that hasty travelers miss.",
      },
      {
        title: "Quiet & Respectful Game Drives",
        body: "Keep noise levels low near wildlife to avoid disrupting natural feeding, resting, or hunting behaviors. Speak in soft tones when animals are close to the vehicle.",
      },
      {
        title: "In-Vehicle Safety",
        body: "Our custom 4x4 Land Cruisers feature individual window seats and wide pop-up roof hatches. Always remain inside the vehicle frame unless your driver-guide explicitly indicates it is safe to step out at designated picnic sites or ranger posts.",
      },
      {
        title: "Environmental Integrity",
        body: "Leave no trace behind. All trash, food wrappers, and organic waste must remain inside the vehicle’s garbage receptacles to preserve Tanzania’s pristine natural reserves.",
      },
    ],
  },
  {
    id: "photography",
    number: "4",
    title: "PHOTOGRAPHY",
    shortTitle: "Photography",
    intro:
      "Tanzania is widely considered one of the world’s premier destinations for wildlife and landscape photography:",
    entries: [
      {
        title: "Camera Gear & Lens Recommendations",
        items: [
          {
            title: "Telephoto Lenses",
            body: "A zoom lens reaching 300mm to 600mm is ideal for close-up wildlife shots and birdlife.",
          },
          {
            title: "Wide-Angle Lenses",
            body: "A 16mm–35mm lens is perfect for sweeping landscapes, dramatic African sunsets, and starry night skies.",
          },
          {
            title: "Stability",
            body: "Dust beanbags are exceptionally useful for resting heavy telephoto lenses on the open roof frames of our safari vehicles.",
          },
        ],
      },
      {
        title: "On-Board Power Inverters",
        body: "Never worry about running out of battery during a Great Migration River crossing or predator sighting. All Macho Halisi 4x4 Land Cruisers are equipped with heavy-duty in-vehicle power inverters and multi-plug charging points. You can recharge camera batteries, drone controllers, laptops, and tablets directly from your seat while on the move.",
      },
      {
        title: "Protecting Equipment from Dust",
        body: "Fine savannah dust is common during dry season game drives. Keep cameras inside padded bags when driving between sightings, and carry a microfiber cloth and blower bulb for daily lens cleaning.",
      },
      {
        title: "Cultural Sensitivity",
        body: "When visiting local communities, such as Maasai bomas or Hadzabe hunter-gatherer settlements, always ask your guide before photographing individuals. Respectful interactions lead to authentic photographic moments.",
      },
    ],
  },
  {
    id: "currency",
    number: "5",
    title: "CURRENCY",
    shortTitle: "Currency",
    entries: [
      {
        title: "Local Currency",
        body: "The official currency is the Tanzanian Shilling (TZS). It is useful for small roadside purchases, souvenirs, and tips at local markets.",
      },
      {
        title: "United States Dollars (USD)",
        body: "US Dollars are widely accepted across tourist establishments, safari lodges, national park gifts shops, and for driver-guide tipping.",
      },
      {
        title: "CRITICAL REQUIREMENT - USD Bill Series",
        body: "Due to strict banking regulations in East Africa, all USD bills must be issued in 2013 or later, and must be in clean, crisp condition without tears, stamps, or heavy folds. Older series bills (pre-2013) are strictly rejected by local banks, lodges, and exchange bureaus.",
      },
      {
        title: "Credit Cards & ATMs",
        body: "Major credit cards (Visa and Mastercard) are accepted at most hotels and luxury lodges. However, a 3% to 5% card processing surcharge is standard across Tanzania. ATMs are readily available in major towns like Arusha and Karatu, but are non-existent inside national parks.",
      },
    ],
  },
  {
    id: "park-rules",
    number: "6",
    title: "NATIONAL PARK RULES",
    shortTitle: "Park Rules",
    intro:
      "All guests entering Tanzania’s National Parks (TANAPA) and Conservation Areas (NCAA) are required to follow official conservation laws:",
    entries: [
      {
        title: "Strict Off-Road Driving Ban",
        body: "Vehicles must stay on designated tracks and roads at all times to prevent soil erosion and habitat destruction, except in designated off-road concession zones.",
      },
      {
        title: "Speed Limits",
        body: "The maximum speed limit inside National Parks is 50 km/h (30 mph), and lower near animals, ensuring safety for both wildlife and guests.",
      },
      {
        title: "Wildlife Protection",
        body: "Feeding wild animals (including monkeys and birds at picnic sites) is strictly forbidden. It alters natural hunting behaviors and causes aggression.",
      },
      {
        title: "Single-Use Plastics Ban",
        body: "Tanzania strictly bans single-use plastic bags. Guests are encouraged to travel with reusable water bottles, which can be refilled continuously from the filtered water tanks in our vehicles.",
      },
      {
        title: "Drone Regulations",
        body: "Unmanned Aerial Vehicles (drones) are strictly prohibited inside all Tanzanian National Parks and Conservation Areas without advance written permits from TANAPA, the Ministry of Defense, and the Civil Aviation Authority.",
      },
    ],
  },
  {
    id: "tipping",
    number: "7",
    title: "DRIVER AND GUIDES TIPPING",
    shortTitle: "Tipping",
    intro:
      "While tipping is not mandatory, it is a deeply appreciated tradition in African safari culture that rewards exceptional knowledge, effort, and personalized service:",
    entries: [
      {
        title: "Safari Driver-Guides",
        body: "Recommended tip: $15 to $20 USD per day per vehicle (from the entire group or private party), handed directly to your guide at the end of the safari.",
      },
      {
        title: "Lodge & Camp Staff",
        body: "Most safari lodges and tented camps feature a central “Staff Tip Box” at reception. Tipping $10 to $15 USD per day into this box ensures equal distribution among the behind-the-scenes staff, including kitchen teams, housekeepers, gardeners, and night guards.",
      },
      {
        title: "Mountain Trekking Crew (Kilimanjaro / Meru)",
        body: "For mountain expeditions, tipping is structured per crew member (guides, assistants, camp chefs, and porters) and details are provided during pre-trek briefings.",
      },
    ],
  },
  {
    id: "links",
    number: "8",
    title: "USEFUL LINKS",
    shortTitle: "Links",
    intro: "Prepare for your journey using official government, health, and travel resources:",
    entries: [
      { title: "Tanzania Official eVisa Application", body: "Apply for your entry visa online." },
      {
        title: "Tanzania National Parks (TANAPA)",
        body: "Official updates on park conservation and wildlife regulations.",
      },
      {
        title: "Ngorongoro Conservation Area Authority (NCAA)",
        body: "Rules and insights on visiting the Crater and Ndutu plains.",
      },
      {
        title: "AMREF Flying Doctors",
        body: "Emergency air evacuation services and Maisha Tourist Cover details.",
      },
      {
        title: "World Health Organization (WHO)",
        body: "International travel health advisories and immunization guidelines.",
      },
    ],
  },
  {
    id: "health",
    number: "9",
    title: "HEALTH AND SAFETY",
    shortTitle: "Health",
    intro:
      "Your personal safety and health are held to the absolute highest standards throughout your time with Macho Halisi:",
    entries: [
      {
        title: "Emergency Medical Evacuation (AMREF Flying Doctors)",
        body: "Remote wilderness areas require guaranteed medical response capabilities. Macho Halisi works directly with AMREF Flying Doctors, East Africa’s leading emergency air ambulance network.",
        items: [
          {
            title: "24/7 Rapid Evacuation",
            body: "In the unlikely event of a medical emergency, severe injury, or sudden illness in remote areas like the Northern Serengeti, AMREF dispatches medically equipped aircraft staffed by emergency flight physicians.",
          },
          {
            title: "Air Ambulance Coverage",
            body: "Guests are covered for direct air transportation from bush airstrips straight to full-service medical centers in Nairobi or Dar es Salaam.",
          },
          {
            title: "Seamless Peace of Mind",
            body: "We automatically assist guests with enrolling in the AMREF Maisha Tourist Cover to ensure complete field protection without out-of-pocket evacuation costs.",
          },
        ],
      },
      {
        title: "Certified Wilderness First Responders (WFR)",
        body: "On the ground, you are supported by highly skilled professionals. Every single Macho Halisi driver-guide holds full certification as a Wilderness First Responder (WFR), trained in remote medical care, CPR, and trauma response. Every Land Cruiser is continuously stocked with comprehensive medical first-aid kits and field communications.",
      },
      {
        title: "Health & Routine Preparations",
        items: [
          {
            title: "Yellow Fever Certificate",
            body: "Required if arriving from or transiting through a country with risk of Yellow Fever transmission (e.g., Kenya, Uganda, Ethiopia) for more than 12 hours.",
          },
          {
            title: "Malaria Prophylaxis",
            body: "Northern Tanzania is a low-to-moderate malaria area. Consult your physician regarding antimalarial tablets (such as Atovaquone-Proguanil/Malarone or Doxycycline). Apply insect repellent during dusk and wear long sleeves during evening dinners.",
          },
          {
            title: "On-Board Hydration",
            body: "Safe, cold, filtered drinking water is supplied inside all our custom safari vehicles to keep you energized throughout daily game drives.",
          },
        ],
      },
    ],
  },
];

/** Sticky-index topics, derived from the sections. */
export const TRAVEL_TOPICS = TRAVEL_SECTIONS.map((s) => ({ id: s.id, title: s.title, shortTitle: s.shortTitle }));

/** Section 1's questions, for FAQ structured data and llms.txt. */
export const TRAVEL_FAQS: TravelFaq[] = TRAVEL_SECTIONS[0].entries.map((e) => ({
  question: e.title ?? "",
  answer: e.body ?? "",
}));
