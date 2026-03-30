const RELATIONSHIPMAPPING: Record<string, string> = {
  member_of: "Part of",
  has_member: "Related",
  is_version_of: "Version",
};

export function documentRelationshipLabel(type: string) {
  return RELATIONSHIPMAPPING[type] || type;
}
