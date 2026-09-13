"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, Moon, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Button from "@/components/dashboard/ui/Button";
import Switch from "@/components/dashboard/ui/Switch";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

export default function NewItineraryPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [nights, setNights] = useState<number | "">(7);
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [startingPrice, setStartingPrice] = useState<number | "">(4500);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isViewer = user?.role === "VIEWER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide an itinerary title.");
      return;
    }
    if (!priceOnRequest && (startingPrice === "" || Number(startingPrice) <= 0)) {
      setError("Please specify a valid starting price in USD, or switch to 'Price on request'.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        nights: nights === "" ? 0 : Number(nights),
        priceOnRequest,
        startingPrice: priceOnRequest ? null : Number(startingPrice),
        days: [],
        destinationIds: [],
        images: [],
      };
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "ok" || !data.itinerary?.id) {
        throw new Error(data.message || "Failed to initialize itinerary draft.");
      }
      router.push(`/dashboard/itineraries/${data.itinerary.id}`);
    } catch (err: any) {
      console.error("Create itinerary failed:", err);
      setError(err.message || "An unexpected error occurred while creating the itinerary.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="New itinerary" description="Define the essentials to create a draft — everything else autosaves in the full editor." />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-6 sm:p-8 space-y-6"
        style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border)" }}
      >
        {error && <InlineMessage tone="error">{error}</InlineMessage>}

        <Field label="Itinerary title" required>
          {({ id, describedBy }) => (
            <input
              id={id}
              aria-describedby={describedBy}
              type="text"
              required
              disabled={submitting || isViewer}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 8-Day Serengeti Migration & Ngorongoro Expedition"
              className={inputClass}
              style={inputStyle}
            />
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Duration (nights)">
            {({ id }) => (
              <div className="relative">
                <Moon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-accent)" }} />
                <input
                  id={id}
                  type="number"
                  min={0}
                  disabled={submitting || isViewer}
                  value={nights}
                  onChange={(e) => setNights(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 7"
                  className={`${inputClass} pl-10`}
                  style={inputStyle}
                />
              </div>
            )}
          </Field>

          <div>
            <span className="dash-label block mb-1.5" style={{ color: "var(--dash-text-muted)" }}>
              Pricing structure
            </span>
            <div className="rounded-md px-3.5 py-2.5" style={inputStyle}>
              <Switch checked={priceOnRequest} onChange={setPriceOnRequest} label="Price on request" disabled={submitting || isViewer} />
            </div>
          </div>
        </div>

        {!priceOnRequest && (
          <Field label="Starting price per person (USD)" required>
            {({ id }) => (
              <div className="relative max-w-xs">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--dash-text-subtle)" }} />
                <input
                  id={id}
                  type="number"
                  min={1}
                  required
                  disabled={submitting || isViewer}
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="4500"
                  className={`${inputClass} pl-9 dash-code`}
                  style={inputStyle}
                />
              </div>
            )}
          </Field>
        )}

        <div className="pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid var(--dash-border)" }}>
          <Link href="/dashboard/itineraries">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={submitting} disabled={isViewer} icon={<Sparkles className="w-4 h-4" />}>
            Create & open editor
          </Button>
        </div>
      </form>
    </div>
  );
}
