"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Archive,
  Trash2,
  Send,
  Eye,
  Calendar,
  CalendarRange,
  Compass,
  FileText,
  MapPin,
  ListCheck,
  Image as ImageIcon,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { AuthUser } from "@/lib/auth/types";
import {
  ItineraryDetail,
  ItineraryStatus,
  ItineraryDay,
  ItineraryDestinationItem,
  ItineraryImage,
  AvailabilityPeriod,
} from "@/lib/itineraries/types";

// Sub-tabs
import OverviewTab from "@/components/dashboard/itineraries/OverviewTab";
import DaysTab from "@/components/dashboard/itineraries/DaysTab";
import DestinationsTab from "@/components/dashboard/itineraries/DestinationsTab";
import InclusionsTab from "@/components/dashboard/itineraries/InclusionsTab";
import GalleryTab from "@/components/dashboard/itineraries/GalleryTab";
import AvailabilityTab from "@/components/dashboard/itineraries/AvailabilityTab";

type TabKey = "overview" | "days" | "destinations" | "inclusions" | "gallery" | "availability";
type SaveStatus = "saved" | "unsaved" | "saving" | "error";

export default function ItineraryEditorPage() {
  const params = useParams();
  const router = useRouter();
  const itineraryId = (params?.id as string) || "";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Form State
  const [formState, setFormState] = useState<ItineraryDetail | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Autosave refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const stateRef = useRef<ItineraryDetail | null>(null);
  stateRef.current = formState;

  // 1. Initial Load: Auth & Itinerary Data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [authRes, itinRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch(`/api/itineraries/${itineraryId}`),
        ]);

        const authData = await authRes.json();
        const itinData = await itinRes.json();

        if (!isMounted) return;

        if (!authRes.ok || authData.status !== "ok" || !authData.user) {
          router.push(`/dashboard/login?from=/dashboard/itineraries/${itineraryId}`);
          return;
        }

        setUser(authData.user);

        if (!itinRes.ok || itinData.status !== "ok" || !itinData.itinerary) {
          setError(itinData.message || "Itinerary not found or access denied.");
          return;
        }

        setFormState(itinData.itinerary);
        setLastSavedAt(new Date(itinData.itinerary.updatedAt));
      } catch (err: any) {
        console.error("Load failed:", err);
        if (isMounted) setError("Failed to communicate with server.");
      } finally {
        if (isMounted) {
          setLoading(false);
          // Set initial load flag to false on next tick
          setTimeout(() => {
            isInitialLoad.current = false;
          }, 100);
        }
      }
    }

    if (itineraryId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [itineraryId, router]);

  // 2. Perform Save to Backend
  const executeSave = useCallback(
    async (overrideState?: ItineraryDetail) => {
      const current = overrideState || stateRef.current;
      if (!current || !itineraryId) return;

      // Viewer cannot save
      if (user?.role === "VIEWER") return;

      // Don't save if title is empty
      if (!current.title || current.title.trim() === "") {
        setSaveStatus("error");
        setSaveError("Title cannot be empty.");
        return;
      }

      setSaveStatus("saving");
      setSaveError(null);

      try {
        const payload: any = {
          title: current.title.trim(),
          slug: current.slug || undefined,
          overview: current.overview ?? null,
          nights: current.nights !== null ? Number(current.nights) : 0,
          priceOnRequest: current.priceOnRequest,
          startingPrice: current.priceOnRequest
            ? null
            : current.startingPrice
            ? Number(current.startingPrice)
            : null,
          availabilityStatus: current.availabilityStatus,
          inclusions: current.inclusions || [],
          exclusions: current.exclusions || [],
          travelInfo: current.travelInfo ?? null,
          routeMapUrl: current.routeMapUrl || "",
          days: (current.days || []).map((d, index) => ({
            dayNumber: index + 1,
            title: d.title || null,
            description: d.description || null,
            accommodation: d.accommodation || null,
            activities: d.activities || [],
          })),
          destinationIds: (current.destinations || []).map((d) => d.destination.id),
        };

        // If status is DRAFT or IN_REVIEW, we can update it
        if (current.status === "DRAFT" || current.status === "IN_REVIEW") {
          payload.status = current.status;
        }

        const res = await fetch(`/api/itineraries/${itineraryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || data.status !== "ok" || !data.itinerary) {
          throw new Error(data.message || "Autosave failed.");
        }

        // Keep local state in sync with server-updated fields (e.g. status, slug)
        setFormState((prev) => {
          if (!prev) return data.itinerary;
          return {
            ...prev,
            status: data.itinerary.status,
            slug: data.itinerary.slug,
            updatedAt: data.itinerary.updatedAt,
          };
        });

        setSaveStatus("saved");
        setLastSavedAt(new Date());
      } catch (err: any) {
        console.error("Autosave error:", err);
        setSaveStatus("error");
        setSaveError(err.message || "Failed to save changes.");
      }
    },
    [itineraryId, user?.role]
  );

  // 3. Field Change Handler with Debounce or Immediate Save
  const handleFieldChange = useCallback(
    (fields: Partial<ItineraryDetail>, immediate: boolean = false) => {
      if (user?.role === "VIEWER") return;

      const current = stateRef.current;
      if (!current) return;
      const next = { ...current, ...fields };
      setFormState(next);
      stateRef.current = next;

      if (!isInitialLoad.current) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }

        if (immediate) {
          executeSave(next);
        } else {
          setSaveStatus("unsaved");
          debounceTimerRef.current = setTimeout(() => {
            executeSave(next);
          }, 1500);
        }
      }
    },
    [executeSave, user?.role]
  );

  const saveStatusRef = useRef<SaveStatus>(saveStatus);
  saveStatusRef.current = saveStatus;

  // Warn if leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatusRef.current === "unsaved" || saveStatusRef.current === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Cleanup debounce timer only on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Actions (Publish, Archive, Delete)
  const handlePublish = async () => {
    if (!formState) return;
    setActionLoading(true);
    setActionError(null);

    try {
      // First ensure any pending autosave is persisted
      await executeSave();

      const res = await fetch(`/api/itineraries/${itineraryId}/publish`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Failed to publish itinerary.");
      }

      setFormState(data.itinerary);
      setShowPublishModal(false);
    } catch (err: any) {
      setActionError(err.message || "Publishing failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!formState) return;
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/archive`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Failed to archive itinerary.");
      }

      setFormState(data.itinerary);
      setShowArchiveModal(false);
    } catch (err: any) {
      setActionError(err.message || "Archiving failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/itineraries/${itineraryId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "Failed to delete itinerary.");
      }

      router.push("/dashboard/itineraries");
    } catch (err: any) {
      setActionError(err.message || "Deletion failed.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#080808]">
        <Loader2 className="w-8 h-8 text-[#c68642] animate-spin" />
        <p className="text-xs tracking-[0.25em] font-mono text-white/50 uppercase">
          Loading itinerary dossier...
        </p>
      </div>
    );
  }

  if (error || !formState || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#080808]">
        <div className="max-w-md p-8 bg-[#111] border border-red-900/40 rounded-xl space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-sm text-red-200">{error || "Failed to load itinerary."}</p>
          <Link
            href="/dashboard/itineraries"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c68642] text-[#080808] text-xs font-mono uppercase tracking-wider rounded font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Itineraries</span>
          </Link>
        </div>
      </div>
    );
  }

  const isViewer = user.role === "VIEWER";
  const isAdmin = user.role === "ADMIN";

  // Status Badge Helper
  const getStatusBadge = (status: ItineraryStatus) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-[#c68642]/10 border border-[#c68642]/40 text-[#ffdbac]">
            DRAFT
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-sky-500/10 border border-sky-500/40 text-sky-200">
            IN REVIEW
          </span>
        );
      case "PUBLISHED":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
            PUBLISHED
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-white/5 border border-white/20 text-white/50">
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] pb-16">
      <DashboardHeader user={user} />

      {/* Sticky Autosave & Control Bar */}
      <div className="sticky top-[69px] z-20 bg-[#0c0c0c]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Back Link & Title/Status */}
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/dashboard/itineraries"
              className="p-2 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors shrink-0"
              title="Return to list"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif-luxury text-base sm:text-lg text-white font-light truncate">
                  {formState.title || "Untitled Itinerary"}
                </h1>
                {getStatusBadge(formState.status)}
              </div>
              <div className="text-[11px] font-mono text-white/40 flex items-center gap-2 truncate">
                <span>/{formState.slug || "slug-pending"}</span>
                {formState.nights !== null && (
                  <span>• {formState.nights} Nights</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Autosave Status & Action Controls */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
            {/* Viewer Warning Badge */}
            {isViewer && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-white/5 border border-white/15 text-white/60">
                <Eye className="w-3.5 h-3.5" />
                Read-Only Clearance
              </span>
            )}

            {/* Autosave Status Indicator */}
            {!isViewer && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/[0.02] border border-white/10 text-xs font-mono">
                {saveStatus === "saving" && (
                  <span className="flex items-center gap-1.5 text-[#ffdbac]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c68642]" />
                    <span>Saving changes...</span>
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All changes saved</span>
                  </span>
                )}
                {saveStatus === "unsaved" && (
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Unsaved changes</span>
                  </span>
                )}
                {saveStatus === "error" && (
                  <button
                    onClick={() => executeSave()}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>Save failed (Retry)</span>
                  </button>
                )}
              </div>
            )}

            {/* In Review Status Toggle (For Editor/Author when DRAFT/IN_REVIEW) */}
            {!isViewer && (formState.status === "DRAFT" || formState.status === "IN_REVIEW") && (
              <select
                value={formState.status}
                onChange={(e) => {
                  const newStatus = e.target.value as ItineraryStatus;
                  handleFieldChange({ status: newStatus }, true);
                }}
                className="bg-[#141414] border border-white/15 hover:border-white/30 text-white rounded px-3 py-1.5 text-xs font-serif-luxury tracking-wider uppercase focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">Status: Draft</option>
                <option value="IN_REVIEW">Status: Ready for Review</option>
              </select>
            )}

            {/* Admin Action: Publish */}
            {isAdmin && formState.status !== "PUBLISHED" && (
              <button
                onClick={() => {
                  setActionError(null);
                  setShowPublishModal(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
            )}

            {/* Admin Action: Archive */}
            {isAdmin && formState.status === "PUBLISHED" && (
              <button
                onClick={() => {
                  setActionError(null);
                  setShowArchiveModal(true);
                }}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white/80 hover:text-white rounded text-xs font-serif-luxury tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}

            {/* Admin Action: Delete */}
            {isAdmin && (
              <button
                onClick={() => {
                  setActionError(null);
                  setShowDeleteModal(true);
                }}
                className="p-2 rounded bg-white/[0.03] hover:bg-red-950/40 border border-white/10 hover:border-red-800/60 text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Itinerary"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="max-w-[1600px] mx-auto mt-4 pt-3 border-t border-white/10 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-serif-luxury tracking-wider uppercase rounded-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac]"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("days")}
            className={`px-4 py-2 text-xs font-serif-luxury tracking-wider uppercase rounded-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "days"
                ? "bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac]"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Days ({formState.days?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("destinations")}
            className={`px-4 py-2 text-xs font-serif-luxury tracking-wider uppercase rounded-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "destinations"
                ? "bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac]"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Destinations ({formState.destinations?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("inclusions")}
            className={`px-4 py-2 text-xs font-serif-luxury tracking-wider uppercase rounded-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "inclusions"
                ? "bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac]"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <ListCheck className="w-3.5 h-3.5" />
            <span>Inclusions & Notes</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 text-xs font-serif-luxury tracking-wider uppercase rounded-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac]"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gallery ({formState.images?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("availability")}
            className={`px-4 py-2 text-xs font-serif-luxury tracking-wider uppercase rounded-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "availability"
                ? "bg-[#c68642]/20 border border-[#c68642]/50 text-[#ffdbac]"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Availability ({formState.availabilityPeriods?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Main Tab View Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 pt-8">
        {activeTab === "overview" && (
          <OverviewTab
            data={formState}
            onChange={handleFieldChange}
            disabled={isViewer}
          />
        )}

        {activeTab === "days" && (
          <DaysTab
            days={formState.days || []}
            onChange={(days: ItineraryDay[]) => handleFieldChange({ days })}
            disabled={isViewer}
          />
        )}

        {activeTab === "destinations" && (
          <DestinationsTab
            selectedIds={(formState.destinations || []).map((d) => d.destination.id)}
            onChange={(selectedIds: string[]) => {
              handleFieldChange({
                destinations: selectedIds.map((id) => ({
                  destinationId: id,
                  destination: { id, name: "", slug: "" },
                })),
              });
            }}
            disabled={isViewer}
          />
        )}

        {activeTab === "inclusions" && (
          <InclusionsTab
            inclusions={formState.inclusions || []}
            exclusions={formState.exclusions || []}
            travelInfo={formState.travelInfo || ""}
            routeMapUrl={formState.routeMapUrl || ""}
            onChange={handleFieldChange}
            disabled={isViewer}
          />
        )}

        {activeTab === "gallery" && (
          <GalleryTab
            itineraryId={itineraryId}
            images={formState.images || []}
            onImagesChange={(images: ItineraryImage[]) => {
              setFormState((prev) => (prev ? { ...prev, images } : prev));
            }}
            disabled={isViewer}
          />
        )}

        {activeTab === "availability" && (
          <AvailabilityTab
            itineraryId={itineraryId}
            periods={formState.availabilityPeriods || []}
            onPeriodsChange={(availabilityPeriods: AvailabilityPeriod[]) => {
              setFormState((prev) => (prev ? { ...prev, availabilityPeriods } : prev));
            }}
            disabled={isViewer}
          />
        )}
      </main>

      {/* ─── MODAL: PUBLISH ITINERARY ─────────────────────── */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/15 rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="font-serif-luxury text-xl text-white font-light flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Publish Safari Itinerary</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                Publishing transitions this itinerary to the public marketing layer. Verify that all
                essential details are verified before proceeding.
              </p>
            </div>

            {/* Validation Checklist */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                {formState.title && formState.title.trim().length > 0 ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="text-white/80">Valid Itinerary Title</span>
              </div>
              <div className="flex items-center gap-2">
                {formState.days && formState.days.length > 0 ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="text-white/80">
                  At least one day configured ({formState.days?.length || 0} currently)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {formState.priceOnRequest ||
                (formState.startingPrice !== null && Number(formState.startingPrice) > 0) ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="text-white/80">Starting price or Price On Request enabled</span>
              </div>
            </div>

            {actionError && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200">
                {actionError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-serif-luxury uppercase tracking-wider text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-serif-luxury tracking-wider uppercase flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Confirm & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: ARCHIVE ITINERARY ─────────────────────── */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/15 rounded-xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="font-serif-luxury text-xl text-white font-light flex items-center gap-2">
                <Archive className="w-5 h-5 text-white/70" />
                <span>Archive Itinerary</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                Archiving withdraws this itinerary from the public site. It will remain preserved in
                the operations archive and can be reviewed at any time.
              </p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200">
                {actionError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowArchiveModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-serif-luxury uppercase tracking-wider text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-serif-luxury tracking-wider uppercase flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
                <span>Confirm Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DELETE ITINERARY ───────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-red-900/40 rounded-xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="font-serif-luxury text-xl text-red-300 font-light flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <span>Delete Itinerary</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                This will permanently eliminate <span className="text-white font-medium">"{formState.title}"</span> along with all attached day schedules, images, and destination associations. This action cannot be undone.
              </p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200">
                {actionError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-serif-luxury uppercase tracking-wider text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-serif-luxury tracking-wider uppercase flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
