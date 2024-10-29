export const getApprovedYearFromEvents = (events) => {
  const approvalEvent = events.find((event) => event.event_type === "Project Approved");

  if (approvalEvent) {
    const date = new Date(approvalEvent.date);
    return String(date.getFullYear());
  }

  return null;
};
