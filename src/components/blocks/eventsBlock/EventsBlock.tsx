import { useEffect, useState } from "react";

import { Section } from "@/components/molecules/section/Section";
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

  const tableColumns = getEventTableColumns({ isLitigation: true, showFamilyColumns: true });
  const tableRows = getEventTableRows({ families, isLitigation: true });
  const entriesToHide = tableRows.length > MAX_ENTRIES_SHOWN;

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  useEffect(() => {
    const language = navigator?.language;

    setUpdatedRowsWithLocalisedDates(getEventTableRows({ families, language, isLitigation: true }));
  }, [families]);

  return (
    <Section block="events" title="Procedural history" wide>
      <div className="col-start-1 -col-end-1">
        <InteractiveTable<TEventTableColumnId>
          columns={tableColumns}
          defaultSort={{ column: "date", order: "desc" }}
          rows={updatedRowsWithLocalisedDates || tableRows}
          maxRows={showAllEntries ? 0 : MAX_ENTRIES_SHOWN}
        />
        {true && (
          <button
            type="button"
            onClick={toggleShowAll}
            className="p-2 mt-3 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 leading-4 font-medium"
          >
            {showAllEntries ? "View less" : "View more"}
          </button>
        )}
      </div>
    </Section>
  );
};
