import Image from "next/image";
import Link from "next/link";
import { MediaSlot } from "@/components/MediaSlot";

export type CommitteeScheduleItem = {
  day: string;
  time?: string;
};

export type AdjacentCommitteeLink = {
  href: string;
  label: string;
  direction: "left" | "right";
};

export type CommitteeDetail = {
  title: string;
  shortName: string;
  logoSrc: string;
  logoAlt: string;
  blurb: string;
  chair: string;
  location: string;
  memberRows: string[][];
  schedule?: CommitteeScheduleItem[];
  adjacent?: AdjacentCommitteeLink[];
};

function MemberTile({ name }: { name: string }) {
  return (
    <article className="w-full max-w-[12rem]">
      <div className="relative">
        <MediaSlot
          label={`${name} committee member image slot`}
          className="aspect-[72/117] w-full"
        />
        <h3 className="absolute inset-x-0 bottom-1 z-10 px-2 text-center text-xl font-semibold uppercase leading-none text-white">
          {name}
        </h3>
      </div>
    </article>
  );
}

function rowClassName(count: number) {
  if (count >= 4) {
    return "mx-auto mt-6 grid max-w-4xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-4";
  }

  if (count === 3) {
    return "mx-auto mt-6 grid max-w-3xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-3";
  }

  return "mx-auto mt-6 grid max-w-md grid-cols-1 justify-items-center gap-6 sm:grid-cols-2";
}

function MeetingSchedule({ items }: { items: CommitteeScheduleItem[] }) {
  return (
    <section
      aria-labelledby="meeting-schedule-heading"
      className="mx-auto mt-14 max-w-3xl px-6 text-center md:mt-16"
    >
      <h2
        id="meeting-schedule-heading"
        className="text-5xl font-semibold uppercase leading-none text-sga-red"
      >
        Meeting Schedule
      </h2>
      <dl className="mt-12 grid grid-cols-[auto_1fr] gap-x-16 gap-y-8 text-left text-4xl font-semibold uppercase leading-none text-sga-red">
        {items.map((item) => (
          <div key={item.day} className="contents">
            <dt className="justify-self-end underline decoration-1 underline-offset-2">
              {item.day}
            </dt>
            <dd className="min-h-[1em] underline decoration-1 underline-offset-2">
              {item.time ?? ""}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CommitteeArrow({ href, label, direction }: AdjacentCommitteeLink) {
  const shape =
    direction === "left"
      ? "[clip-path:polygon(12%_0,100%_0,100%_100%,12%_100%,0_50%)] pl-10 pr-5 text-right"
      : "[clip-path:polygon(0_0,88%_0,100%_50%,88%_100%,0_100%)] pl-5 pr-10 text-left";

  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-12 min-w-[17rem] items-center bg-sga-red py-3 text-lg font-semibold leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red",
        shape,
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function CommitteeDetailPage({ committee }: { committee: CommitteeDetail }) {
  const headingId = `${committee.shortName.toLowerCase()}-heading`;

  return (
    <main className="bg-white text-sga-red">
      <section aria-labelledby={headingId} className="overflow-hidden pb-16 pt-10 md:pb-24 md:pt-14">
        <div>
          <h1
            id={headingId}
            className="mx-auto max-w-4xl px-6 text-center text-4xl font-semibold leading-none md:text-5xl"
          >
            {committee.title}
          </h1>

          <div className="relative mt-10">
            <div className="flex justify-start">
              <div className="relative h-[23rem] w-full max-w-[57rem] md:h-[27rem]">
                <MediaSlot
                  label={`${committee.title} future media slot`}
                  className="absolute left-0 top-0 h-full w-[min(100%,35rem)]"
                />
                <div className="absolute left-0 top-0 z-10 aspect-square h-full shadow-[3px_0_0_rgba(0,0,0,0.18)]">
                  <Image
                    src={committee.logoSrc}
                    alt={committee.logoAlt}
                    fill
                    priority
                    sizes="(min-width: 768px) 36vw, 86vw"
                    className="object-contain"
                  />
                </div>

                <aside className="absolute left-[48vw] top-7 z-20 w-[48vw] max-w-[22rem] bg-white px-6 py-4 text-left text-sga-red shadow-[3px_8px_0_rgba(0,0,0,0.18)] sm:left-[23rem] md:left-[24rem] md:top-9">
                  <div className="border-r border-black/20 pr-6 text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.05em] md:text-5xl">
                    <p>
                      Chair:
                      <br />
                      {committee.chair}
                    </p>
                    <p className="mt-5">
                      Location:
                      <br />
                      {committee.location}
                    </p>
                  </div>
                </aside>
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-xl px-6 text-left text-2xl font-normal leading-[1.2] tracking-[-0.05em] text-sga-red lg:absolute lg:left-[36rem] lg:top-[16.75rem] lg:mt-0 lg:w-[40rem] lg:max-w-[calc(100vw-38rem)] lg:px-0 lg:text-left lg:text-[1.8rem]">
              {committee.blurb}
            </p>
          </div>

          <section aria-labelledby="committee-members-heading" className="mx-auto mt-16 max-w-5xl px-6 text-center md:mt-20">
            <h2
              id="committee-members-heading"
              className="text-5xl font-semibold uppercase leading-none text-sga-red md:text-6xl"
            >
              Committee Members
            </h2>
            {committee.memberRows.map((row, rowIndex) => (
              <div
                key={`${committee.shortName}-row-${rowIndex}`}
                className={rowClassName(row.length).replace("mt-6", rowIndex === 0 ? "mt-9" : "mt-6")}
              >
                {row.map((member, index) => (
                  <MemberTile key={`${member}-${index}`} name={member} />
                ))}
              </div>
            ))}
          </section>

          {committee.schedule ? <MeetingSchedule items={committee.schedule} /> : null}

          {committee.adjacent ? (
            <nav aria-label="Adjacent committees" className="mt-16 flex flex-col gap-4 px-6 sm:flex-row sm:justify-between">
              {committee.adjacent.map((item) => (
                <CommitteeArrow key={item.href} {...item} />
              ))}
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  );
}
