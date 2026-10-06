export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExecutiveStickyTitle } from "@/components/ExecutiveStickyTitle";
import { MediaSlot } from "@/components/MediaSlot";

import { departmentGroups, classGroups, type RepGroup } from "@/lib/pageContent";
import { getSiteConfig } from "@/lib/siteConfig";
import { ProfileCaption } from "@/components/ProfileCaption";

export const metadata: Metadata = {
  title: "Senators | AUP Student Government Association",
  description:
    "Meet the Senate representatives of The American University of Paris Student Government Association.",
};

async function RepresentativeTile({ name, groupTitle, id }: { name: string; groupTitle: string; id: string }) {
  const config = await getSiteConfig();
  const profile = config.profiles[id] ?? { name, title: groupTitle };
  return (
    <article className="w-full max-w-[13rem]">
      <div className="relative">
        <MediaSlot
          editor={{ id, section: "senators", mainText: profile.name, subtext: profile.title }}
          mediaKey={id}
          label={`${name}, ${groupTitle} representative image slot`}
          className="aspect-[112/137] w-full"
        />
        <ProfileCaption id={id} name={name} title={groupTitle} />
      </div>
    </article>
  );
}

function RepGroupBlock({ group, groupIndex }: { group: RepGroup; groupIndex: number }) {
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
          <RepresentativeTile key={`${group.title}-${member}-${index}`} id={`senator-${groupIndex}-${index}`} name={member} groupTitle={group.title} />
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

export default async function SenatorsPage() {
  const config = await getSiteConfig();
  return (
    <main className="relative isolate overflow-hidden bg-white text-sga-red">
      <ExecutiveStickyTitle titleSrc="/images/the-reps-fullscreen-16x9.svg">
        <div className="px-6 pb-16 pt-[calc(100svh+2rem)] md:pb-20">
          <div className="mx-auto max-w-[64rem]">
            <section aria-labelledby="department-representatives-heading" className="py-12 md:py-16">
              <SectionHeading id="department-representatives-heading" title="Department Representatives" />
              <div className="mt-8">
                {departmentGroups.map((group, index) => (
                  <RepGroupBlock key={group.title} group={group} groupIndex={index} />
                ))}
              </div>
            </section>

            <section aria-labelledby="class-representatives-heading" className="py-12 md:py-16">
              <SectionHeading id="class-representatives-heading" title="Class Representatives" />
              <p className="mx-auto mt-8 max-w-2xl text-center text-2xl font-light leading-tight text-sga-red">
                Represent their academic year by bringing student concerns, ideas, and priorities to SGA, helping ensure each class has a clear voice in Senate discussions and student advocacy.
              </p>
              <div className="mt-8">
                {classGroups.map((group, index) => (
                  <RepGroupBlock key={group.title} group={group} groupIndex={index + departmentGroups.length} />
                ))}
              </div>
            </section>

            <section aria-label="Additional senator" className="flex justify-center py-8">
              <RepresentativeTile id="senator-additional" name={config.profiles["senator-additional"]?.name ?? "VACANT"} groupTitle={config.profiles["senator-additional"]?.title ?? "Senator"} />
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
