import sortBy from "lodash/sortBy";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ID_SEPARATOR } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { IFamilyDocumentTopics, TFamilyPublic, TNestedSearchLabel, TTableColumn, TTableRow } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";
import { firstCase } from "@/utils/text/firstCase";
import { formatDateShort } from "@/utils/timedate";

export type TDocumentMentionsTableColumnId = "document" | "mentions";

export const TOPIC_DRAWER_DOCUMENTS_TABLE_COLUMNS: TTableColumn<TDocumentMentionsTableColumnId>[] = [
  { id: "document", fraction: 3 },
  { id: "mentions" },
];

const getTopicQuery = (topic: TNestedSearchLabel): Record<string, string> => {
  const filters = filterPathsToQueryGroup([[{ id: topic.id, type: topic.type, value: topic.value }]], null, "and");

  return { [QUERY_PARAMS.filters]: deflateFilters(filters) };
};

export const getTopicDrawerDocumentTableRows = (
  family: TFamilyPublic,
  familyTopics: IFamilyDocumentTopics,
  topic: TNestedSearchLabel
): TTableRow<TDocumentMentionsTableColumnId>[] => {
  const topicQuery = getTopicQuery(topic);

  return familyTopics.documents.reduce((rows, document) => {
    const mentions = document.conceptCounts[topic.id.split(ID_SEPARATOR)[1]];
    if (!mentions) return rows;

    const contextLines: string[] = [];

    if (family.attribution.category === "Litigation") {
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
                <PageLink href={"/documents/" + document.slug} query={topicQuery} className="block text-inky-blue font-medium hover:underline shrink">
                  {document.title}
                </PageLink>
                {contextLines && (
                  <div className="flex flex-col gap-1 text-sm text-text-tertiary leading-4">
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
