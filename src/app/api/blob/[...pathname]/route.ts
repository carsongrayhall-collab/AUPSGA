import { get } from "@vercel/blob";
import { getBlobCommandOptions } from "@/lib/blobStorage";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    pathname: string[];
  }>;
};

function isAllowedMediaPath(pathname: string) {
  return (
    pathname.startsWith("media/") &&
    !pathname.split("/").some((segment) => segment === "" || segment === "." || segment === "..")
  );
}

export async function GET(_request: Request, context: RouteContext) {
  const { pathname } = await context.params;
  const blobPath = pathname.join("/");

  if (!isAllowedMediaPath(blobPath)) {
    return new Response("Not found", {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    });
  }

  const blobOptions = getBlobCommandOptions();

  if (!blobOptions) {
    return new Response("Blob storage is not configured.", {
      headers: { "Cache-Control": "no-store" },
      status: 500,
    });
  }

  const blob = await get(blobPath, {
    ...blobOptions,
    access: "private",
    useCache: true,
  });

  if (!blob || blob.statusCode !== 200) {
    return new Response("Not found", {
      headers: { "Cache-Control": "no-store" },
      status: 404,
    });
  }

  return new Response(blob.stream, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": blob.blob.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
