import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { Columns } from "@/components/atoms/columns/Columns";
import { EventsBlock } from "@/components/blocks/eventsBlock/EventsBlock";
import { FamilyBlock } from "@/components/blocks/familyBlock/FamilyBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { ContentsSideBar, ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderTab, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { withEnvConfig } from "@/context/EnvConfig";
import { TCollectionPublicWithFamilies, TTheme, TThemeConfig } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled } from "@/utils/features";
import { getCollectionMetadata } from "@/utils/getCollectionMetadata";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  collection: TCollectionPublicWithFamilies;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

type TCollectionTab = "about" | "cases" | "events";
const COLLECTION_TABS: IPageHeaderTab<TCollectionTab>[] = [{ tab: "cases" }, { tab: "events" }, { tab: "about" }];

const CollectionPage: InferGetStaticPropsType<typeof getServerSideProps> = ({ collection, theme, themeConfig }: IProps) => {
  const [currentTab, setCurrentTab] = useState<TCollectionTab>("cases");
  const { families } = collection;

  // TODO sort families before displaying

  const onTabChange = (tab: TCollectionTab) => setCurrentTab(tab);

  const sideBarItems: ISideBarItem[] = families.map((family) => ({
    id: `section-${family.slug}`,
    display: family.title,
  }));

  sideBarItems.unshift({
    id: "section-collection-metadata",
    display: "About",
  });

  return (
    <Layout title={collection.title} description={collection.description} theme={theme} themeConfig={themeConfig} metadataKey="collection">
      <PageHeader<TCollectionTab>
        coloured
        label="Collection"
        title={collection.title}
        tabs={COLLECTION_TABS}
        currentTab={currentTab}
        onTabChange={onTabChange}
      />
      <Columns>
        {currentTab === "cases" && (
          <>
            <ContentsSideBar items={sideBarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
            <main className="flex flex-col py-3 gap-4 cols-2:py-6 cols-2:gap-8 cols-3:py-8 cols-3:gap-12 cols-3:col-span-2 cols-4:col-span-3">
              {families.map((family) => (
                <FamilyBlock key={family.slug} family={family} />
              ))}
            </main>
          </>
        )}

        {currentTab === "events" && (
          <main className="py-3 cols-2:py-6 cols-2:col-span-2 cols-3:py-8 cols-3:col-span-3 cols-4:col-span-4">
            <EventsBlock families={families} />
          </main>
        )}

        {currentTab === "about" && (
          <>
            <div />
            <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
              <TextBlock>
                <div className="text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
              </TextBlock>
              <MetadataBlock metadata={getCollectionMetadata(collection)} id="section-collection-metadata" />
              <Section id="section-debug" title="Debug">
                <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">
                  {JSON.stringify(collection, null, 2)}
                </pre>
              </Section>
            </main>
          </>
        )}
      </Columns>
    </Layout>
  );
};

export default CollectionPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  if (!isLitigationEnabled(featureFlags, themeConfig)) {
    return { notFound: true };
  }

  const import_id = context.params.id;
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let collectionData: TCollectionPublicWithFamilies;

  try {
    const { data: collectionResponse } = await apiClient.get(`/families/collections/${import_id}`);
    collectionData = collectionResponse.data;
  } catch (error) {}

  if (!collectionData) {
    return { notFound: true };
  }

  return {
    props: withEnvConfig({
      collection: collectionData,
      theme,
      themeConfig,
    }),
  };
};
