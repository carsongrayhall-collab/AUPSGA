import "server-only";

import { inflateRawSync } from "node:zlib";

type ZipEntry = {
  data: Buffer;
  name: string;
};

type SheetCell = {
  column: number;
  row: number;
  value: unknown;
};

const textDecoder = new TextDecoder("utf-8");

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function getAttribute(value: string, name: string) {
  const match = value.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? decodeXml(match[1]) : "";
}

function findEndOfCentralDirectory(buffer: Buffer) {
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }

  throw new Error("The workbook file is not a valid .xlsx archive.");
}

function readZipEntries(buffer: Buffer) {
  const entries = new Map<string, ZipEntry>();
  const endOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(endOffset + 10);
  let centralOffset = buffer.readUInt32LE(endOffset + 16);

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(centralOffset) !== 0x02014b50) {
      throw new Error("The workbook archive central directory is invalid.");
    }

    const method = buffer.readUInt16LE(centralOffset + 10);
    const compressedSize = buffer.readUInt32LE(centralOffset + 20);
    const filenameLength = buffer.readUInt16LE(centralOffset + 28);
    const extraLength = buffer.readUInt16LE(centralOffset + 30);
    const commentLength = buffer.readUInt16LE(centralOffset + 32);
    const localOffset = buffer.readUInt32LE(centralOffset + 42);
    const name = buffer.toString("utf8", centralOffset + 46, centralOffset + 46 + filenameLength);

    if (!name.endsWith("/")) {
      if (buffer.readUInt32LE(localOffset) !== 0x04034b50) {
        throw new Error(`The workbook archive entry ${name} is invalid.`);
      }

      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
      const data = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed) : null;

      if (!data) {
        throw new Error(`The workbook archive entry ${name} uses an unsupported compression method.`);
      }

      entries.set(name, { data, name });
    }

    centralOffset += 46 + filenameLength + extraLength + commentLength;
  }

  return entries;
}

function readXml(entries: Map<string, ZipEntry>, name: string) {
  const entry = entries.get(name);

  if (!entry) {
    throw new Error(`The workbook is missing ${name}.`);
  }

  return textDecoder.decode(entry.data);
}

function columnNameToNumber(value: string) {
  return value
    .toUpperCase()
    .split("")
    .reduce((total, character) => total * 26 + character.charCodeAt(0) - 64, 0);
}

function parseCellReference(reference: string) {
  const match = reference.match(/^([A-Z]+)(\d+)$/i);

  if (!match) {
    return null;
  }

  return {
    column: columnNameToNumber(match[1]),
    row: Number(match[2]),
  };
}

function parseRange(value: string) {
  const [startValue, endValue = startValue] = value.replace(/\$/g, "").split(":");
  const start = parseCellReference(startValue);
  const end = parseCellReference(endValue);

  if (!start || !end) {
    throw new Error(`The workbook range ${value} is not valid.`);
  }

  return {
    endColumn: Math.max(start.column, end.column),
    endRow: Math.max(start.row, end.row),
    startColumn: Math.min(start.column, end.column),
    startRow: Math.min(start.row, end.row),
  };
}

function resolveTargetPath(target: string) {
  const normalized = target.replace(/^\/+/, "");
  return normalized.startsWith("xl/") ? normalized : `xl/${normalized}`;
}

function parseSharedStrings(xml: string) {
  return Array.from(xml.matchAll(/<si\b[\s\S]*?<\/si>/g)).map(([item]) =>
    Array.from(item.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g))
      .map((match) => decodeXml(match[1]))
      .join(""),
  );
}

function parseCellValue(cellXml: string, type: string, sharedStrings: string[]) {
  if (type === "inlineStr") {
    return decodeXml(cellXml.match(/<t\b[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "");
  }

  const raw = cellXml.match(/<v\b[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? "";

  if (!raw) {
    return "";
  }

  if (type === "s") {
    return sharedStrings[Number(raw)] ?? "";
  }

  if (type === "b") {
    return raw === "1";
  }

  if (type === "str") {
    return decodeXml(raw);
  }

  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : decodeXml(raw);
}

function parseWorksheetCells(xml: string, sharedStrings: string[]) {
  const cells: SheetCell[] = [];

  for (const [, attributes, cellXml] of xml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
    const reference = getAttribute(attributes, "r");
    const parsedReference = parseCellReference(reference);

    if (!parsedReference) {
      continue;
    }

    cells.push({
      ...parsedReference,
      value: parseCellValue(cellXml, getAttribute(attributes, "t"), sharedStrings),
    });
  }

  return cells;
}

function getSheetPath(entries: Map<string, ZipEntry>, sheetName: string) {
  const workbookXml = readXml(entries, "xl/workbook.xml");
  const relsXml = readXml(entries, "xl/_rels/workbook.xml.rels");
  const relTargets = new Map<string, string>();

  for (const [, attributes] of relsXml.matchAll(/<Relationship\b([^>]*)\/>/g)) {
    relTargets.set(getAttribute(attributes, "Id"), getAttribute(attributes, "Target"));
  }

  for (const [, attributes] of workbookXml.matchAll(/<sheet\b([^>]*)\/>/g)) {
    if (getAttribute(attributes, "name") !== sheetName) {
      continue;
    }

    const target = relTargets.get(getAttribute(attributes, "r:id"));

    if (!target) {
      break;
    }

    return resolveTargetPath(target);
  }

  throw new Error(`The uploaded workbook does not include a worksheet named "${sheetName}".`);
}

export function readXlsxRange(buffer: Buffer, sheetName: string, rangeAddress: string) {
  const entries = readZipEntries(buffer);
  const sharedStrings = entries.has("xl/sharedStrings.xml") ? parseSharedStrings(readXml(entries, "xl/sharedStrings.xml")) : [];
  const sheetPath = getSheetPath(entries, sheetName);
  const cells = parseWorksheetCells(readXml(entries, sheetPath), sharedStrings);
  const range = parseRange(rangeAddress);
  const grid = Array.from({ length: range.endRow - range.startRow + 1 }, () =>
    Array.from<unknown>({ length: range.endColumn - range.startColumn + 1 }).fill(""),
  );

  for (const cell of cells) {
    if (cell.row < range.startRow || cell.row > range.endRow || cell.column < range.startColumn || cell.column > range.endColumn) {
      continue;
    }

    grid[cell.row - range.startRow][cell.column - range.startColumn] = cell.value;
  }

  return grid;
}
