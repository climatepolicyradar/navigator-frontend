import { useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyPublic } from "@/types";
import { getEventTableColumns, getEventTableRows, TEventTableColumnId } from "@/utils/eventTable";

const MAX_ENTRIES_SHOWN = 8;

interface IProps {
  families: TFamilyPublic[];
  language: string;
}

export const EventsBlock = ({ families, language }: IProps) => {
  const [showAllEntries, setShowAllEntries] = useState(false);

  const tableColumns = getEventTableColumns({ showFamilyColumns: true });
  const tableRows = getEventTableRows({ families, language });
  const entriesToHide = tableRows.length > MAX_ENTRIES_SHOWN;

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  return (
    <div className="relative">
      <Card variant="outlined" className="rounded-lg !p-5">
        <h2 className="text-xl text-text-primary font-semibold leading-tight">Procedural history</h2>
        <InteractiveTable<TEventTableColumnId>
          columns={tableColumns}
          defaultSort={{ column: "date", ascending: false }}
          rows={tableRows}
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
