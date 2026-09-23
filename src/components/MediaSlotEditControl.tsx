"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";

type MediaSlotEditControlProps = {
  alt: string;
  mediaKey: string;
};

export function MediaSlotEditControl({ alt, mediaKey }: MediaSlotEditControlProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

      window.location.reload();
    } catch {
      setMessage("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    void uploadFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="absolute right-2 top-2 z-20 grid justify-items-end gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          void uploadFile(event.currentTarget.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        disabled={isUploading}
        className={[
          "rounded-[3px] bg-white px-3 py-1 text-sm font-semibold uppercase leading-none text-sga-red shadow-[0_2px_8px_rgba(0,0,0,0.22)] transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70",
          isDragging ? "bg-black text-white" : "",
        ].join(" ")}
      >
        {isUploading ? "Uploading" : isDragging ? "Drop Image" : "Edit"}
      </button>
      {message ? (
        <p className="max-w-40 bg-white px-2 py-1 text-right text-sm font-semibold leading-tight text-sga-red shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
