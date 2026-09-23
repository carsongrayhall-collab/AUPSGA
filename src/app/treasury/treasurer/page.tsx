import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MediaSlot } from "@/components/MediaSlot";

export const metadata: Metadata = {
  title: "The Treasurer | AUP SGA",
  description:
    "Meet the Treasurer of The American University of Paris Student Government Association and learn how SGA treasury resources work.",
};

const treasuryIntro = [
  "The Treasurer manages the financial structure that supports SGA's work, ensuring that student funds are organized, reviewed, and allocated responsibly. Led by the Treasurer, the Treasury oversees budget planning, funding requests, reimbursements, spending records, and financial guidance for student initiatives.",
  "The Budget and Finance Committee works alongside the Treasurer by reviewing proposals, evaluating the financial needs of projects, and helping ensure that funding decisions are clear, fair, and aligned with the interests of the student body.",
  "Together, the Treasurer and Budget and Finance Committee help make sure SGA resources are used effectively to support events, advocacy, programming, and initiatives that benefit students across AUP.",
];

const treasurerBio =
  "Lorelei Smucker brings strong financial knowledge, analytical experience, and advocacy to her role as Treasurer. As an International Finance student at AUP, Financial Accounting Tutor, and President of the Finance Case & Competition Association, she has a strong foundation in budgeting, accounting, and financial decision-making. Her experience as a Junior Analyst for her previous university's investment group, where she helped manage an $80,000 investment portfolio, supports her ability to approach SGA finances with care and precision. Beyond finance, her work as an Advocacy Associate with the Patrick Henry Policy Institute shows her ability to represent interests, communicate with decision-makers, and follow through on policy goals. Together, these experiences make her well suited to help manage SGA resources responsibly while ensuring student funding decisions remain organized, transparent, and connected to the needs of the AUP community.";

const treasuryCards = [
  {
    title: "View Treasury Records",
    href: "/treasury/records",
    body: "Use the Treasury Records button to view how SGA funds are allocated, track spending priorities, and learn more about the financial goals guiding student initiatives throughout the year.",
  },
  {
    title: "View Budget History",
    href: "/treasury/budget-approvals-history",
    body: "Use the Budget History button to view past funding requests, see which organizations or initiatives submitted them, and track how SGA funding has been requested over time.",
  },
  {
    title: "View Treasury Timeline",
    href: "/treasury/timeline",
    body: "Use the Treasury Timeline button to view upcoming finance meetings, funding request deadlines, reimbursement steps, and expected processing timelines for SGA budget decisions.",
  },
];

function TreasurerButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex min-h-10 items-center justify-center rounded-[3px] bg-sga-red px-5 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.04em] text-white shadow-[0_1px_1px_rgba(0,0,0,0.18)] transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function TreasuryResourceCard({
  title,
  href,
  body,
}: {
  title: string;
  href: string;
  body: string;
}) {
  return (
    <article className="relative flex min-h-[16rem] flex-col justify-between bg-white px-6 pb-8 pt-8 text-center text-sga-red shadow-[6px_4px_2px_rgba(0,0,0,0.22)] md:min-h-[15.5rem] md:px-7 md:pt-9">
      <p className="mx-auto max-w-[18rem] text-2xl font-normal leading-[1.04] tracking-[-0.05em] md:text-[1.65rem]">
        {body}
      </p>
      <div className="absolute inset-x-0 -bottom-6 flex justify-center px-6">
        <TreasurerButton href={href} className="w-full max-w-[18rem] px-3 text-[1.55rem] md:text-[1.65rem]">
          {title}
        </TreasurerButton>
      </div>
    </article>
  );
}

export default function TreasurerPage() {
  return (
    <main className="bg-white text-sga-red">
      <section aria-labelledby="treasurer-heading" className="relative overflow-hidden">
        <div className="relative bg-sga-red">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.45)_0_1px,transparent_1px_22px)]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl gap-8 px-6 pb-14 pt-10 md:grid-cols-[1fr_0.95fr] md:items-start md:pb-10 md:pt-12 lg:px-10">
            <div className="max-w-[32rem]">
              <h1
                id="treasurer-heading"
                className="text-6xl font-semibold uppercase leading-[0.9] tracking-[-0.05em] text-white shadow-black/20 text-shadow-sm md:text-7xl"
              >
                The Treasurer
              </h1>
              <div className="mt-6 space-y-4 text-xl font-normal leading-[1.12] tracking-[-0.05em] text-white md:text-2xl">
                {treasuryIntro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <MediaSlot
              label="Treasury overview media slot"
              src="/images/treasurer-headshot-1.jpg"
              alt="Lorelei Smucker standing at a white railing"
              priority
              imageClassName="object-cover object-[50%_26%]"
              className="mx-auto aspect-[202/255] w-full max-w-[25rem] translate-y-8 shadow-[6px_4px_2px_rgba(0,0,0,0.22)] md:translate-y-14"
            />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-center md:pb-16 md:pt-20 lg:px-10">
          <TreasurerButton href="/treasury/how-do-i-get-my-money?from=treasurer">
            How Does It All Work?
          </TreasurerButton>
        </div>
      </section>

      <section aria-labelledby="meet-treasurer-heading" className="mx-auto grid max-w-6xl gap-8 px-6 pb-12 md:grid-cols-[0.95fr_1fr] md:items-start md:pb-16 lg:px-10">
        <MediaSlot
          label="Lorelei Smucker Treasurer portrait image slot"
          src="/images/treasurer-headshot-2.jpg"
          alt="Lorelei Smucker smiling outdoors"
          imageClassName="object-cover object-center"
          className="aspect-[203/234] w-full shadow-[6px_4px_2px_rgba(0,0,0,0.18)]"
        />
        <div>
          <h2
            id="meet-treasurer-heading"
            className="text-6xl font-semibold uppercase leading-[0.86] tracking-[-0.05em] md:text-7xl"
          >
            Meet Your Treasurer
          </h2>
          <p className="mt-6 text-2xl font-normal leading-[1.12] tracking-[-0.05em] md:text-[1.7rem]">
            {treasurerBio}
          </p>
        </div>
      </section>

      <section aria-label="Budget and Finance Committee action" className="mx-auto max-w-6xl px-6 pb-8 text-center lg:px-10">
        <TreasurerButton href="/committees/budget-finance" className="min-w-[22rem] max-w-full">
          View Budget and Finance Committee
        </TreasurerButton>
      </section>

      <section aria-labelledby="treasury-resources-heading" className="relative overflow-hidden pb-20 pt-20 md:pb-24">
        <div className="absolute inset-x-0 top-16 h-44 bg-sga-red md:top-20" aria-hidden="true">
          <Image
            src="/images/treasury-page-banner.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-95"
          />
        </div>
        <h2 id="treasury-resources-heading" className="sr-only">
          Treasury Resources
        </h2>
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pt-16 md:grid-cols-3 md:gap-9 md:pt-20 lg:px-10">
          {treasuryCards.map((card, index) => (
            <TreasuryResourceCard key={`${card.href}-${index}`} {...card} />
          ))}
        </div>
      </section>
    </main>
  );
}
