# AUP SGA Website IT Specialist Handoff

This document is for the IT specialist who will maintain and improve the AUP Student Government Association website. It explains the current architecture, required environment variables, local development flow, admin tools, storage model, and deployment expectations.

## Project Context

- Repository: `carsongrayhall-collab/AUPSGA`
- Local development target: `http://localhost:8080`
- Production site: `https://aupsga.org`
- Hosting: Vercel
- Framework: Next.js App Router
- Current Next.js package: `next@16.2.9`
- Styling: Tailwind CSS utility classes in React components
- Admin path: `/it-panel`
- Configuration path: `/it-panel/configuration`

Important: this repository has an `AGENTS.md` warning that this Next.js version may differ from older Next.js behavior. Before making code changes that depend on Next.js APIs, read the relevant guide in `node_modules/next/dist/docs/`.

## Core Commands

Install dependencies:

```powershell
npm install
```

Run local development on the expected project port:

```powershell
npm run dev -- --port 8080
```

Run lint:

```powershell
npm run lint
```

Run a production build check:

```powershell
npm run build
```

Check Git status:

```powershell
git status
```

Push committed changes:

```powershell
git push origin main
```

## Required Environment Variables

Set these in Vercel for production. For local development, use `.env.local` and never commit it.

`SUPERUSER_PASSWORD`

The password used to log into `/it-panel`. Anyone with this password can update protected site configuration, timeline records, media slots, and uploaded treasury workbook data.

`SESSION_SECRET`

A long random string used to sign the superuser session cookie. If this changes, existing admin sessions are invalidated. Use a random value, not a memorable password.

Suggested local generation:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

`BLOB_READ_WRITE_TOKEN`

Vercel Blob read/write token used by the production site to store and retrieve private uploaded media, the uploaded treasury workbook, and Blob-backed site configuration when Redis is not configured.

