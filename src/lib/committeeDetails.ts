import type { CommitteeDetail, CommitteeScheduleItem } from "@/components/CommitteeDetailPage";

const committeeMeetingSchedule: CommitteeScheduleItem[] = [
  { day: "Monday:", time: "17:00 - 19:00" },
  { day: "Tuesday:" },
  { day: "Wednesday:" },
  { day: "Thursday:", time: "17:00 - 19:00" },
  { day: "Friday:", time: "17:00 - 18:00" },
];

export const committeeDetails = {
  communicationsOutreach: {
    title: "Communications and Outreach Committee (COC)",
    shortName: "COC",
    logoSrc: "/images/committee-coc.svg",
    logoAlt: "Communications and Outreach Committee logo",
    blurb:
      "The Communications and Outreach Committee manages SGA communications, outreach, branding, merchandise, and promotional efforts. It helps share Senate actions, SGA initiatives, events, and opportunities with the student body. The committee works to make SGA more transparent, accessible, and visible across campus.",
    chair: "Vacant",
    location: "C-103",
    memberRows: [
      ["CHAIR", "Stephanie Oghweh", "UCS COM DIRECT"],
      ["VACANT", "VACANT"],
    ],
    schedule: committeeMeetingSchedule,
    adjacent: [
      {
        href: "/committees/budget-finance",
        label: "Budget and Finance Committee",
        direction: "right",
      },
    ],
  },
  budgetFinance: {
    title: "Budget and Finance Committee (BFC)",
    shortName: "BFC",
    logoSrc: "/images/committee-bfc.svg",
    logoAlt: "Budget and Finance Committee logo",
    blurb:
      "The Budget and Finance Committee reviews funding requests from students, clubs, Senate initiatives, and SGA operations. It helps oversee how SGA funds are allocated, keeps financial records, and supports the Treasurer in preparing budgets. The committee also helps make sure students and clubs remain accountable for approved spending and reimbursement requirements.",
    chair: "Max Jordy",
    location: "C-103",
    memberRows: [["Lorelei Smucker", "Max Jordy", "VACANT", "VACANT"]],
    schedule: committeeMeetingSchedule,
    adjacent: [
      {
        href: "/committees/communications-outreach",
        label: "Communication and Outreach Committee",
        direction: "left",
      },
      {
        href: "/committees/events-activities",
        label: "Events and Activities Committee",
        direction: "right",
      },
    ],
  },
  eventsActivities: {
    title: "Events and Activities Committee (EAC)",
    shortName: "EAC",
    logoSrc: "/images/committee-eac.svg",
    logoAlt: "Events and Activities Committee logo",
    blurb:
      "The Events and Activities Committee plans and supports SGA social, cultural, academic, and community-building events. It helps coordinate event logistics, student engagement initiatives, and major SGA traditions. The committee works to create programming that brings students together and strengthens campus life.",
    chair: "Vacant",
    location: "C-103",
    memberRows: [
      ["CHAIR", "Sydney Livingston", "UCS Soc direct"],
      ["VACANT", "VACANT", "VACANT", "VACANT"],
      ["VACANT", "VACANT", "VACANT", "VACANT"],
    ],
  },
  executiveService: {
    title: "Executive Service Committee (ESC)",
    shortName: "ESC",
    logoSrc: "/images/committee-esc.svg",
    logoAlt: "Executive Service Committee logo",
    blurb:
      "The Executive Service Committee supports the Undergraduate and Graduate Presidents in carrying out their goals, initiatives, and service projects. The committee helps research, develop, and implement proposals that improve student life and expand SGA's service to the AUP community. It serves as a presidential support committee, not as the Executive Board itself.",
    chair: "VACANT",
    location: "C-103",
    memberRows: [
      ["Ben Kolendo", "Katherine Lu", "CHAIR"],
      ["VACANT U", "VACANT U", "VACANT U", "VACANT G"],
    ],
  },
  judiciary: {
    title: "Judiciary Committee (JC)",
    shortName: "JC",
    logoSrc: "/images/committee-jc.svg",
    logoAlt: "Judiciary Committee logo",
    blurb:
      "The Judiciary Committee interprets the SGA Constitution and Bylaws, reviews internal disputes, and helps ensure that SGA follows its governing documents. It hears formal complaints, reviews elections and appeals, and conducts judicial review when questions or concerns arise. The committee issues written decisions when formal rulings are needed.",
    chair: "VACANT",
    location: "C-103",
    memberRows: [
      ["Carson Hall", "GSC VP", "CHAIR"],
      ["VACANT", "VACANT", "VACANT", "VACANT"],
    ],
  },
  election: {
    title: "Election Committee (EC)",
    shortName: "EC",
    logoSrc: "/images/committee-ec.svg",
    logoAlt: "Election Committee logo",
    blurb:
      "The Election Committee oversees SGA elections and works to ensure that they are fair, transparent, impartial, and accessible. It manages election timelines, candidate registration, ballots, vote counting, campaign rules, and election results. The committee also reviews election concerns or alleged violations when they arise.",
    chair: "VACANT",
    location: "C-103",
    memberRows: [["Carson Hall", "VACANT GVP", "DEAN"]],
  },
} satisfies Record<string, CommitteeDetail>;
