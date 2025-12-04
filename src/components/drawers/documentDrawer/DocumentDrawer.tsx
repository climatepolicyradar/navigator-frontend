import { Fragment } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { ARROW_RIGHT } from "@/constants/chars";
import { getLanguage } from "@/helpers/getLanguage";
import { IFamilyDocumentTopics, IMetadata, TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic, TLanguages } from "@/types";
import { getFamilyEvents } from "@/utils/eventTable";
import { DOCUMENT_DRAWER_TOPICS_TABLE_COLUMNS, getDocumentDrawerTopicTableRow } from "@/utils/tables/topic/documentDrawerTopicTable";
import { TTopicTableColumnId, TTopicTableRow } from "@/utils/tables/topic/topicTable";
import { firstCase } from "@/utils/text";
import { formatDateShort } from "@/utils/timedate";

interface IProps {
  documentImportId: string | null; // The currently displayed document
  family: TFamilyPublic;
  familyTopics?: IFamilyDocumentTopics;
  languages: TLanguages;
  onOpenChange: (open: boolean) => void; // Triggered each time the drawer is opened or closed
  open: boolean; // Whether the drawer is currently open. Necessitates useState
}

export const DocumentDrawer = ({ documentImportId, family, familyTopics, languages, onOpenChange, open }: IProps) => {
  /* Get the document and its associated event if present */

  let document: TFamilyDocumentPublic | null = null;
  let event: TFamilyEventPublic | null = null;

  if (family.corpus_type_name === "Litigation") {
    const eventAndDocument = getFamilyEvents(family).find((row) => row.document?.import_id === documentImportId);
    if (eventAndDocument) {
      document = eventAndDocument.document;
      event = eventAndDocument.event;
    }
  } else {
    document = family.documents.find((doc) => doc.import_id === documentImportId);
  }

  /* Return an empty drawer if there is no matching document (zero state, ensures drawer is always rendered) */

  if (!document) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Document">
        {null}
      </Drawer>
    );
  }

  /* Metadata */

  const metadata: IMetadata[] = [];
  const isLitigation = family.corpus_type_name === "Litigation";

  if (isLitigation && event) {
    metadata.push({ label: "Filing date", value: formatDateShort(new Date(event.date)) }, { label: "Type", value: event.event_type });
    if (event.metadata.action_taken?.[0]) {
      metadata.push({ label: "Action taken", value: event.metadata.action_taken?.[0] });
    }
    if (event.metadata.description?.[0]) {
      metadata.push({
        label: "Summary",
        value: <ViewMore maxLines={5}>{event.metadata.description?.[0]}</ViewMore>,
      });
    }
  } else if (!isLitigation) {
    if (document.document_role) {
      metadata.push({
        label: "Role",
        value: firstCase(document.document_role.toLowerCase()) + (document.document_role.toLowerCase().includes("main") ? " document" : ""),
      });
    }
    if (document.document_type) metadata.push({ label: "Type", value: document.document_type });
    if (document.language) {
      metadata.push({
        label: "Language",
        value: getLanguage(document.language, languages) + (document.variant ? ` (${document.variant})` : ""),
      });
    }
  }

  /* Topics */

  let topicRows: TTopicTableRow[] = [];
  if (familyTopics) topicRows = getDocumentDrawerTopicTableRow(familyTopics, documentImportId);

  /* Render */

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={document.title}>
      {metadata.length > 0 && (
        <div className="grid grid-cols-[120px_auto] gap-x-3 gap-y-2 mb-6 text-sm text-gray-700 leading-5">
          {metadata.map((item, itemIndex) => (
            <Fragment key={itemIndex}>
              <div className="font-medium">{item.label}</div>
              <div>{item.value}</div>
            </Fragment>
          ))}
        </div>
      )}

      <PageLink keepQuery href={"/documents/" + document.slug}>
        <button type="button" className="px-3 py-2 bg-brand rounded-sm text-sm text-white font-medium leading-5">
          Go to document {ARROW_RIGHT}
        </button>
      </PageLink>

      {topicRows.length > 0 && (
        <div className="mt-9">
          <h3 className="mt-6 mb-5 text-lg text-gray-950 font-heavy leading-6">Topics mentioned in this document</h3>
          <InteractiveTable<TTopicTableColumnId> columns={DOCUMENT_DRAWER_TOPICS_TABLE_COLUMNS} rows={topicRows} />
        </div>
      )}
    </Drawer>
  );
};
