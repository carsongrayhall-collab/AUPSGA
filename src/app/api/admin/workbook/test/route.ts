import { requireAdminSession } from "@/lib/adminAuth";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { testWorkbookConnection } from "@/lib/workbook";

export async function POST() {
  try {
    await requireAdminSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await testWorkbookConnection();

  if (result.ok) {
    const config = await getSiteConfig();
    config.workbook.lastSuccessfulSync = new Date().toISOString();
    await saveSiteConfig(config);
  }

  return Response.json(result);
}
