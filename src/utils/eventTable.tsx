import orderBy from "lodash/orderBy";
import { LucideInfo } from "lucide-react";
import { ReactNode } from "react";

import { Badge } from "@/components/atoms/badge/Badge";
import { Icon } from "@/components/atoms/icon/Icon";
import { LabelButton } from "@/components/atoms/labelButton/LabelButton";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Popover } from "@/components/atoms/popover/Popover";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { ARROW_UP_RIGHT } from "@/constants/chars";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { getLanguage } from "@/helpers/getLanguage";
import { getMainDocuments } from "@/helpers/getMainDocuments";
import {
  IFamilyDocumentTopics,
  TFamilyDocumentPublic,
  TFamilyEventPublic,
  TFamilyPublic,
  TLanguages,
  TLoadingStatus,
  TMatchedFamily,
  TTableColumn,
  TTableRow,
} from "@/types";

import { getMostSpecificCourts } from "./getMostSpecificCourts";
import { pluralise } from "./pluralise";
import { joinTailwindClasses } from "./tailwind";
import { firstCase } from "./text";
import { formatDateShort } from "./timedate";

/* Columns */

export type TEventTableColumnId = "caseNumber" | "caseTitle" | "court" | "date" | "searchResults" | "document" | "topics" | "type";
type TEventTableColumn = TTableColumn<TEventTableColumnId>;

