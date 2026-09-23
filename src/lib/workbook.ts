import "server-only";

import { readPersistedWorkbookFile } from "@/lib/adminWorkbookFile";
import { getSiteConfig } from "@/lib/siteConfig";
import type { TreasuryAllocation, TreasuryRecordsSnapshot, TreasuryRequestRecord } from "@/lib/treasuryRecords";
import { readXlsxRange } from "@/lib/xlsxReader";

export type WorkbookConnectionResult = {
  message: string;
  ok: boolean;
  reason?: "auth" | "config" | "file" | "parse" | "range" | "worksheet";
};

class WorkbookIntegrationError extends Error {
  constructor(
    message: string,
    readonly reason: NonNullable<WorkbookConnectionResult["reason"]>,
  ) {
    super(message);
  }
}

type GraphDriveItem = {
  id?: string;
  name?: string;
  parentReference?: { driveId?: string };
};

type GraphRange = {
  values?: unknown[][];
};

const graphBaseUrl = "https://graph.microsoft.com/v1.0";

function requiredEnvironment(names: string[]) {
  return names.filter((name) => !process.env[name]);
}

function encodeShareUrl(value: string) {
  return `u!${Buffer.from(value).toString("base64url")}`;
}

function parseRangeReference(value: string, fallbackSheet: string) {
  const separator = value.lastIndexOf("!");

  if (separator < 0) {
    return { address: value.trim(), sheet: fallbackSheet.trim() };
  }

  return {
    address: value.slice(separator + 1).trim(),
    sheet: value.slice(0, separator).replace(/^'|'$/g, "").trim() || fallbackSheet.trim(),
  };
}

