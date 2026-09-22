import { ID_SEPARATOR } from "@/constants/chars";
import { TFiltersGroupPrep, TNestedSearchLabel } from "@/types";
import { createGroupLabel } from "@/utils/filters/createGroupLabel";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";

// Split regions and geographies from each other under separate top-level groups, keeping each
// country's region as a virtual parentPath so filtering still respects the relationship
export const prepareGeographyFilters: TFiltersGroupPrep = (rootLabels) => {
  const validRootLabels = rootLabels.filter((rootLabel) => rootLabel.type === "region");

  const geographyLabels = validRootLabels.flatMap((regionLabel) =>
    regionLabel.children
      .filter((childLabel) => childLabel.type === "country")
      .map((countryLabel) => ({ ...countryLabel, parentPath: [getFilterPathLabel(regionLabel)] }))
  );
  const regionLabels = validRootLabels.map<TNestedSearchLabel>((regionLabel) => ({ ...regionLabel, children: [] }));

  return [
    createGroupLabel("region", regionLabels),
    createGroupLabel("geography", geographyLabels),
    {
      id: ["country", "XAB"].join(ID_SEPARATOR),
      type: "country",
      value: "International",
      alternative_labels: [],
      children: [],
    },
  ];
};
