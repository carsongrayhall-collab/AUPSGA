import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExecutiveStickyTitle } from "@/components/ExecutiveStickyTitle";
import { MediaSlot } from "@/components/MediaSlot";

type ExecutiveProfile = {
  name: string;
  role: string;
  description: string;
  email: string;
};

const undergraduateProfiles: ExecutiveProfile[] = [
  {
    name: "Ben Kolendo",
    role: "Undergraduate President",
    description:
      "Represents undergraduate students, leads advocacy efforts, and helps coordinate SGA priorities on behalf of the student body.",
    email: "undergrad-president@aup.edu",
  },
  {
    name: "Carson Hall",
    role: "Undergraduate Vice President",
    description:
      "Supports the Undergraduate President, helps coordinate student advocacy initiatives, and and represents undergraduate student interests.",
    email: "undergrad-vp@aup.edu",
  },
  {
    name: "Lorelei Smucker",
    role: "Joint Treasurer",
    description:
      "Oversees SGA finances, reviews budget requests, guides funding decisions, and ensures student initiatives are supported through responsible financial planning.",
    email: "treasurer-sga@aup.edu",
  },
  {
    name: "VACANT",
    role: "Undergraduate Social Director",
    description:
      "Plans and supports events that build undergraduate community, encourage student connection, and strengthen campus life.",
    email: "undergrad-social@aup.edu",
  },
  {
    name: "VACANT",
    role: "Undergraduate Communication Director",
    description:
      "Manages SGA messaging, shares updates with undergraduate students, and helps ensure student voices, events, and initiatives are clearly communicated.",
    email: "undergrad-comms@aup.edu",
  },
];

const graduateProfiles: ExecutiveProfile[] = [
  {
    name: "Katherine Lu",
    role: "Graduate President",
    description:
      "Represents graduate students, leads graduate advocacy efforts, and helps coordinate SGA priorities that support the graduate student experience.",
    email: "grad-president@aup.edu",
  },
  {
    name: "VACANT",
    role: "Graduate Vice President",
    description:
      "Supports the Graduate President, helps advance graduate student initiatives, and represents graduate student interests across SGA activities.",
    email: "grad-vp@aup.edu",
  },
  {
    name: "Sydney Livingston",
    role: "Graduate Social Director",
    description:
      "Plans and supports events that build graduate community, encourage connection, and strengthen graduate student life at AUP.",
    email: "grad-social@aup.edu",
  },
  {
    name: "Stephanie Oghweh",
    role: "Graduate Communication Director",
    description:
      "Manages SGA messaging for graduate students, shares updates, and helps keep graduate voices, events, and initiatives clearly communicated.",
    email: "grad-comms@aup.edu",
  },
];

export const metadata: Metadata = {
  title: "The Executive Team | AUP Student Government Association",
  description:
    "Meet the Executive Team of The American University of Paris Student Government Association.",
};

function ExecutiveProfileCard({
  profile,
  centered = false,
}: {
  profile: ExecutiveProfile;
  centered?: boolean;
}) {
  return (
    <article className={centered ? "mx-auto w-full max-w-[19rem]" : "w-full"}>
      <div className="relative">
        <MediaSlot
          label={`${profile.name}, ${profile.role} profile image slot`}
          className="aspect-[170/204] w-full"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 bg-sga-red/85 px-4 py-3 text-white">
          <h3 className="text-3xl font-semibold uppercase leading-[0.9]">{profile.name}</h3>
          <p className="mt-1 text-lg font-semibold uppercase leading-none">{profile.role}</p>
        </div>
      </div>
      <p className="mt-3 text-lg font-light leading-tight text-sga-red">{profile.description}</p>
      <p className="mt-2 text-lg font-semibold uppercase leading-tight text-sga-red">
        Contact:{" "}
        <Link href={`mailto:${profile.email}`} className="font-light normal-case hover:underline">
          {profile.email}
        </Link>
      </p>
    </article>
  );
}

function BoardSection({
  title,
  profiles,
  undergraduate = false,
}: {
  title: string;
  profiles: ExecutiveProfile[];
  undergraduate?: boolean;
}) {
  return (
    <section aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-heading`} className="py-12 md:py-16">
      <h2
        id={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}
        className="mx-auto max-w-4xl text-center text-5xl font-semibold uppercase leading-[0.86] text-sga-red md:text-7xl"
      >
        {title}
      </h2>

      {undergraduate ? (
        <div className="mx-auto mt-10 grid max-w-4xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:gap-x-12">
          <ExecutiveProfileCard profile={profiles[0]} />
          <ExecutiveProfileCard profile={profiles[1]} />
          <div className="sm:col-span-2">
            <ExecutiveProfileCard profile={profiles[2]} centered />
          </div>
          <ExecutiveProfileCard profile={profiles[3]} />
          <ExecutiveProfileCard profile={profiles[4]} />
        </div>
      ) : (
        <div className="mx-auto mt-10 grid max-w-4xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:gap-x-12">
          {profiles.map((profile) => (
            <ExecutiveProfileCard key={`${profile.role}-${profile.email}`} profile={profile} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ExecutiveTeamPage() {
  return (
    <main className="relative isolate overflow-hidden bg-white text-sga-red">
      <ExecutiveStickyTitle>
        <div className="px-6 pb-16 pt-[calc(100svh+2rem)] md:pb-20">
          <div className="mx-auto max-w-[64rem]">
            <BoardSection
              title="Undergraduate Executive Board"
              profiles={undergraduateProfiles}
              undergraduate
            />

            <BoardSection title="Graduate Executive Board" profiles={graduateProfiles} />

            <section aria-labelledby="full-board-heading" className="mx-auto max-w-4xl py-12 text-center md:py-16">
              <h2 id="full-board-heading" className="sr-only">
                Full Executive Board
              </h2>
              <div className="relative">
                <MediaSlot label="Photo of all Executive Board members image slot" className="aspect-[402/186] w-full" />
                <p className="absolute inset-0 z-10 grid place-items-center px-6 text-5xl font-normal uppercase leading-none text-black/70 md:text-7xl">
                  Photo Of All Execs
                </p>
              </div>
              <p className="mt-4 text-2xl font-light leading-tight text-sga-red">
                28th American University of Paris Student Government Executive Board
              </p>
              <p className="mx-auto mt-10 max-w-3xl text-3xl font-light leading-tight text-sga-red md:text-4xl">
                The Executive Board leads SGA&apos;s overall direction, coordinates advocacy across undergraduate and graduate representatives, manages major initiatives, and helps ensure student concerns are organized into clear action. Contact the Executive Board if you have a campus-wide concern, want to propose a major initiative, need help reaching the right representative, or have a question that affects students across multiple committees or programs.
              </p>
            </section>

            <section aria-label="Executive Team actions" className="mx-auto grid max-w-4xl items-center gap-8 py-8 text-center md:grid-cols-[1fr_auto_1fr] md:py-12">
              <Link
                href="/student-government/book-an-appointment"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-sga-red px-7 py-3 text-xl font-semibold uppercase leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
              >
                Book An Appointment
              </Link>
              <Image
                src="/images/aup-student-government-red.svg"
                alt="AUP Student Government Association seal"
                width={94}
                height={94}
                className="mx-auto h-24 w-24"
              />
              <Link
                href="/student-government/office-hours"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-sga-red px-7 py-3 text-xl font-semibold uppercase leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
              >
                View Office Hours
              </Link>
            </section>
          </div>
        </div>
      </ExecutiveStickyTitle>
    </main>
  );
}
