import Image from "next/image";
import Link from "next/link";
import { MediaSlot } from "@/components/MediaSlot";

type LinkCardProps = {
  href: string;
  title: string;
  copy: string;
};

const newsItems = [
  {
    title: "We have so much money left over right now!",
    copy: "Please spend all of our money so that student initiatives can move forward with clarity and momentum.",
    href: "/treasury/budget-approvals-history",
  },
  {
    title: "Something is happening in the Amex or something",
    copy: "Talking and talking and talking about the latest campus update, event, or announcement from SGA.",
    href: "/engagement/calendar",
  },
  {
    title: "Get your tickets now!",
    copy: "Please we have like no monies and we love monies.",
    href: "/engagement/calendar",
  },
  {
    title: "Get your tickets now!",
    copy: "Please we have like no monies and we love monies.",
    href: "/engagement/calendar",
  },
];

const quickLinks: LinkCardProps[] = [
  {
    href: "/engagement/initiatives",
    title: "SGA Initiatives",
    copy: "Our projects to unite and support the AUP Student Body.",
  },
  {
    href: "/resources",
    title: "Student Resources",
    copy: "Forms, documents, and resources for university life, club management, and individual projects.",
  },
  {
    href: "/resources/resolutions",
    title: "Legislative Activities",
    copy: "Records, policies, and reports that keep SGA transparent and accessible.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className={light ? "text-white" : "text-sga-red"}>
      {eyebrow ? <p className="text-base font-semibold uppercase leading-none tracking-normal">{eyebrow}</p> : null}
      <h2 className="mt-1 text-4xl font-semibold uppercase leading-[0.9] tracking-normal md:text-5xl">{title}</h2>
    </div>
  );
}