const topicsColumnName = (
  <>
    Topics&ensp;
    <Badge>Beta</Badge>{" "}
    <Popover
      openOnHover
      trigger={
        <button type="button">
          <LucideInfo size={16} className="inline-block align-text-bottom text-gray-500 hover:text-gray-700 cursor-help" />
        </button>
      }
      description="This table shows the most frequently mentioned topics in this document. Click to view the document and see the specific passages mentioning each topic highlighted. Accuracy is not 100%."
      link={{
        href: "/faq",
        hash: "topics-faqs",
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
  showMatches = false,
}: {
  hasTopics?: boolean;
  isLitigation: boolean;
  isUSA?: boolean;
  showFamilyColumns?: boolean;
  showMatches?: boolean;
}) => {
  const columns: TEventTableColumn[] = [
    { id: "date", name: "Filing Date", sortable: true, fraction: 2 },
    { id: "document", fraction: 6 },
    { id: "type", sortable: true, sortOptions: [{ label: "Group by type", order: "asc" }], fraction: 2 },
    { id: "topics", name: topicsColumnName, fraction: 4 },
    { id: "caseNumber", name: "Case Number", fraction: 2 },
    { id: "court" },
    { id: "caseTitle", name: "Case", fraction: 2 },
    { id: "searchResults", name: "Search results", fraction: 2 },
  ];

  // Remove columns based on context of the document or family
  const columnsToRemove: TEventTableColumnId[] = [];
  if (!hasTopics) columnsToRemove.push("topics");
  if (!showFamilyColumns) columnsToRemove.push("caseNumber", "court", "caseTitle");

  if (!isLitigation) {
    columnsToRemove.push("date", "type");
  }
  if (!showMatches) columnsToRemove.push("searchResults");

  return columns.filter((column) => !columnsToRemove.includes(column.id));
};

/* Rows */

const MAX_TOPICS_PER_DOCUMENT = 4;

export type TEventTableRow = TTableRow<TEventTableColumnId>;

type TEventRowData = {
  family: TFamilyPublic;
  event?: TFamilyEventPublic;
  document?: TFamilyDocumentPublic;
};

export const getCaseNumbers = (family: TFamilyPublic): string | null => family.metadata.case_number?.join(", ") || null;

export const getCourts = (family: TFamilyPublic): string | null =>
  getMostSpecificCourts(family.concepts)
    .map((concept) => concept.preferred_label)
    .join(", ") || null;

// Get one row per event and/or document to populate an events table with
export const getFamilyEvents = (family: TFamilyPublic): TEventRowData[] => {
  const eventRows: TEventRowData[] = family.events.map((event) => ({ family, event }));
  const documentRows: TEventRowData[] = [];

  family.documents.forEach((document) => {
    if (document.events.length === 0) {
      // If this happens there is an API bug but we still want the document to show
      documentRows.push({ family, document });
    } else {
      documentRows.push(...document.events.map((event) => ({ family, event, document })));
    }
  });

  const allRows = [...eventRows, ...documentRows];
  const filteredRows = allRows.filter((row) => !row.event || row.event.event_type !== "Filing Year For Action");

  // family.events and family.document.events sometimes have the same event
  // remove duplicates by import_id and prioritise the document event (because it was added to allRows last)
  const rowEntries = filteredRows.map((row) => [row.event?.import_id || row.document.import_id, row] as const);
  const uniqueRows = Object.values(Object.fromEntries(rowEntries));

  return uniqueRows;
};

const getFamilyDocuments = (family: TFamilyPublic): TEventRowData[] =>
  family.documents.filter((document) => document.document_status !== "deleted").map((document) => ({ family, document }));

const linkClasses = "block text-brand underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500";

const getDocumentLink = (document: TFamilyDocumentPublic, hasMatches: boolean, isMainDocument: boolean, isLitigation: boolean): React.ReactNode => {
  const canPreview = hasMatches || (!!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf"));
  const canViewSource = !canPreview && !!document.source_url;

  if (canPreview)
    return (
      <PageLink
        keepQuery
        href={`/documents/${document.slug}`}
        className={joinTailwindClasses(linkClasses, (isMainDocument || isLitigation) && "font-medium")}
      >
        {document.title}
      </PageLink>
    );
  if (canViewSource)
    return (
      <PageLink external href={document.source_url} className={joinTailwindClasses(linkClasses, (isMainDocument || isLitigation) && "font-medium")}>
        {document.title} (External page {ARROW_UP_RIGHT})
      </PageLink>
    );
  return (
    <>
      {document.title} <br />{" "}
      <span className="text-sm">
        (We do not have this document in our database.{" "}
        <PageLink href="/contact" className="underline hover:text-brand">
          Contact us
        </PageLink>{" "}
        if you can help us find it)
      </span>
    </>
  );
};

const getDocumentCell = (
  isLitigation: boolean,
  document: TFamilyDocumentPublic,
  isMainDocument: boolean,
  languages: TLanguages,
  hasMatches: boolean,
  event?: TFamilyEventPublic
): ReactNode => {
  return (
    <div className="flex flex-col gap-2">
      {isLitigation && (
        <>
          <div>{getDocumentLink(document, hasMatches, isMainDocument, isLitigation)}</div>
          {event?.metadata.action_taken?.[0] && <div className="italic">{event.metadata.action_taken[0]}</div>}
          {event?.metadata.description?.[0] && (
            <ViewMore maxLines={4} onButtonClick={() => {}}>
              {event.metadata.description[0]}
            </ViewMore>
          )}
        </>
      )}
      {!isLitigation && (
        <>
          <div>{getDocumentLink(document, hasMatches, isMainDocument, isLitigation)}</div>
          {document.document_role && (
            <span className={`${document.document_role.toLowerCase().includes("main") ? "font-medium" : ""}`}>
              {firstCase(document.document_role.toLowerCase()) + (document.document_role.toLowerCase().includes("main") ? " document" : "")}
            </span>
          )}
          {document.document_type && <div className="italic">{document.document_type}</div>}
          {document.language && (
            <div>
              {getLanguage(document.language, languages)} {document.variant && `(${document.variant})`}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const getEventTableRows = ({
  families,
  familyTopics,
  documentEventsOnly = false,
  documentRowClick,
  matchesFamily,
  matchesStatus = "success",
  language,
  languages,
  isLitigation,
}: {
  families: TFamilyPublic[];
  familyTopics?: IFamilyDocumentTopics | null;
  documentEventsOnly?: boolean;
  documentRowClick?: (rowId: string) => void;
  matchesFamily?: TMatchedFamily;
  matchesStatus?: TLoadingStatus;
  language?: string;
  languages?: TLanguages;
  isLitigation: boolean;
}): TEventTableRow[] => {
  const rows: TEventTableRow[] = [];
  const topicsData = familyTopics ? Object.values(familyTopics.conceptsGrouped).flat() : [];

  // Populate rows of data differently for litigation where we have events on documents to pull from
  const rowsData = isLitigation ? families.map(getFamilyEvents).flat() : families.map(getFamilyDocuments).flat();

  rowsData.forEach(({ family, event, document }) => {
    if (documentEventsOnly && !document) return;

    const date = event ? new Date(event.date) : null;

    const [mainDocuments] = getMainDocuments(family.documents);
    const isMainDocument = Boolean(document && mainDocuments.find((mainDocument) => mainDocument.slug === document.slug));

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
          <PageLink
            key={topicId}
            href={`/documents/${document.slug}`}
            query={{ [QUERY_PARAMS.concept_name]: topic.preferred_label }}
            className={linkClasses}
          >
            <LabelButton>{firstCase(topic?.preferred_label || fallbackLabel)}</LabelButton>
          </PageLink>
        );
      });

      topicsDisplay = (
        <div className="flex flex-col gap-1 items-start">
          {topicLinks}
          {someTopicsHidden && (
            <button
              type="button"
              role="link"
              className="p-2 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 leading-4 font-medium"
            >
              + {sortedTopics.length - MAX_TOPICS_PER_DOCUMENT} more
            </button>
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
        <PageLink keepQuery href={`/documents/${document.slug}`} className={linkClasses}>
          {matches} {pluralise(matches, ["match", "matches"])}
        </PageLink>
      );
    }

    /* Everything else */

    const row: TEventTableRow = {
      id: `${document?.import_id || ""}:${event?.import_id || ""}`,
      cells: {
        caseNumber: getCaseNumbers(family),
        caseTitle: family.title,
        court: getCourts(family),
        date: date
          ? {
              label: formatDateShort(date, language),
              value: date.getTime(),
            }
          : null,
        searchResults:
          document && matchesDisplay
            ? {
                // TODO: improve the messaging here to include context about the search
                // import { getPassageResultsContext } from "@/utils/getPassageResultsContext";
                label: <div className="flex flex-col gap-2 items-start">{matchesDisplay}</div>,
                value: `${document.slug}:${matches}`,
              }
            : null,
        document: document
          ? {
              label: getDocumentCell(isLitigation, document, isMainDocument, languages, matches > 0, event),
              value: isMainDocument,
            }
          : null,
        topics: { label: topicsDisplay, value: "" },
        type: event?.event_type || null,
      },
    };

    if (documentEventsOnly && document && documentRowClick) {
      row.onClick = (clickedRow) => documentRowClick(clickedRow.id);
    }

    rows.push(row);
  });

  return rows;
};

// Returns the date of the first document in a case
// Uses family.documents over family.events as often the oldest event is the start of a year, so no good for sorting
export const getCaseFirstDocumentDate = (family: TFamilyPublic): string =>
  family.documents
    .filter((document) => document.events.length > 0)
    .map((document) => document.events.map((event) => event.date).sort()[0])
    .sort()[0] || "";
