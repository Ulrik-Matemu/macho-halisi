export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED";

export const ENQUIRY_STATUSES: { key: EnquiryStatus; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "RESPONDED", label: "Responded" },
  { key: "CLOSED", label: "Closed" },
];

export type EmailStatus = "PENDING" | "SENT" | "FAILED" | "SKIPPED";

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  PENDING: "Sending",
  SENT: "Sent",
  FAILED: "Failed",
  SKIPPED: "Not sent",
};

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
  emailStatus: EmailStatus;
  emailAttempts: number;
  emailSentAt: string | null;
  emailError: string | null;
  createdAt: string;
  updatedAt: string;
  itinerary: { id: string; title: string; slug: string } | null;
  handledBy: { id: string; email: string } | null;
}

export interface EnquiryStats {
  byStatus: Record<EnquiryStatus, number>;
  emailByStatus: Record<EmailStatus, number>;
  total: number;
  last7d: number;
}
