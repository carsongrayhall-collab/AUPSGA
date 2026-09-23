export default function TreasuryRecordsLoading() {
  return (
    <main className="bg-white text-sga-red">
      <section className="bg-sga-red px-6 py-14 text-white md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="h-16 max-w-xl animate-pulse bg-white/30" />
          <div className="mt-6 h-8 max-w-3xl animate-pulse bg-white/20" />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="aspect-square animate-pulse bg-sga-red/10" />
        <div className="space-y-4">
          <div className="h-12 animate-pulse bg-sga-red/10" />
          <div className="h-12 animate-pulse bg-sga-red/10" />
          <div className="h-12 animate-pulse bg-sga-red/10" />
          <div className="h-12 animate-pulse bg-sga-red/10" />
        </div>
      </section>
    </main>
  );
}
