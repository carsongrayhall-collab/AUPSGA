import { NextRequest, NextResponse } from "next/server";
import { persistWorkbookFile, validateWorkbookFile } from "@/lib/adminWorkbookFile";
import { requireAdminSession } from "@/lib/adminAuth";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { testWorkbookConnection } from "@/lib/workbook";

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return new Response("Please choose an .xlsx workbook.", { status: 400 });
  }

  const validationError = validateWorkbookFile(file);

  if (validationError) {
    return new Response(validationError, { status: 400 });
  }

  const config = await getSiteConfig();
  const uploadedFile = await persistWorkbookFile(file);
  const nextConfig = {
    ...config,
    workbook: {
      ...config.workbook,
      uploadedFile,
    },
  };
  await saveSiteConfig(nextConfig);

  const testResult = await testWorkbookConnection();

  if (testResult.ok) {
    const updatedConfig = await getSiteConfig();
    updatedConfig.workbook.lastSuccessfulSync = new Date().toISOString();
    await saveSiteConfig(updatedConfig);
  } else {
    await saveSiteConfig(config);
  }

  return NextResponse.redirect(new URL(`/it-panel/configuration?saved=${testResult.ok ? "workbook-upload" : "workbook-upload-needs-attention"}`, request.url), {
    status: 303,
  });
}
