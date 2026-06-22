import type { Metadata } from "next";
import { CommitteeDetailPage } from "@/components/CommitteeDetailPage";
import { committeeDetails } from "@/lib/committeeDetails";

export const metadata: Metadata = {
  title: "Judiciary Committee | AUP SGA",
  description:
    "Judiciary Committee details for The American University of Paris Student Government Association.",
};

export default function JudiciaryCommitteePage() {
  return <CommitteeDetailPage committee={committeeDetails.judiciary} />;
}
