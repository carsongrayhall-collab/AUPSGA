import type { Metadata } from "next";
import { CommitteeDetailPage } from "@/components/CommitteeDetailPage";
import { committeeDetails } from "@/lib/committeeDetails";

export const metadata: Metadata = {
  title: "Communications and Outreach Committee | AUP SGA",
  description:
    "Communications and Outreach Committee details for The American University of Paris Student Government Association.",
};

export default function CommunicationsOutreachCommitteePage() {
  return <CommitteeDetailPage committee={committeeDetails.communicationsOutreach} />;
}
