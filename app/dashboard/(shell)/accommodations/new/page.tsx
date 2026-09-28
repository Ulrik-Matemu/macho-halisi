"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, Hotel, MapPin, Star } from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import {
  AccommodationType,
  ServiceTier,
  ACCOMMODATION_TYPE_LABELS,
  SERVICE_TIER_LABELS,
} from "@/lib/accommodations/types";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import Switch from "@/components/dashboard/ui/Switch";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

const TYPE_OPTIONS = Object.entries(ACCOMMODATION_TYPE_LABELS) as [AccommodationType, string][];
const TIER_OPTIONS = Object.entries(SERVICE_TIER_LABELS) as [ServiceTier, string][];

export default function NewAccommodationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState<AccommodationType>("LODGE");
  const [serviceTier, setServiceTier] = useState<ServiceTier>("LUXURY");
  const [starRating, setStarRating] = useState<number | "">(5);
  const [locationText, setLocationText] = useState("");
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [pricePerNight, setPricePerNight] = useState<number | "">(500);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isViewer = user?.role === "VIEWER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide an accommodation name.");
      return;
    }
    if (!locationText.trim()) {
      setError("Please provide a location.");
      return;
    }
    if (!priceOnRequest && (pricePerNight === "" || Number(pricePerNight) <= 0)) {
      setError("Please specify a valid price per night in USD, or switch to 'Price on request'.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        serviceTier,
        starRating: starRating === "" ? null : Number(starRating),
        locationText: locationText.trim(),
        priceOnRequest,
        pricePerNight: priceOnRequest ? null : Number(pricePerNight),
        amenities: [],
        images: [],
      };
      const res = await fetch("/api/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "ok" || !data.accommodation?.id) {
        throw new Error(data.message || "Failed to initialize accommodation draft.");
      }
      router.push(`/dashboard/accommodations/${data.accommodation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (isViewer) {
    return (
      <div className="max-w-2xl">
        <InlineMessage tone="error">You do not have permission to create accommodations.</InlineMessage>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="New accommodation"
        description="Create a draft. You can add a description, amenities, map location and photos on the next screen."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Name" required>
          {({ id }) => (
            <div className="relative">
              <Hotel className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
              <input
                id={id}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Serengeti Serena Safari Lodge"
                className={`${inputClass} pl-9`}
                style={inputStyle}
                autoFocus
              />
            </div>
          )}
        </Field>

        <Field label="Location" required hint="Human-readable, e.g. 'Central Serengeti, near Seronera'. Exact map coordinates come later.">
          {({ id }) => (
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
              <input
                id={id}
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. Central Serengeti, Tanzania"
                className={`${inputClass} pl-9`}
                style={inputStyle}
              />
            </div>
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Type" required>
            {({ id }) => (
              <select id={id} value={type} onChange={(e) => setType(e.target.value as AccommodationType)} className={inputClass} style={inputStyle}>
                {TYPE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Service tier" required>
            {({ id }) => (
              <select id={id} value={serviceTier} onChange={(e) => setServiceTier(e.target.value as ServiceTier)} className={inputClass} style={inputStyle}>
                {TIER_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field label="Star rating" hint="Optional quality rating, 1–5. Leave blank if unrated.">
          {({ id }) => (
            <div className="relative">
              <Star className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
              <select
                id={id}
                value={starRating}
                onChange={(e) => setStarRating(e.target.value === "" ? "" : Number(e.target.value))}
                className={`${inputClass} pl-9`}
                style={inputStyle}
              >
                <option value="">Unrated</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Field>

        <div
          className="p-4 rounded-lg space-y-4"
          style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
        >
          <Switch
            checked={priceOnRequest}
            onChange={setPriceOnRequest}
            label="Price on request"
            description="Hide a fixed nightly rate and invite enquiries instead."
          />
          {!priceOnRequest && (
            <Field label="Price per night (USD)" required>
              {({ id }) => (
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
                  <input
                    id={id}
                    type="number"
                    min={1}
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 500"
                    className={`${inputClass} pl-9`}
                    style={inputStyle}
                  />
                </div>
              )}
            </Field>
          )}
        </div>

        {error && <InlineMessage tone="error">{error}</InlineMessage>}

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" loading={submitting}>
            Create draft
          </Button>
          <Link href="/dashboard/accommodations">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
