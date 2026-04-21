import { ID_SEPARATOR } from "@/constants/chars";
import { TDataInLabel } from "@/schemas";
import { TApiFamilyConcept } from "@/types";

const CONCEPT_TYPE_MAP: Record<string, string> = {
  case_category: "legal_category",
  jurisdiction: "legal_entity",
  principal_law: "law",
};

export const transformConcepts = (labels: TDataInLabel[]): TApiFamilyConcept[] =>
  labels.map((label) => {
    const preferred_label = label.value.value;
    const relation = label.value.type;

    const subconcept_of_labels = label.value.labels
      .filter((label) => label.type === "subconcept_of")
      .map((label) => {
        const { value } = label.value;
        return value.split(ID_SEPARATOR)[1] ?? value;
      });

    return {
      id: preferred_label,
      ids: [] as string[],
      preferred_label,
      relation,
      subconcept_of_labels,
      type: CONCEPT_TYPE_MAP[relation] ?? relation,
    };
  });
