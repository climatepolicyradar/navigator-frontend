import orderBy from "lodash/orderBy";

import { Label } from "@/components/atoms/label/Label";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { QUERY_PARAMS } from "@/constants/queryParams";
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

  familyTopics.rootConcepts.forEach((rootTopic) => {
    const topicsInGroup = familyTopics.conceptsGrouped[rootTopic.wikibase_id] ?? [];
    if (topicsInGroup.every((topic) => topic.wikibase_id !== rootTopic.wikibase_id)) {
      topicsInGroup.push(rootTopic);
    }

    const topicsToDisplay: TConcept[] = topicsInGroup.reduce((accumulatedTopics, topic) => {
      return wikibaseIds.includes(topic.wikibase_id) ? [...accumulatedTopics, topic] : accumulatedTopics;
    }, []);
    const sortedTopics = orderBy(topicsToDisplay, [(topic) => document.conceptCounts[topic.wikibase_id] ?? 0], ["desc"]);

    if (sortedTopics.length > 0) {
      rows.push({
        id: rootTopic.wikibase_id,
        cells: {
          group: firstCase(rootTopic.preferred_label),
          topics: {
            label: (
              <div className="flex flex-col items-start gap-1">
                {sortedTopics.map((topic) => (
                  <PageLink
                    key={topic.wikibase_id}
                    href={`/documents/${document.slug}`}
                    keepQuery
                    query={{ [QUERY_PARAMS.concept_name]: topic.preferred_label }}
                  >
                    <Label>{firstCase(topic.preferred_label)}</Label>
                  </PageLink>
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
