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
          <section>
            <>
              <Input
                placeholder="Search"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className={"h-[40px] focus-within:outline-0!"}
                value={searchTerm}
              />

              <Button onClick={() => setSearchTerm("")}>x</Button>
            </>

            <div>
              <ul>
                <li> Based on your search: "{searchTerm}", we found the following topics, geos, and years:</li>
                {matchedConcepts
                  .filter((concept) => !selectedTopics.includes(concept))
                  .map((concept) => (
                    <li key={concept}>
                      <Button onClick={() => setSelectedTopics([...selectedTopics, concept])}>{concept}</Button>
                    </li>
                  ))}
                {matchedGeos
                  .filter((geo) => !selectedGeos.includes(geo))
                  .map((geo) => (
                    <li key={geo}>
                      <Button onClick={() => setSelectedGeos([...selectedGeos, geo])}>{geo}</Button>
                    </li>
                  ))}
                {matchedYears
                  .filter((year) => !selectedYears.includes(year))
                  .map((year) => (
                    <li key={year}>
                      <Button onClick={() => setSelectedYears([...selectedYears, year])}>{year}</Button>
                    </li>
                  ))}
                {(matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0) && (
                  <>
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
                    <p>or</p>
                  </>
                )}
                <Button onClick={() => setSearchTerm(searchTerm)}>Search "{searchTerm}"?</Button>
              </ul>
            </div>
            <br />

            <div>
              <p>Filters:</p>
              <p>
                Topics:{" "}
                {selectedTopics.map((topic) => (
                  <Button key={topic} onClick={() => setSelectedTopics(selectedTopics.filter((topicToRemove) => topicToRemove !== topic))}>
                    {topic}
                  </Button>
                ))}
              </p>
              <p>
                Geos:{" "}
                {selectedGeos.map((geo) => (
                  <Button key={geo} onClick={() => setSelectedGeos(selectedGeos.filter((geoToRemove) => geoToRemove !== geo))}>
                    {geo}
                  </Button>
                ))}
              </p>
              <p>
                Years:{" "}
                {selectedYears.map((year) => (
                  <Button key={year} onClick={() => setSelectedYears(selectedYears.filter((yearToRemove) => yearToRemove !== year))}>
                    {year}
                  </Button>
                ))}
              </p>
            </div>

            <br />
            <div>
              <p>Results for your query:</p>
              <p>"{rawSearchTerm}"</p>

              <p>This has been transformed into a filtered view...:</p>
              <Button
                onClick={() => {
                  setSearchTerm(rawSearchTerm);
                  setSelectedTopics([]);
                  setSelectedGeos([]);
                  setSelectedYears([]);
                }}
              >
                Reset
              </Button>
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
