"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE, whatsappUrl } from "@/lib/site";
import { trackContact } from "@/lib/analytics/track";

/**
 * WhatsApp quick-contact — how many safari guests prefer to reach a
 * Tanzanian operator. The prefilled message names the page the guest was
 * reading, so the team knows what they're asking about. "floating" is the
 * site-wide corner button; "inline" sits inside CTA bands.
 */
export default function WhatsAppButton({
  variant = "floating",
  hidden = false,
  placement,
}: {
  variant?: "floating" | "inline";
  /** Lets the floating button step aside, e.g. while the enquiry modal is open. */
  hidden?: boolean;
  /** Analytics label; defaults to the variant. */
  placement?: string;
}) {
  const pathname = usePathname();
  const message = `Hello ${SITE.name}, I'm interested in a safari${pathname && pathname !== "/" ? ` (I was looking at ${pathname})` : ""}.`;
  const onClick = () => trackContact("whatsapp", placement ?? variant);

  if (variant === "inline") {
    return (
      <a
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="inline-flex items-center justify-center gap-2 font-sans font-light text-[11px] tracking-[0.3em] uppercase text-safari-cream border border-safari-cream/30 hover:border-safari-gold hover:text-safari-gold transition-colors px-8 py-4 rounded whitespace-nowrap"
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>WhatsApp us</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="Chat with us on WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      title="Chat with us on WhatsApp"
      className={`fixed z-40 right-4 sm:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6 w-14 h-14 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:scale-105 transition-all duration-300 ${
        hidden ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"
      }`}
    >
      <MessageCircle className="w-6 h-6" aria-hidden="true" />
    </a>
  );
}
