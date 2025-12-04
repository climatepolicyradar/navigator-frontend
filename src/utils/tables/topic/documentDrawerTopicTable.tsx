import orderBy from "lodash/orderBy";

import { Label } from "@/components/atoms/label/Label";
import { IFamilyDocumentTopics, TConcept, TTableColumn } from "@/types";
import { firstCase } from "@/utils/text";

import { TTopicTableColumnId, TTopicTableRow } from "./topicTable";

export const DOCUMENT_DRAWER_TOPICS_TABLE_COLUMNS: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", classes: "font-medium" },
  {
    id: "topics",
    name: (
      <>
        Topics <span className="text-gray-500 font-normal">(Most frequent)</span>
      </>
    ),
    fraction: 2,
  },
];

export const getDocumentDrawerTopicTableRow = (familyTopics: IFamilyDocumentTopics, documentImportId: string): TTopicTableRow[] => {
  const document = familyTopics.documents.find((doc) => doc.importId === documentImportId);
  if (!document) return [];

  const wikibaseIds = Object.keys(document.conceptCounts)
    .map((key) => key.split(":")[0])
    .filter((key) => key);
  if (wikibaseIds.length === 0) return [];

  const rows: TTopicTableRow[] = [];

  familyTopics.rootConcepts.forEach((rootConcept) => {
    const conceptsInGroup = familyTopics.conceptsGrouped[rootConcept.wikibase_id] ?? [];
    if (conceptsInGroup.every((concept) => concept.wikibase_id !== rootConcept.wikibase_id)) {
      conceptsInGroup.push(rootConcept);
    }

    const conceptsToDisplay: TConcept[] = conceptsInGroup.reduce((accumulatedConcepts, concept) => {
      return wikibaseIds.includes(concept.wikibase_id) ? [...accumulatedConcepts, concept] : accumulatedConcepts;
    }, []);
    const sortedConcepts = orderBy(conceptsToDisplay, [(concept) => document.conceptCounts[concept.wikibase_id] ?? 0], ["desc"]);

    if (sortedConcepts.length > 0) {
      rows.push({
        id: rootConcept.wikibase_id,
        cells: {
          group: firstCase(rootConcept.preferred_label),
          topics: {
            label: (
              <div className="flex flex-col items-start gap-1">
                {sortedConcepts.map((concept) => (
                  <Label key={concept.wikibase_id}>{firstCase(concept.preferred_label)}</Label>
                ))}
              </div>
            ),
            value: "",
          },
        },
      });
    }
  });

  return rows;
};
