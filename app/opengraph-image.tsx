import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// next/og's ImageResponse (Satori) needs Node's `fs` to read the poster
// off disk — the default edge runtime doesn't have it.
export const runtime = "nodejs";

export const alt = "Macho Halisi — Luxury Safaris in Tanzania";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Code-generated rather than a static image: composing the actual hero
 * poster with the wordmark means the link preview reads as a brand (in
 * Slack/WhatsApp/iMessage unfurls) rather than a bare screenshot, and it
 * stays in sync automatically if the poster file is ever swapped — see
 * components/Hero.tsx for where the same frame (extracted via
 * totem-video-thumbnailer at t=11s of lion.mp4) is used as the video
 * poster.
 *
 * The source is a dedicated PNG (lion-poster-og.png), not the .webp used
 * by Hero's <video poster>: Satori/resvg's embedded-image decoder does not
 * support WEBP (confirmed by a build-time TypeError with no useful
 * message) — PNG/JPEG work fine.
 *
 * Known limitation: ImageResponse can't use next/font — Satori needs a raw
 * font buffer, not the Google Fonts wiring layout.tsx uses. The bundled
 * default font at wide letter-spacing + uppercase reads close enough to
 * the site's serif register for this round; loading a real .ttf buffer is
 * a later upgrade, not worth blocking this on.
 */
export default async function OpengraphImage() {
  const posterPath = join(process.cwd(), "public/media/hero-vids/lion-poster-og.png");
  const posterBuffer = await readFile(posterPath);
  const posterDataUrl = `data:image/png;base64,${posterBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#050505",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori
            renders its own image pipeline; next/image is not usable here. */}
        <img
          src={posterDataUrl}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Same scrim treatment as Hero.tsx's video overlay, so the
            wordmark stays legible over any part of the frame. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.5))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 70,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 1, background: "rgba(224,172,105,0.8)" }} />
            <span
              style={{
                fontSize: 20,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "#e0ac69",
              }}
            >
              Tanzania
            </span>
          </div>
          <span
            style={{
              fontSize: 84,
              fontWeight: 300,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            Macho Halisi
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 300,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Luxury Safaris in Tanzania
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
