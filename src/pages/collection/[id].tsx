import { GetServerSideProps, InferGetStaticPropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { Columns } from "@/components/atoms/columns/Columns";
import Layout from "@/components/layouts/Main";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
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

const CollectionPage: InferGetStaticPropsType<typeof getServerSideProps> = ({ collection, theme, themeConfig }: IProps) => {
  return (
    <Layout title={collection.title} description={collection.description} theme={theme} themeConfig={themeConfig} metadataKey="collection">
      <Columns>
        <ContentsSideBar items={[]} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="py-3 cols-2:py-6 cols-3:py-8 cols-3:col-span-2 cols-4:col-span-3">
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
