import orderBy from "lodash/orderBy";
import { useMemo, useState } from "react";

import { Card } from "@/components/atoms/card/Card";
import { EntityCard, IProps as IEntityCardProps } from "@/components/molecules/entityCard/EntityCard";
import { Section } from "@/components/molecules/section/Section";
import { Toggle } from "@/components/molecules/toggleGroup/Toggle";
import { ToggleGroup } from "@/components/molecules/toggleGroup/ToggleGroup";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { getCategoryName } from "@/helpers/getCategoryName";
import { TFamilyDocumentPublic, TFamilyPublic, TGeography, TLoadingStatus, TMatchedFamily } from "@/types";
import { getEventTableColumns, getEventTableRows, TEventTableColumnId } from "@/utils/eventTable";
import { formatDate } from "@/utils/timedate";

const getOldestEventDate = (document: TFamilyDocumentPublic) => document.events.map((event) => event.date).sort()[0];

interface IProps {
  family: TFamilyPublic;
  matchesFamily?: TMatchedFamily; // The relevant search result family
  matchesStatus?: TLoadingStatus; // The status of the search
  showMatches?: boolean; // Whether to show matches from the search result
}

export const DocumentsBlock = ({ family, matchesFamily, matchesStatus, showMatches = false }: IProps) => {
  const [view, setView] = useState("table");

  const isUSA = family.geographies.includes("USA");
  const category = getCategoryName(family.category, family.corpus_type_name, family.organisation);

  const tableColumns = useMemo(() => getEventTableColumns({ isUSA, showMatches }), [isUSA, showMatches]);
  const tableRows = useMemo(
    () => getEventTableRows({ families: [family], documentEventsOnly: true, matchesFamily, matchesStatus }),
    [family, matchesFamily, matchesStatus]
  );

  const cards: IEntityCardProps[] = useMemo(
    () =>
      orderBy(family.documents, [getOldestEventDate], ["desc"]).map((document) => {
        return {
          title: document.title,
          metadata: [category, formatDate(getOldestEventDate(document))[0]],
          href: `/documents/${document.slug}`,
        };
      }),
    [category, family]
  );

  // If the case is new, there can be one placeholder document with no events. Handle this interim state
  const hasDocumentsToDisplay = tableRows.length > 0;

  const onToggleChange = (toggleValue: string[]) => {
    setView(toggleValue[0]);
  };

  return (
    <Section block="documents" title="Documents">
      {hasDocumentsToDisplay && (
        <Card variant="outlined" className="flex flex-col rounded-lg !p-5">
          {/* Controls */}
          <div className="pb-6">
            <ToggleGroup value={[view]} onValueChange={onToggleChange}>
              <Toggle value="table">Table</Toggle>
              <Toggle value="cards">Cards</Toggle>
            </ToggleGroup>
          </div>

          {/* Cards */}
          {view === "cards" && (
            <div className="flex gap-5 items-stretch overflow-x-auto pb-2">
              {cards.map((card) => (
                <EntityCard key={card.href} {...card} />
              ))}
            </div>
          )}

          {/* Table */}
          {view === "table" && (
            <InteractiveTable<TEventTableColumnId> columns={tableColumns} rows={tableRows} defaultSort={{ column: "date", ascending: false }} />
          )}
        </Card>
      )}
      {!hasDocumentsToDisplay && <p className="italic">There are no documents to display yet. Check back later.</p>}
    </Section>
  );
};
