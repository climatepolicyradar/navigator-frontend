import { TFamilyEventPublic } from "@/types";

export const getApprovedYearFromEvents = (events: TFamilyEventPublic[]) => {
  const approvalEvent = events.find((event) => ["Project Approved", "Published"].includes(event.event_type));

  if (approvalEvent) {
    const date = new Date(approvalEvent.date);
    return String(date.getUTCFullYear());
  }

  return null;
};
