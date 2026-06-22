"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

type ExecutiveStickyTitleProps = {
  children: ReactNode;
  titleSrc?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function interpolateOpacity(progress: number) {
  const stops = [
    { progress: 0, opacity: 1 },
    { progress: 0.1, opacity: 0.5 },
    { progress: 0.2, opacity: 0 },
    { progress: 0.4, opacity: 0.1 },
    { progress: 1, opacity: 0.1 },
  ];

  const upperIndex = stops.findIndex((stop) => progress <= stop.progress);
  if (upperIndex <= 0) {
    return stops[0].opacity;
  }

  const lower = stops[upperIndex - 1];
  const upper = stops[upperIndex];
  const segmentProgress = (progress - lower.progress) / (upper.progress - lower.progress);

  return lower.opacity + (upper.opacity - lower.opacity) * segmentProgress;
}

export function ExecutiveStickyTitle({
  children,
  titleSrc = "/images/the-execs-fullscreen-16x9.svg",
}: ExecutiveStickyTitleProps) {
  const containerRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;

    const updateTitleState = () => {
      const container = containerRef.current;
      const visual = visualRef.current;

      if (!container || !visual) {
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollY = window.scrollY;
      const containerTop = container.getBoundingClientRect().top + scrollY;
      const containerBottom = containerTop + container.offsetHeight;
      const fadeDistance = Math.max(viewportHeight * 1.25, 1);
      const progress = clamp((scrollY - containerTop) / fadeDistance, 0, 1);
      const isVisible = scrollY + viewportHeight > containerTop && scrollY < containerBottom;

      visual.style.opacity = isVisible ? String(interpolateOpacity(progress)) : "0";
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateTitleState);
    };

    updateTitleState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative isolate min-h-[220svh] overflow-hidden bg-white">
      <div
        aria-hidden="true"
        ref={visualRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[1] grid h-svh place-items-center overflow-hidden px-[2.5vw] pt-[5.5rem] opacity-100 lg:pt-[6.25rem]"
      >
        <div className="relative aspect-video w-[80vw] max-w-[80vw]">
          <Image
            src={titleSrc}
            alt=""
            fill
            priority
            sizes="80vw"
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
