import { useQuery } from "@tanstack/react-query";
import { LucideExternalLink, Search } from "lucide-react";
import { Fragment, ReactNode } from "react";

import { SearchDocument } from "@/api/search";
import { Drawer } from "@/components/atoms/drawer/Drawer";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Tabs } from "@/components/atoms/tabs/Tabs";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { NoteBlock } from "@/components/blocks/noteBlock/NoteBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { TopicsBlock } from "@/components/blocks/topicsBlock/TopicsBlock";
import { PassageSearch } from "@/components/organisms/passageSearch/PassageSearch";
import { SearchLevelContext } from "@/context/SearchLevelContext";
import useConfig from "@/hooks/useConfig";
import { useSearchLevelValues } from "@/hooks/useSearchLevel";
import { useText } from "@/hooks/useText";
import { TFamilyPresentationalData } from "@/types";
import { getFamilyHeader } from "@/utils/family-header/getFamilyHeader";
import { getFamilyMetadata } from "@/utils/family-metadata/getFamilyMetadata";
import { flattenLevelToBaseQuery } from "@/utils/search/searchLevels";
import { firstCase } from "@/utils/text/firstCase";
import { getTopFamilyTopics } from "@/utils/topics/getTopFamilyTopics";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

export type TPrincipalDrawerTab = "about" | "search";

type TDocumentDrawerProps = {
  document: SearchDocument | null; // The clicked search result, absent when the drawer is opened from a link
  importId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: TPrincipalDrawerTab;
  onTabChange: (tab: TPrincipalDrawerTab) => void;
};

type TDrawerContentProps = {
  familyData: TFamilyPresentationalData;
  languages: Record<string, string>;
};

const DrawerContent = ({ familyData, languages }: TDrawerContentProps) => {
  const { family, familyTopics } = familyData;
  const { getCategoryTextLookup } = useText();
  const getCategoryText = getCategoryTextLookup(family.attribution.category);
  const pageHeaderMetadata = getFamilyHeader({ family, getCategoryText });
  const metadata = getFamilyMetadata(family, familyTopics);

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

export function PrincipalDrawer({ document, importId, open, onOpenChange, tab, onTabChange }: TDocumentDrawerProps) {
  const { data: { languages = {} } = {} } = useConfig();
  const { getCategoryTextLookup } = useText();
  // The drawer's own search, flattened onto the base params of whatever page a link leads to
  const [principalSearch] = useSearchLevelValues("principal");

  const { data: familyData, isLoading } = useQuery<TFamilyPresentationalData | null>({
    queryKey: ["family", importId],
    queryFn: () => fetch(`/api/document/${importId}`).then((res) => (res.ok ? res.json() : null)),
    enabled: !!importId,
  });

  const getCategoryText = getCategoryTextLookup(familyData?.family.attribution.category);

  const outboundQuery = flattenLevelToBaseQuery(principalSearch);
  // The clicked result names the drawer immediately; a drawer opened from a link waits for the fetch.
  const titleHref = document ? linkHref(document) : familyData && `/document/${familyData.family.slug}`;
  const titleContent: ReactNode = document ? <span dangerouslySetInnerHTML={{ __html: document.title }} /> : (familyData?.family.title ?? undefined);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        titleContent && titleHref ? (
          <span className="block pt-5">
            <PageLink keepQuery query={outboundQuery} href={titleHref} className="text-3xl text-inky-blue underline-offset-5 hover:underline">
              {titleContent}
            </PageLink>
          </span>
        ) : (
          titleContent
        )
      }
      titleExtras={
        titleHref ? (
          <PageLink external keepQuery query={outboundQuery} href={titleHref} className="text-neutral-500 hover:text-neutral-800 justify-end">
            <LucideExternalLink width={20} height={20} />
          </PageLink>
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
        <SearchLevelContext value="principal">
          <Tabs<TPrincipalDrawerTab>
            onValueChange={onTabChange}
            value={tab}
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
                panel: (
                  <PassageSearch
                    documents={familyData.family.documents}
                    concepts={getTopFamilyTopics(familyData.familyTopics)}
                    documentsLabel={`Documents in this ${firstCase(getCategoryText("familySingular"))}`}
                    subject="these documents"
                  />
                ),
              },
            ]}
            tabsContainer={(tabsList) => <div className="pl-8">{tabsList}</div>}
          />
        </SearchLevelContext>
      )}
      {!isLoading && !familyData && <p>Sorry, this document has failed to load.</p>}
    </Drawer>
  );
}
