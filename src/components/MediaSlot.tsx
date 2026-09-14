import Image from "next/image";
import type { ReactNode } from "react";

type MediaSlotProps = {
  label: string;
  className?: string;
  tone?: "light" | "red";
  children?: ReactNode;
};

type MediaAsset = {
  src: string;
  alt: string;
  position?: string;
};

const mediaByLabel: Record<string, MediaAsset> = {
  "We have so much money left over right now! thumbnail media slot": {
    src: "/images/site/welcome-table.jpg",
    alt: "Student Government welcome table at an AUP event",
  },
  "Something is happening in the Amex or something thumbnail media slot": {
    src: "/images/site/campus-gathering.jpg",
    alt: "AUP community gathering in a campus hall",
  },
  "Featured current news media slot": {
    src: "/images/site/community-conversation.jpg",
    alt: "AUP community members in conversation",
  },
  "Get your tickets now! image media slot": {
    src: "/images/site/student-life-creperie.jpg",
    alt: "AUP students visiting a crêperie in Paris",
  },
  "Featured initiative media slot": {
    src: "/images/site/future-self.jpg",
    alt: "AUP student taking part in a Postcard to Your Future Self activity",
  },
  "Student Life initiative media slot": {
    src: "/images/site/paris-student-life.jpg",
    alt: "AUP student walking in Paris with the Eiffel Tower nearby",
    position: "center",
  },
  "Campus Support initiative media slot": {
    src: "/images/site/student-discussion.jpg",
    alt: "Students participating in a campus discussion",
  },
  "SGA Initiatives media slot": {
    src: "/images/site/student-studying.jpg",
    alt: "Student working on notes outdoors",
  },
  "Student Resources media slot": {
    src: "/images/site/historic-library.jpg",
    alt: "Historic photograph of students working in an AUP library",
  },
  "Legislative Activities media slot": {
    src: "/images/site/historic-campus.jpg",
    alt: "Historic photograph of students on the AUP campus",
  },
  "Photo of SGA media slot": {
    src: "/images/site/sga-community.jpg",
    alt: "AUP students and Student Government community members posing together",
  },
};

export function MediaSlot({
  label,
  className = "",
  tone = "light",
  children,
}: MediaSlotProps) {
  const media = mediaByLabel[label];

  return (
    <div
      role={media ? undefined : "img"}
      aria-label={media ? undefined : label}
      data-media-slot={label}
      className={[
        "relative overflow-hidden bg-[#d9d9d9]",
        !media && tone === "red" ? "bg-white/25" : "",
        !media
          ? "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34)_0_1px,transparent_1px_18px)]"
          : "",
        !media ? "after:absolute after:inset-3 after:border after:border-white/60" : "",
        className,
      ].join(" ")}
    >
      {media ? (
        <>
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: media.position ?? "center" }}
          />
          {tone === "red" ? (
            <span className="absolute inset-0 bg-[#d71920]/70" aria-hidden="true" />
          ) : null}
        </>
      ) : (
        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
      )}
      {children}
    </div>
  );
}
