import { metadataLabelMappings } from "@/constants/familyMetadataMappings";
import { MULTILATERALCLIMATEFUNDSCATEGORY } from "@/components/documents/renderers/DocumentMetaRenderer";
import { getSubCategoryName } from "@/helpers/getCategoryName";
import { getSumUSD } from "@/helpers/getSumUSD";
import { TCorpusTypeSubCategory } from "@types";

interface Metadata {
  [key: string]: string[] | TCorpusTypeSubCategory | string;
}

type ResultItem = {
  label: string;
  value: string[] | string;
};

export const mapFamilyMetadata = (metadata: Metadata) => {
  const result: ResultItem[] = [];

  for (const [key, values] of Object.entries(metadata)) {
    const mapping = metadataLabelMappings[key];

    if (mapping && values) {
      if (key === "geographies") {
        result.push({
          label: mapping.label,
          value: values as string | string[],
        });
      } else if (key.includes("project_value")) {
        if (values[0] !== "0") {
          result.push({ label: mapping.label, value: getSumUSD(values as string[]) });
        }
      } else if (key === "organisation") {
        result.push({ label: mapping.label, value: getSubCategoryName(values as TCorpusTypeSubCategory) });
      } else if (key === "category" && metadata.category === MULTILATERALCLIMATEFUNDSCATEGORY) {
        result.push({ label: mapping.label, value: "Projects" });
      } else {
        result.push({
          label: mapping.label,
          value: Array.isArray(values) && values.length > 1 ? values : values.toString(),
        });
      }
    }
  }
  return result;
};
