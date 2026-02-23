/* eslint-disable @typescript-eslint/no-unused-vars */

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { startTransition, useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { IntelliSearch } from "@/components/_experiment/intellisearch";
import { Typeahead } from "@/components/_experiment/typeahead/Typeahead";
import { withEnvConfig, useEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TopicsContext } from "@/context/TopicsContext";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import useConfig from "@/hooks/useConfig";
import { useSearchLabels } from "@/hooks/useSearchLabels";
import useShadowSearch from "@/hooks/useShadowSearch";
import { TTopic, TTopics } from "@/types";
import { buildFilterFieldOptions } from "@/utils/_experiment/buildFilterFieldOptions";
import { partitionLabelsByConfig } from "@/utils/_experiment/partitionLabelsByConfig";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";
import { readConfigFile } from "@/utils/readConfigFile";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const LABEL_SEED_FALLBACK = "a";

const ShadowSearch = ({ theme, themeConfig, features, topicsData, familyConceptsData }: TProps) => {
  const { CONCEPTS_API_URL } = useEnvConfig();
  const configQuery = useConfig();
  const { data: configData } = configQuery;
  const { regions = [], countries = [], corpus_types = {} } = configData ?? {};

  const [labelSeed, setLabelSeed] = useState(LABEL_SEED_FALLBACK);
  const labelsQuery = useSearchLabels(labelSeed, { enabled: Boolean(CONCEPTS_API_URL?.trim()) });

  const filterOptions = useMemo(() => {
    if (CONCEPTS_API_URL?.trim() && labelsQuery.data?.results?.length) {
      return partitionLabelsByConfig(labelsQuery.data.results, {
        regions,
        countries,
        corpusTypes: corpus_types,
        topicLabels: topicsData?.topics?.map((t) => t.preferred_label).filter(Boolean) ?? [],
      });
    }
    return buildFilterFieldOptions({
      topics: topicsData?.topics,
      regions,
      countries,
      corpusTypes: corpus_types,
    });
  }, [CONCEPTS_API_URL, labelsQuery.data, regions, countries, corpus_types, topicsData]);

  const shadowSearch = useShadowSearch({ filterOptions });

  // Sync label search seed from search term so filter options narrow as user types.
  // (labelSeed cannot be derived during render: it drives useSearchLabels, which feeds filterOptions, which useShadowSearch needs; term only exists after shadowSearch.)
  useEffect(() => {
    const term = shadowSearch.search.term.trim() || LABEL_SEED_FALLBACK;
    startTransition(() => setLabelSeed((prev) => (term === prev ? prev : term)));
  }, [shadowSearch.search.term]);

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
