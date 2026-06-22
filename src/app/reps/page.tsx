import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExecutiveStickyTitle } from "@/components/ExecutiveStickyTitle";
import { MediaSlot } from "@/components/MediaSlot";

type RepGroup = {
  title: string;
  description?: string;
  contact: string;
  members: string[];
};

const departmentGroups: RepGroup[] = [
  {
    title: "Communications, Media, and Culture Representatives",
    description:
      "Represent students within the Communications, Media, and Culture department by bringing their concerns, ideas, and academic interests to SGA.",
    contact: "sga_cmc@aup.edu",
    members: ["VACANT", "VACANT"],
  },
  {
    title: "Art History and Fine Arts Representative",
    description:
      "Represents students in Art History and Fine Arts by advocating for their academic needs, creative perspectives, and department-specific concerns within the Senate.",
    contact: "sga_art@aup.edu",
    members: ["Ava Crespo"],
  },
  {
    title: "Computer Science, Mathematics, and Environmental Science Representatives",
    description:
      "Represent students across analytical, technical, and scientific fields by bringing department-specific needs, ideas, and academic concerns to the Senate.",
    contact: "sga_csmes@aup.edu",
    members: ["Max Jordy", "Madison Shearer"],
  },
  {
    title: "Economics and Management Representative",
    description:
      "Represent students in business, economics, and management fields by advocating for their academic interests, professional development needs, and department-specific concerns within the Senate.",
    contact: "sga_eandm@aup.edu",
    members: ["Rita Okwor", "Carson Hall", "Antonella Henkens"],
  },
  {
    title: "History and Politics Representatives",
    description:
      "Represent students in History, Law, and Politics by advocating for their academic interests, civic perspectives, and department-specific concerns within the Senate.",
    contact: "sga_hp@aup.edu",
    members: ["Belen Bolhuis", "Peter Dean Orola-Andrada", "Claire Strickland"],
  },
  {
    title: "Psychology, Health, and Gender Representative",
    description:
      "Represents students in Psychology, Health, and Gender Studies by bringing department-specific concerns, academic needs, and student perspectives to the Senate.",
    contact: "sga_phg@aup.edu",
    members: ["VACANT"],
  },
];

const classGroups: RepGroup[] = [
  {
    title: "Freshmen Representatives",
    contact: "sga_firstyear@aup.edu",
    members: ["VACANT", "VACANT"],
  },
  {
    title: "Sophomore Representatives",
    contact: "sga_sophomore@aup.edu",
    members: ["VACANT", "VACANT", "VACANT"],
  },
  {
    title: "Junior Representatives",
    contact: "sga_junior@aup.edu",
    members: ["VACANT", "VACANT", "VACANT", "VACANT"],
  },
  {
    title: "Senior Representatives",
    contact: "sga_senior@aup.edu",
    members: ["VACANT", "VACANT"],
  },
  {
    title: "Graduate Representatives",
    contact: "sga_graduate@aup.edu",
    members: ["VACANT", "VACANT"],
  },
];

export const metadata: Metadata = {
  title: "Senators | AUP Student Government Association",
  description:
    "Meet the Senate representatives of The American University of Paris Student Government Association.",
};

function RepresentativeTile({ name, groupTitle }: { name: string; groupTitle: string }) {
  return (
    <article className="w-full max-w-[13rem]">
      <div className="relative">
        <MediaSlot
          label={`${name}, ${groupTitle} representative image slot`}
          className="aspect-[112/137] w-full"
        />
        <h3 className="absolute inset-x-0 bottom-0 z-10 bg-sga-red/85 px-3 py-2 text-center text-2xl font-semibold uppercase leading-none text-white">
          {name}
        </h3>
      </div>
    </article>
  );
}

