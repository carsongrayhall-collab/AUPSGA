import "server-only";

import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 5;
const memoryAttempts = new Map<string, { count: number; resetAt: number }>();

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
  });
}

export async function checkLoginLimit(identifier: string) {
  const redis = getRedis();
  const key = `sga:login:${identifier}`;

  if (redis) {
    const attempts = Number((await redis.get<number>(key)) ?? 0);

    return {
      allowed: attempts < MAX_ATTEMPTS,
      attempts,
      maxAttempts: MAX_ATTEMPTS,
    };
  }

  const now = Date.now();
  const current = memoryAttempts.get(key);

  if (!current || current.resetAt <= now) {
    return { allowed: true, attempts: 0, maxAttempts: MAX_ATTEMPTS };
  }

  return {
    allowed: current.count < MAX_ATTEMPTS,
    attempts: current.count,
    maxAttempts: MAX_ATTEMPTS,
  };
}

export async function recordFailedLogin(identifier: string) {
  const redis = getRedis();
  const key = `sga:login:${identifier}`;

  if (redis) {
    const attempts = await redis.incr(key);
    await redis.expire(key, WINDOW_SECONDS);
    return attempts;
  }

  const now = Date.now();
  const current = memoryAttempts.get(key);

  if (!current || current.resetAt <= now) {
    memoryAttempts.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return 1;
  }

  current.count += 1;
  return current.count;
}

export async function clearLoginLimit(identifier: string) {
  const redis = getRedis();
  const key = `sga:login:${identifier}`;

  if (redis) {
    await redis.del(key);
    return;
  }

  memoryAttempts.delete(key);
}
