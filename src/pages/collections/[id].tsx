import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { useState } from "react";

import { ApiClient } from "@/api/http-common";
import { Columns } from "@/components/atoms/columns/Columns";
import { Debug } from "@/components/atoms/debug/Debug";
import { EventsBlock } from "@/components/blocks/eventsBlock/EventsBlock";
import { FamilyBlock } from "@/components/blocks/familyBlock/FamilyBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { ContentsSideBar, ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderTab, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { withEnvConfig } from "@/context/EnvConfig";
import { TCollectionPublicWithFamilies, TTheme, TThemeConfig } from "@/types";
import { getCaseNumbers, getCourts } from "@/utils/eventTable";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled } from "@/utils/features";
import { getCollectionMetadata } from "@/utils/getCollectionMetadata";
import { getLanguage } from "@/utils/getLanguage";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  collection: TCollectionPublicWithFamilies;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

type TCollectionTab = "about" | "cases" | "procedural history";
const COLLECTION_TABS: IPageHeaderTab<TCollectionTab>[] = [{ tab: "cases" }, { tab: "procedural history" }, { tab: "about" }];

const CollectionPage: InferGetStaticPropsType<typeof getServerSideProps> = ({ collection, theme, themeConfig }: IProps) => {
  const [currentTab, setCurrentTab] = useState<TCollectionTab>("cases");
  const { families } = collection;

  // TODO sort families before displaying

  const onTabChange = (tab: TCollectionTab) => setCurrentTab(tab);

  const sideBarItems: ISideBarItem[] = families.map((family) => ({
    id: `section-${family.slug}`,
    display: family.title,
    context: [getCaseNumbers(family), getCourts(family)].filter((part) => part),
  }));

  return (
    <Layout title={collection.title} description={collection.description} theme={theme} themeConfig={themeConfig} metadataKey="collection">
      <BreadCrumbs label={collection.title} />
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
            <ContentsSideBar items={sideBarItems} stickyClasses="!top-[72px] cols-3:max-h-[calc(100vh-72px)] pt-3 cols-2:pt-6 cols-3:pt-8" />
            <main className="flex flex-col py-3 gap-4 cols-2:py-6 cols-2:gap-8 cols-3:py-8 cols-3:gap-12 cols-3:col-span-2 cols-4:col-span-3">
              {families.map((family) => (
                <FamilyBlock key={family.slug} family={family} />
              ))}
            </main>
          </>
        )}

        {currentTab === "procedural history" && (
          <main className="py-3 cols-2:py-6 cols-2:col-span-2 cols-3:py-8 cols-3:col-span-3 cols-4:col-span-4">
            <EventsBlock families={families} />
          </main>
        )}

        {currentTab === "about" && (
          <>
            <div />
            <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
              <TextBlock id="section-summary" title="Summary">
                <div className="text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
              </TextBlock>
              <MetadataBlock block="metadata" metadata={getCollectionMetadata(collection)} />
              {/* <Section block="debug" title="Debug">
                <Debug data={collection} title="Collection" />
              </Section> */}
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

  let collectionData: TCollectionPublicWithFamilies;

  try {
    const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);
    const id = context.params.id;
    const { data: slugData } = await apiClient.get(`/families/slugs/${id}`);
    const collection_import_id = slugData.data.collection_import_id;

    const { data: collectionResponse } = await apiClient.get(`/families/collections/${collection_import_id}`);
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
