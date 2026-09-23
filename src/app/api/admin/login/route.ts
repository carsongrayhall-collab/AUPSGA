import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/adminAuth";
import { checkLoginLimit, clearLoginLimit, recordFailedLogin } from "@/lib/adminRateLimit";

function getClientIdentifier(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/it-panel/configuration");
  const identifier = getClientIdentifier(request);
  const redirectUrl = new URL("/it-panel", request.url);

  if (!isAdminConfigured()) {
    redirectUrl.searchParams.set("error", "not-configured");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const limit = await checkLoginLimit(identifier);

  if (!limit.allowed) {
    redirectUrl.searchParams.set("error", "locked");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (!verifyPassword(password)) {
    await recordFailedLogin(identifier);
    redirectUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  await clearLoginLimit(identifier);

  const response = NextResponse.redirect(new URL(next.startsWith("/") ? next : "/it-panel/configuration", request.url), {
    status: 303,
  });
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const isSecureRequest = forwardedProtocol === "https" || request.nextUrl.protocol === "https:";
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSessionToken(), getAdminCookieOptions(isSecureRequest));

  return response;
}
