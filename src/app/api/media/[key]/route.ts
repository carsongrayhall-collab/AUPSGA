import { getMediaConfig } from "@/lib/siteConfig";

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  const media = await getMediaConfig(key);

  if (!media) {
    return new Response(null, { status: 404 });
  }

  return Response.json({
    alt: media.alt,
    objectPosition: media.objectPosition,
    src: media.src,
  });
}
