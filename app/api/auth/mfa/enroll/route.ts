import { NextRequest, NextResponse } from "next/server";
import { getExpressApiUrl } from "@/lib/auth/constants";

export async function POST(request: NextRequest) {
  try {
    let challengeToken = "";

    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      challengeToken = authHeader.slice(7);
    }

    if (!challengeToken) {
      try {
        const body = await request.json();
        challengeToken = body.challengeToken || "";
      } catch {
        // body could be empty
      }
    }

    if (!challengeToken) {
      return NextResponse.json(
        { status: "error", message: "Missing challenge token" },
        { status: 400 }
      );
    }

    const expressUrl = `${getExpressApiUrl()}/auth/mfa/enroll`;
    const res = await fetch(expressUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${challengeToken}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("MFA enroll proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to connect to authentication server" },
      { status: 500 }
    );
  }
}
