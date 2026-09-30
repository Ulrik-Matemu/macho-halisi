export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED";

export const ENQUIRY_STATUSES: { key: EnquiryStatus; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "RESPONDED", label: "Responded" },
  { key: "CLOSED", label: "Closed" },
];

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  partySize: string | null;
  preferredDates: string | null;
  message: string | null;
  status: EnquiryStatus;
  source: string | null;
  pagePath: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  country: string | null;
  city: string | null;
  sessionId: string | null;
  staffNotes: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  itinerary: { id: string; title: string; slug: string } | null;
  handledBy: { id: string; email: string } | null;
}

export interface EnquiryStats {
  byStatus: Record<EnquiryStatus, number>;
  total: number;
  last7d: number;
}
