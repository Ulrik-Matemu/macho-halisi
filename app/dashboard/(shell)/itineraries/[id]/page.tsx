"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
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
  Eye,
  Calendar,
  CalendarRange,
  Compass,
  MapPin,
  ListCheck,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/lib/dashboard/auth-context";
import { useSetBreadcrumb } from "@/lib/dashboard/breadcrumb-context";
import {
  ItineraryDetail,
  ItineraryStatus,
  ItineraryDay,
  ItineraryImage,
  AvailabilityPeriod,
} from "@/lib/itineraries/types";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import Button from "@/components/dashboard/ui/Button";
import IconButton from "@/components/dashboard/ui/IconButton";
import Dialog from "@/components/dashboard/ui/Dialog";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

import OverviewTab from "@/components/dashboard/itineraries/OverviewTab";
import DaysTab from "@/components/dashboard/itineraries/DaysTab";
import DestinationsTab from "@/components/dashboard/itineraries/DestinationsTab";
import InclusionsTab from "@/components/dashboard/itineraries/InclusionsTab";
import GalleryTab from "@/components/dashboard/itineraries/GalleryTab";
import AvailabilityTab from "@/components/dashboard/itineraries/AvailabilityTab";
import PublishChangesModal from "@/components/dashboard/itineraries/PublishChangesModal";

type TabKey = "overview" | "days" | "destinations" | "inclusions" | "gallery" | "availability";
type SaveStatus = "saved" | "unsaved" | "saving" | "error";

const TABS: { key: TabKey; label: string; icon: typeof Compass; count?: (d: ItineraryDetail) => number }[] = [
  { key: "overview", label: "Overview", icon: Compass },
  { key: "days", label: "Days", icon: Calendar, count: (d) => d.days?.length || 0 },
  { key: "destinations", label: "Destinations", icon: MapPin, count: (d) => d.destinations?.length || 0 },
  { key: "inclusions", label: "Inclusions & notes", icon: ListCheck },
  { key: "gallery", label: "Gallery", icon: ImageIcon, count: (d) => d.images?.length || 0 },
  { key: "availability", label: "Availability", icon: CalendarRange, count: (d) => d.availabilityPeriods?.length || 0 },
];