function QuickLinkCard({ href, title, copy }: LinkCardProps) {
  return (
    <Link href={href} className="group relative flex min-h-[18rem] flex-col justify-end overflow-hidden bg-[#d9d9d9] p-5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red">
      <MediaSlot label={`${title} media slot`} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-sga-red/35 transition group-hover:bg-sga-red/55 group-focus-visible:bg-sga-red/55" />
      <div className="relative">
        <h3 className="text-4xl font-semibold uppercase leading-[0.92]">{title}</h3>
        <p className="mt-4 text-xl font-light leading-tight">{copy}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="bg-white text-sga-red">
      <section className="relative">
        <MediaSlot label="Looping video hero media slot" className="aspect-[484/130] min-h-[15rem] w-full md:min-h-[22rem]" />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 text-center md:py-16">
        <Image
          src="/images/aup-student-government-red.svg"
          alt="AUP Student Government Association seal"
          width={108}
          height={108}
          priority
          className="mx-auto h-24 w-24 md:h-28 md:w-28"
        />
        <h1 className="sr-only">The American University of Paris Student Government Association</h1>
        <div className="mt-5">
          <p className="text-xl font-semibold uppercase leading-none">Our Mission</p>
          <p className="mx-auto mt-3 max-w-4xl text-2xl font-light leading-tight md:text-3xl">
            The American University of Paris Student Government Association advocates for AUP&apos;s international student body by amplifying diverse voices, advancing student interests, and building a globally minded community rooted in representation and cross-cultural dialogue.
          </p>
        </div>
        <div className="mx-auto my-8 h-px max-w-3xl bg-sga-red/35" />
        <div>
          <p className="text-xl font-semibold uppercase leading-none">Our Goal</p>
          <p className="mx-auto mt-3 max-w-3xl text-xl font-light leading-tight md:text-2xl">
            To unite AUP&apos;s international student body around a shared global voice, ensuring students are represented, heard, and empowered across cultures, perspectives, and experiences.
          </p>
        </div>
      </section>

      <section className="border-y border-sga-red/35 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-5xl font-semibold uppercase leading-none tracking-normal">Current News</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl font-light leading-tight">
              Updates from Senate, committees, treasury, and student life at AUP.
            </p>
          </div>

          <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_1.7fr_1fr]">
            <div className="grid gap-5">
              {newsItems.slice(0, 2).map((item) => (
                <Link key={item.title + item.href} href={item.href} className="group grid grid-cols-[5.25rem_1fr] gap-4 border-t border-sga-red/35 pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red">
                  <MediaSlot label={`${item.title} thumbnail media slot`} className="aspect-square" />
                  <span>
                    <span className="block text-2xl font-semibold italic leading-none group-hover:underline">{item.title}</span>
                    <span className="mt-2 block text-base font-light leading-tight">{item.copy}</span>
                  </span>
                </Link>
              ))}
            </div>

            <Link href="/engagement/calendar" className="group border-x border-sga-red/35 px-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red md:px-6">
              <MediaSlot label="Featured current news media slot" className="aspect-[215/190] w-full" />
              <h3 className="mt-5 text-3xl font-semibold italic leading-none group-hover:underline md:text-4xl">
                Something is happening in the Amex or something
              </h3>
              <p className="mt-4 text-xl font-light leading-tight">
                Talking and talking and talking about student life, upcoming events, and the work happening across campus.
              </p>
            </Link>

            <div className="grid gap-6">
              {newsItems.slice(2).map((item, index) => (
                <Link key={`${item.title}-${index}`} href={item.href} className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red">
                  <MediaSlot label={`${item.title} image media slot`} className="aspect-[98/90] w-full" />
                  <span className="mt-3 block text-2xl font-semibold italic leading-none group-hover:underline">{item.title}</span>
                  <span className="mt-2 block text-base font-light leading-tight">{item.copy}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sga-red px-6 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Current Initiatives" light />
          <p className="mt-4 max-w-2xl text-xl font-light leading-tight">
            SGA projects, campaigns, and priorities for uniting and supporting the AUP student body.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {["Featured", "Student Life", "Campus Support"].map((item) => (
              <Link key={item} href="/engagement/initiatives" className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <MediaSlot label={`${item} initiative media slot`} tone="red" className="aspect-square w-full" />
                <span className="mt-3 block text-xl font-semibold uppercase group-hover:underline">{item}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Quick Links" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {quickLinks.map((item) => (
              <QuickLinkCard key={item.href} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sga-red px-6 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Get Involved" light />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="grid min-h-[20rem] place-items-center bg-white/10 p-6 text-center">
              <div>
                <h3 className="text-4xl font-semibold uppercase leading-none">Make Your Voice Heard</h3>
                <p className="mx-auto mt-5 max-w-md text-xl font-light leading-tight">
                  Share feedback, suggestions, or opportunities for improvement through the feedback button below or contact us directly at sga@aup.edu.
                </p>
                <Link href="/engagement/feedback" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-lg font-semibold uppercase leading-none text-sga-red transition hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  Submit Feedback
                </Link>
              </div>
            </article>
            <article className="grid min-h-[20rem] place-items-center bg-white/10 p-6 text-center">
              <div>
                <h3 className="text-4xl font-semibold uppercase leading-none">Come To A Session</h3>
                <p className="mx-auto mt-5 max-w-md text-xl font-light leading-tight">
                  See student government in action by attending a Senate or committee meeting. Meeting times and locations are available on our calendar.
                </p>
                <Link href="/engagement/calendar" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-lg font-semibold uppercase leading-none text-sga-red transition hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  View Calendar
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.4fr_0.85fr] md:items-center">
          <div>
            <MediaSlot label="Photo of SGA media slot" className="aspect-[277/188] w-full" />
            <p className="mt-3 text-xl font-light">28th American University of Paris Student Government</p>
          </div>
          <div>
            <SectionHeading title="Meet Your Representatives" />
            <p className="mt-5 text-xl font-light leading-tight">
              Get to know the students representing you. Explore who serves in SGA, learn about each committee&apos;s work, view voting records, and find contact information for your representatives.
            </p>
            <Link href="/student-government/senators" className="mt-7 inline-flex rounded-full bg-sga-red px-6 py-3 text-lg font-semibold uppercase leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red">
              SGA Representatives
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-sga-red/35 px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.78fr_1.45fr] md:items-center">
          <div>
            <SectionHeading title="Buy AUP Merch!" />
            <p className="mt-5 text-xl font-light leading-tight">
              Show your AUP spirit and support student initiatives by purchasing official SGA merchandise.
            </p>
            <Link href="/engagement/merch-shop" className="mt-7 inline-flex rounded-full bg-sga-red px-6 py-3 text-lg font-semibold uppercase leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red">
              Shop Now!
            </Link>
          </div>
          <div className="relative">
            <MediaSlot label="Merch media slot" className="aspect-[307/174] w-full" />
          </div>
        </div>
      </section>

      <section className="bg-sga-red px-6 py-16 text-center text-white">
        <p className="mx-auto max-w-5xl text-5xl font-semibold uppercase leading-[0.9] md:text-7xl">
          AUP Student Government Association We Are Here To Serve You
        </p>
      </section>

    </main>
  );
}
