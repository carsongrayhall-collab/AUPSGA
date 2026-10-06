export type RepGroup = {
  title: string;
  description?: string;
  contact: string;
  members: string[];
};

export const departmentGroups: RepGroup[] = [
  {
    title: "Communications, Media, and Culture Representatives",
    description:
      "Represent students within the Communications, Media, and Culture department by bringing their concerns, ideas, and academic interests to SGA.",
    contact: "sga_cmc@aup.edu",
    members: ["VACANT", "VACANT"],
  },
  {
    title: "Art History and Fine Arts Representative",
    description:
      "Represents students in Art History and Fine Arts by advocating for their academic needs, creative perspectives, and department-specific concerns within the Senate.",
    contact: "sga_art@aup.edu",
    members: ["Ava Crespo"],
  },
  {
    title: "Computer Science, Mathematics, and Environmental Science Representatives",
    description:
      "Represent students across analytical, technical, and scientific fields by bringing department-specific needs, ideas, and academic concerns to the Senate.",
    contact: "sga_csmes@aup.edu",
    members: ["Max Jordy", "Madison Shearer"],
  },
  {
    title: "Economics and Management Representative",
    description:
      "Represent students in business, economics, and management fields by advocating for their academic interests, professional development needs, and department-specific concerns within the Senate.",
    contact: "sga_eandm@aup.edu",
    members: ["Rita Okwor", "Carson Hall", "Antonella Henkens"],
  },
  {
    title: "History and Politics Representatives",
    description:
      "Represent students in History, Law, and Politics by advocating for their academic interests, civic perspectives, and department-specific concerns within the Senate.",
    contact: "sga_hp@aup.edu",
    members: ["Belen Bolhuis", "Peter Dean Orola-Andrada", "Claire Strickland"],
  },
  {
    title: "Psychology, Health, and Gender Representative",
    description:
      "Represents students in Psychology, Health, and Gender Studies by bringing department-specific concerns, academic needs, and student perspectives to the Senate.",
    contact: "sga_phg@aup.edu",
    members: ["VACANT"],
  },
];

export const classGroups: RepGroup[] = [
  {
    title: "Freshmen Representatives",
    contact: "sga_firstyear@aup.edu",
    members: ["VACANT", "VACANT"],
  },
  {
    title: "Sophomore Representatives",
    contact: "sga_sophomore@aup.edu",
    members: ["VACANT", "VACANT", "VACANT"],
  },
  {
    title: "Junior Representatives",
    contact: "sga_junior@aup.edu",
    members: ["VACANT", "VACANT", "VACANT", "VACANT"],
  },
  {
    title: "Senior Representatives",
    contact: "sga_senior@aup.edu",
    members: ["VACANT", "VACANT"],
  },
  {
    title: "Graduate Representatives",
    contact: "sga_graduate@aup.edu",
    members: ["VACANT", "VACANT"],
  },
];

export type ExecutiveProfile = {
  name: string;
  role: string;
  description: string;
  email: string;
};

export const undergraduateProfiles: ExecutiveProfile[] = [
  {
    name: "Ben Kolendo",
    role: "Undergraduate President",
    description:
      "Represents undergraduate students, leads advocacy efforts, and helps coordinate SGA priorities on behalf of the student body.",
    email: "undergrad-president@aup.edu",
  },
  {
    name: "Vacant",
    role: "Undergraduate Vice President",
    description:
      "Supports the Undergraduate President, helps coordinate student advocacy initiatives, and and represents undergraduate student interests.",
    email: "undergrad-vp@aup.edu",
  },
  {
    name: "Lorelei Smucker",
    role: "Joint Treasurer",
    description:
      "Oversees SGA finances, reviews budget requests, guides funding decisions, and ensures student initiatives are supported through responsible financial planning.",
    email: "treasurer-sga@aup.edu",
  },
  {
    name: "VACANT",
    role: "Undergraduate Social Director",
    description:
      "Plans and supports events that build undergraduate community, encourage student connection, and strengthen campus life.",
    email: "undergrad-social@aup.edu",
  },
  {
    name: "VACANT",
    role: "Undergraduate Communication Director",
    description:
      "Manages SGA messaging, shares updates with undergraduate students, and helps ensure student voices, events, and initiatives are clearly communicated.",
    email: "undergrad-comms@aup.edu",
  },
];

export const graduateProfiles: ExecutiveProfile[] = [
  {
    name: "Katherine Lu",
    role: "Graduate President",
    description:
      "Represents graduate students, leads graduate advocacy efforts, and helps coordinate SGA priorities that support the graduate student experience.",
    email: "grad-president@aup.edu",
  },
  {
    name: "VACANT",
    role: "Graduate Vice President",
    description:
      "Supports the Graduate President, helps advance graduate student initiatives, and represents graduate student interests across SGA activities.",
    email: "grad-vp@aup.edu",
  },
  {
    name: "Sydney Livingston",
    role: "Graduate Social Director",
    description:
      "Plans and supports events that build graduate community, encourage connection, and strengthen graduate student life at AUP.",
    email: "grad-social@aup.edu",
  },
  {
    name: "Stephanie Oghweh",
    role: "Graduate Communication Director",
    description:
      "Manages SGA messaging for graduate students, shares updates, and helps keep graduate voices, events, and initiatives clearly communicated.",
    email: "grad-comms@aup.edu",
  },
];


export const homeLinks = {
  "news-0": { label: "News: funding", href: "/treasury/budget-approvals-history" },
  "news-1": { label: "News: campus update", href: "/engagement/calendar" },
  "news-2": { label: "News: tickets (first)", href: "/engagement/calendar" },
  "news-3": { label: "News: tickets (second)", href: "/engagement/calendar" },
  featured: { label: "Featured news", href: "/engagement/calendar" },
  "initiative-0": { label: "Featured initiative", href: "/engagement/initiatives" },
  "initiative-1": { label: "Student Life initiative", href: "/engagement/initiatives" },
  "initiative-2": { label: "Campus Support initiative", href: "/engagement/initiatives" },
  "quick-0": { label: "SGA Initiatives", href: "/engagement/initiatives" },
  "quick-1": { label: "Student Resources", href: "/resources" },
  "quick-2": { label: "Legislative Activities", href: "/resources/resolutions" },
  feedback: { label: "Submit Feedback", href: "/engagement/feedback" },
  calendar: { label: "View Calendar", href: "/engagement/calendar" },
  representatives: { label: "SGA Representatives", href: "/reps" },
  shop: { label: "Shop Now", href: "/engagement/merch-shop" },
};

export const senatorGroups = [...departmentGroups, ...classGroups];
export const profileDefaults = Object.fromEntries([
  ...[...undergraduateProfiles, ...graduateProfiles].map((profile, index) =>
    [`exec-${index}`, { name: profile.name, title: profile.role }]),
  ...senatorGroups.flatMap((group, groupIndex) => group.members.map((name, index) =>
    [`senator-${groupIndex}-${index}`, { name, title: group.title }])),
  ["senator-additional", { name: "VACANT", title: "Senator" }],
]) as Record<string, { name: string; title: string }>;
