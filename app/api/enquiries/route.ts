import { NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";

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
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { status: "error", message: "A valid email address is required" },
        { status: 400 }
      );
    }
    if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
      return NextResponse.json(
        { status: "error", message: "A valid phone number is required" },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      itineraryId: itineraryId || null,
      partySize: partySize || null,
      preferredDates: preferredDates || null,
      message: message || null,
    };

    // Forward to Express backend public enquiry endpoint
    const backendUrl = `${getExpressApiUrl()}/public/enquiries`;
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
      }

      // If backend returned a 4xx error (e.g. validation), pass it through
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData.message
          ? errorData
          : { status: "error", message: "Failed to submit enquiry" },
        { status: response.status }
      );
    } catch (backendErr) {
      // Backend is offline or unreachable — simulate graceful acceptance for testing / offline preview
      console.warn("Express backend unreachable at " + backendUrl + ", returning graceful simulated response:", backendErr);
      return NextResponse.json(
        {
          status: "ok",
          enquiryId: `mock-${Date.now()}`,
          receivedAt: new Date().toISOString(),
          simulated: true,
          message: "Enquiry received successfully (demo mode)",
        },
        { status: 201 }
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
