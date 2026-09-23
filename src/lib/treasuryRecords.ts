export type TreasuryAllocation = {
  category: string;
  allocated: number;
  spent: number;
  description: string;
};

export type TreasuryRequestRecord = {
  id: string;
  organization: string;
  category: string;
  request: string;
  requested: number;
  approved: number;
  status: "Approved" | "Pending" | "Reimbursed";
  decisionDate: string;
};

export type TreasuryRecordsSnapshot = {
  fiscalYear: string;
  lastUpdated: string;
  allocations: TreasuryAllocation[];
  requests: TreasuryRequestRecord[];
  source?: "fixture" | "live";
};

const treasuryRecordsFixture: TreasuryRecordsSnapshot = {
  fiscalYear: "2026-2027",
  lastUpdated: "Fixture fallback while the workbook is unavailable",
  allocations: [
    {
      category: "Student Organizations",
      allocated: 9800,
      spent: 3200,
      description: "Club events, competitions, travel, supplies, and organization-led activities.",
    },
    {
      category: "Events & Social",
      allocated: 7600,
      spent: 2900,
      description: "Campus-wide programming and student life events open to the AUP community.",
    },
    {
      category: "Student Projects",
      allocated: 5200,
      spent: 1650,
      description: "Independent student initiatives, research, advocacy, and service projects.",
    },
    {
      category: "Grad Gala",
      allocated: 4100,
      spent: 1200,
      description: "Senior and graduate representative programming connected to Grad Gala.",
    },
    {
      category: "Merchandise",
      allocated: 3600,
      spent: 900,
      description: "AUP and SGA merchandise coordinated through Communications and Outreach.",
    },
    {
      category: "Senate",
      allocated: 2400,
      spent: 680,
      description: "Operational needs for Senate initiatives, representation, and student support.",
    },
    {
      category: "Executive",
      allocated: 1900,
      spent: 450,
      description: "Executive Board operating needs aligned with SGA bylaws and priorities.",
    },
  ],
  requests: [
    {
      id: "BFC-2026-001",
      organization: "Finance Case & Competition Association",
      category: "Student Organizations",
      request: "Competition registration and travel support",
      requested: 1450,
      approved: 1200,
      status: "Approved",
      decisionDate: "September 18, 2026",
    },
    {
      id: "BFC-2026-002",
      organization: "Events and Activities Committee",
      category: "Events & Social",
      request: "Welcome week campus social",
      requested: 2100,
      approved: 1950,
      status: "Reimbursed",
      decisionDate: "September 23, 2026",
    },
    {
      id: "BFC-2026-003",
      organization: "Student Research Initiative",
      category: "Student Projects",
      request: "Conference materials and local transit",
      requested: 780,
      approved: 650,
      status: "Approved",
      decisionDate: "October 2, 2026",
    },
    {
      id: "BFC-2026-004",
      organization: "Communications and Outreach Committee",
      category: "Merchandise",
      request: "Merchandise sample order",
      requested: 960,
      approved: 850,
      status: "Pending",
      decisionDate: "October 9, 2026",
    },
  ],
  source: "fixture",
};

export async function getTreasuryRecordsSnapshotFromWorkbook(): Promise<TreasuryRecordsSnapshot> {
  const { fetchTreasuryRecordsFromWorkbook } = await import("@/lib/workbook");

  try {
    return await fetchTreasuryRecordsFromWorkbook();
  } catch {
    return treasuryRecordsFixture;
  }
}

export function getTreasuryRecordsSnapshot(): TreasuryRecordsSnapshot {
  return treasuryRecordsFixture;
}

export function getSortedAllocations(snapshot: TreasuryRecordsSnapshot) {
  return [...snapshot.allocations].sort((a, b) => b.allocated - a.allocated);
}

export function formatEuro(amount: number) {
  return `EUR ${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}
