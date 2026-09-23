"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { slugifyKey } from "@/lib/keys";
import { MediaSlotEditControl } from "@/components/MediaSlotEditControl";

type MediaSlotProps = {
  label: string;
  className?: string;
  src?: string;
  alt?: string;
  imageClassName?: string;
  mediaKey?: string;
  priority?: boolean;
  tone?: "light" | "red";
  children?: ReactNode;
};

type PublicMediaConfig = {
  alt: string;
  objectPosition?: string;
  src: string;
};

export function MediaSlot({
  label,
  className = "",
  src,
  alt,
  imageClassName = "object-cover",
  mediaKey,
  priority = false,
  tone = "light",
  children,
}: MediaSlotProps) {
  const resolvedMediaKey = useMemo(() => mediaKey ?? slugifyKey(label), [label, mediaKey]);
  const [mediaConfig, setMediaConfig] = useState<PublicMediaConfig | null>(null);
  const resolvedSrc = mediaConfig?.src ?? src;
  const accessibleLabel = mediaConfig?.alt ?? alt ?? label;
  const imageStyle: CSSProperties | undefined = mediaConfig?.objectPosition
    ? { objectPosition: mediaConfig.objectPosition }
    : undefined;

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/media/${encodeURIComponent(resolvedMediaKey)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PublicMediaConfig | null) => {
        if (!cancelled && data?.src) {
          setMediaConfig(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMediaConfig(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedMediaKey]);

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      data-media-slot={label}
      className={[
        "relative overflow-hidden bg-[#d9d9d9]",
        tone === "red" ? "bg-white/25" : "",
        resolvedSrc
          ? ""
          : "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34)_0_1px,transparent_1px_18px)] after:absolute after:inset-3 after:border after:border-white/60",
        className,
      ].join(" ")}
    >
      <MediaSlotEditControl alt={accessibleLabel} mediaKey={resolvedMediaKey} />
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          sizes="(min-width: 1024px) 36vw, (min-width: 768px) 48vw, 100vw"
          className={imageClassName}
          style={imageStyle}
        />
      ) : (
        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
      )}
      {children}
    </div>
  );
}
