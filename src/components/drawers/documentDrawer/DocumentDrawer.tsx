import { Loader, LucideExternalLink } from "lucide-react";

import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ViewMore } from "@/components/molecules/viewMore/ViewMore";
import { PassageSearch } from "@/components/organisms/passageSearch/PassageSearch";
import { SearchLevelContext } from "@/context/SearchLevelContext";
import { getLanguage } from "@/helpers/getLanguage";
import { useSearchLevelValues } from "@/hooks/useSearchLevel";
import { IMetadata, TFamilyDocumentPublic, TFamilyEventPublic, TFamilyPublic } from "@/types";
import { getEventTableRowsData } from "@/utils/eventTable";
import { flattenLevelToBaseQuery } from "@/utils/search/searchLevels";
import { firstCase } from "@/utils/text/firstCase";
import { formatDateShort } from "@/utils/timedate";

interface IProps {
  documentSlug: string | null;
  family: TFamilyPublic;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const DocumentDrawer = ({ documentSlug, family, onOpenChange, open }: IProps) => {
  // The drawer's own search, flattened onto the base params of the document page it links to
  const [documentSearch] = useSearchLevelValues("document");
  const outboundQuery = flattenLevelToBaseQuery(documentSearch);

  const isLitigation = family.attribution.category === "Litigation";

  /* Get the document and its associated event if present */
  let document: TFamilyDocumentPublic | null = null;
  let event: TFamilyEventPublic | null = null;

  if (isLitigation) {
    const eventAndDocument = getEventTableRowsData(family).find((row) => row.document?.slug === documentSlug);
    if (eventAndDocument) {
      document = eventAndDocument.document;
      event = eventAndDocument.event;
    }
  } else {
    document = family.documents.find((doc) => doc.slug === documentSlug);
  }

  /* Return an empty drawer if there is no matching document */
  if (!document) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} title="Document" trackScroll wide>
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
        value: getLanguage(document.language) + (document.variant ? ` (${document.variant})` : ""),
      });
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        document.slug ? (
          <span className="block pt-0 md:pt-5">
            <PageLink
              keepQuery
              query={outboundQuery}
              href={"/documents/" + document.slug}
              className="text-xl md:text-2xl lg:text-3xl text-inky-blue underline-offset-5 hover:underline"
            >
              {document.title}
            </PageLink>
          </span>
        ) : (
          document.title
        )
      }
      titleExtras={
        document.slug ? (
          <PageLink
            external
            keepQuery
            query={outboundQuery}
            href={"/documents/" + document.slug}
            className="text-neutral-500 hover:text-neutral-800 justify-end"
          >
            <LucideExternalLink width={20} height={20} />
          </PageLink>
        ) : undefined
      }
      trackScroll
      wide
    >
      <SearchLevelContext value="document">
        <PassageSearch documents={[document]} subject="this document" />
      </SearchLevelContext>
    </Drawer>
  );
};
