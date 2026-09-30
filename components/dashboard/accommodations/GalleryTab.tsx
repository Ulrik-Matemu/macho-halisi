"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { AccommodationImage, effectiveAltText, effectiveSortOrder, hasPendingImageChange } from "@/lib/accommodations/types";
import { ImagePlus, Trash2, ArrowLeft, ArrowRight, Loader2, UploadCloud, Star, RotateCcw } from "lucide-react";
import Field, { inputClass, inputStyle } from "@/components/dashboard/ui/Field";
import IconButton from "@/components/dashboard/ui/IconButton";
import { InlineMessage } from "@/components/dashboard/ui/Toast";

interface GalleryTabProps {
  accommodationId: string;
  images: AccommodationImage[];
  onImagesChange: (images: AccommodationImage[]) => void;
  /** The accommodation's explicit hero/cover image — null falls back to the first gallery image. */
  heroImageId: string | null;
  onHeroImageChange: (heroImageId: string | null) => void;
  isPublished?: boolean;
  /** Called whenever a gallery action stages a change awaiting publish (only meaningful while isPublished). */
  onPendingChange?: () => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Gallery manager for an accommodation — mirrors the itineraries GalleryTab
 * but targets the /api/accommodations/:id/images endpoints.
 */
export default function GalleryTab({
  accommodationId,
  images = [],
  onImagesChange,
  heroImageId,
  onHeroImageChange,
  isPublished = false,
  onPendingChange,
  disabled = false,
}: GalleryTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [savingAltId, setSavingAltId] = useState<string | null>(null);

  const sortedImages = [...images].sort((a, b) => effectiveSortOrder(a) - effectiveSortOrder(b));
  const effectiveHeroId = heroImageId ?? sortedImages[0]?.id ?? null;

  const handleFiles = async (files: FileList | null) => {
    if (disabled || !files || files.length === 0) return;
    setUploadError(null);
    const file = files[0];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(`Invalid file format "${file.type}". Only JPEG, PNG, WebP, and AVIF are allowed.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File exceeds maximum 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await fetch("/api/uploads/image", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || uploadData.status === "error") {
        setUploadError(uploadData.message || "Failed to upload image file");
        return;
      }

      const { url, publicId } = uploadData;
      const nextSortOrder = sortedImages.length;
      const cleanAlt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      const attachRes = await fetch(`/api/accommodations/${accommodationId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, cloudinaryPublicId: publicId, sortOrder: nextSortOrder, altText: cleanAlt }),
      });
      const attachData = await attachRes.json();
      if (!attachRes.ok || attachData.status === "error") {
        setUploadError(attachData.message || "Failed to attach image to accommodation");
        return;
      }
      if (attachData.image) {
        onImagesChange([...images, attachData.image]);
        if (isPublished) onPendingChange?.();
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
      setUploadError("Network error while uploading image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (disabled || deletingId) return;
    setDeletingId(imageId);
    setUploadError(null);
    try {
      const res = await fetch(`/api/accommodations/${accommodationId}/images/${imageId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setUploadError(data.message || "Failed to delete image");
        return;
      }
      if (data.image) {
        // Staged for removal, or a staged removal undone — the row stays,
        // only its status changed.
        onImagesChange(images.map((img) => (img.id === imageId ? data.image : img)));
        if (isPublished) onPendingChange?.();
      } else {
        // Hard-deleted for real (never published, or accommodation not published).
        onImagesChange(images.filter((img) => img.id !== imageId));
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
      setUploadError("Network error while removing image");
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Persists a full reorder, applied optimistically. Purely a gallery
   * browsing/display concern — the hero image is the separate, explicit
   * heroImageId toggle below, independent of position.
   */
  const moveImage = async (fromIndex: number, toIndex: number) => {
    if (disabled || reordering || toIndex < 0 || toIndex >= sortedImages.length) return;
    const list = [...sortedImages];
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);

    const previousOrder = sortedImages;
    setReordering(true);
    setUploadError(null);
    onImagesChange(list.map((img, idx) => ({ ...img, sortOrder: idx })));
    try {
      const res = await fetch(`/api/accommodations/${accommodationId}/images/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: list.map((img) => img.id) }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setUploadError(data.message || "Failed to save the new image order");
        onImagesChange(previousOrder);
        return;
      }
      if (Array.isArray(data.images)) onImagesChange(data.images);
      if (data.pendingReview) onPendingChange?.();
    } catch (err) {
      console.error("Failed to save image order:", err);
      setUploadError("Network error while saving the new image order");
      onImagesChange(previousOrder);
    } finally {
      setReordering(false);
    }
  };

  const updateAltText = (imageId: string, newAlt: string) => {
    if (disabled) return;
    onImagesChange(
      images.map((img) => {
        if (img.id !== imageId) return img;
        // Optimistic local echo of what persistAltText (below) will do —
        // a LIVE image on a published accommodation stages into pendingAltText
        // rather than overwriting the live value.
        return isPublished && img.status === "LIVE" ? { ...img, pendingAltText: newAlt } : { ...img, altText: newAlt };
      })
    );
  };

