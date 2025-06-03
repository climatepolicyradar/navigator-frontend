import { MAX_PASSAGES } from "@/constants/paging";
import { TConcept } from "@/types";

import { firstCase } from "./text";

interface IArgs {
  isExactSearch?: boolean;
  passageMatches: number;
  queryTerm: string | string[];
  selectedTopics: TConcept[];
}

export const getPassageResultsContext = ({ isExactSearch, passageMatches, queryTerm, selectedTopics }: IArgs): string => {
  const queryString = queryTerm instanceof Array ? queryTerm[0] || "" : queryTerm;

  const passages = passageMatches >= MAX_PASSAGES ? `Top ${MAX_PASSAGES}` : `${passageMatches}`;
  const matchesPlural = passageMatches === 1 ? "match" : "matches";

  const phrase = queryString ? `${isExactSearch ? "" : "phrases related to "}"${queryString}"` : null;
  const topics = selectedTopics.map((concept) => firstCase(concept.preferred_label));
  const phraseAndTopics = [phrase, ...topics].filter((part) => part).join(" AND ");

  return [passages, matchesPlural, "for", phraseAndTopics].join(" ") + ".";
};
