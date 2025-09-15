import { ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Icon } from "@/components/atoms/icon/Icon";
import { IInteractiveTableColumn, IInteractiveTableRow } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyConcept, TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic, TLoadingStatus, TMatchedFamily } from "@/types";

import { formatDateShort } from "./timedate";

/* Columns */

export type TEventTableColumnId = "action" | "caseNumber" | "caseTitle" | "court" | "date" | "document" | "matches" | "summary" | "type";
export type TEventTableColumn = IInteractiveTableColumn<TEventTableColumnId>;

export const getEventTableColumns = ({
  isUSA = true,
  showFamilyColumns = false,
  showMatches = false,
}: {
  isUSA?: boolean;
  showFamilyColumns?: boolean;
  showMatches?: boolean;
}) => {
  let columns: TEventTableColumn[] = [
    { id: "date", name: "Filing Date", fraction: 2 },
    { id: "type", fraction: 3 },
    { id: "action", name: "Action Taken", fraction: 4 },
    { id: "document" },
    { id: "summary", sortable: false, fraction: 6, classes: "min-w-75" },
  ];

  if (showFamilyColumns) {
    columns = [...columns, { id: "caseNumber", name: "Case Number", fraction: 2 }, { id: "court" }, { id: "caseTitle", name: "Case", fraction: 2 }];
  }

  if (!isUSA) columns.splice(2, 1);
  if (showMatches) columns.push({ id: "matches" });

  return columns;
};

/* Rows */

export type TEventTableRow = IInteractiveTableRow<TEventTableColumnId>;

type TEventWithDocument = {
  event: TFamilyEventPublic;
  document?: TFamilyDocumentPublic;
};

const getMostSpecificCourts = (concepts: TFamilyConcept[]): TFamilyConcept[] => {
  let courtConcepts = concepts.filter((concept) => concept.type === "legal_entity");
  if (courtConcepts.length === 0) return [];

  // On each loop, remove legal entities without parents. Stops when the deepest level court remains
  while (courtConcepts.length > 1) {
    const moreSpecificConcepts = courtConcepts.filter((concept) =>
      concept.subconcept_of_labels.some((id) => courtConcepts.findIndex((con) => con.id === id) !== -1)
    );

    // Prevent a situation where number of concepts goes from 2 to 0 on the last loop
    if (moreSpecificConcepts.length === 0) {
      return courtConcepts;
    } else {
      courtConcepts = moreSpecificConcepts;
    }
  }

  return courtConcepts;
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
      ).map((item) => [item.event.import_id, item] as const)
    )
  );

export const getEventTableRows = ({
  families,
  documentEventsOnly = false,
  matchesFamily,
  matchesStatus = "success",
}: {
  families: TFamilyPublic[];
  documentEventsOnly?: boolean;
  matchesFamily?: TMatchedFamily;
  matchesStatus?: TLoadingStatus;
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
            display: formatDateShort(date),
            value: date.getTime(),
          },
          document: document
            ? {
                display: (
                  <LinkWithQuery href={`/documents/${document.slug}`} className="text-text-brand underline">
                    View
                  </LinkWithQuery>
                ),
                value: document.slug,
              }
            : null,
          matches: {
            display: matchesDisplay,
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
