import orderBy from "lodash/orderBy";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";

import { getCollectionData } from "@/bff/methods/getCollectionData";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { EventsBlock } from "@/components/blocks/eventsBlock/EventsBlock";
import { FamilyBlock } from "@/components/blocks/familyBlock/FamilyBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { TToggleGroupToggle } from "@/components/molecules/toggleGroup/ToggleGroup";
import { ContentsSideBar, ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TTheme } from "@/types";
import { getCaseFirstDocumentDate, getCaseNumbers, getCourts } from "@/utils/eventTable";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { getCollectionMetadata } from "@/utils/getCollectionMetadata";
import { getLitigationCollectionJSONLD } from "@/utils/json-ld/getLitigationCollectionJSONLD";
import { readConfigFile } from "@/utils/readConfigFile";

type TCollectionTabId = "about" | "cases" | "procedural history"; // Don't rename, add a label instead (else analytics break)
const COLLECTION_TABS: TToggleGroupToggle<TCollectionTabId>[] = [{ id: "cases" }, { id: "procedural history" }, { id: "about" }];

const CollectionPage = ({ collection, theme, themeConfig, features }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [currentTab, setCurrentTab] = useState<TCollectionTabId>("cases");
  const onTabChange = (tab: TCollectionTabId) => setCurrentTab(tab);

  const sortedFamilies = orderBy(collection.families, [getCaseFirstDocumentDate], ["desc"]);

  const sideBarItems: ISideBarItem<string>[] = sortedFamilies.map((family) => ({
    id: family.slug,
    display: family.title,
    context: [getCaseNumbers(family), getCourts(family)].filter((part) => part),
  }));

  return (
    <Layout title={collection.title} description={collection.description} theme={theme as TTheme} themeConfig={themeConfig}>
      <FeaturesContext.Provider value={features}>
        <BreadCrumbs dark label={collection.title} />
        <PageHeader<TCollectionTabId> dark title={collection.title} tabs={COLLECTION_TABS} currentTab={currentTab} onTabChange={onTabChange} />
        <FiveColumns>
          {currentTab === "cases" && (
            <>
              <ContentsSideBar items={sideBarItems} stickyClasses="cols-3:!top-26 cols-3:max-h-[calc(100vh-72px)]" />
              <main className="pb-8 grid grid-cols-subgrid gap-y-8 col-start-1 -col-end-1 cols-4:col-start-3">
                {sortedFamilies.map((family) => (
                  <FamilyBlock key={family.slug} family={family} />
                ))}
              </main>
            </>
          )}

          {currentTab === "procedural history" && <EventsBlock families={sortedFamilies} />}

          {currentTab === "about" && (
            <>
              <div className="col-start-1 cols-4:col-end-3 -col-end-1" />
              <main className="pb-8 grid grid-cols-subgrid gap-y-8 col-start-1 -col-end-1 cols-4:col-start-3">
                <TextBlock block="summary" title="Summary">
                  <div className="text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
                </TextBlock>
                <MetadataBlock block="metadata" metadata={getCollectionMetadata(collection)} />
                {/* <Section block="debug" title="Debug">
                  <Debug data={collection} title="Collection" />
                </Section> */}
              </main>
            </>
          )}
        </FiveColumns>

        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(getLitigationCollectionJSONLD(collection)),
            }}
          />
        </Head>
      </FeaturesContext.Provider>
    </Layout>
  );
};

export default CollectionPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const slug = context.params.id as string;

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  if (!features.litigation) {
    return { notFound: true };
  }

  const { data: collectionData, errors } = await getCollectionData(slug, features);
  errors.forEach(console.error); // eslint-disable-line no-console
  if (collectionData === null) return { notFound: true };

  return {
    props: withEnvConfig({
      ...collectionData,
      theme,
      themeConfig,
      features,
    }),
  };
}) satisfies GetServerSideProps;
