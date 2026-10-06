import "server-only";

import { cache } from "react";
import { profileDefaults } from "@/lib/pageContent";
import { slugifyKey } from "@/lib/keys";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { get, put } from "@vercel/blob";
import { getBlobCommandOptions, type BlobCredentialOptions } from "@/lib/blobStorage";

export type MediaConfig = {
  alt: string;
  objectPosition?: string;
  src: string;
  updatedAt: string;
};

export type TimelineConfigEvent = {
  date: string;
  description?: string;
  displayOrder: number;
  id: string;
  published: boolean;
  time?: string;
  title: string;
};

export type WorkbookConfig = {
  allocationRange: string;
  lastSuccessfulSync?: string;
  recordsRange: string;
  sharePointUrl: string;
  uploadedFile?: {
    fileName: string;
    size: number;
    src: string;
    updatedAt: string;
  };
  worksheetName: string;
};

export type SiteConfig = {
  media: Record<string, MediaConfig>;
  homeLinks: Record<string, string>;
  homeContent: Record<string, { mainText: string; subtext: string }>;
  profiles: Record<string, { name: string; title: string }>;
  timeline: TimelineConfigEvent[];
  workbook: WorkbookConfig;
};

const CONFIG_KEY = "sga:site-config:v1";
const BLOB_CONFIG_PATH = "config/site-config.json";
const localConfigPath = path.join(process.cwd(), ".data", "site-config.json");

export const defaultConfig: SiteConfig = {
  media: {},
  homeLinks: {},
  homeContent: {},
  profiles: {},
  timeline: [
    {
      date: "September 10th, 2026",
      description:
        "Meet the Treasurer Night gives students a chance to ask funding questions, understand the budget process, and get direct guidance on how to request money from SGA.",
      displayOrder: 10,
      id: "fall-meet-the-treasurer",
      published: true,
      title: "Meet The Treasurer",
    },
    {
      date: "September 14th - 21st, 2026",
      description:
        "For two weeks, the Budget and Finance Committee meets every weekday from 17h - 19h so that budget requests get approved faster for the beginning of the semester.",
      displayOrder: 20,
      id: "fall-daily-bfc-meetings",
      published: true,
      time: "17h - 19h",
      title: "Daily BFC Meetings",
    },
    {
      date: "October 21st, 2026",
      description:
        "The Midterm Check-In gives students and club leaders a chance to review spending progress and submit receipts incurred up to this point.",
      displayOrder: 30,
      id: "fall-midterm-check-in",
      published: true,
      title: "Midterm Check-In",
    },
  ],
  workbook: {
    allocationRange: "Budget Allocation!A1:D20",
    recordsRange: "Treasury Records!A1:H100",
    sharePointUrl:
      "https://aupedu.sharepoint.com/:x:/s/sgaexecs_group/IQDvTYqhJiW5Rqd4ai-FcL-LARivEHBANxZzhlj1FMsTIeo?e=7bb2dc&CID=5b45c265-2655-118c-2acf-c477596197dd",
    worksheetName: "Treasury Records",
  },
};

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    url: process.env.UPSTASH_REDIS_REST_URL,
  });
}

function normalizeConfig(config: Partial<SiteConfig> | null | undefined): SiteConfig {
  const media = { ...(config?.media ?? {}) };
  for (const [id, profile] of Object.entries(profileDefaults)) {
    const legacyKey = slugifyKey(`${profile.name}, ${profile.title} ${id.startsWith("exec-") ? "profile" : "representative"} image slot`);
    if (!media[id] && media[legacyKey]) media[id] = media[legacyKey];
  }
  const homeMediaLabels: Record<string, string> = {
    "home-news-0": "We have so much money left over right now! thumbnail media slot",
    "home-news-1": "Something is happening in the Amex or something thumbnail media slot",
    "home-news-2": "Get your tickets now! image media slot",
    "home-news-3": "Get your tickets now! image media slot",
    "home-quick-0": "SGA Initiatives media slot",
    "home-quick-1": "Student Resources media slot",
    "home-quick-2": "Legislative Activities media slot",
  };
  for (const [key, label] of Object.entries(homeMediaLabels)) {
    if (!media[key] && media[slugifyKey(label)]) media[key] = media[slugifyKey(label)];
  }
  return {
    homeLinks: config?.homeLinks ?? {},
    homeContent: config?.homeContent ?? {},
    profiles: config?.profiles ?? {},
    media,
    timeline: config?.timeline ?? [...defaultConfig.timeline],
    workbook: {
      ...defaultConfig.workbook,
      ...(config?.workbook ?? {}),
    },
  };
}

async function readBlobConfig(options: BlobCredentialOptions) {
  const blob = await get(BLOB_CONFIG_PATH, {
    ...options,
    access: "private",
    useCache: false,
  });

  if (!blob || blob.statusCode !== 200) {
    return null;
  }

  return JSON.parse(await new Response(blob.stream).text()) as SiteConfig;
}

async function writeBlobConfig(options: BlobCredentialOptions, config: SiteConfig) {
  await put(BLOB_CONFIG_PATH, JSON.stringify(config, null, 2), {
    ...options,
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const redis = getRedis();

  if (redis) {
    return normalizeConfig(await redis.get<SiteConfig>(CONFIG_KEY));
  }

  const blobOptions = getBlobCommandOptions();

  if (blobOptions) {
    return normalizeConfig(await readBlobConfig(blobOptions));
  }

  try {
    return normalizeConfig(JSON.parse(await readFile(localConfigPath, "utf8")) as SiteConfig);
  } catch {
    return defaultConfig;
  }
});

export async function saveSiteConfig(config: SiteConfig) {
  const redis = getRedis();

  if (redis) {
    await redis.set(CONFIG_KEY, config);
    return;
  }

  const blobOptions = getBlobCommandOptions();

  if (blobOptions) {
    await writeBlobConfig(blobOptions, config);
    return;
  }

  if (process.env.VERCEL === "1") {
    throw new Error("Persistent Redis or Vercel Blob storage credentials are required in production.");
  }

  await mkdir(path.dirname(localConfigPath), { recursive: true });
  await writeFile(localConfigPath, JSON.stringify(config, null, 2));
}

export async function getMediaConfig(key: string) {
  const config = await getSiteConfig();
  return config.media[key] ?? null;
}

export async function setMediaConfig(key: string, media: MediaConfig) {
  const config = await getSiteConfig();
  config.media[key] = media;
  await saveSiteConfig(config);
}

export async function getPublishedTimelineEvents() {
  const config = await getSiteConfig();

  return config.timeline
    .filter((event) => event.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
