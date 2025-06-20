import startCase from "lodash/startCase";
import { ChevronUp, TextSearch } from "lucide-react";
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
import { ConceptLink } from "../molecules/conceptLink/ConceptLink";
import { Info } from "../molecules/info/Info";
import { NewFeatureCard } from "../molecules/newFeatures/NewFeatureCard";
import { Heading } from "../typography/Heading";

interface IProps {
  concepts: TConcept[];
  rootConcepts: TConcept[];
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
            <ConceptLink concept={concept} onClick={() => onConceptClick?.(concept.preferred_label)} />
          </li>
        );
      })}
      {concepts.length > TOP_CONCEPTS_LENGTH && (
        <>
          <div>
            <Button size="x-small" color="mono" variant="faded" onClick={() => setShowAll(!showAll)}>
              {showAll ? (
                <>
                  <ChevronUp size={14} className="mr-0.5" />
                  hide
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

export const ConceptsPanel = ({ rootConcepts, concepts, onConceptClick }: IProps) => {
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
      <div className="flex flex-col gap-4 pb-4 border-b border-border-light text-text-secondary">
        {knowledgeGraphIsNew && <NewFeatureCard newFeature={NEW_FEATURES[0]} />}
        <span className="text-base font-semibold text-text-primary">
          <TextSearch size={20} className="inline mr-2 text-text-brand align-text-bottom" />
          Find mentions of topics
          {!knowledgeGraphIsNew && <Badge className="ml-2">Beta</Badge>}
        </span>
        {!knowledgeGraphIsNew && (
          <p>
            Find where a topic precisely appears in the main document. Accuracy is not 100%.{" "}
            <ExternalLink url="/faq#topics-faqs" className="underline inline-block">
              Learn more
            </ExternalLink>
          </p>
        )}
      </div>
      <div className="pt-1 pb-4">
        <span className="block mb-1 text-[15px] text-text-primary font-semibold">Topics in the main document</span>
        <p className="">Ordered by most frequently mentioned, grouped by category</p>
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
                link={{ href: getConceptStoreLink(rootConcept.wikibase_id), text: "Source", external: true }}
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
