"use client";

import { useMemo, useState } from "react";

type MediaUploadFormProps = {
  initialKey: string;
  fixedKey?: boolean;
  initialAlt?: string;
};

export function MediaUploadForm({ initialKey, fixedKey = false, initialAlt }: MediaUploadFormProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const objectPosition = useMemo(() => `${x}% ${y}%`, [x, y]);

  return (
    <form action="/api/admin/media" method="post" encType="multipart/form-data" className="mt-6 grid gap-5">
      {fixedKey ? <input type="hidden" name="key" value={initialKey} /> : <label className="grid gap-2 text-xl font-semibold uppercase leading-none">
        Media key
        <input
          name="key"
          defaultValue={initialKey}
          required
          className="min-h-11 rounded-[3px] border border-sga-red/35 px-3 text-xl font-normal normal-case"
        />
      </label>}

      <label className="grid gap-2 text-xl font-semibold uppercase leading-none">
        Alternative text
        <input
          name="alt"
          defaultValue={initialAlt}
          required
          className="min-h-11 rounded-[3px] border border-sga-red/35 px-3 text-xl font-normal normal-case"
        />
      </label>

      <label className="grid gap-2 text-xl font-semibold uppercase leading-none">
        Replacement image
        <input
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          className="text-xl font-normal normal-case"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </label>

      <input type="hidden" name="objectPosition" value={objectPosition} />

      <div className="grid gap-4 md:grid-cols-[17rem_1fr] md:items-center">
        <div
          className="relative aspect-video overflow-hidden bg-sga-red/10 bg-cover bg-no-repeat"
          style={preview ? { backgroundImage: `url(${preview})`, backgroundPosition: objectPosition } : undefined}
        >
          {preview ? (
            <span className="sr-only">Selected image preview</span>
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-xl font-semibold uppercase leading-none">
              Preview
            </div>
          )}
        </div>
        <div className="grid gap-4">
          <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
            Horizontal crop position: {x}%
            <input type="range" min="0" max="100" value={x} onChange={(event) => setX(Number(event.currentTarget.value))} />
          </label>
          <label className="grid gap-2 text-lg font-semibold uppercase leading-none">
            Vertical crop position: {y}%
            <input type="range" min="0" max="100" value={y} onChange={(event) => setY(Number(event.currentTarget.value))} />
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-[3px] bg-sga-red px-6 py-2 text-xl font-semibold uppercase leading-none text-white transition hover:bg-black"
      >
        Save Media
      </button>
    </form>
  );
}
