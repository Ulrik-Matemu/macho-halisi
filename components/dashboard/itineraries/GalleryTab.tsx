"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ItineraryImage } from "@/lib/itineraries/types";
import { ImagePlus, Trash2, ArrowLeft, ArrowRight, Loader2, AlertCircle, UploadCloud } from "lucide-react";

interface GalleryTabProps {
  itineraryId: string;
  images: ItineraryImage[];
  onImagesChange: (images: ItineraryImage[]) => void;
  /** Shows the "saves immediately" note when the itinerary is already live. */
  isPublished?: boolean;
  disabled?: boolean;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function GalleryTab({
  itineraryId,
  images = [],
  onImagesChange,
  isPublished = false,
  disabled = false,
}: GalleryTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Re-sort images by sortOrder asc
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleFiles = async (files: FileList | null) => {
    if (disabled || !files || files.length === 0) return;

    setUploadError(null);
    const file = files[0];

    // Client-side validations
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
      // Step 1: Upload to Cloudinary via backend
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || uploadData.status === "error") {
        setUploadError(uploadData.message || "Failed to upload image file");
        return;
      }

      const { url, publicId } = uploadData;

      // Step 2: Attach to itinerary in database
      const nextSortOrder = sortedImages.length;
      const cleanAlt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      const attachRes = await fetch(`/api/itineraries/${itineraryId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          cloudinaryPublicId: publicId,
          sortOrder: nextSortOrder,
          altText: cleanAlt,
        }),
      });

      const attachData = await attachRes.json();

      if (!attachRes.ok || attachData.status === "error") {
        setUploadError(attachData.message || "Failed to attach image to itinerary");
        return;
      }

      if (attachData.image) {
        onImagesChange([...images, attachData.image]);
      }
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      setUploadError("Network error while uploading image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (disabled || deletingId) return;

    setDeletingId(imageId);
    setUploadError(null);

    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/images/${imageId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setUploadError(data.message || "Failed to delete image");
        return;
      }

      // Remove from state and re-normalize sortOrder
      const filtered = images
        .filter((img) => img.id !== imageId)
        .map((img, idx) => ({ ...img, sortOrder: idx }));

      onImagesChange(filtered);
    } catch (err) {
      console.error("Failed to delete image:", err);
      setUploadError("Network error while removing image");
    } finally {
      setDeletingId(null);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    if (toIndex < 0 || toIndex >= sortedImages.length) return;

    const list = [...sortedImages];
    const [item] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, item);

    // Re-assign sequential sortOrder
    const updated = list.map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }));

    onImagesChange(updated);
  };

  const updateAltText = (imageId: string, newAlt: string) => {
    if (disabled) return;
    const updated = images.map((img) =>
      img.id === imageId ? { ...img, altText: newAlt } : img
    );
    onImagesChange(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-2 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-serif-luxury text-lg text-white font-light flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-[#c68642]" />
            <span>Itinerary Gallery & Hero Visuals</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Upload high-resolution photography of wildlife, camps, and scenic landscapes for this safari.
          </p>
        </div>
        <span className="text-xs font-mono text-white/40">
          {images.length} image{images.length === 1 ? "" : "s"} attached
        </span>
      </div>

      {isPublished && (
        <p className="text-[11px] text-[#ffdbac]/80 -mt-4">
          Unlike the other tabs, gallery changes save immediately and are visible to visitors right away —
          they aren&apos;t held for review.
        </p>
      )}

      {uploadError && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{uploadError}</div>
        </div>
      )}

      {/* Upload Dropzone */}
      {!disabled && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
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
            className={`p-8 sm:p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-[#c68642] bg-[#c68642]/10 scale-[1.01]"
                : "border-white/15 bg-[#0e0e0e] hover:border-[#c68642]/60 hover:bg-[#141414]"
            } ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="w-8 h-8 text-[#c68642] animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#ffdbac] tracking-wider uppercase">
                  Uploading to Cloudinary CDN & processing image...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c160f] border border-[#c68642]/40 text-[#c68642] flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Click to select or drag and drop safari photos
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    JPEG, PNG, WebP, or AVIF (Up to 10MB per file)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {sortedImages.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-white/10 rounded-lg text-xs text-white/40">
          No images uploaded yet. Upload high-quality wildlife or lodge photography above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedImages.map((img, idx) => (
            <div
              key={img.id}
              className="rounded-lg bg-[#0e0e0e] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-black/60 overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.altText || `Safari photo ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Primary Tag for Index 0 */}
                {idx === 0 && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-[#c68642] text-black shadow">
                    Hero Cover
                  </span>
                )}

                {/* Sort Position Badge */}
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-white/80 border border-white/10">
                  #{idx + 1}
                </span>
              </div>

              {/* Card Controls */}
              <div className="p-3.5 space-y-3">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase text-white/50 mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    value={img.altText || ""}
                    onChange={(e) => updateAltText(img.id, e.target.value)}
                    placeholder="Describe scene..."
                    className="w-full bg-[#141414] border border-white/15 focus:border-[#c68642] rounded px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>

                {!disabled && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, idx - 1)}
                        title="Move image earlier"
                        className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedImages.length - 1}
                        onClick={() => moveImage(idx, idx + 1)}
                        title="Move image later"
                        className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={deletingId === img.id}
                      onClick={() => handleDeleteImage(img.id)}
                      title="Delete image from Cloudinary & Itinerary"
                      className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors flex items-center gap-1 text-xs cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === img.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[11px]">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
