import type { Metadata } from "next";
import { CommitteeDetailPage } from "@/components/CommitteeDetailPage";
import { committeeDetails } from "@/lib/committeeDetails";

export const metadata: Metadata = {
  title: "Executive Service Committee | AUP SGA",
  description:
    "Executive Service Committee details for The American University of Paris Student Government Association.",
};

export default function ExecutiveServiceCommitteePage() {
  return <CommitteeDetailPage committee={committeeDetails.executiveService} />;
}
