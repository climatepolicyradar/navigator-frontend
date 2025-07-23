import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { useState } from "react";

import { ApiClient } from "@/api/http-common";
import { Columns } from "@/components/atoms/columns/Columns";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import Layout from "@/components/layouts/Main";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderTab, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { withEnvConfig } from "@/context/EnvConfig";
import { TCollection, TTheme, TThemeConfig } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isLitigationEnabled } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  collection: TCollection;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

type TCollectionTab = "about" | "cases" | "events";
const COLLECTION_TABS: IPageHeaderTab<TCollectionTab>[] = [{ tab: "cases" }, { tab: "events" }, { tab: "about" }];

const CollectionPage: InferGetStaticPropsType<typeof getServerSideProps> = ({ collection, theme, themeConfig }: IProps) => {
  const [currentTab, setCurrentTab] = useState<TCollectionTab>("cases");

  const onTabChange = (tab: TCollectionTab) => setCurrentTab(tab);

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
        <ContentsSideBar items={[]} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
          <TextBlock>
            <div className="text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
          </TextBlock>
          <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(collection, null, 2)}</pre>
        </main>
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

  const id = context.params.id;
  const client = new ApiClient(process.env.BACKEND_API_URL);

  if (!isLitigationEnabled(featureFlags, themeConfig)) {
    return { notFound: true };
  }

  let collection: TCollection;

  try {
    const { data: returnedData } = await client.get(`/collections/${id}`);
    collection = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }

  if (!collection) {
    return { notFound: true };
  }

  return {
    props: withEnvConfig({
      collection,
      theme,
      themeConfig,
    }),
  };
};
