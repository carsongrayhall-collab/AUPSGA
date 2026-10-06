"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export type ContentEditor = { id: string; section: "home-item" | "senators" | "executives"; mainText: string; subtext: string; href?: string };

export function ContentEditControl({ editor, mediaKey, src, objectPosition, alt }: { editor: ContentEditor; mediaKey?: string; src?: string; objectPosition?: string; alt?: string }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("content");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  useEffect(() => { fetch("/api/admin/session").then(r => r.json()).then(d => setAuthenticated(!!d.authenticated)).catch(() => {}); }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  if (!authenticated) return null;
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); event.stopPropagation(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const image = data.get("file") as File | null;
    try {
      const result = await fetch("/api/admin/content", { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!result.ok) throw new Error(await result.text());
      if (mediaKey && ((image && image.size) || src)) {
        const media = new FormData(); media.set("key", mediaKey); media.set("alt", String(data.get("alt") || alt || editor.mainText));
        media.set("objectPosition", `${data.get("x")}% ${data.get("y")}%`);
        if (image?.size) media.set("file", image); else { media.set("action", "crop"); media.set("src", src!); }
        const response = await fetch("/api/admin/media", { method: "POST", body: media, headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Text saved; image update failed: ${await response.text()}`);
        const updated = await response.json(); window.dispatchEvent(new CustomEvent("sga-media-updated", { detail: { key: mediaKey, media: updated } }));
      }
      setOpen(false); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save changes."); } finally { setBusy(false); }
  }
  const position = objectPosition?.match(/(\d+)%\s+(\d+)%/);
  return <>
    <button type="button" aria-label={`Edit ${editor.mainText}`} className="absolute right-2 top-2 z-30 rounded bg-white px-3 py-1 text-sm font-semibold uppercase text-sga-red shadow-md" onClick={e => { e.preventDefault(); e.stopPropagation(); setError(""); setPreview(undefined); setTab("content"); setOpen(true); }} onPointerDown={e => e.stopPropagation()}>Edit</button>
    {open && createPortal(<dialog ref={dialog} aria-label="Edit content" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} className="fixed inset-0 m-auto max-h-[90svh] w-[min(95vw,40rem)] overflow-auto rounded bg-white p-6 text-sga-red shadow-xl backdrop:bg-black/55" onClick={e => e.stopPropagation()}>
      <h2 className="text-3xl font-semibold uppercase">Edit {editor.section === "home-item" ? "home item" : "profile"}</h2>
      <div className="my-4 flex gap-3" role="tablist" aria-label="Editor sections">
        {['content', ...(mediaKey ? ['image'] : [])].map(t => <button key={t} type="button" role="tab" aria-selected={tab === t} aria-controls={`editor-${t}`} id={`tab-${t}`} className={`rounded border px-4 py-2 ${tab === t ? 'bg-sga-red text-white' : ''}`} onClick={() => setTab(t)}>{t === 'content' ? 'Text and link' : 'Image'}</button>)}
      </div>
      <form onSubmit={save} className="grid gap-4">
        <input type="hidden" name="section" value={editor.section} /><input type="hidden" name="id" value={editor.id} />
        <div id="editor-content" role="tabpanel" aria-labelledby="tab-content" hidden={tab !== 'content'} className={tab === "content" ? "grid gap-4" : "hidden"}>
          <label className="grid gap-2">{editor.section === 'home-item' ? 'Main text' : 'Name'}<input name="name" required maxLength={200} defaultValue={editor.mainText} className="rounded border p-2" /></label>
          <label className="grid gap-2">{editor.section === 'home-item' ? 'Subtext' : 'Title'}<textarea name="title" maxLength={2000} required={editor.section !== 'home-item'} defaultValue={editor.subtext} className="min-h-24 rounded border p-2" /></label>
          {editor.href !== undefined && <label className="grid gap-2">Hyperlink<input name="href" required defaultValue={editor.href} className="rounded border p-2" /></label>}
        </div>
        {mediaKey && <div id="editor-image" role="tabpanel" aria-labelledby="tab-image" hidden={tab !== 'image'} className={tab === "image" ? "grid gap-4" : "hidden"}>
          {(preview || src) && <div className="h-48 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${preview || src})` }} />}
          <label className="grid gap-2">Replacement image<input name="file" type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setPreview(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : undefined)} /></label>
          <label className="grid gap-2">Alternative text<input name="alt" defaultValue={alt ?? editor.mainText} className="rounded border p-2" /></label>
          <label className="grid gap-2">Horizontal crop<input name="x" type="range" min="0" max="100" defaultValue={position?.[1] ?? 50} /></label>
          <label className="grid gap-2">Vertical crop<input name="y" type="range" min="0" max="100" defaultValue={position?.[2] ?? 50} /></label>
        </div>}
        {error && <p role="alert">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" disabled={busy} onClick={() => setOpen(false)} className="rounded border px-4 py-2">Cancel</button><button disabled={busy} className="rounded bg-sga-red px-4 py-2 text-white">{busy ? 'Saving…' : 'Save changes'}</button></div>
      </form>
    </dialog>, document.body)}
  </>;
}
