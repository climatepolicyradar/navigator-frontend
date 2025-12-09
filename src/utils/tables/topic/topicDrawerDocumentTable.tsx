import sortBy from "lodash/sortBy";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics, TConcept, TFamilyPublic, TTableColumn, TTableRow } from "@/types";
import { firstCase } from "@/utils/text";
import { formatDateShort } from "@/utils/timedate";

export type TDocumentMentionsTableColumnId = "document" | "mentions";

export const TOPIC_DRAWER_DOCUMENTS_TABLE_COLUMNS: TTableColumn<TDocumentMentionsTableColumnId>[] = [
  { id: "document", fraction: 3 },
  { id: "mentions" },
];

export const getTopicDrawerDocumentTableRows = (
  family: TFamilyPublic,
  familyTopics: IFamilyDocumentTopics,
  topic: TConcept
): TTableRow<TDocumentMentionsTableColumnId>[] => {
  const conceptCountsKey = `${topic.wikibase_id}:${topic.preferred_label}`;

  return familyTopics.documents.reduce((rows, document) => {
    const mentions = document.conceptCounts[conceptCountsKey];
    if (!mentions) return rows;

    const contextLines: string[] = [];

    if (family.corpus_type_name === "Litigation") {
      const documentFromFamily = family.documents.find((doc) => doc.import_id === document.importId);
      const latestEvent = sortBy(documentFromFamily.events, "date")[0];

      if (latestEvent) {
        contextLines.push(formatDateShort(new Date(latestEvent.date)), firstCase(latestEvent.event_type));
      }
    }

    return [
      ...rows,
      {
        id: document.importId,
        cells: {
          document: {
            label: (
              <div className="flex flex-col items-start gap-2">
                <PageLink
                  href={"/documents/" + document.slug}
                  query={{ [QUERY_PARAMS.concept_name]: topic.preferred_label }}
                  className="block text-brand font-medium hover:underline shrink"
                >
                  {document.title}
                </PageLink>
                {contextLines && (
                  <div className="flex flex-col gap-1 text-sm text-gray-500 leading-4">
                    {contextLines.map((line, lineIndex) => (
                      <span key={lineIndex} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ),
            value: "",
          },
          mentions: {
            label: "~" + mentions,
            value: mentions,
          },
        },
      },
    ];
  }, []);
};
