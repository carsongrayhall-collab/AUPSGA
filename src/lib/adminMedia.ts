import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getBlobCommandOptions } from "@/lib/blobStorage";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateMediaFile(file: File) {
  if (!allowedTypes.has(file.type)) {
    return "Please upload a JPG, PNG, or WebP image.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "Please upload an image smaller than 5 MB.";
  }

  return null;
}

export async function persistMediaFile(key: string, file: File) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${key}-${Date.now()}.${extension}`;
  const blobOptions = getBlobCommandOptions();

  if (blobOptions) {
    const blob = await put(`media/${filename}`, file, {
      ...blobOptions,
      access: "private",
      contentType: file.type,
    });

    return `/api/blob/${blob.pathname}`;
  }

  if (process.env.VERCEL === "1") {
    throw new Error("Vercel Blob storage credentials are required for production media uploads.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "media");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return `/uploads/media/${filename}`;
}
