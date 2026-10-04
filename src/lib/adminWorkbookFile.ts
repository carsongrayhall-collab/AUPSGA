import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { getBlobCommandOptions } from "@/lib/blobStorage";

const MAX_WORKBOOK_UPLOAD_BYTES = 10 * 1024 * 1024;
const localWorkbookDirectory = path.join(process.cwd(), ".data", "workbooks");
const localWorkbookPath = path.join(localWorkbookDirectory, "treasury-records.xlsx");
const workbookMimeTypes = new Set([
  "application/octet-stream",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export type PersistedWorkbookFile = {
  fileName: string;
  size: number;
  src: string;
  updatedAt: string;
};

export function validateWorkbookFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return "Please upload an .xlsx workbook.";
  }

  if (file.type && !workbookMimeTypes.has(file.type)) {
    return "Please upload a valid .xlsx workbook.";
  }

  if (file.size > MAX_WORKBOOK_UPLOAD_BYTES) {
    return "Please upload a workbook smaller than 10 MB.";
  }

  return null;
}

export async function persistWorkbookFile(file: File): Promise<PersistedWorkbookFile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name;
  const updatedAt = new Date().toISOString();
  const blobOptions = getBlobCommandOptions();

  if (blobOptions) {
    const blob = await put(`workbooks/treasury-records-${Date.now()}.xlsx`, buffer, {
      ...blobOptions,
      access: "private",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return {
      fileName,
      size: file.size,
      src: `blob:${blob.pathname}`,
      updatedAt,
    };
  }

  if (process.env.VERCEL === "1") {
    throw new Error("Vercel Blob storage credentials are required for production workbook uploads.");
  }

  await mkdir(localWorkbookDirectory, { recursive: true });
  await writeFile(localWorkbookPath, buffer);

  return {
    fileName,
    size: file.size,
    src: ".data/workbooks/treasury-records.xlsx",
    updatedAt,
  };
}

export async function readPersistedWorkbookFile(src: string) {
  if (src.startsWith("blob:")) {
    const blobOptions = getBlobCommandOptions();

    if (!blobOptions) {
      throw new Error("Vercel Blob storage credentials are required to read the uploaded workbook.");
    }

    const blob = await get(src.slice("blob:".length), {
      ...blobOptions,
      access: "private",
      useCache: false,
    });

    if (!blob || blob.statusCode !== 200) {
      throw new Error("The uploaded workbook file could not be read.");
    }

    return Buffer.from(await new Response(blob.stream).arrayBuffer());
  }

  if (/^https?:\/\//i.test(src)) {
    const response = await fetch(src, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("The uploaded workbook file could not be read.");
    }

    return Buffer.from(await response.arrayBuffer());
  }

  return readFile(path.join(localWorkbookDirectory, path.basename(src)));
}
