import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const PRIVATE = ["/dashboard/", "/api/"];

// AI search, answer and training crawlers. All are explicitly welcome (the
// client wants visibility in ChatGPT, Claude, Perplexity, Gemini and
// friends); naming them documents that choice, and a few bots only honour
// a group that names them.
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
  "Bytespider",
  "DuckAssistBot",
  "cohere-ai",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_AGENTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
