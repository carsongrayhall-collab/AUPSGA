import { PageEditors } from "@/components/admin/PageEditors";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { WorkbookTestButton } from "@/components/admin/WorkbookTestButton";
import { getAdminSession } from "@/lib/adminAuth";
import { getSiteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Configuration | AUP SGA",
  description: "Protected website configuration for the AUP SGA website.",
};

type ConfigurationPageProps = {
  searchParams?: Promise<{
    media?: string;
    saved?: string;
  }>;
};

function Field({
  defaultValue,
  label,
  name,
  required = false,
  type = "text",
}: {
  defaultValue?: string | number;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="min-h-11 rounded-[3px] border border-sga-red/35 px-3 text-xl font-normal normal-case"
      />
    </label>
  );
}

const redPanelInputClass =
  "min-h-11 rounded-[3px] border border-white/60 bg-sga-red px-3 text-xl font-normal normal-case text-white caret-white placeholder:text-white/70";

export default async function ConfigurationPage({ searchParams }: ConfigurationPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/it-panel?next=/it-panel/configuration");
  }

  const params = await searchParams;
  const config = await getSiteConfig();
  const selectedMediaKey = params?.media ?? "treasury-overview-media-slot";

  return (
    <main className="bg-white text-sga-red">
      <section className="bg-sga-red px-6 py-12 text-white md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xl font-semibold uppercase leading-none">IT Panel</p>
            <h1 className="mt-2 text-6xl font-semibold uppercase leading-none tracking-[-0.05em] md:text-8xl">
              Configuration
            </h1>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-white px-5 py-2 text-xl font-semibold uppercase leading-none text-sga-red transition hover:bg-white/85"
            >
              Logout
            </button>
          </form>
        </div>
      </section>

      {params?.saved ? (
        <div className="mx-auto max-w-6xl px-6 pt-8 lg:px-10">
          <p className="bg-sga-red/10 px-4 py-3 text-xl font-semibold uppercase leading-none">
            Saved {params.saved}
          </p>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:px-10">
        <PageEditors />
        <article className="border-l-8 border-sga-red bg-white px-6 py-6 shadow-[5px_3px_2px_rgba(0,0,0,0.16)]">
          <h2 className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em]">
            Treasury Timeline
          </h2>
          <p className="mt-3 text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
            Add, update, hide, or remove timeline events. Published events feed the public Treasury Timeline page.
          </p>

          <div className="mt-8 grid gap-6">
            {config.timeline
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((event) => (
                <form key={event.id} action="/api/admin/timeline" method="post" className="grid gap-4 border-t border-sga-red/25 pt-5">
                  <input type="hidden" name="id" value={event.id} />
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field name="title" label="Event title" defaultValue={event.title} required />
                    <Field name="date" label="Date" defaultValue={event.date} required />
                    <Field name="time" label="Time" defaultValue={event.time} />
                  </div>
                  <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
                    Optional description
                    <textarea
                      name="description"
                      defaultValue={event.description}
                      className="min-h-28 rounded-[3px] border border-sga-red/35 px-3 py-2 text-xl font-normal normal-case"
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-[12rem_1fr] md:items-end">
                    <Field name="displayOrder" label="Display order" defaultValue={event.displayOrder} type="number" />
                    <label className="flex min-h-11 items-center gap-3 text-xl font-semibold uppercase leading-none">
                      <input name="published" type="checkbox" defaultChecked={event.published} className="h-5 w-5" />
                      Published
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button name="action" value="save" className="rounded-[3px] bg-sga-red px-5 py-2 text-xl font-semibold uppercase leading-none text-white">
                      Save Event
                    </button>
                    <button name="action" value="delete" className="rounded-[3px] border border-sga-red px-5 py-2 text-xl font-semibold uppercase leading-none text-sga-red">
                      Remove
                    </button>
                  </div>
                </form>
              ))}
          </div>

          <form action="/api/admin/timeline" method="post" className="mt-8 grid gap-4 border-t-4 border-sga-red pt-6">
            <h3 className="text-3xl font-semibold uppercase leading-none tracking-[-0.05em]">Add Event</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Field name="title" label="Event title" required />
              <Field name="date" label="Date" required />
              <Field name="time" label="Time" />
            </div>
            <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
              Optional description
              <textarea name="description" className="min-h-28 rounded-[3px] border border-sga-red/35 px-3 py-2 text-xl font-normal normal-case" />
            </label>
            <Field name="displayOrder" label="Display order" defaultValue={config.timeline.length * 10 + 10} type="number" />
            <label className="flex min-h-11 items-center gap-3 text-xl font-semibold uppercase leading-none">
              <input name="published" type="checkbox" defaultChecked className="h-5 w-5" />
              Published
            </label>
            <button name="action" value="save" className="w-fit rounded-[3px] bg-sga-red px-5 py-2 text-xl font-semibold uppercase leading-none text-white">
              Add Event
            </button>
          </form>
        </article>

        <article className="bg-sga-red px-6 py-6 text-white shadow-[5px_3px_2px_rgba(0,0,0,0.16)]">
          <h2 className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em]">
            Treasury Workbook
          </h2>
          <p className="mt-3 text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
            Upload an .xlsx workbook for Treasury Records. Advanced SharePoint API settings remain available below when a live Microsoft Graph source is needed.
          </p>
          <form action="/api/admin/workbook/upload" method="post" encType="multipart/form-data" className="mt-6 grid gap-4 border-b border-white/35 pb-6">
            <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
              Upload .xlsx workbook
              <input
                name="file"
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                required
                className="min-h-11 rounded-[3px] border border-white/60 bg-sga-red px-3 py-2 text-xl font-normal normal-case text-white file:mr-4 file:rounded-[3px] file:border-0 file:bg-white file:px-4 file:py-1 file:text-lg file:font-semibold file:uppercase file:text-sga-red"
              />
            </label>
            <div className="flex flex-wrap items-end gap-4">
              <button className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-white px-5 py-2 text-xl font-semibold uppercase leading-none text-sga-red transition hover:bg-white/85">
                Upload Workbook
              </button>
              {config.workbook.uploadedFile ? (
                <p className="text-xl font-normal leading-tight">
                  Current upload: {config.workbook.uploadedFile.fileName} ({config.workbook.uploadedFile.updatedAt})
                </p>
              ) : (
                <p className="text-xl font-normal leading-tight">No uploaded workbook yet.</p>
              )}
            </div>
          </form>
          <form action="/api/admin/workbook" method="post" className="mt-6 grid gap-4">
            <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
              Workbook or SharePoint file URL
              <input
                name="sharePointUrl"
                defaultValue={config.workbook.sharePointUrl}
                className={redPanelInputClass}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
                Worksheet name
                <input name="worksheetName" defaultValue={config.workbook.worksheetName} className={redPanelInputClass} />
              </label>
              <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
                Treasury records range
                <input name="recordsRange" defaultValue={config.workbook.recordsRange} className={redPanelInputClass} />
              </label>
              <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
                Budget allocation range
                <input name="allocationRange" defaultValue={config.workbook.allocationRange} className={redPanelInputClass} />
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex min-h-11 items-center justify-center rounded-[3px] bg-white px-5 py-2 text-xl font-semibold uppercase leading-none text-sga-red transition hover:bg-white/85">
                Save Workbook
              </button>
              <WorkbookTestButton />
            </div>
            <p className="text-xl font-normal leading-tight">
              Last successful sync: {config.workbook.lastSuccessfulSync ?? "Not synchronized yet"}
            </p>
          </form>
        </article>

        <article className="border-l-8 border-sga-red bg-white px-6 py-6 shadow-[5px_3px_2px_rgba(0,0,0,0.16)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-5xl font-semibold uppercase leading-none tracking-[-0.05em]">
                Media Replacement
              </h2>
              <p className="mt-3 text-2xl font-normal leading-[1.1] tracking-[-0.05em]">
                Upload a replacement image, preview the existing aspect-ratio crop, and save alternative text.
              </p>
            </div>
            <Link href="/treasury/treasurer" className="text-xl font-semibold uppercase underline">
              View Public Page
            </Link>
          </div>
          <MediaUploadForm initialKey={selectedMediaKey} />
        </article>
      </section>
    </main>
  );
}
