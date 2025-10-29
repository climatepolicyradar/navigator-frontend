import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyPublic } from "@/types";
import { getEventTableColumns, getEventTableRows, TEventTableColumnId, TEventTableRow } from "@/utils/eventTable";

const MAX_ENTRIES_SHOWN = 8;

interface IProps {
  families: TFamilyPublic[];
}

export const EventsBlock = ({ families }: IProps) => {
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [updatedRowsWithLocalisedDates, setUpdatedRowsWithLocalisedDates] = useState<TEventTableRow[]>(null);

  const tableColumns = getEventTableColumns({ showFamilyColumns: true });
  const tableRows = getEventTableRows({ families });
  const entriesToHide = tableRows.length > MAX_ENTRIES_SHOWN;

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  useEffect(() => {
    const language = navigator?.language;

    setUpdatedRowsWithLocalisedDates(getEventTableRows({ families, language }));
  }, [families]);

  return (
    <div className="relative col-start-1 -col-end-1">
      <Card variant="outlined" className="rounded-lg !p-5">
        <h2 className="text-xl text-text-primary font-semibold leading-tight">Procedural history</h2>
        <InteractiveTable<TEventTableColumnId>
          columns={tableColumns}
          defaultSort={{ column: "date", order: "desc" }}
          rows={updatedRowsWithLocalisedDates || tableRows}
          maxRows={showAllEntries ? 0 : MAX_ENTRIES_SHOWN}
          tableClasses="pt-8"
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
