import { LucideScrollText, LucideTable } from "lucide-react";
import { useMemo, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Card } from "@/components/atoms/card/Card";
import { DocumentCard } from "@/components/molecules/documentCard/DocumentCard";
import { Section } from "@/components/molecules/section/Section";
import { Toggle } from "@/components/molecules/toggleGroup/Toggle";
import { ToggleGroup } from "@/components/molecules/toggleGroup/ToggleGroup";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyPublic, TGeography, TLoadingStatus, TMatchedFamily } from "@/types";
import { getEventTableColumns, getEventTableRows, TEventTableColumnId } from "@/utils/eventTable";

interface IProps {
  countries: TGeography[];
  family: TFamilyPublic;
  matchesFamily?: TMatchedFamily; // The relevant search result family
  matchesStatus?: TLoadingStatus; // The status of the search
  showMatches?: boolean; // Whether to show matches from the search result
}

export const DocumentsBlock = ({ countries, family, matchesFamily, matchesStatus, showMatches = false }: IProps) => {
  const [view, setView] = useState("table");

  const isUSA = family.geographies.includes("USA");
  const tableColumns = useMemo(() => getEventTableColumns({ isUSA, showMatches }), [isUSA, showMatches]);
  const tableRows = useMemo(
    () => getEventTableRows({ families: [family], documentEventsOnly: true, matchesFamily, matchesStatus }),
    [family, matchesFamily, matchesStatus]
  );

  const onToggleChange = (toggleValue: string[]) => {
    setView(toggleValue[0]);
  };

  return (
    <Section id="section-documents" title="Documents">
      <Card variant="outlined" className="flex flex-col rounded-lg !p-5">
        {/* Controls */}
        <div className="pb-6">
          <ToggleGroup value={[view]} onValueChange={onToggleChange}>
            <Toggle value="table">Table</Toggle>
            <Toggle value="cards">Cards</Toggle>
          </ToggleGroup>
        </div>

        {/* Cards TODO */}
        {view === "card" && (
          <div className="flex flex-col gap-4">
            {family.documents.map((document) => (
              <LinkWithQuery key={document.slug} href={`/documents/${document.slug}`}>
                <DocumentCard countries={countries} document={document} family={family} />
              </LinkWithQuery>
            ))}
          </div>
        )}

        {/* Table */}
        {view === "table" && (
          <InteractiveTable<TEventTableColumnId> columns={tableColumns} rows={tableRows} defaultSort={{ column: "date", ascending: false }} />
        )}
      </Card>
    </Section>
  );
};
