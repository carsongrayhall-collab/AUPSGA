import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { slugifyKey } from "@/lib/keys";
import { getSiteConfig, saveSiteConfig, type TimelineConfigEvent } from "@/lib/siteConfig";

function parseEvent(formData: FormData): TimelineConfigEvent {
  const title = String(formData.get("title") ?? "").trim();
  const id = slugifyKey(String(formData.get("id") || title || crypto.randomUUID()));

  return {
    date: String(formData.get("date") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    displayOrder: Number(formData.get("displayOrder") ?? 0),
    id,
    published: formData.get("published") === "on",
    time: String(formData.get("time") ?? "").trim(),
    title,
  };
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const action = String(formData.get("action") ?? "save");
  const config = await getSiteConfig();

  if (action === "delete") {
    const id = String(formData.get("id") ?? "");
    config.timeline = config.timeline.filter((event) => event.id !== id);
  } else {
    const event = parseEvent(formData);
    const existingIndex = config.timeline.findIndex((item) => item.id === event.id);

    if (existingIndex >= 0) {
      config.timeline[existingIndex] = event;
    } else {
      config.timeline.push(event);
    }
  }

  await saveSiteConfig(config);

  return NextResponse.redirect(new URL("/it-panel/configuration?saved=timeline", request.url), { status: 303 });
}
