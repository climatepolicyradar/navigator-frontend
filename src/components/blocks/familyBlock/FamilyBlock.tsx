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

  const isUSA = family.geographies.includes("USA");
  const tableColumns = useMemo(() => getEventTableColumns({ isUSA }), [isUSA]);
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
    <Section id={`section-${family.slug}`}>
      <div className="relative">
        <Card variant="outlined" className="rounded-lg !p-5">
          <LinkWithQuery href={`/document/${family.slug}`}>
            <h2 className="text-xl text-text-primary font-semibold leading-tight hover:underline">
              {family.title}&nbsp;
              <span className="text-lg text-text-brand">↗</span>
            </h2>
          </LinkWithQuery>
          <div className="mt-2 flex gap-4 flex-wrap text-sm text-text-tertiary leading-none">
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
            tableClasses="pt-8"
          />
        </Card>
        {entriesToHide && (
          <Button color="mono" size="small" rounded onClick={toggleShowAll} className="absolute -bottom-4 left-5">
            {showAllEntries ? "Show less" : "Show all"}
          </Button>
        )}
      </div>
    </Section>
  );
};
