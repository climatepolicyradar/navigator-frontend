import { TConcept, TTableColumn, TTableRow } from "@/types";
import { firstCase } from "@/utils/text";

export type TTopicTableColumnId = "group" | "concepts";

export const TopicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2 },
  { id: "concepts", name: "Concepts", fraction: 5 },
];

export type TTopicTableRow = TTableRow<TTopicTableColumnId>;

export const getTopicTableRows = ({
  rootConcepts,
  conceptsGrouped,
}: {
  rootConcepts: TConcept[];
  conceptsGrouped: {
    [rootConceptId: string]: TConcept[];
  };
}): TTopicTableRow[] => {
  const rows: TTopicTableRow[] = [];

  rootConcepts.forEach((rootConcept) => {
    const hasConcepts = conceptsGrouped[rootConcept.wikibase_id]?.length > 0;
    if (!hasConcepts) return null;

    rows.push({
      id: rootConcept.wikibase_id,
      cells: {
        group: firstCase(rootConcept.preferred_label),
        concepts: {
          label: conceptsGrouped[rootConcept.wikibase_id].map((concept) => concept.preferred_label).join(", "),
          value: conceptsGrouped[rootConcept.wikibase_id].map((concept) => concept.wikibase_id).join(", "),
        },
      },
    });

    //       return (
    // <div key={rootConcept.wikibase_id} className="relative group">
    //   <div className="flex items-center gap-2">
    //     <Heading level={3} className="text-[15px] leading-tight font-medium text-text-primary">
    //       {firstCase(rootConcept.preferred_label)}
    //     </Heading>
    //     <Info
    //       title={startCase(rootConcept.preferred_label)}
    //       description={rootConcept.description}
    //       link={{ href: getConceptStoreLink(rootConcept.wikibase_id), text: "Source", external: true }}
    //     />
    //   </div>
    //   <ul className="">
    //     {conceptsGrouped[rootConcept.wikibase_id].map((concept) => (
    //       <li key={concept.wikibase_id} className="">
    //         <ConceptLink concept={concept} />
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  });
  return rows;
};
