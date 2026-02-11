/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@base-ui/react/button";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

import { ApiClient } from "@/api/http-common";
import { SearchTypeahead } from "@/components/_experiment/searchTypeahead/SearchTypeahead";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TopicsContext } from "@/context/TopicsContext";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import useConfig from "@/hooks/useConfig";
import { TTopic, TTopics } from "@/types";
import { FamilyConcept, mapFamilyConceptsToConcepts } from "@/utils/familyConcepts";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { fetchAndProcessTopics } from "@/utils/fetchAndProcessTopics";
import { readConfigFile } from "@/utils/readConfigFile";

type TProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ShadowSearch = ({ theme, themeConfig, features, topicsData, familyConceptsData }: TProps) => {
  const configQuery = useConfig();
  const { data: { regions = [], countries = [], corpus_types = {} } = {} } = configQuery;

  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>([]);
  return (
    <FeaturesContext.Provider value={features}>
      <TopicsContext.Provider value={topicsData}>
        <WikiBaseConceptsContext.Provider value={familyConceptsData || []}>
          <section className="bg-surface-light py-10 md:py-16">
            <div className="mx-auto max-w-5xl px-4">
              <header className="mb-4 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">Experimental</p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">Search</h1>
              </header>
              <div className="grid gap-8 md:grid-cols-12 items-start">
                <aside className="md:col-span-4 space-y-4 border border-border-lighter bg-white p-4">
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

                    <div>
                      <p className="mb-1 text-xs font-medium text-text-tertiary">Document types</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDocumentTypes.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                        {selectedDocumentTypes.map((documentType) => (
                          <Button
                            key={documentType}
                            onClick={() => setSelectedDocumentTypes(selectedDocumentTypes.filter((typeToRemove) => typeToRemove !== documentType))}
                            className="group inline-flex items-center gap-1 rounded-full border border-border-lighter bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui hover:text-text-brand transition"
                          >
                            <span>{documentType}</span>
                            <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(selectedTopics.length > 0 || selectedGeos.length > 0 || selectedYears.length > 0 || selectedDocumentTypes.length > 0) && (
                    <Button
                      onClick={() => {
                        setSelectedTopics([]);
                        setSelectedGeos([]);
                        setSelectedYears([]);
                        setSelectedDocumentTypes([]);
                      }}
                      className="mt-2 inline-flex items-center border border-border-lighter bg-surface-light px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-ui"
                    >
                      Clear all filters
                    </Button>
                  )}
                </aside>

                <main className="md:col-span-8 space-y-6">
                  <SearchTypeahead
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    selectedTopics={selectedTopics}
                    selectedGeos={selectedGeos}
                    selectedYears={selectedYears}
                    selectedDocumentTypes={selectedDocumentTypes}
                    onSelectConcept={(concept) => {
                      setSelectedTopics([...selectedTopics, concept]);
                    }}
                    onSelectGeo={(geo) => {
                      setSelectedGeos([...selectedGeos, geo]);
                    }}
                    onSelectYear={(year) => {
                      setSelectedYears([...selectedYears, year]);
                    }}
                    onSelectDocumentType={(documentType) => {
                      setSelectedDocumentTypes([...selectedDocumentTypes, documentType]);
                    }}
                    onApplyAll={({ concepts, geos, years, documentTypes }) => {
                      setSelectedTopics(concepts);
                      setSelectedGeos(geos);
                      setSelectedYears(years);
                      setSelectedDocumentTypes(documentTypes);
                      setRawSearchTerm(searchTerm);
                      setSearchTerm("");
                    }}
                    onSearchOnly={() => {
                      setRawSearchTerm(searchTerm);
                      setSearchTerm("");
                    }}
                  />

                  <div className="border border-border-lighter bg-white p-4 space-y-3">
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
