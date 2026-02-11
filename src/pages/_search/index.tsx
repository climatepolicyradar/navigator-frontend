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
          <section className="bg-surface-light py-10 md:py-16">
            <div className="mx-auto max-w-5xl px-4">
              <header className="mb-10 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">Experimental</p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">Search</h1>
                <p className="max-w-2xl text-sm text-text-secondary">
                  Try the next-generation filters for topics, geographies and years before they graduate into the main search.
                </p>
              </header>

              <div className="grid gap-8 md:grid-cols-[260px,1fr] items-start">
                <aside className="space-y-4 rounded-2xl border border-border-lighter bg-white/70 p-4 shadow-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">Active filters</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-xs font-medium text-text-tertiary">Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTopics.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedTopics.map((topic) => (
                          <Button
                            key={topic}
                            onClick={() => setSelectedTopics(selectedTopics.filter((topicToRemove) => topicToRemove !== topic))}
                            className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                          >
                            <span>{topic}</span>
                            <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-text-tertiary">Geographies</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedGeos.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedGeos.map((geo) => (
                          <Button
                            key={geo}
                            onClick={() => setSelectedGeos(selectedGeos.filter((geoToRemove) => geoToRemove !== geo))}
                            className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                          >
                            <span>{geo}</span>
                            <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-text-tertiary">Years</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedYears.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedYears.map((year) => (
                          <Button
                            key={year}
                            onClick={() => setSelectedYears(selectedYears.filter((yearToRemove) => yearToRemove !== year))}
                            className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                          >
                            <span>{year}</span>
                            <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>

                <main className="space-y-6">
                  <div className="rounded-2xl border border-border-lighter bg-white/70 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Input
                        placeholder="Search the database"
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                        }}
                        className="h-[44px] w-full rounded-full border border-border-lighter bg-surface-light px-4 text-sm text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand"
                        value={searchTerm}
                      />

                      <div className="flex gap-2 justify-end sm:justify-start">
                        <Button
                          onClick={() => setSearchTerm("")}
                          disabled={!searchTerm}
                          className="inline-flex items-center rounded-full border border-border-lighter bg-surface-light px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-ui disabled:opacity-60 disabled:hover:bg-surface-light"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-text-tertiary">
                      Start typing to discover topics, geographies and years we can turn into filters.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border-lighter bg-white/70 p-4 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold text-text-primary">Suggested filters</h2>
                    <p className="mb-3 text-xs text-text-secondary">
                      Based on your search <span className="font-semibold">&ldquo;{searchTerm}&rdquo;</span>, we have found the following:
                    </p>
                    <ul className="space-y-3 text-sm text-text-primary">
                      {matchedConcepts.length === 0 && matchedGeos.length === 0 && matchedYears.length === 0 && (
                        <li className="text-xs text-text-tertiary">
                          We will show filter suggestions here once your search includes recognised topics, geographies or years.
                        </li>
                      )}

                      {matchedConcepts.length > 0 && (
                        <li>
                          <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Topics</p>
                          <div className="flex flex-wrap gap-2">
                            {matchedConcepts
                              .filter((concept) => !selectedTopics.includes(concept))
                              .map((concept) => (
                                <Button
                                  key={concept}
                                  onClick={() => setSelectedTopics([...selectedTopics, concept])}
                                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                                >
                                  {concept}
                                </Button>
                              ))}
                          </div>
                        </li>
                      )}

                      {matchedGeos.length > 0 && (
                        <li>
                          <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Geographies</p>
                          <div className="flex flex-wrap gap-2">
                            {matchedGeos
                              .filter((geo) => !selectedGeos.includes(geo))
                              .map((geo) => (
                                <Button
                                  key={geo}
                                  onClick={() => setSelectedGeos([...selectedGeos, geo])}
                                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                                >
                                  {geo}
                                </Button>
                              ))}
                          </div>
                        </li>
                      )}

                      {matchedYears.length > 0 && (
                        <li>
                          <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Years</p>
                          <div className="flex flex-wrap gap-2">
                            {matchedYears
                              .filter((year) => !selectedYears.includes(year))
                              .map((year) => (
                                <Button
                                  key={year}
                                  onClick={() => setSelectedYears([...selectedYears, year])}
                                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                                >
                                  {year}
                                </Button>
                              ))}
                          </div>
                        </li>
                      )}
                    </ul>

                    {(matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0) && (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Button
                          onClick={() => {
                            setSelectedTopics(matchedConcepts);
                            setSelectedGeos(matchedGeos);
                            setSelectedYears(matchedYears);
                            setRawSearchTerm(searchTerm);
                            setSearchTerm("");
                          }}
                          className="inline-flex items-center rounded-full bg-text-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-text-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-text-brand"
                        >
                          Apply all filters
                        </Button>
                        <span className="text-xs text-text-tertiary">or</span>
                        <Button
                          onClick={() => setSearchTerm(searchTerm)}
                          className="inline-flex items-center rounded-full border border-border-lighter bg-white px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-light"
                        >
                          Search &ldquo;{searchTerm}&rdquo; only
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border-lighter bg-white/70 p-4 shadow-sm space-y-3">
                    <p className="text-xs font-semibold tracking-[0.14em] text-text-tertiary uppercase">Filtered view</p>
                    <p className="text-sm text-text-primary">
                      Results for <span className="font-semibold">&ldquo;{rawSearchTerm}&rdquo;</span>
                    </p>
                    <p className="text-xs text-text-secondary">
                      This query has been translated into the filters on the left. Use the search box to adjust your query, or clear the filters to
                      start again.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm(rawSearchTerm);
                        setSelectedTopics([]);
                        setSelectedGeos([]);
                        setSelectedYears([]);
                      }}
                      className="mt-2 inline-flex items-center rounded-full border border-border-lighter bg-white px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-light"
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
