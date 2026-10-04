import { NextRequest, NextResponse } from "next/server";
import { persistMediaFile, validateMediaFile } from "@/lib/adminMedia";
import { requireAdminSession } from "@/lib/adminAuth";
import { slugifyKey } from "@/lib/keys";
import { getMediaConfig, setMediaConfig } from "@/lib/siteConfig";

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const key = slugifyKey(String(formData.get("key") ?? ""));
  const alt = String(formData.get("alt") ?? "").trim();
  const objectPosition = String(formData.get("objectPosition") ?? "50% 50%").trim();
  const action = String(formData.get("action") ?? "").trim();
  const file = formData.get("file");

  if (!key || !alt) {
    return new Response("Media key and alt text are required.", { status: 400 });
  }

  if (action === "crop") {
    try {
      const existingMedia = await getMediaConfig(key);
      const src = existingMedia?.src ?? String(formData.get("src") ?? "").trim();

      if (!src) {
        return new Response("Upload an image before saving its crop.", { status: 400 });
      }

      const media = {
        alt,
        objectPosition,
        src,
        updatedAt: new Date().toISOString(),
      };

      await setMediaConfig(key, media);

      if (request.headers.get("accept")?.includes("application/json")) {
        return Response.json({ key, ...media });
      }

      return NextResponse.redirect(new URL(`/it-panel/configuration?media=${encodeURIComponent(key)}&saved=media`, request.url), {
        status: 303,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown crop update error.";

      if (request.headers.get("accept")?.includes("application/json")) {
        return Response.json({ error: `Crop update failed: ${message}` }, { status: 500 });
      }

      return new Response(`Crop update failed: ${message}`, { status: 500 });
    }
  }

  if (!(file instanceof File) || file.size === 0) {
    return new Response("Please choose an image file.", { status: 400 });
  }

  const validationError = validateMediaFile(file);

  if (validationError) {
    return new Response(validationError, { status: 400 });
  }

  let src: string;

  try {
    src = await persistMediaFile(key, file);
    await setMediaConfig(key, {
      alt,
      objectPosition,
      src,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown media upload error.";

    if (request.headers.get("accept")?.includes("application/json")) {
      return Response.json({ error: `Media upload failed: ${message}` }, { status: 500 });
    }

    return new Response(`Media upload failed: ${message}`, { status: 500 });
  }

  if (request.headers.get("accept")?.includes("application/json")) {
    return Response.json({ alt, key, objectPosition, src });
  }

  return NextResponse.redirect(new URL(`/it-panel/configuration?media=${encodeURIComponent(key)}&saved=media`, request.url), {
    status: 303,
  });
}
