import { useMemo, useState } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Button } from "@/components/atoms/button/Button";
import { Card } from "@/components/atoms/card/Card";
import { Section } from "@/components/molecules/section/Section";
import { IInteractiveTableColumn, IInteractiveTableRow, InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TFamilyPage } from "@/types";
import { pluralise } from "@/utils/pluralise";

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
  family: TFamilyPage;
}

export const FamilyBlock = ({ family }: IProps) => {
  const [showAllEntries, setShowAllEntries] = useState(false);
  const { documents } = family;

  const documentsToHide = documents.length > MAX_ENTRIES_SHOWN;

  const toggleShowAll = () => {
    setShowAllEntries((current) => !current);
  };

  const formatDate = (date: Date): string => {
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(navigator?.language ?? "en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const tableRows: IInteractiveTableRow<TTableColumn>[] = useMemo(() => {
    if (documents.length === 0) return [];

    const shownDocuments = documentsToHide && !showAllEntries ? documents.slice(0, 4) : documents;

    return shownDocuments.map((doc) => ({
      id: doc.slug,
      cells: {
        date: formatDate(new Date(family.published_date)),
        type: doc.document_type,
        action: "Action taken",
        document: {
          display: (
            <LinkWithQuery href={`/documents/${doc.slug}`} className="underline">
              View
            </LinkWithQuery>
          ),
          value: doc.slug,
        },
        summary: "Summary",
      },
    }));
  }, [documents, documentsToHide, family.published_date, showAllEntries]);

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
              {documents.length} {pluralise(documents.length, "entry", "entries")}
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
