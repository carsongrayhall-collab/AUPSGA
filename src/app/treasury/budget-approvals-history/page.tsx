import type { Metadata } from "next";
import Link from "next/link";
import { formatEuro, getTreasuryRecordsSnapshot } from "@/lib/treasuryRecords";

export const metadata: Metadata = {
  title: "Budget Approvals History | AUP SGA",
  description:
    "A public history of SGA Budget and Finance Committee funding requests and approval outcomes.",
};

export default function BudgetApprovalsHistoryPage() {
  const snapshot = getTreasuryRecordsSnapshot();

  return (
    <main className="bg-white text-sga-red">
      <section aria-labelledby="budget-history-heading" className="relative overflow-hidden bg-sga-red px-6 py-14 text-white md:px-10 md:py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.45)_0_1px,transparent_1px_22px)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xl font-semibold uppercase leading-none">Treasury</p>
          <h1
            id="budget-history-heading"
            className="mt-2 max-w-5xl text-6xl font-semibold uppercase leading-none tracking-[-0.05em] text-shadow-[4px_1px_1px_rgba(0,0,0,0.25)] md:text-8xl"
          >
            Budget Approvals History
          </h1>
          <p className="mt-5 max-w-4xl text-2xl font-normal leading-[1.08] tracking-[-0.05em] md:text-3xl">
            Review recent funding requests, approvals, and pending items submitted through the Budget and Finance Committee.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-6xl">
              Recent Requests
            </h2>
            <p className="mt-3 text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
              This page currently uses the Milestone 2 fixture adapter and will connect to the configured workbook in Milestone 3.
            </p>
          </div>
          <Link
            href="/treasury/records"
            className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-sga-red px-6 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.04em] text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
          >
            View Treasury Records
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {snapshot.requests.map((record) => (
            <article key={record.id} className="border-l-8 border-sga-red bg-white px-6 py-5 shadow-[5px_3px_2px_rgba(0,0,0,0.16)]">
              <p className="text-lg font-semibold uppercase leading-none">{record.id} / {record.status}</p>
              <h3 className="mt-2 text-3xl font-semibold uppercase leading-none tracking-[-0.05em]">
                {record.organization}
              </h3>
              <p className="mt-3 text-2xl font-normal leading-[1.08] tracking-[-0.05em]">
                {record.request}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-xl font-normal leading-none">
                <div>
                  <dt className="font-semibold uppercase">Requested</dt>
                  <dd className="mt-1">{formatEuro(record.requested)}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase">Approved</dt>
                  <dd className="mt-1">{formatEuro(record.approved)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-lg font-normal leading-none">{record.decisionDate} / {record.category}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
