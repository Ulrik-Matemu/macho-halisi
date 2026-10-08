import { buildLlmsTxt } from "@/lib/seo/llms";

// Rebuilt hourly so newly published itineraries appear without a deploy.
export const revalidate = 3600;

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
