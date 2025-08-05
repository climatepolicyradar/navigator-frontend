import { useMemo, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { getEventsWithDocuments, TABLE_COLUMNS, TTableColumn } from "@/components/blocks/familyBlock/FamilyBlock";
import { IInteractiveTableRow, InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyPublic } from "@/types";
import { formatDateShort } from "@/utils/timedate";

const MAX_ENTRIES_SHOWN = 8;

interface IProps {
  families: TFamilyPublic[];
  showValues?: boolean; // Debug mode for understanding table sorting
}

export const EventsBlock = ({ families, showValues = false }: IProps) => {
  const [showAllEntries, setShowAllEntries] = useState(false);

  const tableRows: IInteractiveTableRow<TTableColumn>[] = useMemo(
    () =>
      getEventsWithDocuments(families).map(({ event, document }, eventIndex) => {
        const date = new Date(event.date);

        return {
          id: `${eventIndex}`, // TODO replace with event.id once added
          cells: {
            date: {
              display: formatDateShort(date),
              value: date.getTime(),
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
            summary: event.metadata.description?.[0] || null, // TODO handle long descriptions
          },
        };
      }),
    [families]
  );

  const entriesToHide = tableRows.length > MAX_ENTRIES_SHOWN;

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  return (
    <div className="relative">
      <Card variant="outlined" className="rounded-lg !p-5">
        <h2 className="text-xl text-text-primary font-semibold leading-tight">Events</h2>
        <InteractiveTable<TTableColumn>
          columns={TABLE_COLUMNS}
          defaultSort={{ column: "date", ascending: false }}
          rows={tableRows}
          maxRows={showAllEntries ? 0 : MAX_ENTRIES_SHOWN}
          tableClasses="pt-8"
          showValues={showValues}
        />
      </Card>
      {entriesToHide && (
        <Button color="mono" size="small" rounded onClick={toggleShowAll} className="absolute -bottom-4 left-5">
          {showAllEntries ? "Show less" : "Show all"}
        </Button>
      )}
    </div>
  );
};
