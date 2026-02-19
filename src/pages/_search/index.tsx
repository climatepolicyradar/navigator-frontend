/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo } from "react";

import { ApiClient } from "@/api/http-common";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { Typeahead } from "@/components/_experiment/typeahead/Typeahead";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TopicsContext } from "@/context/TopicsContext";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import useConfig from "@/hooks/useConfig";
import useShadowSearch from "@/hooks/useShadowSearch";
import { TTopic, TTopics } from "@/types";
import { buildFilterFieldOptions } from "@/utils/_experiment/buildFilterFieldOptions";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";
import { readConfigFile } from "@/utils/readConfigFile";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ShadowSearch = ({ theme, themeConfig, features, topicsData, familyConceptsData }: TProps) => {
  const configQuery = useConfig();
  const { data: configData } = configQuery;
  const { regions = [], countries = [], corpus_types = {} } = configData ?? {};

  const filterOptions = useMemo(
    () =>
      buildFilterFieldOptions({
        topics: topicsData?.topics,
        regions,
        countries,
        corpusTypes: corpus_types,
      }),
    [topicsData?.topics, regions, countries, corpus_types]
  );

  const shadowSearch = useShadowSearch({ filterOptions });
  const addFilter = shadowSearch.actions.add;

  return (
    <FeaturesContext.Provider value={features}>
      <TopicsContext.Provider value={topicsData}>
        <WikiBaseConceptsContext.Provider value={familyConceptsData || []}>
          <div className="ml-40 mt-40">
            <IntelliSearch
              topics={topicsData.topics}
              selectedTopics={shadowSearch.filters.value.topics}
              onSelectConcept={(concept) => {
                if (concept?.preferred_label) {
                  addFilter("topics", concept.preferred_label);
                }
              }}
            />
          </div>
          <Typeahead shadowSearch={shadowSearch} filterOptions={filterOptions} />
        </WikiBaseConceptsContext.Provider>
      </TopicsContext.Provider>
    </FeaturesContext.Provider>
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
      posthogPageViewProps: {
        search_version: "v2",
      },
    }),
  };
}) satisfies GetServerSideProps;
