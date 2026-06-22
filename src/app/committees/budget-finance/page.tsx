import type { Metadata } from "next";
import { CommitteeDetailPage } from "@/components/CommitteeDetailPage";
import { committeeDetails } from "@/lib/committeeDetails";

export const metadata: Metadata = {
  title: "Budget and Finance Committee | AUP SGA",
  description:
    "Budget and Finance Committee details for The American University of Paris Student Government Association.",
};

export default function BudgetFinanceCommitteePage() {
  return <CommitteeDetailPage committee={committeeDetails.budgetFinance} />;
}
