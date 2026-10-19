import { NextRequest } from "next/server";
import { proxyJsonResponse } from "@/lib/auth/serverFetch";

// Retry the staff alert email for one enquiry.
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyJsonResponse(request, `/enquiries/${encodeURIComponent(id)}/resend-email`, { method: "POST" });
}
