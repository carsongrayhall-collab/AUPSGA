"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MAX_COMMITTEE_POSITIONS, type CommitteePosition } from "@/lib/committeePositions";

type Position = CommitteePosition & { src?: string; file?: File; preview?: string };
type Props = { committeeId: string; title: string; positions: Position[] };

function PositionImage({ position }: { position: Position }) {
  const src = position.preview ?? position.src;
  return src ? <Image src={src} alt={position.name} width={80} height={100} unoptimized className="h-24 w-20 object-cover" /> : <span className="flex h-24 w-20 items-center justify-center bg-gray-100 text-sm">No image</span>;
}

function EditorDialog({ committeeId, title, positions, close }: Props & { close: () => void }) {
  const [draft, setDraft] = useState(positions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const previews = useRef<string[]>([]);
  const router = useRouter();
  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => () => { for (const url of previews.current) URL.revokeObjectURL(url); }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData();
    data.set("committeeId", committeeId);
    data.set("positions", JSON.stringify(draft.map(({ id, name }) => ({ id, name }))));
    for (const position of draft) if (position.file) data.set(`image-${position.id}`, position.file);
    try {
      const response = await fetch("/api/admin/committees", { method: "POST", body: data });
      if (!response.ok) throw new Error(await response.text());
      router.refresh();
      close();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save changes.");
    } finally { setBusy(false); }
  }

  return createPortal(
    <dialog ref={dialog} aria-labelledby={`edit-${committeeId}`} onCancel={event => { if (busy) event.preventDefault(); else close(); }} onClose={close} className="fixed inset-0 m-auto max-h-[90svh] w-[min(95vw,48rem)] overflow-auto rounded bg-white p-6 text-sga-red shadow-xl backdrop:bg-black/55">
      <h2 id={`edit-${committeeId}`} className="text-3xl font-semibold">Edit {title}</h2>
      <p className="mt-3">Change names and images, or add and remove positions. Changes appear on the public committee page after saving.</p>
      <form onSubmit={save} className="mt-5">
        <fieldset disabled={busy} className="grid gap-4">
          <legend className="mb-4 text-xl font-semibold">Positions ({draft.length})</legend>
          {draft.map((position, index) => (
            <div key={position.id} className="grid gap-4 rounded border border-sga-red/25 p-4 sm:grid-cols-[5rem_1fr]">
              <PositionImage position={position} />
              <div className="grid gap-3">
                <label className="grid gap-1">Position {index + 1}: name or role
                  <input required maxLength={120} value={position.name} onChange={event => setDraft(current => current.map(item => item.id === position.id ? { ...item, name: event.target.value } : item))} className="min-h-11 rounded border p-2" />
                </label>
                <label className="grid gap-1">Replacement image (JPG, PNG, WebP; up to 5 MB)
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => {
                    const file = event.target.files?.[0];
                    if (file && (file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
                      setError("Choose a JPG, PNG, or WebP image up to 5 MB.");
                      event.target.value = "";
                      return;
                    }
                    setError("");
                    const preview = file ? URL.createObjectURL(file) : undefined;
                    if (preview) previews.current.push(preview);
                    setDraft(current => current.map(item => item.id === position.id ? { ...item, file, preview } : item));
                  }} className="w-full min-w-0" />
                </label>
                <button type="button" aria-label={`Remove position ${index + 1}: ${position.name}`} onClick={() => setDraft(current => current.filter(item => item.id !== position.id))} className="w-fit underline">Remove position</button>
              </div>
            </div>
          ))}
          {draft.length === 0 && <p>No positions. Add one below, or save to show an empty committee.</p>}
          <button type="button" disabled={draft.length >= MAX_COMMITTEE_POSITIONS} onClick={() => setDraft(current => [...current, { id: crypto.randomUUID(), name: "VACANT" }])} className="w-fit rounded border px-4 py-2 disabled:opacity-50">Add position</button>
          {error && <p role="alert">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={close} className="rounded border px-4 py-2">Cancel</button>
            <button className="rounded bg-sga-red px-4 py-2 text-white">{busy ? "Saving…" : "Save changes"}</button>
          </div>
        </fieldset>
      </form>
    </dialog>, document.body,
  );
}

export function CommitteeEditor(props: Props) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setOpen(true)} className="my-5 rounded bg-sga-red px-5 py-3 text-lg font-semibold text-white">Edit committee positions</button>
    {open && <EditorDialog {...props} close={() => setOpen(false)} />}
  </>;
}
