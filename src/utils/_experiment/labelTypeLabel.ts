const LABELMAPPING: Record<string, string> = {
  category: "Category",
  concept: "Topic",
  entity_type: "Document type",
  geography: "Geography",
  agent: "Data provider",
  status: "Status",
  activity_status: "Activity status",
  topic: "Response area",
};

export function labelTypeLabel(type: string) {
  return LABELMAPPING[type] || type;
}
