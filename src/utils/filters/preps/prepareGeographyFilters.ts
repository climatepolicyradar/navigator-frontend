import { ID_SEPARATOR } from "@/constants/chars";
import { SUBNATIONAL_LABEL_TYPE } from "@/constants/labels";
import { TFiltersGroupPrep, TNestedSearchLabel } from "@/types";
import { createGroupLabel, createLabel } from "@/utils/filters/createGroupLabel";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";

const SUBNATIONAL_LABELS: TNestedSearchLabel[] = ["Country", "Subdivision"].map((value) => createLabel(SUBNATIONAL_LABEL_TYPE, value));

// Split regions and geographies from each other under separate top-level groups, keeping each
// country's region as a virtual parentPath so filtering still respects the relationship
export const prepareGeographyFilters =
  (showSubnationalTypes: boolean): TFiltersGroupPrep =>
  (rootLabels) => {
    const validRootLabels = rootLabels.filter((rootLabel) => rootLabel.type === "region");

    const geographyLabels = validRootLabels.flatMap((regionLabel) =>
      regionLabel.children
        .filter((childLabel) => childLabel.type === "country")
        .map((countryLabel) => ({ ...countryLabel, parentPath: [getFilterPathLabel(regionLabel)] }))
    );
    const regionLabels = validRootLabels.map<TNestedSearchLabel>((regionLabel) => ({ ...regionLabel, children: [] }));

    return [
      ...(showSubnationalTypes ? [createGroupLabel("type", SUBNATIONAL_LABELS)] : []),
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
