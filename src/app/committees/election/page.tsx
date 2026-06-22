import type { Metadata } from "next";
import { CommitteeDetailPage } from "@/components/CommitteeDetailPage";
import { committeeDetails } from "@/lib/committeeDetails";

export const metadata: Metadata = {
  title: "Election Committee | AUP SGA",
  description:
    "Election Committee details for The American University of Paris Student Government Association.",
};

export default function ElectionCommitteePage() {
  return <CommitteeDetailPage committee={committeeDetails.election} />;
}
