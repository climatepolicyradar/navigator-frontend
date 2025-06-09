import { GetServerSideProps, InferGetStaticPropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { Columns } from "@/components/atoms/columns/Columns";
import Layout from "@/components/layouts/Main";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { FAMILY_PAGE_SIDE_BAR_ITEMS } from "@/constants/sidebarItems";
import { withEnvConfig } from "@/context/EnvConfig";
import { TFamilyPage, TFeatureFlags, TTheme, TThemeConfig } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isKnowledgeGraphEnabled } from "@/utils/features";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  featureFlags: TFeatureFlags;
  page: TFamilyPage;
  theme: TTheme;
  themeConfig: TThemeConfig;
}

const Family: InferGetStaticPropsType<typeof getServerSideProps> = ({ featureFlags, page, theme, themeConfig }: IProps) => {
  return (
    <Layout
      title={page.title}
      description={getFamilyMetaDescription(page.summary, "", page.category)}
      theme={theme}
      themeConfig={themeConfig}
      metadataKey="family"
    >
      <Columns>
        <ContentsSideBar items={FAMILY_PAGE_SIDE_BAR_ITEMS} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="py-3 cols-2:py-6 cols-3:py-8 cols-3:col-span-2 cols-4:col-span-3">
          <div className="mb-19">
            <h1 className="text-4xl leading-tight font-[640] text-text-primary">{page.title}</h1>
          </div>
          <div className="flex flex-col gap-24">
            {FAMILY_PAGE_SIDE_BAR_ITEMS.map((item) => (
              <section key={item.id} id={item.id} className="scroll-m-21 cols-2:scroll-m-24 cols-3:scroll-m-26">
                <h2 className="text-2xl leading-tight font-[640] text-text-primary mb-4">{item.display}</h2>
                <div className="h-[500px] bg-[rgb(230,230,230)] rounded-xl" />
              </section>
            ))}
          </div>
        </main>
      </Columns>
    </Layout>
  );
};

export default Family;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const featureFlags = getFeatureFlags(context.req.cookies);

  const id = context.params.id;
  const client = new ApiClient(process.env.BACKEND_API_URL);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);
  if (!knowledgeGraphEnabled) return { notFound: true };

  let familyData: TFamilyPage;

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`);
    familyData = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }

  return {
    props: withEnvConfig({
      page: familyData,
      theme,
      themeConfig,
      featureFlags,
    }),
  };
};
