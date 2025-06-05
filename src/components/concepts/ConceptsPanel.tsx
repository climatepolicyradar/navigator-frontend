import startCase from "lodash/startCase";
import Link from "next/link";
import { useCallback, useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { TConcept } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { firstCase } from "@/utils/text";

import { LinkWithQuery } from "../LinkWithQuery";
import { Badge } from "../atoms/label/Badge";
import { Info } from "../molecules/info/Info";
import { NewFeatureCard } from "../molecules/newFeatures/NewFeatureCard";
import { Heading } from "../typography/Heading";

interface IProps {
  concepts: TConcept[];
  rootConcepts: TConcept[];
  conceptCountsById: Record<string, number>;
  showCounts?: boolean;
  onConceptClick?: (conceptLabel: string) => void;
}

export const ConceptsPanel = ({ rootConcepts, concepts, conceptCountsById, showCounts = true, onConceptClick }: IProps) => {
  const { previousNewFeature } = useContext(NewFeatureContext);

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
  const knowledgeGraphIsNew = previousNewFeature < 0;

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col gap-5">
        {knowledgeGraphIsNew && <NewFeatureCard newFeature={NEW_FEATURES[0]} />}
        <span className="text-base font-semibold text-text-primary">
          Topics
          {!knowledgeGraphIsNew && <Badge className="ml-2">Beta</Badge>}
        </span>
        {!knowledgeGraphIsNew && (
          <p className="text-sm text-text-tertiary">
            Find mentions of topics. Accuracy is not 100%.
            <br />
            <LinkWithQuery href="/faq" className="underline" target="_blank">
              Learn more
            </LinkWithQuery>
          </p>
        )}
      </div>

      {rootConcepts.concat(otherRootConcept).map((rootConcept) => {
        const hasConcepts = conceptsGroupedByRootConcept[rootConcept.wikibase_id]?.length > 0;
        if (!hasConcepts) return null;

        return (
          <div key={rootConcept.wikibase_id} className="relative group">
            <div className="flex items-center gap-2">
              <Heading level={3} className="text-[15px] leading-tight font-medium text-text-primary">
                {firstCase(rootConcept.preferred_label)}
              </Heading>
              <Info
                title={startCase(rootConcept.preferred_label)}
                description={rootConcept.description}
                link={{ href: getConceptStoreLink(rootConcept.wikibase_id), text: "Source" }}
              />
            </div>
            <ul className="flex flex-wrap gap-1 mt-4">
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
                      <Button
                        color="mono"
                        rounded
                        variant="outlined"
                        className="!px-2.5 !py-1.5 !font-normal leading-tight"
                        data-cy="view-document-viewer-concept"
                      >
                        {firstCase(concept.preferred_label)}
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
