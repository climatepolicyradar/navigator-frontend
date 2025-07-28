import React from "react";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { MAX_PASSAGES } from "@/constants/paging";
import { IConcept } from "@/types";

interface IArgs {
  isExactSearch?: boolean;
  passageMatches: number;
  queryTerm: string | string[];
  selectedTopics: IConcept[];
}

export const ResultsTopicsContext = ({ phrase, selectedTopics }: { phrase: string; selectedTopics: IConcept[] }) => {
  return (
    <>
      {phrase && <>'{phrase}'&nbsp;</>}
      {selectedTopics.map((concept, i, allConcepts) => (
        <React.Fragment key={concept.wikibase_id}>
          {i === 0 && phrase && "AND "}
          <ConceptLink key={concept.wikibase_id} concept={concept} />
          {i + 1 < allConcepts.length && " AND "}
        </React.Fragment>
      ))}
    </>
  );
};

export const getPassageResultsContext = ({ isExactSearch, passageMatches, queryTerm, selectedTopics }: IArgs) => {
  const queryString = queryTerm instanceof Array ? queryTerm[0] || "" : queryTerm;

  const passages =
    passageMatches >= MAX_PASSAGES ? (
      <>
        Top <span className="font-bold">{MAX_PASSAGES}</span>
      </>
    ) : (
      <span className="font-bold">{passageMatches}</span>
    );
  const matchesPlural = passageMatches === 1 ? "match" : "matches";

  const phrase = queryString ? `${isExactSearch ? "" : "phrases related to "}${queryString}` : null;

  return (
    <div>
      {passages} {matchesPlural} for <ResultsTopicsContext phrase={phrase} selectedTopics={selectedTopics} />
    </div>
  );
};
