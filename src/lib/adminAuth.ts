import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "sga_superuser_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  exp: number;
  iat: number;
  nonce: string;
  sub: "superuser";
};

function base64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function getSessionSecret() {
  return process.env.SESSION_SECRET;
}

function signPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function isAdminConfigured() {
  return Boolean(process.env.SUPERUSER_PASSWORD && getSessionSecret());
}

export function verifyPassword(candidate: string) {
  const expected = process.env.SUPERUSER_PASSWORD;

  if (!expected) {
    return false;
  }

  return safeEqual(candidate, expected);
}

export function createAdminSessionToken() {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("SESSION_SECRET is required to create an admin session.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    exp: now + SESSION_TTL_SECONDS,
    iat: now,
    nonce: randomBytes(16).toString("base64url"),
    sub: "superuser",
  };
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  const secret = getSessionSecret();

  if (!token || !secret) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.sub !== "superuser" || payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const payload = verifyAdminSessionToken(token);

  return payload ? { expiresAt: payload.exp, isSuperuser: true } : null;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export function getAdminCookieOptions(secure = process.env.NODE_ENV === "production") {
  return {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure,
  };
}
