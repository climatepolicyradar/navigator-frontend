const LABELMAPPING: Record<string, string> = {
  concept: "Topic",
  entity_type: "Document type",
  geography: "Geography",
  agent: "Data provider",
  status: "Status",
  activity_status: "Activity status",
  category: "Category",
};

export function labelTypeLabel(type: string) {
  return LABELMAPPING[type] || type;
}
