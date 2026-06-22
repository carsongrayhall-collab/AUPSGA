import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Do I Get My Money? | AUP SGA",
  description:
    "A guide to SGA funding categories, budget requests, Budget and Finance Committee meetings, Senate approval, fund access, and receipt submission.",
};

const fundingCategories = [
  {
    title: "Student Organizations",
    items: [
      "Can only be requested by registered AUP clubs through the Club Treasurer or President.",
      "All funds requested from the Student Organization category must be spent on a club activity.",
      "This can include food and drink, travel and accommodations, competition fees, tickets, reservations, and any other item that is relevant to the club requesting funding.",
    ],
  },
  {
    title: "Merchandise",
    items: [
      "Can only be requested by members of the Communication and Outreach Committee (COC).",
      "All funds requested from the Merchandise category must be spent on merchandise or merchandise related items.",
    ],
  },
  {
    title: "Executive",
    items: [
      "Can only be requested by members of the Executive Board.",
      "All funds will be used by the Executive Board as they see fit to meet Executive Board needs and that align with Student Senate Bylaws.",
    ],
  },
  {
    title: "Senate",
    items: [
      "Can only be requested by members of Senate.",
      "All funds will be used by the Senate as they see fit to meet Senate needs and that align with Student Senate Bylaws.",
    ],
  },
  {
    title: "Events & Social",
    items: [
      "Can be requested by any member of the AUP Student Body, in coordination with the Events and Activities Committee.",
      "All funds requested from the Events & Social category must be spent on social activities that are open to the entire AUP student body and and are not for club or organizational use.",
    ],
  },
  {
    title: "Grad Gala",
    items: [
      "Can only be requested by Senior Representatives and Graduate Representatives.",
      "All funds requested from the Grad Gala category must be spent on items related to the Grad Gala.",
    ],
  },
  {
    title: "Student Projects",
    items: [
      "Can be requested by any member of the AUP Student Body.",
      "This can include conference tickets, travel and accommodations for academic research, community service initiatives, political activism, and subscriptions or other material that are related to academic research.",
    ],
  },
];

