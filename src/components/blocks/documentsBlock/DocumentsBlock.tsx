import { LucideScrollText, LucideTable } from "lucide-react";
import { useMemo, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Card } from "@/components/atoms/card/Card";
import { Section } from "@/components/molecules/section/Section";
import { Toggle } from "@/components/molecules/toggleGroup/Toggle";
import { ToggleGroup } from "@/components/molecules/toggleGroup/ToggleGroup";
import { InteractiveTable, IInteractiveTableColumn, IInteractiveTableRow } from "@/components/organisms/interactiveTable/InteractiveTable";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName } from "@/helpers/getCountryFields";
import useConfig from "@/hooks/useConfig";
import { TDocumentPage, TFamily, TFamilyPage, TLoadingStatus } from "@/types";
import { convertDate } from "@/utils/timedate";

type TTableColumn = "year" | "geography" | "type" | "document";
const TABLE_COLUMNS: IInteractiveTableColumn<TTableColumn>[] = [
  { id: "year" },
  { id: "geography", fraction: 2 },
  { id: "type", fraction: 2 },
  { id: "document", fraction: 4 },
];

interface IProps {
  documents: (TDocumentPage & { matches?: number })[];
  family: TFamilyPage;
  status: TLoadingStatus;
}

export const DocumentsBlock = ({ documents, family }: IProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  const [view, setView] = useState("card");

  const onToggleChange = (toggleValue: string[]) => {
    setView(toggleValue[0]);
  };

  const [year] = convertDate(family.published_date);
  const categoryName = getCategoryName(family.category, family.corpus_type_name, family.organisation);

  const tableRows: IInteractiveTableRow<TTableColumn>[] = useMemo(() => {
    if (documents.length === 0) return [];

    return documents.map((doc) => {
      return {
        id: doc.slug,
        cells: {
          year,
          geography: family.geographies.map((geo) => getCountryName(geo, countries)).join(", "),
          type: categoryName,
          document: {
            display: <LinkWithQuery href={`/documents/${doc.slug}`}>{doc.title}</LinkWithQuery>,
            value: doc.title,
          },
        },
      };
    });
  }, [categoryName, countries, documents, family, year]);

  return (
    <Section id="section-documents" title="Documents">
      <Card variant="outlined" className="flex flex-col rounded-lg !p-5">
        {/* Controls */}
        <div className="pb-6">
          <ToggleGroup value={[view]} onValueChange={onToggleChange}>
            <Toggle Icon={LucideScrollText} text="Card" value="card" />
            <Toggle Icon={LucideTable} text="Table" value="table" />
          </ToggleGroup>
        </div>

        {/* Cards TODO */}

        {/* Table */}
        {view === "table" && <InteractiveTable columns={TABLE_COLUMNS} rows={tableRows} />}
      </Card>
    </Section>
  );
};
