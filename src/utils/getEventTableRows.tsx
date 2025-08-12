import { LinkWithQuery } from "@/components/LinkWithQuery";
import { IInteractiveTableRow } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic } from "@/types";

import { formatDateShort } from "./timedate";

export type TEventTableColumn = "action" | "date" | "document" | "summary" | "type";
export type TEventTableRow = IInteractiveTableRow<TEventTableColumn>;

type TEventWithDocument = {
  event: TFamilyEventPublic;
  document?: TFamilyDocumentPublic;
};

const getFamilyEvents = (family: TFamilyPublic): TEventWithDocument[] =>
  [
    ...family.events.map((event) => ({ event })),
    ...family.documents.map((document) => document.events.map((event) => ({ event, document }))).flat(1),
  ].flat(1);

interface IProps {
  families: TFamilyPublic[];
  documentEventsOnly?: boolean;
  showDocumentName?: boolean;
}

export const getEventTableRows = ({ families, documentEventsOnly = false, showDocumentName = false }: IProps): TEventTableRow[] => {
  const rows: TEventTableRow[] = [];

  families.forEach((family) =>
    getFamilyEvents(family).forEach(({ event, document }) => {
      if (documentEventsOnly && !document) return;

      const date = new Date(event.date);

      rows.push({
        id: [family.import_id, event.import_id].join("/"),
        cells: {
          date: {
            display: formatDateShort(date),
            value: date.getTime(),
          },
          type: event.event_type,
          action: event.status,
          document: document
            ? {
                display: (
                  <LinkWithQuery href={`/documents/${document.slug}`} className="underline">
                    {showDocumentName ? document.title : "View"}
                  </LinkWithQuery>
                ),
                value: document.slug,
              }
            : null,
          summary: event.metadata.description?.[0] || null,
        },
      });
    })
  );

  return rows;
};
