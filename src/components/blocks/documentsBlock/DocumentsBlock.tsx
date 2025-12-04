import { useEffect, useMemo, useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { TutorialCard } from "@/components/molecules/tutorials/TutorialCard";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TUTORIALS } from "@/constants/tutorials";
import { IFamilyDocumentTopics, TFamilyPublic, TLanguages, TLoadingStatus, TMatchedFamily } from "@/types";
import { getEventTableColumns, getEventTableRows, TEventTableColumnId, TEventTableRow } from "@/utils/eventTable";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

interface IProps {
  family: TFamilyPublic;
  familyTopics?: IFamilyDocumentTopics;
  languages: TLanguages;
  matchesFamily?: TMatchedFamily; // The relevant search result family
  matchesStatus?: TLoadingStatus; // The status of the search
  onClickRow: (rowData: string) => void;
  showKnowledgeGraphTutorial: boolean;
  showMatches?: boolean; // Whether to show matches from the search result
}

export const DocumentsBlock = ({
  family,
  familyTopics,
  languages,
  matchesFamily,
  matchesStatus,
  onClickRow,
  showKnowledgeGraphTutorial,
  showMatches = false,
}: IProps) => {
  const [updatedRowsWithLocalisedDates, setUpdatedRowsWithLocalisedDates] = useState<TEventTableRow[]>(null);

  const isLitigation = family.corpus_type_name === "Litigation";
  const isUSA = family.geographies.includes("USA");

  const tableColumns = useMemo(
    () => getEventTableColumns({ hasTopics: familyTopicsHasTopics(familyTopics), isLitigation, isUSA, showMatches }),
    [familyTopics, isLitigation, isUSA, showMatches]
  );
  const tableRows = useMemo(
    () =>
      getEventTableRows({
        documentEventsOnly: true,
        documentRowClick: (rowId) => onClickRow(rowId),
        families: [family],
        familyTopics,
        isLitigation,
        languages,
        matchesFamily,
        matchesStatus,
      }),
    [family, familyTopics, isLitigation, languages, matchesFamily, matchesStatus, onClickRow]
  );

  // If the case is new, there can be one placeholder document with no events. Handle this interim state
  const hasDocumentsToDisplay = tableRows.length > 0;

  useEffect(() => {
    const language = navigator?.language;
    setUpdatedRowsWithLocalisedDates(
      getEventTableRows({
        documentEventsOnly: true,
        documentRowClick: (rowId) => onClickRow(rowId),
        families: [family],
        familyTopics,
        isLitigation,
        language,
        languages,
        matchesFamily,
        matchesStatus,
      })
    );
  }, [family, familyTopics, isLitigation, languages, matchesFamily, matchesStatus, onClickRow]);

  return (
    <Section block="documents" title="Documents" wide>
      {showKnowledgeGraphTutorial && (
        <TutorialCard name="knowledgeGraph" card={TUTORIALS.knowledgeGraph.card} className="col-start-1 -col-end-1 cols5-5:-col-end-3 mb-4" />
      )}

      <div className="col-start-1 -col-end-1">
        {hasDocumentsToDisplay && (
          <InteractiveTable<TEventTableColumnId>
            columns={tableColumns}
            rows={updatedRowsWithLocalisedDates || tableRows}
            defaultSort={{ column: isLitigation ? "date" : "document", order: "desc" }}
            tableClasses={isLitigation ? "min-w-250" : "min-w-200"}
          />
        )}
        {!hasDocumentsToDisplay && <p className="italic">There are no documents to display yet. Check back later.</p>}
      </div>
    </Section>
  );
};