export default function ItineraryEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const itineraryId = (params?.id as string) || "";
  const tabsId = useId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({} as any);

  const [formState, setFormState] = useState<ItineraryDetail | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [liveSnapshot, setLiveSnapshot] = useState<ItineraryDetail | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [showPublishChangesModal, setShowPublishChangesModal] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const stateRef = useRef<ItineraryDetail | null>(null);
  stateRef.current = formState;

  useSetBreadcrumb(formState?.title || undefined);

  // 1. Initial Load
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const itinRes = await fetch(`/api/itineraries/${itineraryId}`);
        const itinData = await itinRes.json();
        if (!isMounted) return;

        if (!itinRes.ok || itinData.status !== "ok" || !itinData.itinerary) {
          setError(itinData.message || "Itinerary not found or access denied.");
          return;
        }

        const live: ItineraryDetail = itinData.itinerary;
        setLiveSnapshot(live);

        if (live.status === "PUBLISHED") {
          try {
            const revRes = await fetch(`/api/itineraries/${itineraryId}/revision`);
            const revData = await revRes.json();
            if (revRes.ok && revData.status === "ok" && revData.revision && revData.preview) {
              setFormState(revData.preview);
              setHasPendingChanges(true);
            } else {
              setFormState(live);
            }
          } catch (revErr) {
            console.error("Failed to load pending revision:", revErr);
            setFormState(live);
          }
        } else {
          setFormState(live);
        }
      } catch (err: any) {
        console.error("Load failed:", err);
        if (isMounted) setError("Failed to communicate with server.");
      } finally {
        if (isMounted) {
          setLoading(false);
          setTimeout(() => {
            isInitialLoad.current = false;
          }, 100);
        }
      }
    }

    if (itineraryId) loadData();
    return () => {
      isMounted = false;
    };
  }, [itineraryId]);

  // 2. Save
  const executeSave = useCallback(
    async (overrideState?: ItineraryDetail) => {
      const current = overrideState || stateRef.current;
      if (!current || !itineraryId) return;
      if (user?.role === "VIEWER") return;

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
          startingPrice: current.priceOnRequest ? null : current.startingPrice ? Number(current.startingPrice) : null,
          availabilityStatus: current.availabilityStatus,
          inclusions: current.inclusions || [],
          exclusions: current.exclusions || [],
          travelInfo: current.travelInfo ?? null,
          routeMapUrl: current.routeMapUrl || "",
          showRouteMap: current.showRouteMap ?? true,
          days: (current.days || []).map((d, index) => ({
            dayNumber: index + 1,
            title: d.title || null,
            description: d.description || null,
            accommodation: d.accommodation || null,
            activities: d.activities || [],
            latitude: d.latitude ?? null,
            longitude: d.longitude ?? null,
            heroImageId: d.heroImageId || null,
            highlight: Boolean(d.highlight),
          })),
          destinationIds: (current.destinations || []).map((d) => d.destination.id),
        };

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

        setFormState((prev) =>
          prev ? { ...prev, status: data.itinerary.status, slug: data.itinerary.slug, updatedAt: data.itinerary.updatedAt } : data.itinerary
        );

        setHasPendingChanges(Boolean(data.pendingReview));
        setSaveStatus("saved");
      } catch (err: any) {
        console.error("Autosave error:", err);
        setSaveStatus("error");
        setSaveError(err.message || "Failed to save changes.");
      }
    },
    [itineraryId, user?.role]
  );

  // 3. Field change handler
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
          debounceTimerRef.current = setTimeout(() => executeSave(next), 1500);
        }
      }
    },
    [executeSave, user?.role]
  );

  const saveStatusRef = useRef<SaveStatus>(saveStatus);
  saveStatusRef.current = saveStatus;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatusRef.current === "unsaved" || saveStatusRef.current === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Actions
  const handlePublish = async () => {
    if (!formState) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await executeSave();
      const res = await fetch(`/api/itineraries/${itineraryId}/publish`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") throw new Error(data.message || "Failed to publish itinerary.");
      setFormState(data.itinerary);
      setLiveSnapshot(data.itinerary);
      setShowPublishModal(false);
    } catch (err: any) {
      setActionError(err.message || "Publishing failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishChanges = async () => {
    const res = await fetch(`/api/itineraries/${itineraryId}/publish-changes`, { method: "PATCH" });
    const data = await res.json();
    if (!res.ok || data.status !== "ok" || !data.itinerary) throw new Error(data.message || "Failed to publish changes.");
    setFormState(data.itinerary);
    setLiveSnapshot(data.itinerary);
    setHasPendingChanges(false);
    setShowPublishChangesModal(false);
  };

  const handleDiscardChanges = async () => {
    setDiscarding(true);
    try {
      await fetch(`/api/itineraries/${itineraryId}/revision`, { method: "DELETE" });
      const res = await fetch(`/api/itineraries/${itineraryId}`);
      const data = await res.json();
      if (res.ok && data.status === "ok" && data.itinerary) {
        setFormState(data.itinerary);
        setLiveSnapshot(data.itinerary);
      }
      setHasPendingChanges(false);
    } catch (err) {
      console.error("Failed to discard pending changes:", err);
    } finally {
      setDiscarding(false);
    }
  };

  const handleArchive = async () => {
    if (!formState) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/archive`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") throw new Error(data.message || "Failed to archive itinerary.");
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
      const res = await fetch(`/api/itineraries/${itineraryId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") throw new Error(data.message || "Failed to delete itinerary.");
      router.push("/dashboard/itineraries");
    } catch (err: any) {
      setActionError(err.message || "Deletion failed.");
      setActionLoading(false);
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = TABS[nextIndex].key;
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--dash-accent)" }} />
        <p role="status" className="text-sm" style={{ color: "var(--dash-text-subtle)" }}>
          Loading itinerary…
        </p>
      </div>
    );
  }

  if (error || !formState || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="max-w-md p-8 rounded-xl space-y-4" style={{ background: "var(--dash-surface-1)", border: "1px solid var(--dash-border-strong)" }}>
          <AlertCircle className="w-8 h-8 mx-auto" style={{ color: "var(--dash-status-danger)" }} />
          <p role="alert" className="text-sm" style={{ color: "var(--dash-text)" }}>
            {error || "Failed to load itinerary."}
          </p>
          <Link href="/dashboard/itineraries">
            <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
              Return to itineraries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isViewer = user.role === "VIEWER";
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="-mx-4 sm:-mx-6 -my-8">
      {/* Sticky editor control bar — anchored to the topbar's published
          height instead of the old magic-number top-[69px], which
          desynced the moment the header wrapped at narrow widths. */}
      <div
        className="sticky z-20 px-4 sm:px-6 py-3.5"
        style={{
          top: "var(--dash-topbar-h)",
          background: "color-mix(in srgb, var(--dash-bg) 96%, transparent)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--dash-border)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard/itineraries" className="dash-focusable p-2 rounded-md shrink-0" style={{ color: "var(--dash-text-subtle)" }} aria-label="Return to itineraries list">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <h1 className="font-serif-luxury text-base sm:text-lg truncate" style={{ color: "var(--dash-text)" }}>
                  {formState.title || "Untitled itinerary"}
                </h1>
                <StatusBadge status={formState.status} />
              </div>
              <div className="dash-code flex items-center gap-2 truncate text-xs" style={{ color: "var(--dash-text-subtle)" }}>
                <span>/{formState.slug || "slug-pending"}</span>
                {formState.nights !== null && <span>· {formState.nights} nights</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
            {isViewer && (
              <span className="dash-badge dash-badge--neutral">
                <Eye className="w-3.5 h-3.5" />
                View only
              </span>
            )}

            {!isViewer && (
              <div role="status" aria-live="polite" aria-atomic="true" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
                {saveStatus === "saving" && (
                  <span className="flex items-center gap-1.5" style={{ color: "var(--dash-accent)" }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving…
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="flex items-center gap-1.5" style={{ color: hasPendingChanges ? "var(--dash-accent)" : "var(--dash-status-published)" }}>
                    <Check className="w-3.5 h-3.5" />
                    {hasPendingChanges ? "Draft saved (not yet live)" : "All changes saved"}
                  </span>
                )}
                {saveStatus === "unsaved" && (
                  <span className="flex items-center gap-1.5" style={{ color: "var(--dash-status-draft)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: "currentColor" }} />
                    Unsaved changes
                  </span>
                )}
                {saveStatus === "error" && (
                  <button type="button" onClick={() => executeSave()} className="dash-focusable flex items-center gap-1.5 underline cursor-pointer" style={{ color: "var(--dash-status-danger)" }}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    Save failed — retry
                  </button>
                )}
              </div>
            )}

            {!isViewer && (formState.status === "DRAFT" || formState.status === "IN_REVIEW") && (
              <label className="sr-only" htmlFor="itinerary-status-select">
                Itinerary status
              </label>
            )}
            {!isViewer && (formState.status === "DRAFT" || formState.status === "IN_REVIEW") && (
              <select
                id="itinerary-status-select"
                value={formState.status}
                onChange={(e) => handleFieldChange({ status: e.target.value as ItineraryStatus }, true)}
                className="dash-focusable rounded-md px-3 py-2 text-sm cursor-pointer"
                style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border-strong)", color: "var(--dash-text)" }}
              >
                <option value="DRAFT">Status: Draft</option>
                <option value="IN_REVIEW">Status: Ready for review</option>
              </select>
            )}

            {isAdmin && formState.status !== "PUBLISHED" && (
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => {
                  setActionError(null);
                  setShowPublishModal(true);
                }}
              >
                Publish
              </Button>
            )}

            {isAdmin && formState.status === "PUBLISHED" && (
              <Button
                variant="secondary"
                size="sm"
                icon={<Archive className="w-3.5 h-3.5" />}
                onClick={() => {
                  setActionError(null);
                  setShowArchiveModal(true);
                }}
              >
                Archive
              </Button>
            )}

            {isAdmin && (
              <IconButton
                label="Delete itinerary"
                tone="danger"
                onClick={() => {
                  setActionError(null);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </IconButton>
            )}
          </div>
        </div>

        {formState.status === "PUBLISHED" && hasPendingChanges && (
          <div
            className="mt-4 px-4 py-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)" }}
          >
            <span className="text-sm flex items-center gap-2" style={{ color: "var(--dash-accent)" }}>
              <Eye className="w-3.5 h-3.5 shrink-0" />
              You have unpublished changes — visitors are still seeing the live version.
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="primary" size="sm" onClick={() => setShowPublishChangesModal(true)}>
                Review & publish
              </Button>
              {!isViewer && (
                <Button variant="ghost" size="sm" loading={discarding} onClick={handleDiscardChanges}>
                  Discard changes
                </Button>
              )}
            </div>
          </div>
        )}

        <div role="tablist" aria-label="Itinerary sections" className="mt-4 pt-3 flex items-center gap-1 flex-wrap" style={{ borderTop: "1px solid var(--dash-border)" }}>
          {TABS.map((tab, index) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            const count = tab.count?.(formState);
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[tab.key] = el;
                }}
                role="tab"
                id={`${tabsId}-tab-${tab.key}`}
                aria-selected={active}
                aria-controls={`${tabsId}-panel-${tab.key}`}
                tabIndex={active ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                onClick={() => setActiveTab(tab.key)}
                className="dash-focusable px-3.5 py-2 text-sm rounded-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                style={{
                  color: active ? "var(--dash-accent)" : "var(--dash-text-muted)",
                  background: active ? "var(--dash-accent-soft)" : "transparent",
                  border: active ? "1px solid var(--dash-accent-soft-border)" : "1px solid transparent",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>
                  {tab.label}
                  {count !== undefined ? ` (${count})` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-8 pb-16">
        {TABS.map((tab) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${tabsId}-panel-${tab.key}`}
            aria-labelledby={`${tabsId}-tab-${tab.key}`}
            tabIndex={-1}
            hidden={activeTab !== tab.key}
          >
            {tab.key === "overview" && activeTab === "overview" && (
              <OverviewTab data={formState} onChange={handleFieldChange} disabled={isViewer} />
            )}
            {tab.key === "days" && activeTab === "days" && (
              <DaysTab
                days={formState.days || []}
                onChange={(days: ItineraryDay[]) => handleFieldChange({ days })}
                images={formState.images || []}
                destinations={formState.destinations || []}
                disabled={isViewer}
              />
            )}
            {tab.key === "destinations" && activeTab === "destinations" && (
              <DestinationsTab
                selectedIds={(formState.destinations || []).map((d) => d.destination.id)}
                onChange={(selectedIds: string[]) =>
                  handleFieldChange({
                    destinations: selectedIds.map((id) => ({ destinationId: id, destination: { id, name: "", slug: "" } })),
                  })
                }
                disabled={isViewer}
              />
            )}
            {tab.key === "inclusions" && activeTab === "inclusions" && (
              <InclusionsTab
                inclusions={formState.inclusions || []}
                exclusions={formState.exclusions || []}
                travelInfo={formState.travelInfo || ""}
                routeMapUrl={formState.routeMapUrl || ""}
                showRouteMap={formState.showRouteMap ?? true}
                onChange={handleFieldChange}
                disabled={isViewer}
              />
            )}
            {tab.key === "gallery" && activeTab === "gallery" && (
              <GalleryTab
                itineraryId={itineraryId}
                images={formState.images || []}
                onImagesChange={(images: ItineraryImage[]) => setFormState((prev) => (prev ? { ...prev, images } : prev))}
                isPublished={formState.status === "PUBLISHED"}
                disabled={isViewer}
              />
            )}
            {tab.key === "availability" && activeTab === "availability" && (
              <AvailabilityTab
                itineraryId={itineraryId}
                periods={formState.availabilityPeriods || []}
                onPeriodsChange={(availabilityPeriods: AvailabilityPeriod[]) =>
                  setFormState((prev) => (prev ? { ...prev, availabilityPeriods } : prev))
                }
                isPublished={formState.status === "PUBLISHED"}
                disabled={isViewer}
              />
            )}
          </div>
        ))}
      </div>

      {showPublishChangesModal && liveSnapshot && (
        <PublishChangesModal
          live={liveSnapshot}
          pending={formState}
          isAdmin={isAdmin}
          onPublish={handlePublishChanges}
          onClose={() => setShowPublishChangesModal(false)}
        />
      )}

      <Dialog
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish safari itinerary"
        description="Publishing transitions this itinerary to the public marketing site. Verify the essentials below before proceeding."
        footer={
          <>
            <Button variant="ghost" disabled={actionLoading} onClick={() => setShowPublishModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={actionLoading} icon={<Sparkles className="w-4 h-4" />} onClick={handlePublish}>
              Confirm & publish
            </Button>
          </>
        }
      >
        <div className="space-y-2 p-3.5 rounded-lg text-sm" style={{ background: "var(--dash-surface-2)", border: "1px solid var(--dash-border)" }}>
          <ChecklistRow ok={Boolean(formState.title && formState.title.trim().length > 0)} label="Valid itinerary title" />
          <ChecklistRow
            ok={Boolean(formState.days && formState.days.length > 0)}
            label={`At least one day configured (${formState.days?.length || 0} currently)`}
          />
          <ChecklistRow
            ok={Boolean(formState.priceOnRequest || (formState.startingPrice !== null && Number(formState.startingPrice) > 0))}
            label="Starting price or Price on Request enabled"
          />
        </div>
        {actionError && (
          <div className="mt-4">
            <InlineMessage tone="error">{actionError}</InlineMessage>
          </div>
        )}
      </Dialog>

      <Dialog
        open={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        title="Archive itinerary"
        description="Archiving withdraws this itinerary from the public site. It remains preserved in the operations archive and can be reviewed at any time."
        footer={
          <>
            <Button variant="ghost" disabled={actionLoading} onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button variant="secondary" loading={actionLoading} icon={<Archive className="w-4 h-4" />} onClick={handleArchive}>
              Confirm archive
            </Button>
          </>
        }
      >
        {actionError && <InlineMessage tone="error">{actionError}</InlineMessage>}
      </Dialog>

      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete itinerary"
        description={`This will permanently remove "${formState.title}" along with all attached day schedules, images, and destination associations. This cannot be undone.`}
        footer={
          <>
            <Button variant="ghost" disabled={actionLoading} onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={actionLoading} icon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
              Delete permanently
            </Button>
          </>
        }
      >
        {actionError && <InlineMessage tone="error">{actionError}</InlineMessage>}
      </Dialog>
    </div>
  );
}

function ChecklistRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <Check className="w-4 h-4 shrink-0" style={{ color: "var(--dash-status-published)" }} />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--dash-status-danger)" }} />
      )}
      <span style={{ color: "var(--dash-text-muted)" }}>{label}</span>
    </div>
  );
}