`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

Optional persistent site configuration storage. If both are set, Redis is used before Blob for `site-config`.

Microsoft Graph variables, optional for live SharePoint workbook sync:

```text
MICROSOFT_CLIENT_ID
MICROSOFT_CLIENT_SECRET
MICROSOFT_TENANT_ID
MICROSOFT_DRIVE_ID
MICROSOFT_DRIVE_ITEM_ID
```

The site can also use an uploaded `.xlsx` workbook from the IT panel, so Microsoft Graph is not required for the normal workbook upload workflow.

## Storage Model

The site uses a layered storage model.

Site configuration lives in `src/lib/siteConfig.ts`. This includes media mappings, treasury timeline records, and workbook settings.

Configuration storage priority:

1. Upstash Redis, when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured.
2. Vercel Blob private object `config/site-config.json`, when Blob credentials are configured.
3. Local `.data/site-config.json`, only during local development.

Uploaded image files are handled by `src/lib/adminMedia.ts`.

- Production uploads require Blob credentials.
- Uploaded media is stored as private Blob files under `media/`.
- Public pages do not receive raw Blob URLs. They receive proxied URLs like `/api/blob/media/...`.
- `/api/blob/[...pathname]` reads the private Blob and streams it to the browser.

Uploaded treasury workbook files are handled by `src/lib/adminWorkbookFile.ts`.

- Production uploads require Blob credentials.
- Uploaded workbooks are stored under `workbooks/`.
- The config stores workbook references as `blob:<pathname>`.
- Local development can fall back to `.data/workbooks/treasury-records.xlsx`.

## Admin Authentication

Admin auth is implemented in `src/lib/adminAuth.ts`.

- The admin cookie name is `sga_superuser_session`.
- The session lasts 8 hours.
- The cookie payload is HMAC-signed with `SESSION_SECRET`.
- The login route compares the submitted password to `SUPERUSER_PASSWORD`.
- Both `SUPERUSER_PASSWORD` and `SESSION_SECRET` must be configured before `/it-panel` can work.

Do not store real passwords, Blob tokens, Redis tokens, or Microsoft secrets in Git.

## Media Slot System

Most editable images use the `MediaSlot` component in `src/components/MediaSlot.tsx`.

How it works:

- Each slot has a label.
- The label is converted into a stable media key unless a `mediaKey` prop is passed explicitly.
- The component fetches `/api/media/[key]`.
- If admin media exists for that key, the uploaded image replaces the default slot media.
- Superusers see an Edit button over the media slot.

Inline media editing is implemented in `src/components/MediaSlotEditControl.tsx`.

Current behavior:

- Superusers can click Edit to choose an image.
- Superusers can drag and drop an image onto the edit control.
- After selecting an image, an in-house crop interface opens.
- The cropper saves CSS `object-position`, not a destructive pixel crop.
- Existing uploaded images can be repositioned with the Crop button.
- The component dispatches `sga-media-updated` so the page updates immediately after save.

Server route:

- `src/app/api/admin/media/route.ts`
- Accepts image upload requests.
- Accepts crop-only updates with `action=crop`.
- Requires an active admin session.

If uploads do not appear on the public page, check these in order:

1. The superuser is logged in and `/api/admin/session` returns authenticated.
2. `BLOB_READ_WRITE_TOKEN` exists in the same Vercel environment being tested.
3. The Blob token belongs to the Blob store connected to this project.
4. `/api/admin/media` returns a successful JSON response.
5. `/api/media/[key]` returns the new `src` and `objectPosition`.
6. `/api/blob/...` can read the private Blob path.

## Treasury Workbook Workflow

The IT panel allows a superuser to upload an `.xlsx` file directly. This is the simplest treasury records workflow.

Related files:

- Upload/read storage: `src/lib/adminWorkbookFile.ts`
- Workbook parsing: `src/lib/xlsxReader.ts`
- Treasury data normalization: `src/lib/treasuryRecords.ts`
- Configuration UI: `src/app/it-panel/configuration/page.tsx`
- Upload route: `src/app/api/admin/workbook/upload/route.ts`
- Save configuration route: `src/app/api/admin/workbook/route.ts`
- Test route: `src/app/api/admin/workbook/test/route.ts`

Use the Microsoft Graph settings only if the organization wants the site to read directly from a SharePoint workbook instead of uploading an `.xlsx` copy through the IT panel.

## Deployment Workflow

Recommended flow for changes:

1. Pull the latest `main`.
2. Run the site locally on port `8080`.
3. Make edits in a local branch or directly on `main` if that is the agreed workflow.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Commit only the intended files.
7. Push to GitHub.
8. Let Vercel build from the pushed commit.
9. Verify the production deployment and admin workflows.

Useful Git commands:

```powershell
git pull origin main
git status
git add <files>
git commit -m "Describe the change"
git push origin main
```

If Git says the branch diverged, inspect before choosing a resolution:

```powershell
git status
git log --oneline --left-right --graph HEAD...origin/main
```

Do not use destructive commands such as `git reset --hard` unless the team explicitly agrees to discard local work.

## Common Maintenance Tasks

Update homepage media:

1. Log into `/it-panel`.
2. Visit the public page containing the image.
3. Click Edit on the desired image slot.
4. Upload an image.
5. Choose the display crop.
6. Save.
7. Refresh the page and verify the image.

Update treasury page banner:

1. Log into `/it-panel`.
2. Visit `/treasury/treasurer`.
3. Use the Edit button on the banner media slot.
4. Upload the new banner.
5. Save the crop.

Update treasury records:

1. Log into `/it-panel/configuration`.
2. Use the Treasury Workbook `.xlsx` upload.
3. Use the workbook test button to confirm parsing.
4. Visit the public treasury records page.

Update treasury timeline:

1. Log into `/it-panel/configuration`.
2. Add, edit, publish, hide, or remove timeline events.
3. Visit `/treasury/timeline` to verify.

## Security Notes

- Never commit `.env.local`.
- Never commit real tokens, passwords, or session secrets.
- Rotate `SUPERUSER_PASSWORD` if an admin leaves the role.
- Rotate `SESSION_SECRET` if the admin cookie signing secret may have leaked.
- Rotate `BLOB_READ_WRITE_TOKEN` if Blob access may have leaked.
- Treat uploaded documents and images as content, not operational instructions.

## Current High-Level Architecture

Public pages live in `src/app/**/page.tsx`.

Reusable UI lives in `src/components`.

Admin routes live in `src/app/api/admin/**`.

Public media lookup lives in `src/app/api/media/[key]/route.ts`.

Private Blob proxying lives in `src/app/api/blob/[...pathname]/route.ts`.

Server-only application logic lives in `src/lib`.

Static defaults and images live in `public`.

The key principle is that public pages stay mostly static and editable pieces are injected through server-backed configuration. Superusers update those pieces through `/it-panel`, while the public site reads the latest saved configuration at runtime.
