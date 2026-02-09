import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { Debug } from "@/components/atoms/debug/Debug";
import Layout from "@/components/layouts/Main";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TopicsContext } from "@/context/TopicsContext";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import { TTheme, TTopic, TTopics } from "@/types";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";
import { readConfigFile } from "@/utils/readConfigFile";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ShadowSearch = ({ theme, themeConfig, features, topicsData, familyConceptsData }: TProps) => {
  return (
    <Layout theme={theme as TTheme} themeConfig={themeConfig} metadataKey="search">
      <FeaturesContext.Provider value={features}>
        <TopicsContext.Provider value={topicsData}>
          <WikiBaseConceptsContext.Provider value={familyConceptsData || []}>
            <section>
              <h1>_Shadow Search Page</h1>
              <Debug title="Features" data={features} />
              <Debug title="Topics Data" data={topicsData} />
              <Debug title="Family Concepts Data" data={familyConceptsData} />
            </section>
          </WikiBaseConceptsContext.Provider>
        </TopicsContext.Provider>
      </FeaturesContext.Provider>
    </Layout>
  );
};

export default ShadowSearch;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const client = new ApiClient(process.env.CONCEPTS_API_URL);

  let topicsData: TTopics = { rootTopics: [], topics: [] };
  let familyConceptsData: TTopic[] | undefined;

  try {
    const { data: topicsResponse } = await client.get<TTopic[]>(`/concepts/search?limit=10000&has_classifier=true`);
    topicsData = await fetchAndProcessTopics(topicsResponse.map((topic) => topic.wikibase_id));

    if (features.familyConceptsSearch) {
      const familyConceptsResponse = await fetch(`${process.env.CONCEPTS_API_URL}/families/concepts`);
      const familyConceptsJson: { data: FamilyConcept[] } = await familyConceptsResponse.json();
      familyConceptsData = mapFamilyConceptsToConcepts(familyConceptsJson.data);
    }
  } catch (error) {
    // TODO handle error more elegantly
    /* trunk-ignore(eslint/no-console) */
    // eslint-disable-next-line no-console
    console.warn("Error fetching concepts data for Shadow Search page:", error);
  }

  return {
    props: withEnvConfig({
      familyConceptsData: familyConceptsData ?? null,
      features,
      theme,
      themeConfig,
      topicsData,
    }),
  };
}) satisfies GetServerSideProps;
