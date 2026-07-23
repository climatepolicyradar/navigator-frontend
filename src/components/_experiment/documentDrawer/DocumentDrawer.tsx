import { useQuery } from "@tanstack/react-query";
import { LucideExternalLink, Search } from "lucide-react";
import { Fragment, useState } from "react";

import { SearchDocument } from "@/api/search";
import { Drawer } from "@/components/atoms/drawer/Drawer";
import { Tabs } from "@/components/atoms/tabs/Tabs";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { NoteBlock } from "@/components/blocks/noteBlock/NoteBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { TopicsBlock } from "@/components/blocks/topicsBlock/TopicsBlock";
import useConfig from "@/hooks/useConfig";
import { useText } from "@/hooks/useText";
import { TFamilyPresentationalData } from "@/types";
import { getFamilyHeader } from "@/utils/family-header/getFamilyHeader";
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

const DrawerContent = ({ familyData, languages }: TDrawerContentProps) => {
  const { countries, family, familyTopics, subdivisions } = familyData;
  const { getCategoryTextLookup } = useText();
  const getCategoryText = getCategoryTextLookup(family.attribution.category);
  const pageHeaderMetadata = getFamilyHeader({ countries, family, subdivisions, getCategoryText });
  const metadata = getFamilyMetadata(family, familyTopics, countries, subdivisions);

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
        <DocumentsBlock family={family} familyTopics={familyTopics} languages={languages} />
      </div>
      {familyTopicsHasTopics(familyTopics) && (
        <TopicsBlock key="topics" family={family} familyTopics={familyTopics} getCategoryText={getCategoryText} />
      )}
      <NoteBlock key="note" attribution={family.attribution} />
    </div>
  );
};

export function DocumentDrawer({ document, open, onOpenChange }: TDocumentDrawerProps) {
  const { data: { languages = {} } = {} } = useConfig();
  const [activeTab, setActiveTab] = useState<string>("about");
  const changeTab = (newValue: string) => setActiveTab(newValue);

  const importId = document?.id as string | undefined;

  const { data: familyData, isLoading } = useQuery<TFamilyPresentationalData | null>({
    queryKey: ["family", importId],
    queryFn: () => fetch(`/api/document/${importId}`).then((res) => (res.ok ? res.json() : null)),
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
      {!isLoading && familyData && (
        <Tabs
          onValueChange={changeTab}
          value={activeTab}
          className="-mx-8"
          panelClassName="pt-8"
          tabs={[
            { id: "about", label: "About", panel: <DrawerContent familyData={familyData} languages={languages} /> },
            {
              id: "search",
              label: (
                <>
                  <Search size={20} />
                  Search in documents
                </>
              ),
              panel: <div>Search to go here.</div>,
            },
          ]}
        />
      )}
      {!isLoading && !familyData && <p>Sorry, this document has failed to load.</p>}
    </Drawer>
  );
}
