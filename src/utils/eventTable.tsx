import { LinkWithQuery } from "@/components/LinkWithQuery";
import { IInteractiveTableColumn, IInteractiveTableRow } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyConcept, TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic } from "@/types";

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
    { id: "action", name: "Action taken", fraction: 3 },
    { id: "document" },
    { id: "summary", sortable: false, fraction: 6 },
  ];

  if (showFamilyColumns) {
    columns = [...columns, { id: "caseNumber", name: "Case", fraction: 2 }, { id: "court" }, { id: "caseTitle", name: "Case", fraction: 2 }];
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

const getFamilyEvents = (family: TFamilyPublic): TEventWithDocument[] =>
  [
    ...family.events.map((event) => ({ event })),
    ...family.documents.map((document) => document.events.map((event) => ({ event, document }))).flat(1),
  ].flat(1);

export const getEventTableRows = ({
  families,
  documentEventsOnly = false,
}: {
  families: TFamilyPublic[];
  documentEventsOnly?: boolean;
}): TEventTableRow[] => {
  const rows: TEventTableRow[] = [];

  families.forEach((family) =>
    getFamilyEvents(family).forEach(({ event, document }, eventIndex) => {
      if (documentEventsOnly && !document) return;

      const date = new Date(event.date);

      rows.push({
        id: [family.import_id, eventIndex].join("/"),
        cells: {
          action: family.metadata.action_taken?.[0] || null,
          caseNumber: family.metadata.case_number?.[0] || null,
          caseTitle: family.title,
          court: getMostSpecificCourts(family.concepts).join(" / ") || null,
          date: {
            display: formatDateShort(date),
            value: date.getTime(),
          },
          document: document
            ? {
                display: (
                  <LinkWithQuery href={`/documents/${document.slug}`} className="underline">
                    View
                  </LinkWithQuery>
                ),
                value: document.slug,
              }
            : null,
          matches: 0, // TODO
          summary: event.metadata.description?.[0] || null,
          type: event.event_type,
        },
      });
    })
  );

  return rows;
};
