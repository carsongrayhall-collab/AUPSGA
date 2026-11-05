import { requireAdminSession } from "@/lib/adminAuth";
import { persistMediaFile, validateMediaFile } from "@/lib/adminMedia";
import { defaultPositions, findCommittee, legacyPositionMediaKey, parsePositions, positionMediaKey } from "@/lib/committeePositions";
import { getSiteConfig, saveSiteConfig, type MediaConfig } from "@/lib/siteConfig";

export async function POST(request: Request) {
  try { await requireAdminSession(); } catch { return new Response("Unauthorized", { status: 401 }); }
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return new Response("Forbidden", { status: 403 });

  let data: FormData;
  let positions;
  let committeeId: string;
  try {
    data = await request.formData();
    committeeId = String(data.get("committeeId") ?? "");
    if (!findCommittee(committeeId)) throw new Error("Unknown committee.");
    positions = parsePositions(JSON.parse(String(data.get("positions") ?? "")));
    for (const position of positions) {
      const file = data.get(`image-${position.id}`);
      if (file instanceof File && file.size) {
        const error = validateMediaFile(file);
        if (error) throw new Error(error);
      }
    }
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Invalid committee data.", { status: 400 });
  }

  try {
    const updates: Record<string, MediaConfig> = {};
    for (const position of positions) {
      const file = data.get(`image-${position.id}`);
      if (file instanceof File && file.size) {
        const key = positionMediaKey(committeeId, position.id);
        updates[key] = { src: await persistMediaFile(key, file), alt: position.name, objectPosition: "50% 50%", updatedAt: new Date().toISOString() };
      }
    }
    // Read after uploads so other saved media is retained. Copy old name-based
    // images once, then keep every position independent of its name or index.
    const config = await getSiteConfig();
    if (!config.committees[committeeId]) {
      for (const position of defaultPositions(findCommittee(committeeId)!.memberRows)) {
        const key = positionMediaKey(committeeId, position.id);
        const legacy = config.media[legacyPositionMediaKey(position.name)];
        if (!config.media[key] && legacy) config.media[key] = { ...legacy };
      }
    }
    Object.assign(config.media, updates);
    config.committees[committeeId] = positions;
    await saveSiteConfig(config);
    return Response.json({ saved: true });
  } catch {
    return new Response("Could not save committee changes. Please try again.", { status: 500 });
  }
}
