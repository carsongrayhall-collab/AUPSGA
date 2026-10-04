"use client";

import { useEffect, useState, type ChangeEvent, type DragEvent, type MouseEvent, type PointerEvent } from "react";

type MediaSlotEditControlProps = {
  alt: string;
  mediaKey: string;
};

type MediaUploadResponse = {
  alt: string;
  key: string;
  objectPosition?: string;
  src: string;
};

function stopParentNavigation(event: DragEvent | PointerEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function isolateFromParentHandlers(event: MouseEvent | PointerEvent) {
  event.stopPropagation();
}

export function MediaSlotEditControl({ alt, mediaKey }: MediaSlotEditControlProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/session", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : { authenticated: false }))
      .then((data: { authenticated?: boolean }) => {
        if (!cancelled) {
          setIsAuthenticated(Boolean(data.authenticated));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  async function uploadFile(file: File | undefined) {
    if (!file || isUploading) {
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("key", mediaKey);
    formData.append("alt", alt);
    formData.append("objectPosition", "50% 50%");
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/media", {
        body: formData,
        headers: { Accept: "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        setMessage(await response.text());
        return;
      }

      const media = (await response.json()) as MediaUploadResponse;

      window.dispatchEvent(
        new CustomEvent("sga-media-updated", {
          detail: {
            key: media.key,
            media: {
              alt: media.alt,
              objectPosition: media.objectPosition,
              src: media.src,
            },
          },
        }),
      );
      setMessage("Updated");
    } catch {
      setMessage("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    void uploadFile(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    stopParentNavigation(event);
    setIsDragging(false);
    void uploadFile(event.dataTransfer.files[0]);
  }

  return (
    <div
      className="absolute right-2 top-2 z-20 grid justify-items-end gap-2"
      onClick={isolateFromParentHandlers}
      onPointerDown={isolateFromParentHandlers}
    >
      <label
        onDragEnter={(event) => {
          stopParentNavigation(event);
          setIsDragging(true);
        }}
        onDragOver={stopParentNavigation}
        onDragLeave={(event) => {
          stopParentNavigation(event);
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        aria-disabled={isUploading}
        className={[
          "relative inline-flex cursor-pointer overflow-hidden rounded-[3px] bg-white px-3 py-1 text-sm font-semibold uppercase leading-none text-sga-red shadow-[0_2px_8px_rgba(0,0,0,0.22)] transition hover:bg-black hover:text-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white",
          isDragging ? "bg-black text-white" : "",
          isUploading ? "pointer-events-none opacity-70" : "",
        ].join(" ")}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={isUploading}
          aria-label={`Upload image for ${alt}`}
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleFileChange}
          onClick={isolateFromParentHandlers}
          onPointerDown={isolateFromParentHandlers}
        />
        {isUploading ? "Uploading" : isDragging ? "Drop Image" : "Edit"}
      </label>
      {message ? (
        <p className="max-w-40 bg-white px-2 py-1 text-right text-sm font-semibold leading-tight text-sga-red shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
