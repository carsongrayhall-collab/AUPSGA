import type { Metadata } from "next";
import Link from "next/link";
import {
  formatEuro,
  getSortedAllocations,
  getTreasuryRecordsSnapshotFromWorkbook,
  type TreasuryAllocation,
  type TreasuryRecordsSnapshot,
} from "@/lib/treasuryRecords";

export const metadata: Metadata = {
  title: "Treasury Records | AUP SGA",
  description:
    "Review SGA Treasury budget allocations, funding requests, spending categories, and public finance records.",
};

type TreasuryRecordsPageProps = {
  searchParams?: Promise<{
    state?: string | string[];
  }>;
};

const chartColors = ["#5f0806", "#7a0c08", "#95110d", "#b10200", "#cf2018", "#e13c31", "#f05a4a"];

function getPieGradient(allocations: TreasuryAllocation[]) {
  const total = allocations.reduce((sum, item) => sum + item.allocated, 0);
  let cursor = 0;

  if (total === 0) {
    return "conic-gradient(#b10200 0% 100%)";
  }

  const stops = allocations.map((allocation, index) => {
    const start = cursor;
    const size = (allocation.allocated / total) * 100;
    cursor += size;

    return `${chartColors[index % chartColors.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

function Hero() {
  return (
    <section aria-labelledby="treasury-records-heading" className="relative overflow-hidden bg-sga-red px-6 py-14 text-white md:px-10 md:py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.45)_0_1px,transparent_1px_22px)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xl font-semibold uppercase leading-none">Treasury</p>
        <h1
          id="treasury-records-heading"
          className="mt-2 max-w-4xl text-6xl font-semibold uppercase leading-none tracking-[-0.05em] text-shadow-[4px_1px_1px_rgba(0,0,0,0.25)] md:text-8xl"
        >
          Treasury Records
        </h1>
        <p className="mt-5 max-w-4xl text-2xl font-normal leading-[1.08] tracking-[-0.05em] md:text-3xl">
          Track how SGA funds are allocated, which budget categories are active, and how funding requests move through the public Treasury process.
        </p>
      </div>
    </section>
  );
}

function StatePanel({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10">
      <h2 className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-6xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
        {body}
      </p>
      <Link
        href="/treasury/treasurer"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[3px] bg-sga-red px-6 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.04em] text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
      >
        Back To The Treasurer
      </Link>
    </section>
  );
}

function BudgetChart({ snapshot }: { snapshot: TreasuryRecordsSnapshot }) {
  const sortedAllocations = getSortedAllocations(snapshot);
  const totalAllocated = sortedAllocations.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = sortedAllocations.reduce((sum, item) => sum + item.spent, 0);

  return (
    <section aria-labelledby="budget-allocation-heading" className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[0.85fr_1.15fr] md:items-center md:py-16 lg:px-10">
      <div>
        <h2
          id="budget-allocation-heading"
          className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-6xl"
        >
          Budget Allocation
        </h2>
        <p className="mt-4 text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
          Larger allocations appear in darker reds and smaller allocations move toward brighter reds. Exact values are listed in the legend and table.
        </p>
        <dl className="mt-7 grid grid-cols-2 gap-4">
          <div className="border-l-8 border-sga-red pl-4">
            <dt className="text-lg font-semibold uppercase leading-none">Allocated</dt>
            <dd className="mt-1 text-4xl font-semibold leading-none">{formatEuro(totalAllocated)}</dd>
          </div>
          <div className="border-l-8 border-sga-red/50 pl-4">
            <dt className="text-lg font-semibold uppercase leading-none">Spent</dt>
            <dd className="mt-1 text-4xl font-semibold leading-none">{formatEuro(totalSpent)}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(15rem,0.82fr)_1fr] md:items-center">
        <div
          aria-label={`Pie chart showing ${formatEuro(totalAllocated)} allocated across ${sortedAllocations.length} categories`}
          className="mx-auto aspect-square w-full max-w-[22rem] rounded-full shadow-[7px_5px_2px_rgba(0,0,0,0.18)]"
          role="img"
          style={{ background: getPieGradient(sortedAllocations) }}
        />
        <ol className="space-y-3">
          {sortedAllocations.map((allocation, index) => {
            const percent = totalAllocated === 0 ? 0 : (allocation.allocated / totalAllocated) * 100;

            return (
              <li key={allocation.category} className="grid grid-cols-[1rem_1fr] gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-4 w-4"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                />
                <span>
                  <span className="block text-2xl font-semibold uppercase leading-none tracking-[-0.05em]">
                    {allocation.category}
                  </span>
                  <span className="mt-1 block text-xl font-normal leading-none tracking-[-0.05em]">
                    {formatEuro(allocation.allocated)} allocated, {formatEuro(allocation.spent)} spent, {percent.toFixed(1)}%
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function AllocationTable({ snapshot }: { snapshot: TreasuryRecordsSnapshot }) {
  const sortedAllocations = getSortedAllocations(snapshot);

  return (
    <section aria-labelledby="allocation-table-heading" className="bg-sga-red px-6 py-12 text-white md:py-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 id="allocation-table-heading" className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-6xl">
          Allocation Details
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-[48rem] w-full border-collapse text-left">
            <caption className="sr-only">Budget allocation details by category</caption>
            <thead>
              <tr className="border-b border-white/60 text-xl font-semibold uppercase leading-none">
                <th scope="col" className="py-3 pr-5">Category</th>
                <th scope="col" className="px-5 py-3">Allocated</th>
                <th scope="col" className="px-5 py-3">Spent</th>
                <th scope="col" className="py-3 pl-5">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-xl font-normal leading-tight tracking-[-0.03em]">
              {sortedAllocations.map((allocation) => (
                <tr key={allocation.category} className="border-b border-white/25">
                  <th scope="row" className="py-4 pr-5 text-2xl font-semibold uppercase leading-none">
                    {allocation.category}
                  </th>
                  <td className="px-5 py-4">{formatEuro(allocation.allocated)}</td>
                  <td className="px-5 py-4">{formatEuro(allocation.spent)}</td>
                  <td className="py-4 pl-5">{allocation.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function RequestTable({ snapshot }: { snapshot: TreasuryRecordsSnapshot }) {
  return (
    <section aria-labelledby="request-records-heading" className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="request-records-heading" className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-6xl">
            Funding Requests
          </h2>
          <p className="mt-3 text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
            {snapshot.source === "live"
              ? "Public request records are synchronized from the configured Treasury workbook."
              : "Public request records are shown from a safe fallback while the Treasury workbook is unavailable."}
          </p>
        </div>
        <p className="text-xl font-semibold uppercase leading-none">Fiscal Year {snapshot.fiscalYear}</p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-[58rem] w-full border-collapse text-left">
          <caption className="sr-only">Treasury funding request records</caption>
          <thead>
            <tr className="border-y border-sga-red/45 text-xl font-semibold uppercase leading-none">
              <th scope="col" className="py-3 pr-5">Record</th>
              <th scope="col" className="px-5 py-3">Organization</th>
              <th scope="col" className="px-5 py-3">Category</th>
              <th scope="col" className="px-5 py-3">Requested</th>
              <th scope="col" className="px-5 py-3">Approved</th>
              <th scope="col" className="py-3 pl-5">Status</th>
            </tr>
          </thead>
          <tbody className="text-xl font-normal leading-tight tracking-[-0.03em]">
            {snapshot.requests.map((record) => (
              <tr key={record.id} className="border-b border-sga-red/20">
                <th scope="row" className="py-4 pr-5 align-top text-2xl font-semibold uppercase leading-none">
                  {record.id}
                  <span className="mt-1 block text-lg font-normal normal-case leading-none">{record.decisionDate}</span>
                </th>
                <td className="px-5 py-4 align-top">{record.organization}</td>
                <td className="px-5 py-4 align-top">{record.category}</td>
                <td className="px-5 py-4 align-top">{formatEuro(record.requested)}</td>
                <td className="px-5 py-4 align-top">{formatEuro(record.approved)}</td>
                <td className="py-4 pl-5 align-top">
                  <span className="inline-flex rounded-[3px] bg-sga-red px-3 py-1 text-base font-semibold uppercase leading-none text-white">
                    {record.status}
                  </span>
                  <span className="mt-2 block">{record.request}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

async function PopulatedRecords() {
  const snapshot = await getTreasuryRecordsSnapshotFromWorkbook();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-10 text-right text-lg font-semibold uppercase leading-none text-sga-red/70 lg:px-10">
        Last updated: {snapshot.lastUpdated}
      </section>
      <BudgetChart snapshot={snapshot} />
      <AllocationTable snapshot={snapshot} />
      <RequestTable snapshot={snapshot} />
    </>
  );
}

export default async function TreasuryRecordsPage({ searchParams }: TreasuryRecordsPageProps) {
  const params = await searchParams;
  const state = Array.isArray(params?.state) ? params?.state[0] : params?.state;

  return (
    <main className="bg-white text-sga-red">
      <Hero />
      {state === "loading" ? (
        <StatePanel
          title="Loading Treasury Records"
          body="Treasury records are being gathered. This state is ready for the live spreadsheet adapter in the next milestone."
        />
      ) : state === "empty" ? (
        <StatePanel
          title="No Records Published"
          body="No Treasury records are currently available for the selected period. Published records will appear here once data is configured."
        />
      ) : state === "error" ? (
        <StatePanel
          title="Records Unavailable"
          body="Treasury records could not be loaded. The page keeps a clear fallback state while the live source is checked."
        />
      ) : (
        <PopulatedRecords />
      )}
    </main>
  );
}
