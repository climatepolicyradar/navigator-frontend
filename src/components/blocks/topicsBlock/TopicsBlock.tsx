import { useEffect, useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TConcept } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { getTopicTableRows, TopicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  topicIds: string[];
};

export const TopicsBlock = ({ topicIds }: TProps) => {
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{
    [rootConceptId: string]: TConcept[];
  }>({});

  useEffect(() => {
    const conceptIds = topicIds.map((topic) => topic);
    fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
      setRootConcepts(rootConcepts);
      setConceptsGrouped(groupByRootConcept(concepts, rootConcepts));
    });
  }, [topicIds]);

  return (
    <Section block="topics" title="Topics explorer">
      <InteractiveTable<TTopicTableColumnId>
        columns={TopicTableColumns}
        rows={getTopicTableRows({ rootConcepts, conceptsGrouped })}
        defaultSort={{ column: "group", order: "desc" }}
      />
    </Section>
  );
};
