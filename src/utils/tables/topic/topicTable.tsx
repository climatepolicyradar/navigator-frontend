import orderBy from "lodash/orderBy";

import { LabelButton } from "@/components/atoms/labelButton/LabelButton";
import { IFamilyDocumentTopics, TTableColumn, TTableRow } from "@/types";
import { firstCase } from "@/utils/text";

export type TTopicTableColumnId = "group" | "topics";

export const topicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2, classes: "font-medium" },
  { id: "topics", name: "Topics", fraction: 5 },
];

export type TTopicTableRow = TTableRow<TTopicTableColumnId>;

export const getTopicTableRows = (familyTopics: IFamilyDocumentTopics, onClickTopic: (wikibaseId: string) => void): TTopicTableRow[] => {
  const rows: TTopicTableRow[] = [];

  familyTopics.rootConcepts.forEach((rootConcept) => {
    const hasConcepts = familyTopics.conceptsGrouped[rootConcept.wikibase_id]?.length > 0;
    if (!hasConcepts) return null;

    const sortedConcepts = orderBy(
      familyTopics.conceptsGrouped[rootConcept.wikibase_id],
      [(concept) => familyTopics.conceptCounts[concept.wikibase_id] || 0],
      ["desc"]
    );

    rows.push({
      id: rootConcept.wikibase_id,
      cells: {
        group: {
          label: firstCase(rootConcept.preferred_label),
          value: rootConcept.preferred_label,
        },
        topics: {
          label: (
            <div className="flex flex-col gap-1 items-start">
              {sortedConcepts.map((concept) => (
                <LabelButton key={concept.wikibase_id} onClick={() => onClickTopic(concept.wikibase_id)}>
                  {firstCase(concept.preferred_label)}
                </LabelButton>
              ))}
            </div>
          ),
          value: "",
        },
      },
    });
  });
  return rows;
};
