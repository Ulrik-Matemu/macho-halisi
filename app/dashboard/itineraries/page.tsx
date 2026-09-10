"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ItinerarySummary, ItineraryStatus } from "@/lib/itineraries/types";
import { AuthUser } from "@/lib/auth/types";
import {
  Plus,
  Compass,
  Calendar,
  DollarSign,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Archive,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";

export default function ItinerariesListPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [error, setError] = useState<string | null>(null);

  // Modals / Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: "publish" | "archive" | "delete";
    itinerary: ItinerarySummary;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // 1. Fetch user session
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.status === "ok" && data.user) {
          setUser(data.user);
        } else {
          router.push("/dashboard/login?from=/dashboard/itineraries");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    fetchUser();
  }, [router]);

  // 2. Fetch itineraries
  const loadItineraries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        statusFilter === "ALL"
          ? "/api/itineraries?limit=50"
          : `/api/itineraries?status=${statusFilter}&limit=50`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.status === "ok" && Array.isArray(data.data)) {
        setItineraries(data.data);
      } else {
        setError(data.message || "Failed to fetch itineraries");
      }
    } catch (err) {
      console.error("Failed to load itineraries:", err);
      setError("Network error while connecting to server");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  // Actions
  const handleExecuteAction = async () => {
    if (!confirmModal) return;
    const { type, itinerary } = confirmModal;
    setActionLoading(itinerary.id);
    setActionError(null);

    try {
      let endpoint = "";
      let method = "";

      if (type === "publish") {
        endpoint = `/api/itineraries/${itinerary.id}/publish`;
        method = "PATCH";
      } else if (type === "archive") {
        endpoint = `/api/itineraries/${itinerary.id}/archive`;
        method = "PATCH";
      } else if (type === "delete") {
        endpoint = `/api/itineraries/${itinerary.id}`;
        method = "DELETE";
      }

      const res = await fetch(endpoint, { method });
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setActionError(data.message || `Failed to ${type} itinerary.`);
        return;
      }

      // Success: Close modal and refresh list
      setConfirmModal(null);
      await loadItineraries();
    } catch (err: any) {
      console.error(`Action error ${type}:`, err);
      setActionError("Network error while performing action.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: ItineraryStatus) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-[#c68642]/15 border border-[#c68642]/40 text-[#ffdbac]">
            DRAFT
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-sky-500/15 border border-sky-500/40 text-sky-200">
            IN REVIEW
          </span>
        );
      case "PUBLISHED":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            PUBLISHED
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-zinc-700/30 border border-white/20 text-white/50">
            ARCHIVED
          </span>
        );
    }
  };

  const isAdmin = user?.role === "ADMIN";
  const isViewer = user?.role === "VIEWER";
  const canCreate = !isViewer;

  return (
    <div className="flex-1 flex flex-col bg-[#080808]">
      {user && <DashboardHeader user={user} />}

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#c68642] uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>Safari Expedition Management</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl text-white font-light tracking-wide mt-1">
              Itineraries Catalog
            </h1>
          </div>

          {canCreate && (
            <Link
              href="/dashboard/itineraries/new"
              className="px-4 py-2.5 bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac] font-serif-luxury text-xs tracking-[0.18em] uppercase font-medium rounded transition-all duration-200 flex items-center gap-2 self-start sm:self-auto shadow-md hover:shadow-[0_4px_20px_rgba(198,134,66,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Itinerary</span>
            </Link>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 border-b border-white/10">
          <Filter className="w-3.5 h-3.5 text-white/40 mr-1 shrink-0" />
          {["ALL", "DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1 rounded text-xs font-mono tracking-wider transition-colors shrink-0 cursor-pointer ${
                statusFilter === filterKey
                  ? "bg-[#c68642] text-black font-semibold shadow-sm"
                  : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {filterKey === "ALL" ? "All Itineraries" : filterKey.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800/50 rounded flex items-center gap-3 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Itineraries List / Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-7 h-7 text-[#c68642] animate-spin" />
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Loading itineraries catalog...
            </span>
          </div>
        ) : itineraries.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d] space-y-4">
            <Compass className="w-12 h-12 text-white/20 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg text-white font-light">
                No Itineraries Found
              </h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                {statusFilter === "ALL"
                  ? "Get started by authoring your first luxury safari itinerary."
                  : `No itineraries found matching status "${statusFilter}".`}
              </p>
            </div>
            {canCreate && (
              <Link
                href="/dashboard/itineraries/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac] hover:bg-[#c68642]/30 rounded text-xs font-mono tracking-wider uppercase transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Itinerary</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0e0e0e] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80 border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#121212] text-white/50 font-mono text-[10px] tracking-widest uppercase">
                    <th className="py-3.5 px-4 sm:px-6">Title & Route</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Price Basis</th>
                    <th className="py-3.5 px-4">Updated</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {itineraries.map((itinerary) => (
                    <tr
                      key={itinerary.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Title & Slug */}
                      <td className="py-4 px-4 sm:px-6 max-w-xs sm:max-w-md">
                        <Link
                          href={`/dashboard/itineraries/${itinerary.id}`}
                          className="font-serif-luxury text-sm text-white font-normal group-hover:text-[#ffdbac] transition-colors block line-clamp-1"
                        >
                          {itinerary.title}
                        </Link>
                        <span className="text-[11px] font-mono text-[#c68642]/70 block truncate mt-0.5">
                          /{itinerary.slug}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(itinerary.status)}
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4 font-mono text-white/70">
                        {itinerary.nights !== null ? (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#c68642]" />
                            {itinerary.nights} night{itinerary.nights === 1 ? "" : "s"}
                          </span>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>

                      {/* Price Basis */}
                      <td className="py-4 px-4 font-mono text-white/80">
                        {itinerary.priceOnRequest ? (
                          <span className="text-[11px] text-[#f1c27d]">On Request</span>
                        ) : itinerary.startingPrice !== null ? (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-[#c68642]" />
                            <span>{Number(itinerary.startingPrice).toLocaleString()}</span>
                          </span>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>

                      {/* Updated At */}
                      <td className="py-4 px-4 text-white/50 text-[11px] font-mono">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-white/30" />
                          {new Date(itinerary.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/itineraries/${itinerary.id}`}
                            className="px-2.5 py-1.5 rounded border border-white/15 hover:border-[#c68642] text-white hover:text-[#ffdbac] font-serif-luxury tracking-wider text-[11px] uppercase transition-colors inline-flex items-center gap-1"
                          >
                            <span>{isViewer ? "View" : "Edit"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          {/* Admin-only Lifecycle Controls */}
                          {isAdmin && (
                            <>
                              {/* Publish button if DRAFT or IN_REVIEW */}
                              {(itinerary.status === "DRAFT" || itinerary.status === "IN_REVIEW") && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({ type: "publish", itinerary })
                                  }
                                  title="Publish to Live Website"
                                  className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded hover:bg-emerald-950/30 transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}

                              {/* Archive button if PUBLISHED */}
                              {itinerary.status === "PUBLISHED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({ type: "archive", itinerary })
                                  }
                                  title="Archive Itinerary"
                                  className="p-1.5 text-amber-400 hover:text-amber-300 rounded hover:bg-amber-950/30 transition-colors"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                              )}

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmModal({ type: "delete", itinerary })
                                }
                                title="Delete Itinerary Permanently"
                                className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal (Publish / Archive / Delete) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-[#111111] border border-[#8d5524]/40 rounded-xl p-6 shadow-2xl space-y-5 text-white">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#c68642] block mb-1">
                Admin Action Confirmation
              </span>
              <h3 className="font-serif-luxury text-xl font-normal text-white">
                {confirmModal.type === "publish" && "Publish Itinerary to Public Site?"}
                {confirmModal.type === "archive" && "Archive this Itinerary?"}
                {confirmModal.type === "delete" && "Permanently Delete Itinerary?"}
              </h3>
              <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
                {confirmModal.type === "publish" &&
                  `This will verify all requirements and make "${confirmModal.itinerary.title}" visible on the live public marketing website.`}
                {confirmModal.type === "archive" &&
                  `This will unpublish "${confirmModal.itinerary.title}" and move it to archived status.`}
                {confirmModal.type === "delete" &&
                  `Are you sure you want to permanently delete "${confirmModal.itinerary.title}"? All associated days and destination links will be erased.`}
              </p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 rounded text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={() => {
                  setConfirmModal(null);
                  setActionError(null);
                }}
                className="px-4 py-2 rounded text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={handleExecuteAction}
                className={`px-5 py-2.5 rounded text-xs font-serif-luxury tracking-wider uppercase font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  confirmModal.type === "delete"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : confirmModal.type === "publish"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-[#c68642] hover:bg-[#8d5524] text-[#ffdbac]"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>
                  {confirmModal.type === "publish" && "Confirm Publish"}
                  {confirmModal.type === "archive" && "Confirm Archive"}
                  {confirmModal.type === "delete" && "Delete Permanently"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