  const persistAltText = async (imageId: string, altText: string) => {
    if (disabled) return;
    setSavingAltId(imageId);
    setUploadError(null);
    try {
      const res = await fetch(`/api/accommodations/${accommodationId}/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText: altText || null }),
      });
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        setUploadError(data.message || "Failed to save alt text");
        return;
      }
      if (data.image) onImagesChange(images.map((img) => (img.id === imageId ? data.image : img)));
      if (data.pendingReview) onPendingChange?.();
    } catch (err) {
      console.error("Failed to save alt text:", err);
      setUploadError("Network error while saving alt text");
    } finally {
      setSavingAltId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid var(--dash-border)" }}>
        <div>
          <h3 className="dash-subtitle flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <ImagePlus className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Photo gallery & hero visual
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--dash-text-subtle)" }}>
            Upload high-resolution photography of rooms, grounds, views and dining. Click the star on any image to
            make it the hero — the one shown on the public site.
          </p>
        </div>
        <span className="dash-code text-xs shrink-0" style={{ color: "var(--dash-text-subtle)" }}>
          {images.length} image{images.length === 1 ? "" : "s"}
        </span>
      </div>

      {isPublished && (
        <p className="text-sm" style={{ color: "var(--dash-accent)" }}>
          This accommodation is published — gallery changes (new photos, removals, reordering, the hero image, alt
          text) are staged here and only go live once an admin publishes the pending changes, the same as every
          other field.
        </p>
      )}

      {uploadError && <InlineMessage tone="error">{uploadError}</InlineMessage>}

      {!disabled && (
        <div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <div
            role="button"
            tabIndex={0}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !uploading) fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className="dash-focusable p-8 sm:p-10 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${isDragOver ? "var(--dash-accent)" : "var(--dash-border-strong)"}`,
              background: isDragOver ? "var(--dash-accent-soft)" : "var(--dash-surface-1)",
              opacity: uploading ? 0.6 : 1,
              pointerEvents: uploading ? "none" : "auto",
            }}
          >
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--dash-accent)" }} />
                <p className="text-sm" style={{ color: "var(--dash-accent)" }}>
                  Uploading and processing image…
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: "var(--dash-accent-soft)", border: "1px solid var(--dash-accent-soft-border)", color: "var(--dash-accent)" }}>
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>
                    Click to select or drag and drop photos
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--dash-text-subtle)" }}>
                    JPEG, PNG, WebP, or AVIF (up to 10MB per file)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {sortedImages.length === 0 ? (
        <div className="p-8 text-center rounded-lg text-sm" style={{ border: "1px dashed var(--dash-border-strong)", color: "var(--dash-text-subtle)" }}>
          No images uploaded yet. Upload high-quality property photography above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedImages.map((img, idx) => {
            const isHero = img.id === effectiveHeroId;
            const isPendingDelete = img.status === "PENDING_DELETE";
            const pending = hasPendingImageChange(img);
            return (
              <div
                key={img.id}
                className="rounded-lg overflow-hidden flex flex-col justify-between"
                style={{
                  background: "var(--dash-surface-1)",
                  border: `1px solid ${isPendingDelete ? "var(--dash-status-danger)" : "var(--dash-border)"}`,
                  opacity: isPendingDelete ? 0.6 : 1,
                }}
              >
                <div className="relative aspect-[16/10] bg-black/40 overflow-hidden">
                  <Image src={img.url} alt={effectiveAltText(img) || `Property photo ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover object-center" />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {isHero && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: "var(--dash-accent-fill)", color: "var(--dash-accent-on-fill)" }}>
                        <Star className="w-3 h-3" fill="currentColor" />
                        Hero
                      </span>
                    )}
                    {isPendingDelete ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: "var(--dash-status-danger)", color: "var(--dash-accent-on-fill)" }}>
                        Pending removal
                      </span>
                    ) : (
                      img.status === "PENDING_ADD" && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: "var(--dash-surface-3)", color: "var(--dash-text)" }}>
                          Pending
                        </span>
                      )
                    )}
                    {!isPendingDelete && img.status !== "PENDING_ADD" && pending && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ background: "var(--dash-surface-3)", color: "var(--dash-text)" }}>
                        Edited
                      </span>
                    )}
                  </div>
                  <span className="dash-code absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px]" style={{ background: "rgb(0 0 0 / 65%)", color: "var(--dash-text-muted)" }}>
                    #{idx + 1}
                  </span>
                </div>

                <div className="p-3.5 space-y-3">
                  <Field label="Alt text (accessibility)">
                    {({ id }) => (
                      <input
                        id={id}
                        type="text"
                        disabled={disabled || isPendingDelete}
                        value={effectiveAltText(img)}
                        onChange={(e) => updateAltText(img.id, e.target.value)}
                        onBlur={(e) => persistAltText(img.id, e.target.value)}
                        placeholder="Describe scene..."
                        className={`${inputClass} py-1.5`}
                        style={inputStyle}
                      />
                    )}
                  </Field>
                  {savingAltId === img.id && (
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--dash-text-subtle)" }}>
                      <Loader2 className="w-3 h-3 animate-spin" /> Saving…
                    </p>
                  )}

                  {!disabled && (
                    <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--dash-border)" }}>
                      <div className="flex items-center gap-1">
                        <IconButton label="Move image earlier" disabled={idx === 0 || reordering || isPendingDelete} onClick={() => moveImage(idx, idx - 1)}>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </IconButton>
                        <IconButton label="Move image later" disabled={idx === sortedImages.length - 1 || reordering || isPendingDelete} onClick={() => moveImage(idx, idx + 1)}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </IconButton>
                        {!isHero && !isPendingDelete && (
                          <IconButton label="Set as hero image" tone="warning" onClick={() => onHeroImageChange(img.id)}>
                            <Star className="w-3.5 h-3.5" />
                          </IconButton>
                        )}
                      </div>
                      {isPendingDelete ? (
                        <IconButton label="Undo removal" tone="success" disabled={deletingId === img.id} onClick={() => handleDeleteImage(img.id)}>
                          {deletingId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        </IconButton>
                      ) : (
                        <IconButton label="Delete image" tone="danger" disabled={deletingId === img.id} onClick={() => handleDeleteImage(img.id)}>
                          {deletingId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </IconButton>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
