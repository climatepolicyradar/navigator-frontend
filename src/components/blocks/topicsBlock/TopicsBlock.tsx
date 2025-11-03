import startCase from "lodash/startCase";
import { useEffect, useState } from "react";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { Info } from "@/components/molecules/info/Info";
import { Section } from "@/components/molecules/section/Section";
import { Heading } from "@/components/typography/Heading";
import { TConcept } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { getConceptStoreLink } from "@/utils/getConceptStoreLink";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { firstCase } from "@/utils/text";

type TProps = {
  topicIds: string[];
};

export const TopicsBlock = ({ topicIds }: TProps) => {
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{
    [rootConceptId: string]: TConcept[];
  }>({});
  const [filteredConcepts, setFilteredConcepts] = useState<TConcept[]>([]);

  useEffect(() => {
    const conceptIds = topicIds.map((topic) => topic);
    fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
      setRootConcepts(rootConcepts);
      setFilteredConcepts(concepts);
      setConceptsGrouped(groupByRootConcept(concepts, rootConcepts));
    });
  }, [topicIds]);

  return (
    <Section block="topics" title="Topics explorer">
      {rootConcepts.map((rootConcept) => {
        const hasConcepts = conceptsGrouped[rootConcept.wikibase_id]?.length > 0;
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
            <ul className="">
              {conceptsGrouped[rootConcept.wikibase_id].map((concept) => (
                <li key={concept.wikibase_id} className="">
                  <ConceptLink concept={concept} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </Section>
  );
};
