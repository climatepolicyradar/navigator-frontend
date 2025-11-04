import { Fragment } from "react";

import { ConceptLink } from "@/components/molecules/conceptLink/ConceptLink";
import { IFamilyDocumentTopics, TTableColumn, TTableRow } from "@/types";
import { firstCase } from "@/utils/text";

export type TTopicTableColumnId = "group" | "concepts";

export const TopicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2 },
  { id: "concepts", name: "Concepts", fraction: 5 },
];

export type TTopicTableRow = TTableRow<TTopicTableColumnId>;

export const getTopicTableRows = (familyTopics: IFamilyDocumentTopics): TTopicTableRow[] => {
  const rows: TTopicTableRow[] = [];

  familyTopics.rootConcepts.forEach((rootConcept) => {
    const hasConcepts = familyTopics.conceptsGrouped[rootConcept.wikibase_id]?.length > 0;
    if (!hasConcepts) return null;

    rows.push({
      id: rootConcept.wikibase_id,
      cells: {
        group: firstCase(rootConcept.preferred_label),
        concepts: {
          label: (
            <div className="flex flex-wrap gap-y-2 gap-x-1">
              {familyTopics.conceptsGrouped[rootConcept.wikibase_id]
                .sort((a, b) => {
                  const countA = familyTopics.conceptCounts[a.wikibase_id] || 0;
                  const countB = familyTopics.conceptCounts[b.wikibase_id] || 0;
                  return countB - countA;
                })
                .map((concept, i) => (
                  <span className="inline-block" key={concept.wikibase_id}>
                    <ConceptLink
                      concept={concept}
                      label={`${firstCase(concept.preferred_label)} (${familyTopics.conceptCounts[concept.wikibase_id] || 0})`}
                    >
                      <div>TODO: display breakdown of the count per document</div>
                      <div>{concept.description}</div>
                    </ConceptLink>
                    {i < familyTopics.conceptsGrouped[rootConcept.wikibase_id].length - 1 && ", "}
                  </span>
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
