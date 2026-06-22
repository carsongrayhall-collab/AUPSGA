import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExecutiveStickyTitle } from "@/components/ExecutiveStickyTitle";
import { MediaSlot } from "@/components/MediaSlot";

type Committee = {
  name: string;
  acronym: string;
  description: string;
  logoSrc: string;
  href: string;
};

const committees: Committee[] = [
  {
    name: "Communications and Outreach Committee",
    acronym: "COC",
    description:
      "The Communications and Outreach Committee (COC) manages SGA's public presence by helping share updates, promote initiatives, advertise events, and keep students informed about opportunities to get involved. The committee also oversees SGA merchandise, supporting campus spirit while making student government more visible and accessible to the AUP community.",
    logoSrc: "/images/committee-coc.svg",
    href: "/committees/communications-outreach",
  },
  {
    name: "Budget and Finance Committee",
    acronym: "BFC",
    description:
      "The Budget and Finance Committee reviews funding requests, supports responsible allocation of SGA resources, and helps ensure student initiatives are financially realistic and well-organized. The committee works with the Treasurer to evaluate budgets, track spending priorities, and support projects that benefit the AUP student body.",
    logoSrc: "/images/committee-bfc.svg",
    href: "/committees/budget-finance",
  },
  {
    name: "Events and Activities Committee",
    acronym: "EAC",
    description:
      "The Events and Activities Committee helps plan, support, and promote events that bring students together and strengthen campus life. The committee works on student-centered programming, community-building activities, and opportunities for students to connect across classes, departments, and backgrounds.",
    logoSrc: "/images/committee-eac.svg",
    href: "/committees/events-activities",
  },
  {
    name: "Executive Service Committee",
    acronym: "ESC",
    description:
      "The Executive Service Committee supports the internal operations of SGA by helping coordinate projects, organize administrative needs, and ensure representatives have the resources and structure needed to serve students effectively. The committee helps keep SGA organized, responsive, and focused on turning student priorities into action.",
    logoSrc: "/images/committee-esc.svg",
    href: "/committees/executive-service",
  },
  {
    name: "Judiciary Committee",
    acronym: "JC",
    description:
      "The Judiciary Committee supports fairness, accountability, and transparency within SGA by reviewing governance questions, helping interpret SGA rules and procedures, and ensuring representatives act in accordance with established standards. The committee helps maintain trust in student government by promoting consistent and responsible decision-making.",
    logoSrc: "/images/committee-jc.svg",
    href: "/committees/judiciary",
  },
  {
    name: "Election Committee",
    acronym: "EC",
    description:
      "The Election Task Force supports fair, organized, and transparent SGA elections by helping manage election procedures, candidate information, voting timelines, and student outreach. The task force works to ensure students understand how to run, vote, and participate in the election process.",
    logoSrc: "/images/committee-ec.svg",
    href: "/committees/election",
  },
];

export const metadata: Metadata = {
  title: "Committees | AUP Student Government Association",
  description:
    "Explore the committees of The American University of Paris Student Government Association.",
};

function CommitteeRow({ committee }: { committee: Committee }) {
  return (
    <article className="grid gap-7 py-10 md:grid-cols-[minmax(20rem,42vw)_minmax(0,1fr)] md:items-center md:gap-10 md:py-12">
      <div className="relative aspect-[242/207] w-[calc(100vw-1.5rem)] max-w-[34rem] md:w-full md:max-w-none">
        <MediaSlot
          label={`${committee.name} future media slot`}
          className="absolute inset-0 h-full w-full"
        />
        <Link
          href={committee.href}
          aria-label={`Read more about ${committee.name}`}
          className="absolute left-0 top-0 z-10 aspect-square h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
        >
          <Image
            src={committee.logoSrc}
            alt={`${committee.name} logo`}
            fill
            sizes="(min-width: 768px) 36vw, 86vw"
            className="object-contain"
          />
        </Link>
      </div>
      <div className="px-6 text-center text-sga-red md:max-w-3xl md:px-0 md:pr-8 md:text-left">
        <h2 className="text-4xl font-semibold uppercase leading-[0.9] md:text-5xl">
          {committee.name} ({committee.acronym})
        </h2>
        <p className="mt-5 text-xl font-light leading-tight md:text-2xl">{committee.description}</p>
        <Link
          href={committee.href}
          className="mt-5 inline-flex text-xl font-semibold uppercase leading-none underline decoration-1 underline-offset-4 transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
        >
          Read More
        </Link>
      </div>
    </article>
  );
}

export default function CommitteesPage() {
  return (
    <main className="relative isolate overflow-hidden bg-white text-sga-red">
      <ExecutiveStickyTitle titleSrc="/images/committees-fullscreen-16x9.svg">
        <div className="pb-16 pt-[calc(100svh+2rem)] md:pb-20">
          <div>
            <section aria-labelledby="committees-introduction" className="py-10 text-center md:py-14">
              <h1 id="committees-introduction" className="sr-only">
                Committees
              </h1>
              <p className="mx-auto max-w-4xl px-6 text-3xl font-light leading-tight text-sga-red md:text-4xl">
                Committees are smaller working groups within SGA that focus on specific areas of student life, advocacy, events, finance, communications, and campus improvement. They help turn student ideas and concerns into concrete projects by researching issues, planning initiatives, and preparing recommendations for the Senate or Executive Board.
              </p>
            </section>

            <section aria-label="SGA committees" className="divide-y divide-sga-red/25">
              {committees.map((committee) => (
                <CommitteeRow key={committee.acronym} committee={committee} />
              ))}
            </section>
          </div>
        </div>
      </ExecutiveStickyTitle>
    </main>
  );
}