function RepGroupBlock({ group }: { group: RepGroup }) {
  return (
    <article className="mx-auto max-w-3xl py-8 text-center md:py-10">
      <h3 className="mx-auto max-w-3xl text-3xl font-semibold uppercase leading-none text-sga-red md:text-4xl">
        {group.title}
      </h3>
      {group.description ? (
        <p className="mx-auto mt-4 max-w-2xl text-xl font-light leading-tight text-sga-red">
          {group.description}
        </p>
      ) : null}
      <p className="mt-3 text-xl font-semibold uppercase leading-tight text-sga-red">
        Contact:{" "}
        <Link href={`mailto:${group.contact}`} className="font-light normal-case hover:underline">
          {group.contact}
        </Link>
      </p>
      <div
        className={[
          "mx-auto mt-6 grid justify-items-center gap-5",
          group.members.length === 1
            ? "max-w-[13rem] grid-cols-1"
            : group.members.length === 2
              ? "max-w-[29rem] grid-cols-1 sm:grid-cols-2"
              : group.members.length === 3
                ? "max-w-[43rem] grid-cols-1 sm:grid-cols-3"
                : "max-w-[43rem] grid-cols-1 sm:grid-cols-2",
        ].join(" ")}
      >
        {group.members.map((member, index) => (
          <RepresentativeTile key={`${group.title}-${member}-${index}`} name={member} groupTitle={group.title} />
        ))}
      </div>
    </article>
  );
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2
      id={id}
      className="mx-auto max-w-5xl text-center text-5xl font-semibold uppercase leading-[0.86] text-sga-red md:text-7xl"
    >
      {title}
    </h2>
  );
}

export default function SenatorsPage() {
  return (
    <main className="relative isolate overflow-hidden bg-white text-sga-red">
      <ExecutiveStickyTitle titleSrc="/images/the-reps-fullscreen-16x9.svg">
        <div className="px-6 pb-16 pt-[calc(100svh+2rem)] md:pb-20">
          <div className="mx-auto max-w-[64rem]">
            <section aria-labelledby="department-representatives-heading" className="py-12 md:py-16">
              <SectionHeading id="department-representatives-heading" title="Department Representatives" />
              <div className="mt-8">
                {departmentGroups.map((group) => (
                  <RepGroupBlock key={group.title} group={group} />
                ))}
              </div>
            </section>

            <section aria-labelledby="class-representatives-heading" className="py-12 md:py-16">
              <SectionHeading id="class-representatives-heading" title="Class Representatives" />
              <p className="mx-auto mt-8 max-w-2xl text-center text-2xl font-light leading-tight text-sga-red">
                Represent their academic year by bringing student concerns, ideas, and priorities to SGA, helping ensure each class has a clear voice in Senate discussions and student advocacy.
              </p>
              <div className="mt-8">
                {classGroups.map((group) => (
                  <RepGroupBlock key={group.title} group={group} />
                ))}
              </div>
            </section>

            <section aria-labelledby="full-senate-heading" className="mx-auto max-w-4xl py-12 text-center md:py-16">
              <h2 id="full-senate-heading" className="sr-only">
                Full Senate
              </h2>
              <div className="relative">
                <MediaSlot label="Photo of all Senate representatives image slot" className="aspect-[484/223] w-full" />
                <p className="absolute inset-0 z-10 grid place-items-center px-6 text-5xl font-normal uppercase leading-none text-black/70 md:text-7xl">
                  Photo Of All Reps
                </p>
              </div>
              <p className="mt-4 text-2xl font-light leading-tight text-sga-red">
                28th American University of Paris Student Government Senate
              </p>
              <p className="mx-auto mt-10 max-w-3xl text-3xl font-light leading-tight text-sga-red md:text-4xl">
                The Senate is made up of student representatives who bring forward student concerns, debate proposals, review initiatives, and vote on actions that shape SGA&apos;s work. Senators represent academic departments, class years, and student interests, helping ensure different parts of the AUP community have a voice in student government.
              </p>
              <p className="mx-auto mt-8 max-w-3xl text-3xl font-semibold leading-tight text-sga-red md:text-4xl">
                Students can stay informed by viewing Senate voting records and meeting minutes, and they are welcome to sit in on Senate meetings as observers. Meeting times, locations, records, and minutes can be found on the SGA calendar and Resources page.
              </p>
            </section>

            <section aria-label="Senate actions" className="mx-auto grid max-w-4xl items-center gap-8 py-8 text-center md:grid-cols-[1fr_auto_1fr] md:py-12">
              <Link
                href="/resources/agendas-minutes"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-sga-red px-7 py-3 text-xl font-semibold uppercase leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
              >
                Read Senate Records
              </Link>
              <Image
                src="/images/aup-student-government-red.svg"
                alt="AUP Student Government Association seal"
                width={94}
                height={94}
                className="mx-auto h-24 w-24"
              />
              <Link
                href="/student-government/voting-records"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-sga-red px-7 py-3 text-xl font-semibold uppercase leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
              >
                View Voting History
              </Link>
            </section>
          </div>
        </div>
      </ExecutiveStickyTitle>
    </main>
  );
}