function formatPotentialExcelDate(value: unknown) {
  if (typeof value !== "number" || value < 30000 || value > 60000) {
    return String(value ?? "").trim();
  }

  const date = new Date(Date.UTC(1899, 11, 30 + value));
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findColumn(headers: string[], aliases: string[], label: string) {
  const index = headers.findIndex((header) => aliases.includes(header));

  if (index < 0) {
    throw new WorkbookIntegrationError(`The workbook is missing a ${label} column.`, "parse");
  }

  return index;
}

function parseAmount(value: unknown, label: string, rowNumber: number) {
  const numeric = typeof value === "number" ? value : Number(String(value ?? "").replace(/[€,\s]/g, ""));

  if (!Number.isFinite(numeric)) {
    throw new WorkbookIntegrationError(`Row ${rowNumber} has a nonnumeric ${label} value.`, "parse");
  }

  return numeric;
}

function parseRows(values: unknown[][] | undefined, label: string) {
  if (!values || values.length < 2) {
    throw new WorkbookIntegrationError(`The ${label} range is empty or has no data rows.`, "range");
  }

  const headers = values[0].map(normalizeHeader);
  return { headers, rows: values.slice(1).filter((row) => row.some((value) => String(value ?? "").trim() !== "")) };
}

function parseAllocations(values: unknown[][] | undefined): TreasuryAllocation[] {
  const { headers, rows } = parseRows(values, "budget allocation");
  const categoryIndex = findColumn(headers, ["category", "budgetcategory", "allocationcategory"], "category");
  const allocatedIndex = findColumn(headers, ["allocated", "allocation", "budget", "budgetallocated"], "allocated");
  const spentIndex = findColumn(headers, ["spent", "spending", "amountspent"], "spent");
  const descriptionIndex = headers.findIndex((header) => ["description", "purpose", "notes"].includes(header));

  return rows.map((row, index) => {
    const category = String(row[categoryIndex] ?? "").trim();

    if (!category) {
      throw new WorkbookIntegrationError(`Row ${index + 2} has no allocation category.`, "parse");
    }

    return {
      allocated: parseAmount(row[allocatedIndex], "allocated", index + 2),
      category,
      description: String(descriptionIndex < 0 ? "" : row[descriptionIndex] ?? "").trim(),
      spent: parseAmount(row[spentIndex], "spent", index + 2),
    };
  });
}

function parseRequests(values: unknown[][] | undefined): TreasuryRequestRecord[] {
  const { headers, rows } = parseRows(values, "Treasury records");
  const idIndex = findColumn(headers, ["id", "record", "recordid", "requestid"], "record ID");
  const organizationIndex = findColumn(headers, ["organization", "organisation", "club", "requestingorganization"], "organization");
  const categoryIndex = findColumn(headers, ["category", "budgetcategory"], "category");
  const requestIndex = findColumn(headers, ["request", "description", "purpose"], "request");
  const requestedIndex = findColumn(headers, ["requested", "amountrequested", "requestamount"], "requested");
  const approvedIndex = findColumn(headers, ["approved", "amountapproved", "approvalamount"], "approved");
  const statusIndex = findColumn(headers, ["status", "decision", "requeststatus"], "status");
  const decisionDateIndex = findColumn(headers, ["decisiondate", "date", "processeddate"], "decision date");
  const seenIds = new Set<string>();

  return rows.map((row, index) => {
    const id = String(row[idIndex] ?? "").trim();
    const status = String(row[statusIndex] ?? "Pending").trim();

    if (!id || seenIds.has(id)) {
      throw new WorkbookIntegrationError(`Row ${index + 2} has a missing or duplicated record ID.`, "parse");
    }

    if (!["Approved", "Pending", "Reimbursed"].includes(status)) {
      throw new WorkbookIntegrationError(`Row ${index + 2} has an unsupported request status.`, "parse");
    }

    seenIds.add(id);

    return {
      approved: parseAmount(row[approvedIndex], "approved", index + 2),
      category: String(row[categoryIndex] ?? "").trim(),
      decisionDate: formatPotentialExcelDate(row[decisionDateIndex]),
      id,
      organization: String(row[organizationIndex] ?? "").trim(),
      request: String(row[requestIndex] ?? "").trim(),
      requested: parseAmount(row[requestedIndex], "requested", index + 2),
      status: status as TreasuryRequestRecord["status"],
    };
  });
}

async function fetchTreasuryRecordsFromUploadedWorkbook(): Promise<TreasuryRecordsSnapshot | null> {
  const config = await getSiteConfig();

  if (!config.workbook.uploadedFile?.src) {
    return null;
  }

  const buffer = await readPersistedWorkbookFile(config.workbook.uploadedFile.src);
  const allocationReference = parseRangeReference(config.workbook.allocationRange, config.workbook.worksheetName);
  const recordsReference = parseRangeReference(config.workbook.recordsRange, config.workbook.worksheetName);
  const [allocationRange, recordsRange] = [
    readXlsxRange(buffer, allocationReference.sheet, allocationReference.address),
    readXlsxRange(buffer, recordsReference.sheet, recordsReference.address),
  ];

  return {
    allocations: parseAllocations(allocationRange),
    fiscalYear: new Date().getFullYear().toString(),
    lastUpdated: config.workbook.uploadedFile.updatedAt,
    requests: parseRequests(recordsRange),
    source: "live",
  };
}

async function getGraphToken() {
  const missing = requiredEnvironment(["MICROSOFT_TENANT_ID", "MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET"]);

  if (missing.length > 0) {
    throw new WorkbookIntegrationError(`Missing Microsoft Graph environment variables: ${missing.join(", ")}.`, "auth");
  }

  const body = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });
  const response = await fetch(`https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`, {
    body,
    cache: "no-store",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  });

  if (!response.ok) {
    throw new WorkbookIntegrationError("Microsoft Graph rejected the application credentials.", "auth");
  }

  const result = (await response.json()) as { access_token?: string };

  if (!result.access_token) {
    throw new WorkbookIntegrationError("Microsoft Graph returned no access token.", "auth");
  }

  return result.access_token;
}

