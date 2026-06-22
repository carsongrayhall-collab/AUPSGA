"use client";

import { useEffect, useRef, useState } from "react";
import { MediaSlot } from "@/components/MediaSlot";

export type TreasuryTimelineEvent = {
  date: string;
  title: string;
  body: string;
  media?: {
    label: string;
    aspect: string;
  };
};

export type TreasuryTimelineBlock = {
  semester: string;
  media?: {
    label: string;
    aspect: string;
  };
  events: TreasuryTimelineEvent[];
};

function flattenTimeline(blocks: TreasuryTimelineBlock[]) {
  return blocks.flatMap((block) =>
    block.events.map((event) => ({
      ...event,
      semester: block.semester,
    })),
  );
}

export function TreasuryTimelineScroller({ blocks }: { blocks: TreasuryTimelineBlock[] }) {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const flatEvents = flattenTimeline(blocks);
  const blockOffsets = blocks.reduce<number[]>((offsets, block, index) => {
    const previousOffset = index === 0 ? 0 : offsets[index - 1] + blocks[index - 1].events.length;

    return [...offsets, previousOffset];
  }, []);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const activeEvent = activeIndex === null ? null : flatEvents[activeIndex];

  useEffect(() => {
    let frame = 0;

    const updateActiveEvent = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = window.innerHeight * 0.52;
        let closestIndex: number | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        rowRefs.current.forEach((node, index) => {
          if (!node) {
            return;
          }

          const rect = node.getBoundingClientRect();
          const rowCenter = rect.top + rect.height / 2;
          const distance = Math.abs(rowCenter - center);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        const activationWindow = Math.min(240, window.innerHeight * 0.22);
        setActiveIndex(closestDistance <= activationWindow ? closestIndex : null);
      });
    };

    updateActiveEvent();
    window.addEventListener("scroll", updateActiveEvent, { passive: true });
    window.addEventListener("resize", updateActiveEvent);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveEvent);
      window.removeEventListener("resize", updateActiveEvent);
    };
  }, []);

  return (
    <section aria-labelledby="treasury-timeline-events-heading" className="relative">
      <h2 id="treasury-timeline-events-heading" className="sr-only">
        Treasury Timeline Events
      </h2>

      <div className="md:hidden">
        <div className="mx-auto max-w-xl space-y-10 px-6 pb-16">
          {blocks.map((block) => (
            <section key={block.semester} aria-labelledby={`${block.semester.toLowerCase().replaceAll(" ", "-")}-mobile-heading`}>
              <h3
                id={`${block.semester.toLowerCase().replaceAll(" ", "-")}-mobile-heading`}
                className="text-4xl font-semibold uppercase leading-none tracking-[-0.05em]"
              >
                {block.semester}
              </h3>
              {block.media ? (
                <MediaSlot
                  label={block.media.label}
                  className={`mt-5 w-full ${block.media.aspect}`}
                />
              ) : null}
              <div className="mt-6 space-y-6">
                {block.events.map((event) => (
                  <article key={`${block.semester}-${event.date}`} className="border-l-8 border-sga-red pl-5">
                    {event.media ? (
                      <MediaSlot
                        label={event.media.label}
                        className={`mb-4 w-full ${event.media.aspect}`}
                      />
                    ) : null}
                    <p className="text-3xl font-semibold uppercase leading-none tracking-[-0.05em]">
                      {event.date}
                    </p>
                    <h4 className="mt-3 text-2xl font-semibold uppercase leading-none tracking-[-0.05em]">
                      {event.title}
                    </h4>
                    <p className="mt-2 text-xl font-normal leading-[1.1] tracking-[-0.05em]">
                      {event.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="relative hidden md:block">
        <div className="pointer-events-none sticky top-[6.25rem] z-20 h-[calc(100svh-6.25rem)] overflow-visible">
          <div className="absolute left-1/2 top-0 h-full w-[10.8rem] -translate-x-1/2 bg-sga-red/70 shadow-[5px_2px_2px_rgba(0,0,0,0.24)]" />
          <div className="absolute left-1/2 top-1/2 flex min-h-24 w-[10rem] -translate-x-[54%] -translate-y-1/2 items-center justify-end px-4 text-right text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.05em] text-white transition-opacity duration-200">
            <span className={activeEvent ? "opacity-100" : "opacity-0"}>
              {activeEvent?.date}
            </span>
          </div>
          <div
            aria-hidden="true"
            className={[
              "absolute left-[calc(50%+5.4rem)] top-1/2 h-8 w-8 -translate-y-1/2 bg-sga-red transition-opacity duration-200 [clip-path:polygon(0_0,100%_50%,0_100%)]",
              activeEvent ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
          <aside
            aria-live="polite"
            className={[
              "absolute left-[calc(50%+8.9rem)] top-1/2 w-[21.6rem] -translate-y-1/2 text-center text-sga-red transition duration-200",
              activeEvent ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
            ].join(" ")}
          >
            {activeEvent ? (
              <>
                <p className="text-[1.05rem] font-semibold uppercase leading-none tracking-[-0.05em]">
                  {activeEvent.semester}
                </p>
                <h3 className="mt-3 text-[2.25rem] font-semibold uppercase leading-none tracking-[-0.05em]">
                  {activeEvent.title}
                </h3>
                <p className="mt-4 text-[1.8rem] font-normal leading-[1.05] tracking-[-0.05em]">
                  {activeEvent.body}
                </p>
              </>
            ) : null}
          </aside>
        </div>

        <div className="relative z-10 mx-auto -mt-[calc(100svh-6.25rem)] max-w-6xl px-8 pb-32 pt-20 lg:px-10">
          {blocks.map((block, blockIndex) => (
            <section key={block.semester} aria-labelledby={`${block.semester.toLowerCase().replaceAll(" ", "-")}-heading`}>
              <div className="grid min-h-56 grid-cols-[minmax(14rem,1fr)_10rem_minmax(14rem,1fr)] items-center gap-8">
                <div>
                  <h3
                    id={`${block.semester.toLowerCase().replaceAll(" ", "-")}-heading`}
                    className="text-4xl font-semibold uppercase leading-none tracking-[-0.05em]"
                  >
                    {block.semester}
                  </h3>
                  {block.media ? (
                    <MediaSlot
                      label={block.media.label}
                      className={`mt-7 w-full max-w-md ${block.media.aspect}`}
                    />
                  ) : null}
                </div>
                <div aria-hidden="true" />
                <div aria-hidden="true" />
              </div>

              {block.events.map((event, eventIndex) => {
                const currentIndex = blockOffsets[blockIndex] + eventIndex;

                return (
                  <article
                    key={`${block.semester}-${event.date}`}
                    ref={(node) => {
                      rowRefs.current[currentIndex] = node;
                    }}
                    className="grid min-h-[23rem] grid-cols-[minmax(14rem,1fr)_10rem_minmax(14rem,1fr)] items-center gap-8"
                    aria-label={`${event.date}: ${event.title}`}
                  >
                    <div>
                      {event.media ? (
                        <MediaSlot
                          label={event.media.label}
                          className={`w-full max-w-md ${event.media.aspect}`}
                        />
                      ) : null}
                    </div>
                    <div className="relative h-full" aria-hidden="true">
                      <span className="absolute left-[calc(50%+5.4rem)] top-1/2 h-5 w-5 -translate-y-1/2 bg-sga-red [clip-path:polygon(0_0,100%_50%,0_100%)]" />
                    </div>
                    <div className="sr-only">
                      <p>{event.date}</p>
                      <h4>{event.title}</h4>
                      <p>{event.body}</p>
                    </div>
                  </article>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
