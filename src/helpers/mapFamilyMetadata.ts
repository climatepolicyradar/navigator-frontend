import { metadataLabelMappings } from "@constants/familyMetadataMappings";
import { getSumUSD } from "@helpers/getSumUSD";
import { getSubCategoryName } from "@helpers/getCategoryName";

interface Metadata {
  [key: string]: string[];
}

type ResultItem = {
  label: string;
  iconLabel: string;
  value: string[] | string;
};

export const mapFamilyMetadata = (metadata: Metadata) => {
  const result: ResultItem[] = [];

  for (const [key, values] of Object.entries(metadata)) {
    const mapping = metadataLabelMappings[key];
    if (mapping) {
      if (key === "geographies") {
        result.push({
          label: mapping.label,
          iconLabel: mapping.iconLabel,
          value: values as string | string[],
        });
      } else if (key.includes("project_value") && values[0] !== "0") {
        result.push({ label: mapping.label, iconLabel: mapping.iconLabel, value: getSumUSD(values as string[]) });
      } else if (key === "organisation") {
        result.push({ label: mapping.label, iconLabel: mapping.iconLabel, value: getSubCategoryName(values) });
      } else {
        result.push({
          label: mapping.label,
          iconLabel: mapping.iconLabel,
          value: (values as string[]).slice(0, 3).join(", "),
        });
      }
    }
  }
  return result;
};
