import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();

  return Response.json({
    authenticated: Boolean(session),
    expiresAt: session?.expiresAt ?? null,
  });
}
