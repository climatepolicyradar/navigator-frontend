import { IConcept } from "@/types";

const findConceptObject = (conceptSearch: string, dataSet: IConcept[]) => {
  let concept = dataSet.find((c) => c.wikibase_id.toLowerCase() === conceptSearch.toLowerCase());
  if (!concept) concept = dataSet.find((c) => c.preferred_label.toLowerCase() === conceptSearch.toLowerCase());
  if (!concept) return null;
  return concept;
};

export const getConceptName = (conceptSearch: string, dataSet: IConcept[]) => {
  return findConceptObject(conceptSearch, dataSet)?.preferred_label;
};

export const getConceptId = (conceptSearch: string, dataSet: IConcept[]) => {
  return findConceptObject(conceptSearch, dataSet)?.wikibase_id;
};
