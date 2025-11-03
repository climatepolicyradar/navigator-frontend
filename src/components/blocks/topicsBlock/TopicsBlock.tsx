import { useEffect, useMemo, useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TConcept, TSearchResponse } from "@/types";
import { groupByRootConcept } from "@/utils/conceptsGroupedbyRootConcept";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { getTopicTableRows, TopicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  vespaFamilyData: TSearchResponse;
};

export const TopicsBlock = ({ vespaFamilyData }: TProps) => {
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const [conceptsGrouped, setConceptsGrouped] = useState<{
    [rootConceptId: string]: TConcept[];
  }>({});

  // console.log("VESPA FAMILY DATA IN TOPICS BLOCK", vespaFamilyData);

  // const conceptCounts: { conceptKey: string; count: number }[] = useMemo(() => {
  //   const uniqueConceptMap = new Map<string, number>();

  //   (vespaFamilyData?.families ?? []).forEach((family) => {
  //     family.hits.forEach((hit) => {
  //       // Check the document id against the documents in the page
  //       // if (documentIsPublished(page.documents, hit.document_import_id) && conceptsFromDocumentId === hit.document_import_id) {
  //       Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
  //         const existingCount = uniqueConceptMap.get(conceptKey) || 0;
  //         uniqueConceptMap.set(conceptKey, existingCount + count);
  //       });
  //       // }
  //     });
  //   });

  //   return Array.from(uniqueConceptMap.entries())
  //     .map(([conceptKey, count]) => ({ conceptKey, count }))
  //     .sort((a, b) => b.count - a.count);
  // }, [vespaFamilyData]);

  // const conceptIds = conceptCounts.map(({ conceptKey }) => conceptKey.split(":")[0]);

  // useEffect(() => {
  //   fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
  //     setRootConcepts(rootConcepts);
  //     setConceptsGrouped(groupByRootConcept(concepts, rootConcepts));
  //   });
  // }, [conceptIds]);

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
