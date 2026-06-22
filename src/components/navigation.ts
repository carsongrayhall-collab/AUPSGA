export type DropdownItem = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href?: string;
  items?: DropdownItem[];
};

export const navItems: NavItem[] = [
  { label: "HOME", href: "/" },
  {
    label: "YOUR STUDENT GOVERNMENT",
    items: [
      { label: "THE EXECUTIVE TEAM", href: "/execs" },
      { label: "SENATORS", href: "/reps" },
      { label: "COMMITTEES", href: "/committees" },
      { label: "VOTING RECORDS", href: "/student-government/voting-records" },
      { label: "BOOK AN APPOINTMENT", href: "/student-government/book-an-appointment" },
    ],
  },
  {
    label: "TREASURY",
    items: [
      { label: "THE TREASURER", href: "/treasury/treasurer" },
      { label: "TREASURY RECORDS", href: "/treasury/records" },
      { label: "BUDGET APPROVALS HISTORY", href: "/treasury/budget-approvals-history" },
      { label: "HOW DO I GET MY MONEY?", href: "/treasury/how-do-i-get-my-money" },
      { label: "TREASURY TIMELINE", href: "/treasury/timeline" },
      { label: "BOOK AN APPOINTMENT", href: "/treasury/book-an-appointment" },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      { label: "OUR CONSTITUTION & BYLAWS", href: "/resources/constitution-bylaws" },
      { label: "AGENDAS & MINUTES", href: "/resources/agendas-minutes" },
      { label: "RESOLUTIONS", href: "/resources/resolutions" },
      { label: "VOTING RECORDS", href: "/resources/voting-records" },
      { label: "FORMS & TEMPLATES", href: "/resources/forms-templates" },
      { label: "CLUB INFORMATION", href: "/resources/club-information" },
      { label: "OMBUDSPERSON", href: "/resources/ombudsperson" },
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [
      { label: "CALENDAR", href: "/engagement/calendar" },
      { label: "INITIATIVES", href: "/engagement/initiatives" },
      { label: "MERCH SHOP", href: "/engagement/merch-shop" },
    ],
  },
  { label: "IT PANEL", href: "/it-panel" },
];
