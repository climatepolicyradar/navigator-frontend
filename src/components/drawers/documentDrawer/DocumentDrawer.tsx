import { Fragment } from "react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { ARROW_RIGHT } from "@/constants/chars";
import { IMetadata, TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic } from "@/types";
import { getFamilyEvents } from "@/utils/eventTable";
import { formatDateShort } from "@/utils/timedate";

interface IProps {
  documentImportId: string | null;
  family: TFamilyPublic;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const DocumentDrawer = ({ documentImportId, family, onOpenChange, open }: IProps) => {
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

  /* Content */

  const metadata: IMetadata[] = [];

  if (event) {
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
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={document.title}>
      {metadata.length > 0 && (
        <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-2 mb-4 text-sm text-gray-700 leading-5">
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
    </Drawer>
  );
};
