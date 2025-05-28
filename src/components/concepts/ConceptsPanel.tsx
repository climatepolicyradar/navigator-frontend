import startCase from "lodash/startCase";
import Link from "next/link";
import { useCallback } from "react";

import { Button } from "@/components/atoms/button/Button";
import { TConcept } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";

import { ConceptsHead } from "./ConceptsHead";
import { Info } from "../molecules/info/Info";

interface IProps {
  concepts: TConcept[];
  rootConcepts: TConcept[];
  conceptCountsById: Record<string, number>;
  showCounts?: boolean;
  onConceptClick?: (conceptLabel: string) => void;
}

export const ConceptsPanel = ({ rootConcepts, concepts, conceptCountsById, showCounts = true, onConceptClick }: IProps) => {
  const handleConceptClick = useCallback(
    (conceptLabel: string) => {
      onConceptClick?.(conceptLabel);
    },
    [onConceptClick]
  );

  const otherRootConcept: TConcept = {
    wikibase_id: "Q000",
    preferred_label: "Other",
    subconcept_of: [],
    recursive_subconcept_of: [],
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  };

  const conceptsGroupedByRootConcept = groupByRootConcept(concepts, rootConcepts);

  return (
    <div className="pb-4">
      <div className="grow-0 shrink-0">
        <ConceptsHead></ConceptsHead>
      </div>

      {rootConcepts.concat(otherRootConcept).map((rootConcept) => {
        const hasConcepts = conceptsGroupedByRootConcept[rootConcept.wikibase_id]?.length > 0;
        if (!hasConcepts) return null;

        return (
          <div key={rootConcept.wikibase_id} className="pt-6 pb-6 relative group">
            <div className="flex items-center gap-2">
              <p className="capitalize text-neutral-800 text-base font-medium leading-normal flex-grow">{rootConcept.preferred_label}</p>
              <Info
                title={startCase(rootConcept.preferred_label)}
                description={rootConcept.description}
                link={{ href: getConceptStoreLink(rootConcept.wikibase_id), text: "Source" }}
              />
            </div>
            <ul className="flex flex-wrap gap-2 mt-4">
              {conceptsGroupedByRootConcept[rootConcept.wikibase_id].map((concept) => {
                return (
                  <li key={concept.wikibase_id}>
                    <Link
                      className="capitalize hover:no-underline"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleConceptClick?.(concept.preferred_label);
                      }}
                    >
                      <Button color="mono" rounded variant="outlined" className="capitalize" data-cy="view-document-viewer-concept">
                        {concept.preferred_label}
                        {showCounts && ` (${conceptCountsById[concept.wikibase_id]})`}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
