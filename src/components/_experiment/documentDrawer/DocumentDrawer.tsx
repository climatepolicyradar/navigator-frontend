import { useQuery } from "@tanstack/react-query";
import { LucideExternalLink } from "lucide-react";
import { Fragment } from "react";

import { SearchDocument } from "@/api/search";
import { Drawer } from "@/components/atoms/drawer/Drawer";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { NoteBlock } from "@/components/blocks/noteBlock/NoteBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { TopicsBlock } from "@/components/blocks/topicsBlock/TopicsBlock";
import useConfig from "@/hooks/useConfig";
import { useFamilyPageHeaderData } from "@/hooks/useFamilyPageHeaderData";
import { useText } from "@/hooks/useText";
import { TFamilyPresentationalData } from "@/types";
import { getFamilyMetadata } from "@/utils/family-metadata/getFamilyMetadata";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

type TDocumentDrawerProps = {
  document: SearchDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TDrawerContentProps = {
  familyData: TFamilyPresentationalData;
  languages: Record<string, string>;
};

// The content to display within the Drawer - relies on familyData being loaded
function DrawerContent({ familyData, languages }: TDrawerContentProps) {
  const { getCategoryTextLookup } = useText();
  const { countries, family, subdivisions } = familyData;
  const { pageHeaderMetadata } = useFamilyPageHeaderData({ countries, family, subdivisions });
  const metadata = getFamilyMetadata(family, familyData.familyTopics, countries, subdivisions);
  const getCategoryText = getCategoryTextLookup(family.attribution.category);

  return (
    <div className="flex flex-col gap-8">
      <div>
        {pageHeaderMetadata.length > 0 && (
          <div className="grid grid-cols-[min-content_auto] gap-x-8 gap-y-2 text-sm">
            {pageHeaderMetadata.map((property, index) => (
              <Fragment key={index}>
                <div className="text-[#030712] font-medium whitespace-nowrap">{property.label}</div>
                <div className="text-[#374151]">{property.value}</div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      {family.summary && (
        <TextBlock block="summary" title="Summary" context="drawer-summary">
          <div className="text-content" dangerouslySetInnerHTML={{ __html: family.summary.replace(/\r?\n/g, "<br/>") }} />
        </TextBlock>
      )}
      {metadata.length > 0 && (
        <div className="grid grid-cols-8">
          <MetadataBlock block="metadata" title="About" metadata={metadata} />
        </div>
      )}
      <div className="grid grid-cols-1">
        <DocumentsBlock family={family} familyTopics={familyData.familyTopics} languages={languages} />
      </div>
      {familyTopicsHasTopics(familyData.familyTopics) && (
        <TopicsBlock key="topics" family={family} familyTopics={familyData.familyTopics} getCategoryText={getCategoryText} />
      )}
      <NoteBlock key="note" attribution={family.attribution} />
    </div>
  );
}

export function DocumentDrawer({ document, open, onOpenChange }: TDocumentDrawerProps) {
  const { data: { languages = {} } = {} } = useConfig();

  const importId = document?.id as string | undefined;

  const { data: familyData, isLoading } = useQuery<TFamilyPresentationalData | null>({
    queryKey: ["family", importId],
    queryFn: () => fetch(`/api/family/${importId}`).then((res) => (res.ok ? res.json() : null)),
    enabled: !!importId,
  });

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        document ? (
          linkHref(document) ? (
            <span className="block pt-5">
              <a
                href={linkHref(document)!}
                className="text-3xl text-inky-blue underline-offset-5 hover:underline"
                dangerouslySetInnerHTML={{ __html: document.title }}
              />
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: document.title }} />
          )
        ) : undefined
      }
      titleExtras={
        document && linkHref(document) ? (
          <a target="_blank" href={linkHref(document)!} className="text-neutral-500 hover:text-neutral-800 justify-end">
            <LucideExternalLink width={20} height={20} />
          </a>
        ) : undefined
      }
      wide
    >
      {isLoading && (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-inky-blue" />
        </div>
      )}
      {!isLoading && familyData && <DrawerContent familyData={familyData} languages={languages} />}
    </Drawer>
  );
}
