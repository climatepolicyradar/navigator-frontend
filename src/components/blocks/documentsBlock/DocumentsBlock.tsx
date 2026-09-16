import { LucideInfo } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { DocumentDrawer } from "@/components/drawers/documentDrawer/DocumentDrawer";
import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TCategoryDictionaryKey } from "@/constants/text";
import { SearchLevelContext } from "@/context/SearchLevelContext";
import { useNestedSearchLevel, useSearchLevelValues } from "@/hooks/useSearchLevel";
import { IFamilyDocumentTopics, TFamilyPublic, TFeatures, TLanguages, TLoadingStatus, TMatchedFamily } from "@/types";
import { getEventTableColumns, getEventTableRows, TEventTableColumnId, TEventTableRow } from "@/utils/eventTable";
import { seedPassageLevel } from "@/utils/search/searchLevels";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

interface IProps {
  family: TFamilyPublic;
  familyTopics?: IFamilyDocumentTopics | null;
  features: TFeatures;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
  languages: TLanguages;
  matchesFamily?: TMatchedFamily; // The relevant search result family
  matchesStatus?: TLoadingStatus; // The status of the search
  showMatches?: boolean; // Whether to show matches from the search result
}

export const DocumentsBlock = ({
  family,
  familyTopics,
  features,
  getCategoryText,
  languages,
  matchesFamily,
  matchesStatus,
  showMatches = false,
}: IProps) => {
  const [updatedRowsWithLocalisedDates, setUpdatedRowsWithLocalisedDates] = useState<TEventTableRow[]>(null);
  // Ensure we have the latest search controls when opening the drawer
  const enclosingLevel = useContext(SearchLevelContext);
  const [enclosingSearch] = useSearchLevelValues(enclosingLevel);
  const { close: closeDocumentLevel, id: documentLevelId, open: openDocumentLevel } = useNestedSearchLevel("document");
  const [lastDocumentDrawerId, setLastDocumentDrawerId] = useState<string | null>(null); // Keeps the document in the drawer while it closes

  const onRowClick = useCallback(
    (rowId: string) => {
      // the table is keyed by import id but the drawer is addressed by slugs
      // so the url matches the document pages
      const importId = rowId.split(":")[0];
      const slug = family.documents.find((document) => document.import_id === importId)?.slug;
      if (!slug) return;

      setLastDocumentDrawerId(slug);
      openDocumentLevel(slug, seedPassageLevel(enclosingSearch));
    },
    [enclosingSearch, family.documents, openDocumentLevel]
  );

  const onDocumentDrawerOpenChange = (open: boolean) => {
    if (!open) closeDocumentLevel();
  };

  const isLitigation = family.attribution.category === "Litigation";

  const tableColumns = useMemo(
    () =>
      getEventTableColumns({
        hasTopics: familyTopicsHasTopics(familyTopics),
        isLitigation,
        showMatches: showMatches && !features["new-search"],
      }),
    [familyTopics, features, isLitigation, showMatches]
  );
  const tableRows = useMemo(
    () =>
      getEventTableRows({
        documentEventsOnly: true,
        documentRowClick: onRowClick,
        families: [family],
        familyTopics,
        features,
        isLitigation,
        languages,
        matchesFamily,
        matchesStatus,
      }),
    [family, familyTopics, features, isLitigation, languages, matchesFamily, matchesStatus, onRowClick]
  );

  // If the case is new, there can be one placeholder document with no events. Handle this interim state
  // @related LITIGATION_PLACEHOLDER
  const hasDocumentsToDisplay = tableRows.length > 0;

  useEffect(() => {
    const language = navigator?.language;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUpdatedRowsWithLocalisedDates(
      getEventTableRows({
        documentEventsOnly: true,
        documentRowClick: onRowClick,
        families: [family],
        familyTopics,
        features,
        isLitigation,
        language,
        languages,
        matchesFamily,
        matchesStatus,
      })
    );
  }, [family, familyTopics, features, isLitigation, languages, matchesFamily, matchesStatus, onRowClick]);

  return (
    <Section block="documents" title="Documents" wide>
      <div className="col-start-1 -col-end-1">
        {hasDocumentsToDisplay && (
          <>
            <div className="pb-6 flex gap-1">
              <LucideInfo size={16} className="pt-1 h-full shrink-0 text-text-brand" />
              <p>Each {getCategoryText("familySingular")} in our database can contain one or more documents.</p>
            </div>
            <InteractiveTable<TEventTableColumnId>
              columns={tableColumns}
              rows={updatedRowsWithLocalisedDates || tableRows}
              defaultSort={{ column: isLitigation ? "date" : "document", order: "desc" }}
              tableClasses={isLitigation ? "min-w-250" : "min-w-200"}
            />
          </>
        )}
        {!hasDocumentsToDisplay && <p className="italic">There are no documents to display yet. Check back later.</p>}
      </div>

      <DocumentDrawer
        documentSlug={documentLevelId ?? lastDocumentDrawerId}
        family={family}
        familyTopics={familyTopics}
        languages={languages}
        onOpenChange={onDocumentDrawerOpenChange}
        open={!!documentLevelId}
      />
    </Section>
  );
};
