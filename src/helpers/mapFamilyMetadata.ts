import { MULTILATERALCLIMATEFUNDSCATEGORY } from "@/components/documents/renderers/DocumentMetaRenderer";
import { metadataLabelMappings } from "@/constants/familyMetadataMappings";
import { getSubCategoryName } from "@/helpers/getCategoryName";
import { getSumUSD } from "@/helpers/getSumUSD";
import { TCorpusTypeSubCategory } from "@/types";

interface IMetadata {
  [key: string]: string[] | TCorpusTypeSubCategory | string;
}

type TResultItem = {
  label: string;
  value: string[] | string;
};

export const mapFamilyMetadata = (metadata: IMetadata) => {
  const result: TResultItem[] = [];

  for (const [key, values] of Object.entries(metadata)) {
    const mapping = metadataLabelMappings[key as keyof typeof metadataLabelMappings];

    if (mapping && values) {
      if (key === "geographies") {
        result.push({
          label: mapping.label,
          value: values as string | string[],
        });
      } else if (key.includes("project_value")) {
        if (values[0] !== "0") {
          result.push({
            label: mapping.label,
            value: getSumUSD(values as string[]),
          });
        }
      } else if (key === "organisation") {
        result.push({
          label: mapping.label,
          value: getSubCategoryName(values as TCorpusTypeSubCategory),
        });
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
