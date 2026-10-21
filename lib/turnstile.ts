// Server-side check of a Cloudflare Turnstile token (the bot check on the
// enquiry forms and the dashboard login). See components/TurnstileWidget.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * True when the token is valid. With TURNSTILE_SECRET_KEY unset the check
 * is off (local dev, or before the keys are configured) and every request
 * passes; once it is set, a missing, forged, expired or reused token fails,
 * as does Cloudflare being unreachable.
 */
export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;

  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body: form, signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return false;
  }
}
