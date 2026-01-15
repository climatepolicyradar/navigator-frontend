import React from "react";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { MAX_PASSAGES } from "@/constants/paging";
import { TTopic } from "@/types";

import { pluralise } from "./pluralise";

interface IArgs {
  isExactSearch?: boolean;
  passageMatches: number;
  queryTerm: string | string[];
  selectedTopics: TTopic[];
}

export const ResultsTopicsContext = ({ phrase, selectedTopics }: { phrase: string; selectedTopics: TTopic[] }) => {
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

  const phrase = queryString ? `${isExactSearch ? "" : "phrases related to "}${queryString}` : null;

  return (
    <div>
      {passages} {pluralise(passageMatches, ["match", "matches"])} for <ResultsTopicsContext phrase={phrase} selectedTopics={selectedTopics} />
    </div>
  );
};
