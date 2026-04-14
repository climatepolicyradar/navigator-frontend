import { metadataLabelMappings } from "@/constants/familyMetadataMappings";
import { getSumUSD } from "@/helpers/getSumUSD";
import { TAttributionCategory, TCorpusTypeSubCategory } from "@/types";

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
      } else if (key === "fund") {
        result.push({
          label: mapping.label,
          value: values,
        });
      } else if (key === "category" && (metadata.category as TAttributionCategory) === "Multilateral Climate Fund project") {
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
