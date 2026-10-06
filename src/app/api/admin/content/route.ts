import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { getSiteConfig, saveSiteConfig } from "@/lib/siteConfig";
import { homeLinks, profileDefaults } from "@/lib/pageContent";

function isValidHref(value: string) {
  if (/^\/(?!\/)/.test(value)) return !/[\\\s\u0000-\u001f]/.test(value);
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) && !/[\u0000-\u001f]/.test(value);
  } catch { return false; }
}

export async function POST(request: NextRequest) {
  try { await requireAdminSession(); } catch { return new Response("Unauthorized", { status: 401 }); }
  const data = await request.formData();
  const section = String(data.get("section") ?? "");
  const config = await getSiteConfig();
  if (section === "home-item") {
    const id = String(data.get("id") ?? "");
    const mainText = String(data.get("name") ?? "").trim();
    const subtext = String(data.get("title") ?? "").trim();
    const href = String(data.get("href") ?? "").trim();
    if (!Object.hasOwn(homeLinks, id) || !mainText || mainText.length > 200 || subtext.length > 2000 || href.length > 2048 || !isValidHref(href)) return new Response("Invalid text or hyperlink.", { status: 400 });
    config.homeContent[id] = { mainText, subtext };
    config.homeLinks[id] = href;
  } else if (section === "home") {
    const links: Record<string, string> = {};
    for (const id of Object.keys(homeLinks)) {
      const value = String(data.get(id) ?? "").trim();
      if (!value || value.length > 2048 || !isValidHref(value)) return new Response(`Invalid link: ${id}`, { status: 400 });
      links[id] = value;
    }
    config.homeLinks = links;
  } else if (section === "senators" || section === "executives") {
    const id = String(data.get("id") ?? "");
    const name = String(data.get("name") ?? "").trim();
    const title = String(data.get("title") ?? "").trim();
    if (!Object.hasOwn(profileDefaults, id) || !id.startsWith(section === "senators" ? "senator-" : "exec-") || !name || !title || name.length > 120 || title.length > 200) {
      return new Response("Invalid profile.", { status: 400 });
    }
    config.profiles[id] = { name, title };
  } else { return new Response("Invalid section.", { status: 400 }); }
  try { await saveSiteConfig(config); } catch { return new Response("Could not save changes. Please try again.", { status: 500 }); }
  if (request.headers.get("accept")?.includes("application/json")) return Response.json({ saved: true });
  return NextResponse.redirect(new URL(`/it-panel/configuration?saved=${section}#edit-${section}`, request.url), { status: 303 });
}
