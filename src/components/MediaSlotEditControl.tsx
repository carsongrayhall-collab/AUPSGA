"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type MouseEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";

type MediaSlotEditControlProps = {
  alt: string;
  currentObjectPosition?: string;
  currentSrc?: string;
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

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function parseObjectPosition(value: string | undefined) {
  const match = value?.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);

  if (!match) {
    return { x: 50, y: 50 };
  }

  return {
    x: clampPercent(Number(match[1])),
    y: clampPercent(Number(match[2])),
  };
}

export function MediaSlotEditControl({ alt, currentObjectPosition, currentSrc, mediaKey }: MediaSlotEditControlProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [isPositionDragging, setIsPositionDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const initialPosition = useMemo(() => parseObjectPosition(currentObjectPosition), [currentObjectPosition]);
  const [x, setX] = useState(initialPosition.x);
  const [y, setY] = useState(initialPosition.y);
  const objectPosition = `${x}% ${y}%`;

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

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  if (!isAuthenticated) {
    return null;
  }

  function openCropper(file: File | undefined) {
    if (!file || isUploading) {
      return;
    }

    const nextPosition = parseObjectPosition(currentObjectPosition);
    const nextPreviewUrl = URL.createObjectURL(file);

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    setSelectedFile(file);
    setPreviewObjectUrl(nextPreviewUrl);
    setPreviewUrl(nextPreviewUrl);
    setX(nextPosition.x);
    setY(nextPosition.y);
    setMessage(null);
    setIsCropping(true);
  }

  function openCurrentCropper() {
    if (!currentSrc || isUploading) {
      return;
    }

    const nextPosition = parseObjectPosition(currentObjectPosition);

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    setSelectedFile(null);
    setPreviewObjectUrl(null);
    setPreviewUrl(currentSrc);
    setX(nextPosition.x);
    setY(nextPosition.y);
    setMessage(null);
    setIsCropping(true);
  }

  function closeCropper() {
    setIsCropping(false);
    setSelectedFile(null);
    setPreviewObjectUrl(null);
    setPreviewUrl(null);
    setIsPositionDragging(false);
  }

  function updateCropFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setX(clampPercent(((event.clientX - bounds.left) / bounds.width) * 100));
    setY(clampPercent(((event.clientY - bounds.top) / bounds.height) * 100));
  }

  async function uploadFile() {
    if (isUploading) {
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("key", mediaKey);
    formData.append("alt", alt);
    formData.append("objectPosition", objectPosition);

    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      formData.append("action", "crop");
      formData.append("src", currentSrc ?? "");
    }

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
      closeCropper();
    } catch {
      setMessage("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();
    openCropper(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    stopParentNavigation(event);
    setIsDragging(false);
    openCropper(event.dataTransfer.files[0]);
  }

  const cropper = isCropping && previewUrl
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Crop image for ${alt}`}
          onClick={(event) => {
            event.stopPropagation();
            if (event.target === event.currentTarget && !isUploading) {
              closeCropper();
            }
          }}
          onPointerDown={isolateFromParentHandlers}
        >
          <div className="grid w-full max-w-3xl gap-5 rounded-[3px] bg-white p-5 text-sga-red shadow-[0_12px_36px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-lg font-semibold uppercase leading-none">Display Crop</p>
                <h2 className="text-4xl font-semibold uppercase leading-none tracking-[-0.05em]">
                  {alt}
                </h2>
              </div>
              <p className="text-base font-semibold uppercase leading-none">
                {x}% / {y}%
              </p>
            </div>

            <div
              className="relative aspect-video cursor-crosshair overflow-hidden bg-sga-red/10 bg-cover bg-no-repeat shadow-inner"
              style={{ backgroundImage: `url(${previewUrl})`, backgroundPosition: objectPosition }}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                setIsPositionDragging(true);
                updateCropFromPointer(event);
              }}
              onPointerMove={(event) => {
                if (isPositionDragging) {
                  updateCropFromPointer(event);
                }
              }}
              onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                setIsPositionDragging(false);
              }}
            >
              <div
                className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sga-red shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
                Horizontal position
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={x}
                  onChange={(event) => setX(Number(event.currentTarget.value))}
                />
              </label>
              <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
                Vertical position
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={y}
                  onChange={(event) => setY(Number(event.currentTarget.value))}
                />
              </label>
            </div>

            {message ? <p className="text-lg font-semibold uppercase leading-tight">{message}</p> : null}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={isUploading}
                className="inline-flex min-h-11 items-center justify-center rounded-[3px] border border-sga-red px-5 py-2 text-xl font-semibold uppercase leading-none text-sga-red transition hover:bg-sga-red hover:text-white disabled:opacity-60"
                onClick={closeCropper}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUploading}
                className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-sga-red px-5 py-2 text-xl font-semibold uppercase leading-none text-white transition hover:bg-black disabled:opacity-60"
                onClick={() => void uploadFile()}
              >
                {isUploading ? "Saving" : "Save Crop"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
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
          {isUploading ? "Saving" : isDragging ? "Drop Image" : "Edit"}
        </label>
        {currentSrc ? (
          <button
            type="button"
            disabled={isUploading}
            className="inline-flex rounded-[3px] bg-white px-3 py-1 text-sm font-semibold uppercase leading-none text-sga-red shadow-[0_2px_8px_rgba(0,0,0,0.22)] transition hover:bg-black hover:text-white disabled:opacity-70"
            onClick={openCurrentCropper}
          >
            Crop
          </button>
        ) : null}
        {message && !isCropping ? (
          <p className="max-w-40 bg-white px-2 py-1 text-right text-sm font-semibold leading-tight text-sga-red shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
            {message}
          </p>
        ) : null}
      </div>
      {cropper}
    </>
  );
}
