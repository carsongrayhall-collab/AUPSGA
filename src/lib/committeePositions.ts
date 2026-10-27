import { committeeDetails } from "@/lib/committeeDetails";
import { slugifyKey } from "@/lib/keys";

export type CommitteePosition = { id: string; name: string };
export const MAX_COMMITTEE_POSITIONS = 40;

export function findCommittee(id: string) {
  return Object.values(committeeDetails).find(committee => committee.shortName.toLowerCase() === id);
}

export function defaultPositions(memberRows: string[][]): CommitteePosition[] {
  return memberRows.flat().map((name, index) => ({ id: `position-${index}`, name }));
}

export function positionMediaKey(committeeId: string, positionId: string) {
  return `committee-${committeeId}-${positionId}`;
}

export function legacyPositionMediaKey(name: string) {
  return slugifyKey(`${name} committee member image slot`);
}

export function parsePositions(value: unknown): CommitteePosition[] {
  if (!Array.isArray(value) || value.length > MAX_COMMITTEE_POSITIONS) {
    throw new Error(`Use between 0 and ${MAX_COMMITTEE_POSITIONS} positions.`);
  }
  const ids = new Set<string>();
  return value.map(position => {
    if (!position || typeof position !== "object" || typeof position.id !== "string" ||
        !/^(position-\d+|[a-f0-9-]{36})$/.test(position.id) || ids.has(position.id) ||
        typeof position.name !== "string" || !position.name.trim() || position.name.trim().length > 120) {
      throw new Error("Each position needs a unique ID and a name of 1–120 characters.");
    }
    ids.add(position.id);
    return { id: position.id, name: position.name.trim() };
  });
}
