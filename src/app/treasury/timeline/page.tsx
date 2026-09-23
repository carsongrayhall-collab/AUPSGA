import type { Metadata } from "next";
import { TreasuryTimelineScroller, type TreasuryTimelineBlock } from "@/components/TreasuryTimelineScroller";
import { getPublishedTimelineEvents } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Treasury Timeline | AUP SGA",
  description:
    "Treasury meetings, check-ins, and deadlines for The American University of Paris Student Government Association.",
};

const timelineBlocks: TreasuryTimelineBlock[] = [
  {
    semester: "Fall 2026 Semester",
    events: [
      {
        date: "September 10th, 2026",
        title: "Meet The Treasurer",
        body: "Meet the Treasurer Night gives students a chance to ask funding questions, understand the budget process, and get direct guidance on how to request money from SGA.",
      },
      {
        date: "September 14th - 21st, 2026",
        title: "Daily BFC Meetings",
        body: "For two weeks, the Budget and Finance Committee meets every weekday from 17h - 19h so that budget requests get approved faster for the beginning of the semester.",
        media: {
          label: "Fall semester Budget and Finance Committee media slot",
          aspect: "aspect-[276/138]",
        },
      },
      {
        date: "October 21st, 2026",
        title: "Midterm Check-In",
        body: "The Midterm Check-In gives students and club leaders a chance to review their spending progress, clarify remaining funding needs, ask questions, and stay on track before the second half of the semester. ANY RECEIPTS INCURRED UP TO THIS POINT MUST BE TURNED IN TO THE SGA TREASURER.",
      },
      {
        date: "November 2nd - 6th, 2026",
        title: "Daily BFC Meetings",
        body: "For one week, the Budget and Finance Committee meets every weekday from 17h - 19h so that budget requests get approved faster for the ending of the semester.",
        media: {
          label: "November Budget and Finance Committee media slot",
          aspect: "aspect-[276/152]",
        },
      },
      {
        date: "November 23rd, 2026",
        title: "Final Check-In",
        body: "The Final Check-In gives students and club leaders the chance to review their spending progress, clarify remaining funding needs, ask questions, and stay on track before the end of the semester. ANY RECEIPTS INCURRED UP TO THIS POINT MUST BE TURNED IN TO THE SGA TREASURER.",
      },
      {
        date: "December 7th, 2026",
        title: "Receipt Deadline",
        body: "The Receipt Collection Deadline is the final date for students and club leaders to submit receipts, reimbursement materials, and spending documentation so Treasury can process records accurately and close funding requests on time.",
      },
    ],
  },
  {
    semester: "Spring 2027 Semester",
    media: {
      label: "Spring semester Treasury Timeline media slot",
      aspect: "aspect-[277/184]",
    },
    events: [
      {
        date: "January 29th, 2027",
        title: "Meet The Treasurer",
        body: "Meet the Treasurer Night gives students a chance to ask funding questions, understand the budget process, and get direct guidance on how to request money from SGA.",
      },
      {
        date: "February 1st - 15th, 2027",
        title: "Daily BFC Meetings",
        body: "For two weeks, the Budget and Finance Committee meets every weekday from 17h - 19h so that budget requests get approved faster for the beginning of the semester.",
      },
      {
        date: "March 18th, 2027",
        title: "Midterm Check-In",
        body: "The Midterm Check-In gives students and club leaders a chance to review their spending progress, clarify remaining funding needs, ask questions, and stay on track before the second half of the semester. ANY RECEIPTS INCURRED UP TO THIS POINT MUST BE TURNED IN TO THE SGA TREASURER.",
        media: {
          label: "March Treasury midterm check-in media slot",
          aspect: "aspect-[276/152]",
        },
      },
      {
        date: "March 22nd - 26th, 2027",
        title: "Daily BFC Meetings",
        body: "For one week, the Budget and Finance Committee meets every weekday from 17h - 19h so that budget requests get approved faster for the ending of the semester.",
      },
      {
        date: "April 26th, 2027",
        title: "Final Check-In",
        body: "The Final Check-In gives students and club leaders the chance to review their spending progress, clarify remaining funding needs, ask questions, and stay on track before the end of the semester. ANY RECEIPTS INCURRED UP TO THIS POINT MUST BE TURNED IN TO THE SGA TREASURER.",
        media: {
          label: "April Treasury final check-in media slot",
          aspect: "aspect-[276/152]",
        },
      },
      {
        date: "May 4th, 2027",
        title: "Receipt Deadline",
        body: "The Receipt Collection Deadline is the final date for students and club leaders to submit receipts, reimbursement materials, and spending documentation so Treasury can process records accurately and close funding requests on time.",
      },
    ],
  },
];

export default async function TreasuryTimelinePage() {
  const configuredEvents = await getPublishedTimelineEvents();
  const configuredTimelineBlocks: TreasuryTimelineBlock[] = configuredEvents.length
    ? [
        {
          semester: "Configured Treasury Timeline",
          events: configuredEvents.map((event) => ({
            body: event.description ?? "",
            date: event.time ? `${event.date} / ${event.time}` : event.date,
            title: event.title,
          })),
        },
      ]
    : timelineBlocks;

  return (
    <main className="bg-white text-sga-red">
      <section aria-labelledby="treasury-timeline-heading">
        <div className="relative overflow-hidden bg-sga-red px-6 py-14 text-center text-white md:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.45)_0_1px,transparent_1px_22px)]"
          />
          <h1
            id="treasury-timeline-heading"
            className="relative mx-auto max-w-5xl text-6xl font-semibold uppercase leading-none tracking-[-0.05em] text-shadow-[4px_1px_1px_rgba(0,0,0,0.25)] md:text-8xl"
          >
            Treasury Timeline
          </h1>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-14 text-center md:py-16">
          <p className="text-3xl font-normal leading-[1.12] tracking-[-0.05em] md:text-4xl">
            The Treasury Timeline outlines the key meetings, check-ins, and deadlines students should attend to access SGA funding efficiently. These dates are built to guide clubs, committees, and student projects through the funding process, from understanding budget categories to submitting requests correctly and receiving approval. Staying engaged with the timeline is the clearest and easiest way to secure funding from SGA without delays, missed requirements, or confusion.
          </p>
        </div>
      </section>

      <TreasuryTimelineScroller blocks={configuredTimelineBlocks} />
    </main>
  );
}
