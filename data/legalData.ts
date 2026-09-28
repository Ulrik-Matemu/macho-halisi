export interface LegalSection {
  id: string;
  title: string;
  shortTitle: string;
  content: string[];
  subsections?: {
    subtitle: string;
    text: string[];
  }[];
}

export interface LegalDocument {
  title: string;
  eyebrow: string;
  lastUpdated: string;
  leadParagraph: string;
  inBrief: {
    title: string;
    description: string;
  }[];
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  eyebrow: "Trust & Data Stewardship",
  lastUpdated: "January 2026",
  leadParagraph:
    "At Macho Halisi, your privacy is treated with the same meticulous care that we bring to crafting your wilderness expedition. We collect only the information required to secure government park permits, domestic charter flights, and luxury camp reservations. We never sell, monetize, or disclose your personal details to unauthorized third parties.",
  inBrief: [
    {
      title: "Permit & Flight Data Only",
      description:
        "We collect passport details and travel dates solely because Tanzanian National Park authorities (TANAPA/NCAA) and bush aviation operators legally require them for permits and passenger manifests.",
    },
    {
      title: "Zero Third-Party Selling",
      description:
        "Your data is never leased, sold, or shared for external commercial marketing. It remains strictly within the Macho Halisi operational family.",
    },
    {
      title: "Encrypted Storage",
      description:
        "Personal data and communications are transferred using TLS 1.3 encryption and stored in secure, access-restricted databases.",
    },
    {
      title: "Right to Erasure",
      description:
        "Following completion of your safari and required statutory tax holding periods, you may request complete deletion of your profile.",
    },
  ],
  sections: [
    {
      id: "information-collected",
      title: "1. Information We Collect",
      shortTitle: "1. Information Collected",
      content: [
        "To design and execute a tailor-made luxury safari in Tanzania, Macho Halisi collects specific personal information when you enquire or confirm a booking:",
        "Contact Information: Full legal name, email address, telephone/WhatsApp number, residential country, and communication preferences.",
        "Traveler Identity & Statutory Requirements: Full passport numbers, nationality, dates of birth, and scanned passport biodata pages. These are legally mandated by the Tanzania National Parks Authority (TANAPA), Ngorongoro Conservation Area Authority (NCAA), and the Tanzania Civil Aviation Authority (TCAA) for domestic flight manifests.",
        "Medical & Dietary Needs: Dietary preferences, allergies, physical mobility considerations, and emergency contact details. These ensure our private chefs and camp staff cater safely to your well-being.",
        "Technical & Browsing Data: Anonymous aggregated analytics such as device type, browser, and pages visited, collected through privacy-respecting cookies to optimize site performance.",
      ],
    },
    {
      id: "how-we-use",
      title: "2. How We Utilize Your Information",
      shortTitle: "2. Use of Data",
      content: [
        "Your information is utilized solely for legitimate operational and safari execution purposes:",
        "Booking and confirming boutique tented camps, rim lodges, and private beach villas in your name.",
        "Procuring official government park entry permits, crater descent permits, and conservation fees.",
        "Issuing domestic air charter e-tickets with licensed bush flight operators.",
        "Enrolling you in the AMREF Flying Doctors remote emergency airlift evacuation roster.",
        "Communicating itinerary revisions, weather updates, and pre-departure field advisories.",
      ],
    },
    {
      id: "data-sharing",
      title: "3. Third-Party Disclosures",
      shortTitle: "3. Disclosures",
      content: [
        "We share your details exclusively with trusted operational partners directly involved in your journey:",
        "Government Conservation Bodies: TANAPA, NCAA, and TAWA as required by Tanzanian law.",
        "Aviation & Bush Air Carriers: Coastal Aviation, Auric Air, and Safari Air Link for domestic flight ticketing.",
        "Sanctuary & Lodge Operators: Exclusively to verify room bookings and convey dietary/medical notes.",
        "Medical Evacuation Providers: AMREF Flying Doctors for emergency coverage registration.",
        "We never share or transfer your data to advertisers, aggregators, or external commercial networks.",
      ],
    },
    {
      id: "security-retention",
      title: "4. Data Security & Retention",
      shortTitle: "4. Security & Retention",
      content: [
        "We implement robust technical and organizational security controls to protect your data against unauthorized access, loss, or alteration. All electronic transfers employ high-grade cryptographic protocols (TLS 1.3).",
        "We retain travel records only as long as necessary to fulfill your travel contract, satisfy statutory tax and accounting obligations under Tanzanian commercial law (ordinarily 7 years), or until you exercise your lawful right to request erasure.",
      ],
    },
    {
      id: "your-rights",
      title: "5. Your Rights & Data Choices",
      shortTitle: "5. Your Rights",
      content: [
        "You possess fundamental rights regarding your personal information, including:",
        "The right to access and receive a copy of your personal data held in our systems.",
        "The right to rectify inaccurate, out-of-date, or incomplete records.",
        "The right to withdraw consent for non-essential communications (such as our seasonal journal newsletter) at any moment via one-click unsubscribe.",
        "The right to request deletion of your information following the completion of your safari, subject to statutory legal record retention requirements.",
      ],
    },
    {
      id: "contact-privacy",
      title: "6. Data Controller & Inquiries",
      shortTitle: "6. Contact",
      content: [
        "For any questions regarding this Privacy Policy or to exercise your privacy rights, please contact our Data Protection Liaison:",
        "Macho Halisi Safaris Ltd.",
        "Attn: Data Protection Office",
        "Karatu, Arusha Region, United Republic of Tanzania",
        "Email: privacy@machohalisi.com | Phone: +255 754 474 792",
      ],
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  title: "Terms & Booking Conditions",
  eyebrow: "Commercial Contract & Expedition Terms",
  lastUpdated: "January 2026",
  leadParagraph:
    "These booking terms govern all bespoke safari itineraries, mountain expeditions, and coastal journeys arranged by Macho Halisi Safaris Ltd. (TALA Licensed Tour Operator). By confirming a tailor-made safari and remitting a deposit, you enter into a binding contractual agreement governed by the laws of the United Republic of Tanzania.",
  inBrief: [
    {
      title: "30% Deposit to Secure",
      description:
        "A 30% advance deposit secures your private naturalist guide, custom 4x4 cruiser, and locks scarce luxury tented camp suites.",
    },
    {
      title: "Balance 60 Days Prior",
      description:
        "Final safari balance is payable 60 days before your expedition commences, after which park permits are drawn and finalized.",
    },
    {
      title: "AMREF Flying Doctors Included",
      description:
        "Emergency wilderness medical air evacuation is included for every remote safari passenger traveling with Macho Halisi.",
    },
    {
      title: "Mandatory Personal Insurance",
      description:
        "Guests are required to maintain comprehensive international travel insurance covering cancellation, trip interruption, and medical repatriation.",
    },
  ],
  sections: [
    {
      id: "booking-deposit",
      title: "1. Quotations, Booking Confirmation & Deposits",
      shortTitle: "1. Booking & Deposits",
      content: [
        "All custom itineraries are individually quoted in US Dollars (USD) and remain subject to lodge and flight availability until confirmed.",
        "To confirm your reservation, an initial non-refundable deposit of 30% of the total safari value is required, alongside full advance payment for any scheduled internal domestic flights and non-refundable gorilla/chimpanzee trekking permits.",
        "Upon receipt of your deposit and completed passenger information forms, Macho Halisi will issue an official Expedition Confirmation Voucher detailing all reserved services.",
      ],
    },
    {
      id: "payment-schedules",
      title: "2. Payment Schedules & Invoicing",
      shortTitle: "2. Payment Schedules",
      content: [
        "The remaining balance of 70% must be received by Macho Halisi no later than sixty (60) days prior to your arrival in Tanzania.",
        "For reservations made within sixty (60) days of departure, full payment (100%) is due immediately upon confirmation.",
        "Payments may be remitted via secure international electronic bank wire transfer (SWIFT) or authorized credit card processing. Any bank intermediary transfer fees are the responsibility of the sender.",
      ],
    },
    {
      id: "cancellation-refunds",
      title: "3. Cancellation & Rescheduling Policy",
      shortTitle: "3. Cancellation & Refunds",
      content: [
        "Any cancellation request must be submitted in writing by the primary lead booker. Because luxury tented camps and government conservation authorities impose strict non-refundable cancellation tiers, the following cancellation fee schedule applies:",
        "More than 91 days before arrival: Retention of initial deposit (30%).",
        "90 to 61 days before arrival: 50% of the total safari price is forfeited.",
        "60 to 31 days before arrival: 75% of the total safari price is forfeited.",
        "30 days or fewer before arrival (or no-show): 100% of the total safari price is forfeited.",
        "Government park entry fees, concession fees, and domestic bush flight tickets are 100% non-refundable once issued under Tanzanian statutory regulations.",
      ],
    },
    {
      id: "wildlife-itinerary-changes",
      title: "4. Wildlife Realities, Weather & Route Adjustments",
      shortTitle: "4. Wildlife & Routes",
      content: [
        "While Macho Halisi utilizes the finest certified native naturalists to maximize wildlife encounters, the movements of wild animals, river crossings, and weather patterns cannot be guaranteed. Nature operates on its own terms.",
        "Macho Halisi reserves the right to alter routes, camp allocations, or flight routings if necessitated by severe weather, unpassable river conditions, flight carrier schedule changes, or safety advisories. Any necessary substitute arrangements will match or exceed the standard of the original booking.",
      ],
    },
    {
      id: "insurance-health",
      title: "5. Travel Insurance & Medical Evacuation",
      shortTitle: "5. Insurance & Health",
      content: [
        "AMREF Flying Doctors: All remote safari travelers are automatically enrolled in AMREF Flying Doctors emergency medical evacuation coverage. This provides emergency air ambulance evacuation from remote bush airstrips to a modern hospital in Nairobi or Dar es Salaam.",
        "Comprehensive Personal Policy: AMREF coverage does not replace personal medical and trip cancellation insurance. All guests are contractually required to secure comprehensive international travel insurance covering medical expenses, baggage loss, emergency repatriation, and trip cancellation.",
      ],
    },
    {
      id: "passports-visas",
      title: "6. Passports, Visas & Traveler Responsibilities",
      shortTitle: "6. Passports & Visas",
      content: [
        "Travelers are solely responsible for ensuring they possess a passport valid for at least six (6) months beyond their planned departure date from Tanzania, containing at least three blank unstamped visa pages.",
        "Travelers are responsible for securing appropriate Tanzanian visas and adhering to all health and vaccination directives (including Yellow Fever certificates when arriving from designated transit zones).",
      ],
    },
    {
      id: "bush-safety",
      title: "7. Safari Bush Etiquette & Guide Authority",
      shortTitle: "7. Bush Safety",
      content: [
        "Tanzania's national parks are unfenced wilderness habitats. For your personal safety and the preservation of wildlife, guests must unconditionally follow the instructions of their Macho Halisi Naturalist Guide at all times.",
        "Guests must remain inside the safari vehicle during game drives except in designated picnic areas or under explicit ranger direction. Walking unescorted outside tented camp boundaries at night is strictly prohibited.",
        "Recreational drones are strictly banned across all Tanzanian national parks by order of TANAPA and NCAA.",
      ],
    },
    {
      id: "liability-jurisdiction",
      title: "8. Limitation of Liability & Governing Law",
      shortTitle: "8. Law & Jurisdiction",
      content: [
        "Macho Halisi acts as a bespoke tour operator coordinating private transport, guides, camps, and charter aviation. While we exercise the utmost diligence in vetting all partners, Macho Halisi cannot be held liable for personal injury, property damage, or delays caused by third-party carriers or unforeseen acts of God.",
        "This contract is governed exclusively by the laws of the United Republic of Tanzania. Any dispute arising under or in connection with these terms shall fall under the exclusive jurisdiction of the competent courts in Arusha, Tanzania.",
      ],
    },
  ],
};
