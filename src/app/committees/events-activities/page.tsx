import type { Metadata } from "next";
import { CommitteeDetailPage } from "@/components/CommitteeDetailPage";
import { committeeDetails } from "@/lib/committeeDetails";

export const metadata: Metadata = {
  title: "Events and Activities Committee | AUP SGA",
  description:
    "Events and Activities Committee details for The American University of Paris Student Government Association.",
};

export default function EventsActivitiesCommitteePage() {
  return <CommitteeDetailPage committee={committeeDetails.eventsActivities} />;
}
