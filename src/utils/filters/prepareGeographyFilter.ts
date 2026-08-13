import { TNestedSearchLabel } from "@/types";

const createGroupLabel = (value: string, children: TNestedSearchLabel[]): TNestedSearchLabel => ({
  id: `group::${value}`,
  type: "group",
  value,
  alternative_labels: [],
  children,
});

// Split regions and geographies from each other under separate top-level groups
export const prepareGeographyFilters = (rootLabels: TNestedSearchLabel[]): TNestedSearchLabel[] => {
  const validRootLabels = rootLabels.filter((rootLabel) => rootLabel.type === "region");

  const geographyLabels = validRootLabels.flatMap((regionLabel) => regionLabel.children).filter((childLabel) => childLabel.type === "country");
  const regionLabels = validRootLabels.map<TNestedSearchLabel>((regionLabel) => ({ ...regionLabel, children: [] }));

  return [createGroupLabel("region", regionLabels), createGroupLabel("geography", geographyLabels)];
};
