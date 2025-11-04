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
  });
  return rows;
};
