import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/auth/serverFetch";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const { response, newAccessToken } = await serverFetch(request, "/uploads/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    if (newAccessToken) {
      setAuthCookies(nextResponse, newAccessToken);
    }

    if (response.status === 401 && !newAccessToken) {
      clearAuthCookies(nextResponse);
    }

    return nextResponse;
  } catch (err: any) {
    console.error("Image upload proxy error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to upload image to server" },
      { status: 502 }
    );
  }
}