async function graphRequest<T>(url: string, token: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new WorkbookIntegrationError("Microsoft Graph denied access to the workbook.", "auth");
    }

    if (response.status === 404) {
      throw new WorkbookIntegrationError("The configured SharePoint workbook could not be found.", "file");
    }

    throw new WorkbookIntegrationError(`Microsoft Graph returned HTTP ${response.status}.`, "file");
  }

  return (await response.json()) as T;
}

async function resolveWorkbook(configUrl: string, token: string) {
  const configuredDriveId = process.env.MICROSOFT_DRIVE_ID;
  const configuredItemId = process.env.MICROSOFT_DRIVE_ITEM_ID;

  if (configuredDriveId && configuredItemId) {
    return { driveId: configuredDriveId, itemId: configuredItemId };
  }

  const item = await graphRequest<GraphDriveItem>(`${graphBaseUrl}/shares/${encodeShareUrl(configUrl)}/driveItem?$select=id,parentReference,name`, token);

  if (!item.id || !(item.parentReference?.driveId || configuredDriveId)) {
    throw new WorkbookIntegrationError("The SharePoint link did not resolve to a workbook drive item.", "file");
  }

  return { driveId: item.parentReference?.driveId || configuredDriveId!, itemId: item.id };
}

async function readRange(driveId: string, itemId: string, sheet: string, address: string, token: string) {
  if (!sheet || !address) {
    throw new WorkbookIntegrationError("Each workbook range must include a worksheet and cell address.", "range");
  }

  const url = `${graphBaseUrl}/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/workbook/worksheets/${encodeURIComponent(sheet)}/range(address='${encodeURIComponent(address)}')`;
  return graphRequest<GraphRange>(url, token);
}

export async function fetchTreasuryRecordsFromWorkbook(): Promise<TreasuryRecordsSnapshot> {
  const config = await getSiteConfig();
  const uploadedSnapshot = await fetchTreasuryRecordsFromUploadedWorkbook();

  if (uploadedSnapshot) {
    return uploadedSnapshot;
  }

  const missing = requiredEnvironment([
    "MICROSOFT_TENANT_ID",
    "MICROSOFT_CLIENT_ID",
    "MICROSOFT_CLIENT_SECRET",
    "MICROSOFT_SITE_ID",
  ]);

  if (!config.workbook.sharePointUrl) {
    throw new WorkbookIntegrationError("Add a SharePoint workbook URL before syncing Treasury records.", "config");
  }

  if (missing.length > 0) {
    throw new WorkbookIntegrationError(`Missing Microsoft Graph environment variables: ${missing.join(", ")}.`, "auth");
  }

  const token = await getGraphToken();
  const workbook = await resolveWorkbook(config.workbook.sharePointUrl, token);
  const allocationReference = parseRangeReference(config.workbook.allocationRange, config.workbook.worksheetName);
  const recordsReference = parseRangeReference(config.workbook.recordsRange, config.workbook.worksheetName);
  const [allocationRange, recordsRange] = await Promise.all([
    readRange(workbook.driveId, workbook.itemId, allocationReference.sheet, allocationReference.address, token),
    readRange(workbook.driveId, workbook.itemId, recordsReference.sheet, recordsReference.address, token),
  ]);

  return {
    allocations: parseAllocations(allocationRange.values),
    fiscalYear: new Date().getFullYear().toString(),
    lastUpdated: new Date().toISOString(),
    requests: parseRequests(recordsRange.values),
    source: "live",
  };
}

export async function testWorkbookConnection(): Promise<WorkbookConnectionResult> {
  try {
    const snapshot = await fetchTreasuryRecordsFromWorkbook();

    return {
      message: `Workbook source succeeded. Parsed ${snapshot.allocations.length} budget categories and ${snapshot.requests.length} Treasury records.`,
      ok: true,
    };
  } catch (error) {
    if (error instanceof WorkbookIntegrationError) {
      return { message: error.message, ok: false, reason: error.reason };
    }

    return {
      message: "The workbook connection failed unexpectedly. Check the server logs for details.",
      ok: false,
      reason: "file",
    };
  }
}
