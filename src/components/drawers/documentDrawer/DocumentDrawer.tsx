import { Loader, LucideExternalLink } from "lucide-react";
import { Fragment, useContext } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { PassageSearch } from "@/components/organisms/passageSearch/PassageSearch";
import { FeaturesContext } from "@/context/FeaturesContext";
import { getLanguage } from "@/helpers/getLanguage";
import { IFamilyDocumentTopics, IMetadata, TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic, TLanguages } from "@/types";
import { getEventTableRowsData } from "@/utils/eventTable";
import { DOCUMENT_DRAWER_TOPICS_TABLE_COLUMNS, getDocumentDrawerTopicTableRows } from "@/utils/tables/topic/documentDrawerTopicTable";
import { TTopicTableColumnId, TTopicTableRow } from "@/utils/tables/topic/topicTable";
import { firstCase } from "@/utils/text";
import { formatDateShort } from "@/utils/timedate";
import { getTopFamilyDocumentTopics } from "@/utils/topics/getTopFamilyDocumentTopics";

interface IProps {
  documentImportId: string | null;
  family: TFamilyPublic;
  familyTopics?: IFamilyDocumentTopics | null;
  languages: TLanguages;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const DocumentDrawer = ({ documentImportId, family, familyTopics, languages, onOpenChange, open }: IProps) => {
  const features = useContext(FeaturesContext);

  const isLitigation = family.attribution.category === "Litigation";

  /* Get the document and its associated event if present */
  let document: TFamilyDocumentPublic | null = null;
  let event: TFamilyEventPublic | null = null;

  if (isLitigation) {
    const eventAndDocument = getEventTableRowsData(family).find((row) => row.document?.import_id === documentImportId);
    if (eventAndDocument) {
      document = eventAndDocument.document;
      event = eventAndDocument.event;
    }
  } else {
    document = family.documents.find((doc) => doc.import_id === documentImportId);
  }

  /* Return an empty drawer if there is no matching document */
  if (!document) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Document" wide>
        <Loader height="18" width="18" className="animate-spin" />
      </Drawer>
    );
  }

  const metadata: IMetadata[] = [];

  if (isLitigation && event) {
    metadata.push({ label: "Filing date", value: formatDateShort(new Date(event.date)) }, { label: "Type", value: event.event_type });
    if (event.metadata.action_taken?.[0]) {
      metadata.push({ label: "Action taken", value: event.metadata.action_taken?.[0] });
    }
    if (event.metadata.description?.[0]) {
      metadata.push({
        label: "Summary",
        value: (
          <ViewMore context="document-drawer" maxLines={5} buttonText={["Read more", "Read less"]}>
            {event.metadata.description?.[0]}
          </ViewMore>
        ),
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

  let topicRows: TTopicTableRow[] = [];
  if (familyTopics) topicRows = getDocumentDrawerTopicTableRows(familyTopics, documentImportId);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        document.slug ? (
          <span className="block pt-5">
            <PageLink keepQuery href={"/documents/" + document.slug} className="text-3xl text-inky-blue underline-offset-5 hover:underline">
              {document.title}
            </PageLink>
          </span>
        ) : (
          document.title
        )
      }
      titleExtras={
        document.slug ? (
          <PageLink external keepQuery href={"/documents/" + document.slug} className="text-neutral-500 hover:text-neutral-800 justify-end">
            <LucideExternalLink width={20} height={20} />
          </PageLink>
        ) : undefined
      }
      wide
    >
      {features["new-search"] ? (
        <>
          <PassageSearch documents={[document]} concepts={getTopFamilyDocumentTopics(familyTopics, documentImportId)} subject="this document" />
        </>
      ) : (
        <>
          {metadata.length > 0 && (
            <div className="grid grid-cols-[120px_auto] gap-x-3 gap-y-2 mb-6 text-sm text-text-secondary leading-5">
              {metadata.map((item, itemIndex) => (
                <Fragment key={itemIndex}>
                  <div className="font-medium">{item.label}</div>
                  <div className="select-text">{item.value}</div>
                </Fragment>
              ))}
            </div>
          )}

          {topicRows.length > 0 && (
            <div className="mt-9">
              <h3 className="mt-6 mb-2 text-lg text-text-primary font-heavy leading-6">Topics mentioned</h3>
              <p className="mb-4">See exactly where a topic is mentioned in this document.</p>
              <InteractiveTable<TTopicTableColumnId> columns={DOCUMENT_DRAWER_TOPICS_TABLE_COLUMNS} rows={topicRows} />
            </div>
          )}
        </>
      )}
    </Drawer>
  );
};
