/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Suspense, use, useMemo, useState, useEffect } from "react";

import { ApiClient } from "@/api/http-common";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { fetchSearchDocuments, SearchContainer, SearchDocumentsResponse, SearchResults } from "@/components/_experiment/searchResults/SearchResults";
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

  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  // const filterOptions = useMemo(
  //   () =>
  //     buildFilterFieldOptions({
  //       topics: topicsData?.topics,
  //       regions,
  //       countries,
  //       corpusTypes: corpus_types,
  //     }),
  //   [topicsData?.topics, regions, countries, corpus_types]
  // );

  // const shadowSearch = useShadowSearch({ filterOptions });
  // const addFilter = shadowSearch.actions.add;

  return (
    <FeaturesContext.Provider value={features}>
      <TopicsContext.Provider value={topicsData}>
        <WikiBaseConceptsContext.Provider value={familyConceptsData || []}>
          <div className="w-3/4 m-auto mt-8">
            <IntelliSearch
              // topics={topicsData.topics}
              topics={[]}
              selectedLabels={selectedLabels}
              onSelectConcept={(concept) => {
                if (concept) {
                  setSelectedLabels((prev) => [...prev, concept]);
                }
              }}
              setQuery={setQuery}
            />
          </div>
          <div className="w-3/4 m-auto mt-4 mb-8">
            <div className="flex flex-wrap gap-1">
              {query && (
                <button className="text-xs bg-gray-100 rounded p-2 flex items-center gap-1 hover:bg-gray-200" onClick={() => setQuery("")}>
                  <span>Anything matching "{query}"</span>
                  <span>&times;</span>
                </button>
              )}
              {selectedLabels.map((label, i) => (
                <button
                  key={i}
                  className="text-xs bg-gray-100 rounded p-2 flex items-center gap-1 hover:bg-gray-200"
                  onClick={() => setSelectedLabels((prev) => prev.filter((l) => l !== label))}
                >
                  <span key={i} className="">
                    {selectedLabels.length > 1 ? `or: ` : ""}
                    {label}
                  </span>
                  <span>&times;</span>
                </button>
              ))}
            </div>
          </div>
          {/* <Typeahead shadowSearch={shadowSearch} filterOptions={filterOptions} /> */}
          <SearchContainer selectedLabels={selectedLabels} query={query} />
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
