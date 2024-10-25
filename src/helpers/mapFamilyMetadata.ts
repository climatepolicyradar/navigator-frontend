import { metadataLabelMappings } from "@constants/familyMetadataMappings";
import { getSubCategoryName } from "@helpers/getCategoryName";
import { getSumUSD } from "@helpers/getSumUSD";
import { TCorpusTypeSubCategory } from "@types";

interface Metadata {
  [key: string]: string[] | TCorpusTypeSubCategory | string;
}

type ResultItem = {
  label: string;
  iconLabel: string;
  value: string[] | string;
};

const maxValuesToDisplay = 3;

export const mapFamilyMetadata = (metadata: Metadata) => {
  const result: ResultItem[] = [];

  for (const [key, values] of Object.entries(metadata)) {
    const mapping = metadataLabelMappings[key];
    if (mapping && values) {
      if (key === "geographies") {
        result.push({
          label: mapping.label,
          iconLabel: mapping.iconLabel,
          value: values as string | string[],
        });
      } else if (key.includes("project_value") && values[0] !== "0") {
        result.push({ label: mapping.label, iconLabel: mapping.iconLabel, value: getSumUSD(values as string[]) });
      } else if (key === "organisation") {
        result.push({ label: mapping.label, iconLabel: mapping.iconLabel, value: getSubCategoryName(values as TCorpusTypeSubCategory) });
      } else {
        result.push({
          label: mapping.label,
          iconLabel: mapping.iconLabel,
          value: Array.isArray(values) ? (values as string[]).slice(0, maxValuesToDisplay).join(", ") : values,
        });
      }
    }
  }
  return result;
};
