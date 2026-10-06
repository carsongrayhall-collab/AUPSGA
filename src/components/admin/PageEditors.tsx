import Link from "next/link";

export function PageEditors() {
  return <article className="border-l-8 border-sga-red p-6 shadow-md">
    <h2 className="text-4xl font-semibold uppercase">Page editors</h2>
    <p className="mt-3">Open a page and select Edit on the item you want to change. Text, links, and images are available in its pop-up editor.</p>
    <nav aria-label="Page editors" className="mt-5 flex flex-wrap gap-6 text-xl font-semibold underline">
      <Link href="/">Edit home page</Link><Link href="/reps">Edit senators</Link><Link href="/execs">Edit executives</Link>
    </nav>
  </article>;
}
