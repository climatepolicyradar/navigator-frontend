import { TConcept } from "@/types";

const findConceptObject = (conceptSearch: string, dataSet: TConcept[]) => {
  let concept = dataSet.find((c) => c.wikibase_id.toLowerCase() === conceptSearch.toLowerCase());
  if (!concept) concept = dataSet.find((c) => c.preferred_label.toLowerCase() === conceptSearch.toLowerCase());
  if (!concept) return null;
  return concept;
};

export const getConceptName = (conceptSearch: string, dataSet: TConcept[]) => {
  return findConceptObject(conceptSearch, dataSet)?.preferred_label;
};
