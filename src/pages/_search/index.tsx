/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

import { ApiClient } from "@/api/http-common";
import { PatrickComponent } from "@/components/_experiment/patrick/patrick";
import { Debug } from "@/components/atoms/debug/Debug";
import Layout from "@/components/layouts/Main";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TopicsContext } from "@/context/TopicsContext";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import useConfig from "@/hooks/useConfig";
import { TTheme, TTopic, TTopics } from "@/types";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";
import { readConfigFile } from "@/utils/readConfigFile";

const TOPICS = ["flood defence", "targets"];
const GEOS = ["spain"];

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const findMatches = (searchTerm: string) => {
  if (!searchTerm) return { matchedConcepts: [], matchedGeos: [], matchedYears: [] };

  const matchedYears: string[] = [];
  const rawSearchTermParts = searchTerm.trim().split(" ");
  for (let i = 0; i < rawSearchTermParts.length; i++) {
    const year = parseInt(rawSearchTermParts[i]);
    if (!isNaN(year) && year >= 1900 && year <= 2100) {
      matchedYears.push(year.toString());
    }
  }

  const matchedConcepts = TOPICS.filter((topic) => searchTerm.toLowerCase().includes(topic.toLowerCase()));
  const matchedGeos = GEOS.filter((geo) => searchTerm.toLowerCase().includes(geo.toLowerCase()));
  return { matchedConcepts, matchedGeos, matchedYears };
};

const ShadowSearch = ({ theme, themeConfig, features, topicsData, familyConceptsData }: TProps) => {
  const configQuery = useConfig();
  const { data: { regions = [], countries = [], corpus_types = {} } = {} } = configQuery;

  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const { matchedConcepts, matchedGeos, matchedYears } = findMatches(searchTerm);

  return (
    <FeaturesContext.Provider value={features}>
      <TopicsContext.Provider value={topicsData}>
        <WikiBaseConceptsContext.Provider value={familyConceptsData || []}>
          <section className="py-8">
            <div className="mx-auto max-w-5xl px-4">
              <header className="mb-6">
                <h1 className="text-2xl font-semibold text-text-primary">Shadow search</h1>
              </header>

              <div className="grid gap-6 md:grid-cols-3 items-start">
                <aside className="space-y-4 border border-border-lighter p-4">
                  <h2 className="text-sm font-semibold text-text-primary">Active filters</h2>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-xs text-text-tertiary">Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTopics.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedTopics.map((topic) => (
                          <Button key={topic} onClick={() => setSelectedTopics(selectedTopics.filter((topicToRemove) => topicToRemove !== topic))}>
                            {topic}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-text-tertiary">Geographies</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedGeos.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedGeos.map((geo) => (
                          <Button key={geo} onClick={() => setSelectedGeos(selectedGeos.filter((geoToRemove) => geoToRemove !== geo))}>
                            {geo}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-text-tertiary">Years</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedYears.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedYears.map((year) => (
                          <Button key={year} onClick={() => setSelectedYears(selectedYears.filter((yearToRemove) => yearToRemove !== year))}>
                            {year}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(searchTerm || selectedTopics.length > 0 || selectedGeos.length > 0 || selectedYears.length > 0) && (
                    <Button
                      onClick={() => {
                        setSelectedTopics([]);
                        setSelectedGeos([]);
                        setSelectedYears([]);
                      }}
                      className="text-xs"
                    >
                      Clear all filters
                    </Button>
                  )}
                </aside>

                <main className="space-y-4 md:col-span-2">
                  <div className="relative">
                    <Input
                      placeholder="Search"
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                      className="h-[40px] w-full pr-10"
                      value={searchTerm}
                    />
                    {searchTerm && (
                      <Button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary"
                        aria-label="Clear search"
                      >
                        x
                      </Button>
                    )}
                  </div>

                  {searchTerm.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-text-primary">Suggested filters</h2>
                      <p className="text-xs text-text-secondary">Based on your search &ldquo;{searchTerm}&rdquo;, we have found the following:</p>
                      <ul className="space-y-2 text-sm text-text-primary">
                        {matchedConcepts.length === 0 && matchedGeos.length === 0 && matchedYears.length === 0 && (
                          <li className="text-xs text-text-tertiary">
                            We will show filter suggestions here once your search includes recognised topics, geographies or years.
                          </li>
                        )}

                        {matchedConcepts.length > 0 && (
                          <li>
                            <p className="mb-1 text-xs text-text-tertiary">Topics</p>
                            <div className="flex flex-wrap gap-2">
                              {matchedConcepts
                                .filter((concept) => !selectedTopics.includes(concept))
                                .map((concept) => (
                                  <Button
                                    key={concept}
                                    onClick={() => {
                                      setSelectedTopics([...selectedTopics, concept]);
                                      setSearchTerm("");
                                    }}
                                  >
                                    {concept}
                                  </Button>
                                ))}
                            </div>
                          </li>
                        )}

                        {matchedGeos.length > 0 && (
                          <li>
                            <p className="mb-1 text-xs text-text-tertiary">Geographies</p>
                            <div className="flex flex-wrap gap-2">
                              {matchedGeos
                                .filter((geo) => !selectedGeos.includes(geo))
                                .map((geo) => (
                                  <Button
                                    key={geo}
                                    onClick={() => {
                                      setSelectedGeos([...selectedGeos, geo]);
                                      setSearchTerm("");
                                    }}
                                  >
                                    {geo}
                                  </Button>
                                ))}
                            </div>
                          </li>
                        )}

                        {matchedYears.length > 0 && (
                          <li>
                            <p className="mb-1 text-xs text-text-tertiary">Years</p>
                            <div className="flex flex-wrap gap-2">
                              {matchedYears
                                .filter((year) => !selectedYears.includes(year))
                                .map((year) => (
                                  <Button
                                    key={year}
                                    onClick={() => {
                                      setSelectedYears([...selectedYears, year]);
                                      setSearchTerm("");
                                    }}
                                  >
                                    {year}
                                  </Button>
                                ))}
                            </div>
                          </li>
                        )}
                      </ul>

                      {(matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            onClick={() => {
                              setSelectedTopics(matchedConcepts);
                              setSelectedGeos(matchedGeos);
                              setSelectedYears(matchedYears);
                              setRawSearchTerm(searchTerm);
                              setSearchTerm("");
                            }}
                          >
                            Apply all filters
                          </Button>
                          <Button
                            onClick={() => {
                              setRawSearchTerm(searchTerm);
                              setSearchTerm("");
                            }}
                          >
                            Search &ldquo;{searchTerm}&rdquo; only
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-text-primary">Filtered view</h2>
                    <p className="text-sm text-text-primary">Results for &ldquo;{rawSearchTerm}&rdquo;</p>
                    <p className="text-xs text-text-secondary">This query has been translated into the filters on the left.</p>
                    <Button
                      onClick={() => {
                        setSearchTerm(rawSearchTerm);
                        setSelectedTopics([]);
                        setSelectedGeos([]);
                        setSelectedYears([]);
                      }}
                    >
                      Reset filters to original search
                    </Button>
                  </div>
                </main>
              </div>
            </div>
          </section>
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
    }),
  };
}) satisfies GetServerSideProps;
