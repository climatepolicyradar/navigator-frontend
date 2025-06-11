import startCase from "lodash/startCase";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { TConcept } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { firstCase } from "@/utils/text";

import { ExternalLink } from "../ExternalLink";
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

interface IConceptListProps {
  concepts: TConcept[];
  onConceptClick?: (conceptLabel: string) => void;
}

// How many concepts to show based on the most mentions
const TOP_CONCEPTS_LENGTH = 3;

const ConceptsList = ({ concepts, onConceptClick }: IConceptListProps) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      {concepts.slice(0, showAll ? undefined : TOP_CONCEPTS_LENGTH).map((concept) => {
        return (
          <li key={concept.wikibase_id} className="">
            <Link
              className="inline text-text-primary capitalize underline underline-offset-2 decoration-dotted hover:underline"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onConceptClick?.(concept.preferred_label);
              }}
            >
              {firstCase(concept.preferred_label)}
            </Link>
          </li>
        );
      })}
      {concepts.length > TOP_CONCEPTS_LENGTH && (
        <>
          <div>
            <Button size="x-small" color="mono" variant="faded" onClick={() => setShowAll(!showAll)}>
              {showAll ? (
                <>
                  <ChevronUp />
                  &nbsp; hide
                </>
              ) : (
                `+${concepts.length - TOP_CONCEPTS_LENGTH} more`
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export const ConceptsPanel = ({ rootConcepts, concepts, conceptCountsById, showCounts = false, onConceptClick }: IProps) => {
  const { previousNewFeature } = useContext(NewFeatureContext);

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
    <div className="flex flex-col gap-4 pb-4 text-sm">
      <div className="flex flex-col gap-4 pb-4 border-b border-border-light text-text-tertiary">
        {knowledgeGraphIsNew && <NewFeatureCard newFeature={NEW_FEATURES[0]} />}
        <span className="text-base font-semibold text-text-primary">
          In this document
          {!knowledgeGraphIsNew && <Badge className="ml-2">Beta</Badge>}
        </span>
        {!knowledgeGraphIsNew && (
          <p>
            Find mentions of topics. Accuracy is not 100%.
            <br />
            <ExternalLink url="/faq#topics-faqs" className="underline">
              Learn more
            </ExternalLink>
          </p>
        )}
        <p>Sorted by the most frequent mention.</p>
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
            <ul className="flex flex-col gap-2 mt-2 ml-4">
              <ConceptsList concepts={conceptsGroupedByRootConcept[rootConcept.wikibase_id]} onConceptClick={onConceptClick} />
            </ul>
          </div>
        );
      })}
    </div>
  );
};