const steps = [
  {
    title: "Step 1: Determine the Type of Funding Needed",
    content: (
      <>
        <p>
          Determine what you need funds for and the approximate amount that you want to request. There are eight categories that SGA funding falls under: Student Organizations, Merchandise, Executive, Senate, Events & Social, Grad Gala, and Student Projects. Here are the differences:
        </p>
        <div className="mt-5 space-y-4">
          {fundingCategories.map((category) => (
            <section key={category.title} aria-labelledby={`${category.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}-heading`}>
              <h3
                id={`${category.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}-heading`}
                className="text-2xl font-semibold uppercase leading-none tracking-[-0.05em] text-white"
              >
                {category.title}
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-8">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Step 2: Determine the Amount of Funding to Request",
    content: (
      <>
        <p>
          Once you have determined what type of funding you need, you must then proceed to determine how much funding you will be requesting from the Student Government Association. The Student Government Association has a strict policy on itemizing your budget request for the sake of transparency and to avoid discrepancy when being presented to Senate for final approval. Each item you are requesting funding for should have an approximate cost and should be an individual line item in your budget request. For example, if you are requesting ten water bottles, and the cost of each water bottle is €5.00, your line item for water bottles should look like so:
        </p>
        <p className="mt-4 font-semibold">Water Bottles: 10 x €5.00 = €50.00.</p>
        <p className="mt-4">
          Your line item budget should be as detailed as possible before booking an appointment with the Budget and Finance Committee. If you are requesting a reservation or a large order from a vendor, it is necessary to have a quote from said vendor in a written form BEFORE booking an appointment with the Budget and Finance Committee for budget approvals. Students who do not submit a line item budget with details to the extent of their capabilities and available information will be turned away from their budget approval meeting with the Budget and Finance Committee until a line item budget can be produced. If you are submitting on behalf of a club or student organization, you are required to be either Club Treasurer or Club President.
        </p>
        <p className="mt-4">
          If you are struggling to create a line item budget or are unable to receive approximate quotes, please book an appointment with the SGA Treasurer during their office hours so that they can assist you in your endeavors.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-8">
          <FutureButton label="Submit A Request" />
          <FutureButton label="View Office Hours" />
        </div>
      </>
    ),
  },
  {
    title: "Step 3: Budget and Finance Committee Meeting",
    content: (
      <>
        <p>
          Once you have submitted a budget request, you will need to attend a meeting with the Budget and Finance Committee in order to review your budget request and prepare for the request&apos;s presentation to Senate. Your budget request must be submitted a minimum of 24 hours before your meeting with the Budget and Finance Committee, and your meeting with the Budget and Finance Committee can be no later than Thursday at 19h of every week in order for your request to be heard at Senate the following Wednesday. If you are attending on behalf of a club or student organization, you are required to be either Club Treasurer or Club President.
        </p>
        <div className="mt-6 flex justify-center">
          <FutureButton label="Book An Appointment" />
        </div>
      </>
    ),
  },
  {
    title: "Step 4: Present to Senate for Final Approval",
    content:
      "After your meeting with the Budget and Finance Committee, you will be required to attend the weekly Senate session that takes place every Wednesday from 12:10 to 13:40 in C-104, during which you will be asked to stand with the SGA Treasurer for a two minute presentation that allows the Senate to ask questions pertaining to your budget request. If you are presenting on behalf of a club or student organization, you are required to be either Club Treasurer or Club President.",
  },
  {
    title: "Step 5: Access Your Funds!",
    content:
      "Once your budget request is approved by Senate, there are three ways you will receive your approved amount: reimbursement, payment of invoices, and the use of SGA's corporate card. Reimbursements will be used in the event that you have already paid for the items that you are requesting. Funds that are requested prior to paying for your items will be dispersed via direct deposit into an SGA corporate card. If you require an alternative method of payment, please specify that during your appointment with the Budget and Finance Committee or speak with the SGA Treasurer privately during their office hours.",
  },
  {
    title: "Step 6: Submit Your Receipts",
    content: (
      <>
        <p>
          Once your items have been purchased, please submit all receipts associated with your budget request to the Budget and Finance Committee. Reimbursements are being requested and kept track of throughout the year; please ensure that you complete this in a timely manner. If everything checks out, your remain in great standing for future funding requests. This policy is strictly enforced for ALL methods of payment, including receipts produced from using the SGA corporate card. IF YOU ARE UNSURE ABOUT THE RELEVANCE OF YOUR RECEIPT, BRING THE RECEIPT TO THE SGA TREASURER. It is better to be safe than sorry. Clear and readable photocopies of your receipts are also accepted.
        </p>
        <div className="mt-6 flex justify-center">
          <FutureButton label="Submit Receipts" />
        </div>
      </>
    ),
  },
];

function FutureButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      className="min-h-11 w-44 rounded-[3px] bg-white px-4 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.05em] text-sga-red shadow-[0_5px_2px_rgba(0,0,0,0.24)]"
    >
      {label}
    </button>
  );
}

function TreasuryHelpCard({
  title,
  body,
  buttonLabel,
}: {
  title: string;
  body: string;
  buttonLabel: string;
}) {
  return (
    <article className="relative flex min-h-[12rem] flex-col bg-[#d9d9d9] px-7 pb-12 pt-6 text-center text-white shadow-[4px_2px_2px_rgba(0,0,0,0.16)]">
      <h2 className="text-4xl font-semibold uppercase leading-none tracking-[-0.05em]">
        {title}
      </h2>
      <p className="mt-3 text-xl font-normal leading-[1.08] tracking-[-0.05em]">
        {body}
      </p>
      <div className="absolute inset-x-0 -bottom-5 flex justify-center">
        <FutureButton label={buttonLabel} />
      </div>
    </article>
  );
}

function StepSection({
  title,
  children,
  tall = false,
}: {
  title: string;
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <section
      aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-").replaceAll(":", "")}-heading`}
      className={[
        "bg-sga-red px-6 py-9 text-white shadow-[4px_1px_1px_rgba(0,0,0,0.24)] md:px-10",
        tall ? "md:py-12" : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id={`${title.toLowerCase().replaceAll(" ", "-").replaceAll(":", "")}-heading`}
          className="text-4xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-5xl"
        >
          {title}
        </h2>
        <div className="mt-5 text-xl font-normal leading-[1.12] tracking-[-0.05em] md:text-2xl">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function HowDoIGetMyMoneyPage() {
  return (
    <main className="bg-white text-sga-red">
      <section aria-labelledby="how-do-i-get-my-money-heading" className="relative overflow-hidden bg-sga-red px-6 py-10 text-white md:px-10 md:py-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.45)_0_1px,transparent_1px_22px)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <h1
            id="how-do-i-get-my-money-heading"
            className="text-6xl font-semibold uppercase leading-none tracking-[-0.05em] text-shadow-[4px_1px_1px_rgba(0,0,0,0.25)] md:text-7xl"
          >
            How Do I Get My Money?
          </h1>
          <p className="mt-5 max-w-4xl text-xl font-normal leading-[1.12] tracking-[-0.05em] md:text-2xl">
            This page breaks down how the corporate card works, how to submit and move a budget request through the approval process, and how to identify which funding category your request falls under. It also outlines the different funding pathways available, including pre-approved allocations, reimbursements, direct purchases, club funding, student project funding, and event support, so students can clearly understand where to start and how to use SGA resources responsibly.
          </p>
        </div>
      </section>

      <section aria-label="Treasury help actions" className="bg-white px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-10">
          <TreasuryHelpCard
            title="Schedule A Meeting"
            body="Appointments with the Treasurer give students a direct space to ask questions about funding requests, reimbursements, budget categories, deadlines, and the best way to move their club, committee, or project through the Treasury process. If you have any questions or want to request funding, book a meeting today!"
            buttonLabel="Book An Appointment"
          />
          <TreasuryHelpCard
            title="Don't Miss A Deadline!"
            body="Treasury deadlines and check-ins help clubs, committees, and student projects prepare complete budget requests, submit materials on time, and avoid delays in approval or reimbursement, so be sure to check the Budget Timeline frequently to ensure you are up to date on all treasury information!"
            buttonLabel="View Treasury Timeline"
          />
        </div>
      </section>

      <div className="space-y-8 bg-white pb-10">
        {steps.map((step, index) => (
          <StepSection key={step.title} title={step.title} tall={index <= 1}>
            {typeof step.content === "string" ? <p>{step.content}</p> : step.content}
          </StepSection>
        ))}
      </div>
    </main>
  );
}
