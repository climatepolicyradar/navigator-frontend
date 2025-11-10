import orderBy from "lodash/orderBy";
import { LucideInfo } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Icon } from "@/components/atoms/icon/Icon";
import { Badge } from "@/components/atoms/label/Badge";
import { Popover } from "@/components/atoms/popover/Popover";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { QUERY_PARAMS } from "@/constants/queryParams";
import {
  IFamilyDocumentTopics,
  TFamilyDocumentPublic,
  TFamilyEventPublic,
  TFamilyPublic,
  TLoadingStatus,
  TMatchedFamily,
  TTableColumn,
  TTableRow,
} from "@/types";

import { getMostSpecificCourts } from "./getMostSpecificCourts";
import { pluralise } from "./pluralise";
import { firstCase } from "./text";
import { formatDateShort } from "./timedate";

/* Columns */

export type TEventTableColumnId = "action" | "caseNumber" | "caseTitle" | "court" | "date" | "document" | "summary" | "topics" | "type";
export type TEventTableColumn = TTableColumn<TEventTableColumnId>;

const topicsColumnName = (
  <>
    Topics&ensp;
    <Badge>Beta</Badge>{" "}
    <Popover
      openOnHover
      trigger={<LucideInfo size={16} className="inline-block align-text-bottom text-gray-500 hover:text-gray-700 cursor-help" />}
      description="This table shows the most frequently mentioned topics in this document. The number in brackets is a count of how many times each topic appears. Click to view the document and see the specific passages mentioning each topic highlighted. Accuracy is not 100%."
      link={{
        href: "/faq#topics-faqs",
        text: "Learn more",
        external: true,
      }}
    />
  </>
);

export const getEventTableColumns = ({
  hasTopics = false,
  isLitigation,
  isUSA = true,
  showFamilyColumns = false,
}: {
  hasTopics?: boolean;
  isLitigation: boolean;
  isUSA?: boolean;
  showFamilyColumns?: boolean;
  showMatches?: boolean;
}) => {
  const columns: TEventTableColumn[] = [
    { id: "date", name: "Filing Date", sortable: true, fraction: 2 },
    { id: "type", sortable: true, sortOptions: [{ label: "Group by type", order: "asc" }], fraction: 2 },
    { id: "topics", name: topicsColumnName, fraction: 8 },
    { id: "action", name: "Action Taken", fraction: 4 },
    { id: "summary", fraction: 6, classes: "min-w-75" },
    { id: "caseNumber", name: "Case Number", fraction: 2 },
    { id: "court" },
    { id: "caseTitle", name: "Case", fraction: 2 },
    { id: "document", fraction: 2 },
  ];

  const columnsToRemove: TEventTableColumnId[] = [];
  if (!isLitigation) columnsToRemove.push("date");
  if (!hasTopics) columnsToRemove.push("topics");
  if (!isUSA) columnsToRemove.push("action");
  if (!showFamilyColumns) columnsToRemove.push("caseNumber", "court", "caseTitle");

  return columns.filter((column) => !columnsToRemove.includes(column.id));
};

/* Rows */

const MAX_TOPICS_PER_DOCUMENT = 4;

export type TEventTableRow = TTableRow<TEventTableColumnId>;

type TEventWithDocument = {
  event: TFamilyEventPublic;
  document?: TFamilyDocumentPublic;
};

export const getCaseNumbers = (family: TFamilyPublic): string | null => family.metadata.case_number?.join(", ") || null;

export const getCourts = (family: TFamilyPublic): string | null =>
  getMostSpecificCourts(family.concepts)
    .map((concept) => concept.preferred_label)
    .join(", ") || null;

// Events can be duplicated between the family and document event lists. Use object keys to overwrite the former with the latter.
const getFamilyEvents = (family: TFamilyPublic): TEventWithDocument[] =>
  Object.values(
    Object.fromEntries(
      (
        [
          ...family.events.map((event) => ({ event })),
          ...family.documents.flatMap((document) => document.events.map((event) => ({ event, document }))),
        ] as TEventWithDocument[]
      )
        .filter((item) => item.event.event_type !== "Filing Year For Action") // TODO: review whether we still want to do this
        .map((item) => [item.event.import_id, item] as const)
    )
  );

