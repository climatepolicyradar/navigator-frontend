import { useMemo, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { Section } from "@/components/molecules/section/Section";
import { IInteractiveTableColumn, IInteractiveTableRow, InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TDocumentNew, TEvent, TFamilyNew } from "@/types";
import { pluralise } from "@/utils/pluralise";
import { formatDateShort } from "@/utils/timedate";

type TEventAndDocument = {
  event: TEvent;
  document?: TDocumentNew;
};

export const getEventId = (event: TEvent) => [event.title, event.event_type, event.date].join("-");

// Matches documents up to events (inversion of API response shape)
export const getEventsAndDocuments = (family: TFamilyNew): TEventAndDocument[] => {
  const eventsWithDocuments: TEventAndDocument[] = family.documents.map((doc) => doc.events.map((event) => ({ event, document: doc }))).flat();

  return family.events.map((event) => {
    const eventWithDocument = eventsWithDocuments.find((pair) => getEventId(event) === getEventId(pair.event));

    return eventWithDocument || { event };
  });
};

type TTableColumn = "date" | "type" | "action" | "document" | "summary";
const TABLE_COLUMNS: IInteractiveTableColumn<TTableColumn>[] = [
  { id: "date", name: "Filing Date", fraction: 2 },
  { id: "type", fraction: 3 },
  { id: "action", name: "Action taken", fraction: 4 },
  { id: "document" },
  { id: "summary", fraction: 4 },
];
const MAX_ENTRIES_SHOWN = 4;

interface IProps {
  family: TFamilyNew;
}

export const FamilyBlock = ({ family }: IProps) => {
  const [showAllEntries, setShowAllEntries] = useState(false);

  const tableRows: IInteractiveTableRow<TTableColumn>[] = useMemo(
    () =>
      getEventsAndDocuments(family).map(({ event, document }) => {
        const date = new Date(event.date);

        return {
          id: getEventId(event),
          cells: {
            date: {
              display: formatDateShort(date),
              value: date.getUTCSeconds(),
            },
            type: event.event_type,
            action: event.title,
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
            summary: event.metadata.description?.[0] ?? null,
          },
        };
      }),
    [family]
  );

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  return (
    <Section id={`section-${family.slug}`}>
      <div className="relative">
        <Card variant="outlined" className="rounded-lg !p-5">
          <LinkWithQuery href={`/document/${family.slug}`}>
            <h2 className="text-xl text-text-primary font-semibold leading-tight hover:underline">
              {family.title}&nbsp;
              <span className="text-base text-text-brand">↗</span>
            </h2>
          </LinkWithQuery>
          <div className="mt-2 flex gap-4 flex-wrap text-sm text-text-tertiary leading-none">
            <span>
              {tableRows.length} {pluralise(tableRows.length, "entry", "entries")}
            </span>
          </div>
          <InteractiveTable<TTableColumn> columns={TABLE_COLUMNS} rows={tableRows} tableClasses="pt-8" />
        </Card>
        <Button color="mono" size="small" rounded onClick={toggleShowAll} className="absolute -bottom-4 left-5">
          {showAllEntries ? "Show less" : "Show all"}
        </Button>
      </div>
    </Section>
  );
};
