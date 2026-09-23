import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSession, isAdminConfigured } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "IT Panel | AUP SGA",
  description: "Administrative entry point for the AUP SGA website.",
};

type ItPanelPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "invalid") {
    return "Invalid password. Please try again.";
  }

  if (error === "locked") {
    return "Too many failed attempts. Please wait before trying again.";
  }

  if (error === "not-configured") {
    return "Admin login is not configured. Set SUPERUSER_PASSWORD and SESSION_SECRET server-side.";
  }

  return null;
}

export default async function ItPanelPage({ searchParams }: ItPanelPageProps) {
  const params = await searchParams;
  const session = await getAdminSession();
  const errorMessage = getErrorMessage(params?.error);
  const next = params?.next ?? "/it-panel/configuration";

  return (
    <main className="bg-white text-sga-red">
      <section aria-labelledby="it-panel-heading" className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28 lg:px-10">
        <p className="text-xl font-semibold uppercase leading-none">AUP SGA</p>
        <h1
          id="it-panel-heading"
          className="mt-2 text-6xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-8xl"
        >
          IT Panel
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-2xl font-normal leading-[1.1] tracking-[-0.05em] md:text-3xl">
          Administrative access is protected by a server-side superuser session.
        </p>

        {session ? (
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/it-panel/configuration"
              className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-sga-red px-6 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.04em] text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sga-red"
            >
              Configuration
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-[3px] border border-sga-red px-6 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.04em] text-sga-red transition hover:bg-sga-red hover:text-white"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          <form action="/api/admin/login" method="post" className="mx-auto mt-9 grid max-w-md gap-4 text-left">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-2 text-xl font-semibold uppercase leading-none">
              Superuser password
              <input
                name="password"
                type="password"
                required
                disabled={!isAdminConfigured()}
                className="min-h-12 rounded-[3px] border border-sga-red/35 px-3 text-2xl font-normal normal-case disabled:bg-sga-red/10"
              />
            </label>
            {errorMessage ? <p className="text-xl font-normal leading-tight">{errorMessage}</p> : null}
            {!isAdminConfigured() ? (
              <p className="text-xl font-normal leading-tight">
                Set `SUPERUSER_PASSWORD` and `SESSION_SECRET` in `.env.local` and Vercel environment variables before login.
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!isAdminConfigured()}
              className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-sga-red px-6 py-2 text-center text-xl font-semibold uppercase leading-none tracking-[-0.04em] text-white transition hover:bg-black disabled:opacity-60"
            >
              Login
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
