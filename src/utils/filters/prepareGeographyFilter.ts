import { TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";

const createGroupLabel = (value: string, children: TNestedSearchLabel[]): TNestedSearchLabel => ({
  id: `group::${value}`,
  type: "group",
  value,
  alternative_labels: [],
  children,
});

// Split regions and geographies from each other under separate top-level groups, keeping each
// country's region as a virtual parentPath so filtering still respects the relationship
export const prepareGeographyFilters = (rootLabels: TNestedSearchLabel[]): TNestedSearchLabel[] => {
  const validRootLabels = rootLabels.filter((rootLabel) => rootLabel.type === "region");

  const geographyLabels = validRootLabels.flatMap((regionLabel) =>
    regionLabel.children
      .filter((childLabel) => childLabel.type === "country")
      .map((countryLabel) => ({ ...countryLabel, parentPath: [getFilterPathLabel(regionLabel)] }))
  );
  const regionLabels = validRootLabels.map<TNestedSearchLabel>((regionLabel) => ({ ...regionLabel, children: [] }));

  return [createGroupLabel("region", regionLabels), createGroupLabel("geography", geographyLabels)];
};
