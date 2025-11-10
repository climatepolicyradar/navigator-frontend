import { useEffect, useMemo, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyPublic } from "@/types";
import { getCaseNumbers, getCourts, getEventTableColumns, getEventTableRows, TEventTableColumnId, TEventTableRow } from "@/utils/eventTable";
import { pluralise } from "@/utils/pluralise";

const MAX_ENTRIES_SHOWN = 4;

interface IProps {
  family: TFamilyPublic;
}

export const FamilyBlock = ({ family }: IProps) => {
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [updatedRowsWithLocalisedDates, setUpdatedRowsWithLocalisedDates] = useState<TEventTableRow[]>(null);

  const isLitigation = family.corpus_type_name === "Litigation";
  const isUSA = family.geographies.includes("USA");

  const tableColumns = useMemo(() => getEventTableColumns({ isLitigation, isUSA }), [isLitigation, isUSA]);
  const tableRows = useMemo(() => getEventTableRows({ families: [family] }), [family]);
  const entriesToHide = tableRows.length > MAX_ENTRIES_SHOWN;

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  const caseNumbers = getCaseNumbers(family);
  const courts = getCourts(family);

  useEffect(() => {
    const language = navigator?.language;

    setUpdatedRowsWithLocalisedDates(getEventTableRows({ families: [family], language }));
  }, [family]);

  return (
    <Section id={`section-${family.slug}`} wide>
      <div className="col-start-1 -col-end-1">
        <LinkWithQuery href={`/document/${family.slug}`}>
          <h2 className="text-2xl text-gray-950 font-heavy leading-tight hover:underline underline-offset-6">
            {family.title}&nbsp;
            <span className="text-brand">↗</span>
          </h2>
        </LinkWithQuery>
        <div className="mt-2 mb-3 flex gap-4 flex-wrap text-sm text-gray-500 leading-none">
          {caseNumbers && <span>{caseNumbers}</span>}
          {courts && <span>{courts}</span>}
          <span>
            {tableRows.length} {pluralise(tableRows.length, ["entry", "entries"])}
          </span>
        </div>
        <InteractiveTable<TEventTableColumnId>
          columns={tableColumns}
          defaultSort={{ column: "date", order: "desc" }}
          rows={updatedRowsWithLocalisedDates || tableRows}
          maxRows={showAllEntries ? 0 : MAX_ENTRIES_SHOWN}
        />
        {entriesToHide && (
          <button
            type="button"
            onClick={toggleShowAll}
            className="p-2 mt-2 hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 leading-4 font-medium"
          >
            {showAllEntries ? "Show less" : "Show all"}
          </button>
        )}
      </div>
    </Section>
  );
};
