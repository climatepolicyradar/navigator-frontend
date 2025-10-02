import { ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Icon } from "@/components/atoms/icon/Icon";
import { TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic, TLoadingStatus, TMatchedFamily, TTableColumn, TTableRow } from "@/types";

import { getMostSpecificCourts } from "./getMostSpecificCourts";
import { formatDateShort } from "./timedate";

/* Columns */

export type TEventTableColumnId = "action" | "caseNumber" | "caseTitle" | "court" | "date" | "document" | "matches" | "summary" | "type";
export type TEventTableColumn = TTableColumn<TEventTableColumnId>;

export const getEventTableColumns = ({
  isUSA = true,
  showFamilyColumns = false,
  showMatches = false,
}: {
  isUSA?: boolean;
  showFamilyColumns?: boolean;
  showMatches?: boolean;
}) => {
  const columns: TEventTableColumn[] = [
    { id: "date", name: "Filing Date", sortable: true, fraction: 2 },
    { id: "type", sortable: true, sortOptions: [{ label: "Group by type", order: "asc" }], fraction: 3 },
    { id: "action", name: "Action Taken", fraction: 4 },
    { id: "document" },
    { id: "summary", fraction: 6, classes: "min-w-75" },
    { id: "caseNumber", name: "Case Number", fraction: 2 },
    { id: "court" },
    { id: "caseTitle", name: "Case", fraction: 2 },
    { id: "matches" },
  ];

  const columnsToRemove: TEventTableColumnId[] = [];
  if (!isUSA) columnsToRemove.push("action");
  if (!showFamilyColumns) columnsToRemove.push("caseNumber", "court", "caseTitle");
  if (!showMatches) columnsToRemove.push("matches");

  return columns.filter((column) => !columnsToRemove.includes(column.id));
};

/* Rows */

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
  documentEventsOnly = false,
  matchesFamily,
  matchesStatus = "success",
  language,
}: {
  families: TFamilyPublic[];
  documentEventsOnly?: boolean;
  matchesFamily?: TMatchedFamily;
  matchesStatus?: TLoadingStatus;
  language?: string;
}): TEventTableRow[] => {
  const rows: TEventTableRow[] = [];

  families.forEach((family) =>
    getFamilyEvents(family).forEach(({ event, document }, eventIndex) => {
      if (documentEventsOnly && !document) return;

      const date = new Date(event.date);

      let matches = 0;
      if (matchesFamily && document) {
        const matchesDocument = matchesFamily.family_documents.find((doc) => doc.document_slug === document.slug);
        if (matchesDocument) {
          matches = matchesDocument.document_passage_matches.length;
        }
      }

      let matchesDisplay: ReactNode = matches;
      if (matchesStatus === "loading") {
        matchesDisplay = <Icon name="loading" />;
      } else if (document) {
        matchesDisplay = (
          <LinkWithQuery href={`/documents/${document.slug}`} className="text-text-brand">
            {matches}
          </LinkWithQuery>
        );
      }

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
                  <LinkWithQuery href={`/documents/${document.slug}`} className="text-text-brand underline">
                    View
                  </LinkWithQuery>
                ),
                value: document.slug,
              }
            : null,
          matches: {
            label: matchesDisplay,
            value: matches,
          },
          summary: event.metadata.description?.[0] || null,
          type: event.event_type,
        },
      });
    })
  );

  return rows;
};
