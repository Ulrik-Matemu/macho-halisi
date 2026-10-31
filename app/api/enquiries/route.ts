import { NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";
import { getVisitorContext } from "@/lib/analytics/server";

const optional = (value: unknown, max: number) =>
  typeof value === "string" && value.trim() ? clean(value.trim()).slice(0, max) : null;

// Pragmatic address check (one @, a dot in the domain, no spaces). The
// backend re-validates with Zod, but rejecting junk here saves the hop.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Strip control characters (keeping tab/newline) from free text before it
// is stored and later shown in the dashboard and staff-alert emails.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const clean = (value: string) => value.replace(CONTROL_CHARS, "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, itineraryId, partySize, preferredDates, message } = body ?? {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { status: "error", message: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !EMAIL_PATTERN.test(email.trim()) || email.length > 254) {
      return NextResponse.json(
        { status: "error", message: "A valid email address is required" },
        { status: 400 }
      );
    }
    // Phone is optional; when given it must look like a real number.
    const phoneText = typeof phone === "string" ? phone.trim() : "";
    if (phone != null && typeof phone !== "string") {
      return NextResponse.json(
        { status: "error", message: "A valid phone number is required" },
        { status: 400 }
      );
    }
    if (phoneText && phoneText.length < 5) {
      return NextResponse.json(
        { status: "error", message: "A valid phone number is required" },
        { status: 400 }
      );
    }

    const visitor = getVisitorContext(request);
    const payload = {
      name: clean(name.trim()).slice(0, 100),
      email: email.trim().toLowerCase(),
      phone: clean(phoneText).slice(0, 40),
      itineraryId: typeof itineraryId === "string" && itineraryId ? itineraryId : null,
      partySize: optional(partySize, 100),
      preferredDates: optional(preferredDates, 200),
      message: optional(message, 5000),
      source: body.source === "modal" || body.source === "studio" ? body.source : null,
      pagePath: optional(body.pagePath, 500),
      referrerHost: optional(body.referrerHost, 255),
      utmSource: optional(body.utmSource, 100),
      sessionId: optional(body.sessionId, 64),
      country: visitor.country,
      city: visitor.city,
      // Honeypot — passed through so the backend can silently drop bots.
      website: optional(body.website, 200),
    };

    // Forward to Express backend public enquiry endpoint. The backend
    // rate-limits per visitor IP, which it only sees if we pass it along —
    // authenticated with the ingest secret so it can't be spoofed directly.
    const backendUrl = `${getExpressApiUrl()}/public/enquiries`;
    const ingestSecret = process.env.ANALYTICS_INGEST_SECRET;
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(ingestSecret && visitor.ip && { "X-Client-IP": visitor.ip, "X-Ingest-Secret": ingestSecret }),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
      }

      // If backend returned a 4xx error (e.g. validation, rate limit), pass it through
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData.message
          ? errorData
          : { status: "error", message: "Failed to submit enquiry" },
        { status: response.status }
      );
    } catch (backendErr) {
      // Never fake success here: a "received" message for an enquiry that
      // was never stored is a lost lead. The forms show this message along
      // with the WhatsApp fallback.
      console.error("Express backend unreachable at " + backendUrl + ":", backendErr);
      return NextResponse.json(
        {
          status: "error",
          message: "We couldn't reach our planning desk just now. Please try again in a moment or message us on WhatsApp.",
        },
        { status: 503 }
      );
    }
  } catch (err) {
    console.error("Enquiry submission route error:", err);
    return NextResponse.json(
      { status: "error", message: "Internal server error processing enquiry" },
      { status: 500 }
    );
  }
}
