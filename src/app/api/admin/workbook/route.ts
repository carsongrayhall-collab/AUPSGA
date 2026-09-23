import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const config = await getSiteConfig();
  config.workbook = {
    ...config.workbook,
    allocationRange: String(formData.get("allocationRange") ?? "").trim(),
    recordsRange: String(formData.get("recordsRange") ?? "").trim(),
    sharePointUrl: String(formData.get("sharePointUrl") ?? "").trim(),
    worksheetName: String(formData.get("worksheetName") ?? "").trim(),
  };
  await saveSiteConfig(config);

  return NextResponse.redirect(new URL("/it-panel/configuration?saved=workbook", request.url), { status: 303 });
}