export const getEventTableRows = ({
  families,
  familyTopics,
  documentEventsOnly = false,
  matchesFamily,
  matchesStatus = "success",
  language,
}: {
  families: TFamilyPublic[];
  familyTopics?: IFamilyDocumentTopics;
  documentEventsOnly?: boolean;
  matchesFamily?: TMatchedFamily;
  matchesStatus?: TLoadingStatus;
  language?: string;
}): TEventTableRow[] => {
  const rows: TEventTableRow[] = [];
  const topicsData = familyTopics ? Object.values(familyTopics.conceptsGrouped).flat() : [];

  families.forEach((family) =>
    getFamilyEvents(family).forEach(({ event, document }, eventIndex) => {
      if (documentEventsOnly && !document) return;

      const date = new Date(event.date);
      const summary = event.metadata.description?.[0];

      const linkClasses = "block text-gray-700 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500";

      /* Topics */

      let topicsDisplay: ReactNode = null;
      if (document && familyTopics) {
        const documentTopicsData = familyTopics.documents.find((doc) => doc.importId === document.import_id)?.conceptCounts ?? {};

        const sortedTopics = orderBy(Object.entries(documentTopicsData), ["1"], ["desc"]);
        const someTopicsHidden = sortedTopics.length > MAX_TOPICS_PER_DOCUMENT;

        const topicLinks = sortedTopics.slice(0, MAX_TOPICS_PER_DOCUMENT).map(([topicId, topicCount]) => {
          const [wikibaseId, fallbackLabel] = topicId.split(":");
          const topic = topicsData.find((concept) => concept.wikibase_id === wikibaseId);

          // TODO investigate references to topics not in API response
          if (!topic) return null;

          return (
            <Link
              key={topicId}
              href={{ pathname: `/documents/${document.slug}`, query: { [QUERY_PARAMS.concept_name]: topic.preferred_label } }}
              className={linkClasses}
            >
              {firstCase(topic?.preferred_label || fallbackLabel)} <span className="text-gray-500">({topicCount})</span>
            </Link>
          );
        });

        topicsDisplay = (
          <div className="flex flex-col gap-2 items-start">
            {topicLinks}
            {someTopicsHidden && (
              <Link href={`/documents/${document.slug}`}>
                <button
                  type="button"
                  role="link"
                  className="p-2 mt-1 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 leading-4 font-medium"
                >
                  View all topic mentions
                </button>
              </Link>
            )}
          </div>
        );
      }

      /* Matches */

      let matches = 0;
      if (matchesFamily && document) {
        const matchesDocument = matchesFamily.family_documents.find((doc) => doc.document_slug === document.slug);
        if (matchesDocument) {
          matches = matchesDocument.document_passage_matches.length;
        }
      }

      let matchesDisplay: ReactNode = null;
      if (matchesStatus === "loading") {
        matchesDisplay = <Icon name="loading" />;
      } else if (document && matches > 0) {
        matchesDisplay = (
          <LinkWithQuery href={`/documents/${document.slug}`} className={linkClasses}>
            {matches} {pluralise(matches, ["match", "matches"])}
          </LinkWithQuery>
        );
      }

      /* Everything else */

      rows.push({
        id: [family.import_id, eventIndex].join("/"),
        cells: {
          action: event.metadata.action_taken?.[0] || null,
          caseNumber: getCaseNumbers(family),
          caseTitle: family.title,
          court: getCourts(family),
          date: {
            label: formatDateShort(date, language),
            value: date.getTime(),
          },
          document: document
            ? {
                label: (
                  <div className="flex flex-col gap-2">
                    <LinkWithQuery href={`/documents/${document.slug}`} className={linkClasses}>
                      View
                    </LinkWithQuery>
                    {matchesDisplay}
                  </div>
                ),
                value: `${document.slug}:${matches}`,
              }
            : null,
          summary: summary ? { label: <ViewMore maxLines={4}>{summary}</ViewMore>, value: summary } : null,
          topics: { label: topicsDisplay, value: "" },
          type: event.event_type,
        },
      });
    })
  );

  return rows;
};
