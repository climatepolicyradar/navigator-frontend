import sortBy from "lodash/fp/sortBy";
import { useCallback, useContext, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { fetchSearchPrincipalDocuments } from "@/api/search";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Debug } from "@/components/atoms/debug/Debug";
import { INTRO_BLOCK_TITLE, IntroBlock } from "@/components/blocks/introBlock/IntroBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { RecentFamiliesBlock } from "@/components/blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { TPublicEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { GeographiesContext } from "@/context/GeographiesContext";
import { useText } from "@/hooks/useText";
import {
  TSearch,
  TGeographyPageBlock,
  IMetadata,
  GeographyV2,
  ISearchDocumentsResponse,
  TTheme,
  TThemeConfig,
  TFeatures,
  TApiSearch,
  TFilterPathLabel,
  TSearchLabel,
} from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { TCategoryResults, toCategoryResults } from "@/utils/cards/getFamilySummaries";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";
import { CATEGORY_LABEL_PATH_LOOKUP, createLabel } from "@/utils/links/getGeoSearchLink";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

const geographyLabelPaths = (geographyLabel: TSearchLabel, categoryId: string): TFilterPathLabel[][] => {
  const parentType = geographyLabel.type === "subdivision" ? "country" : "region";
  const parentLabel = geographyLabel.labels.find((label) => label.type === "subconcept_of" && label.value.type === parentType);
  const labelPaths: TFilterPathLabel[][] = [parentLabel ? [geographyLabel, parentLabel.value] : [geographyLabel]];

  // The cards and the "All" link beside them need to show the same documents, so this
  // mirrors @see getGeoSearchLink's scoping (@see FUS-875)
  const categoryLabelPath = CATEGORY_LABEL_PATH_LOOKUP[categoryId];
  if (categoryLabelPath) labelPaths.push(categoryLabelPath.map(createLabel));

  return labelPaths;
};

export interface IProps {
  features: TFeatures;
  geographyV2: GeographyV2;
  parentGeographyV2?: GeographyV2;
  geographyLabel: TSearchLabel | null;
  theme: string;
  themeConfig: TThemeConfig;
  vespaSearchResults?: TSearch | ISearchDocumentsResponse;
  envConfig: TPublicEnvConfig;
}

export const GeographyPage = ({
  geographyV2,
  parentGeographyV2,
  geographyLabel,
  theme,
  themeConfig,
  features,
  vespaSearchResults,
  envConfig,
}: IProps) => {
  const { getAppText } = useText();

  const isCountry = geographyV2.type === "country";
  const subdivisionsTitle = isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions";

  const allGeographies = [geographyV2, ...(geographyV2.has_subconcept || [])];
  if (parentGeographyV2) allGeographies.push(parentGeographyV2);

  /* Page header */

  const pageHeaderMetadata: IMetadata[] = [];
  if (!isCountry && parentGeographyV2) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: (
        <LinkWithQuery href={`/geographies/${parentGeographyV2.slug}`} className="underline">
          {parentGeographyV2.name}
        </LinkWithQuery>
      ),
    });
  }

  /* Search requests */

  const isNewSearch = features["new-search"];
  const geographiesForCards = useContext(GeographiesContext);
  const [summariesByCategory, setSummariesByCategory] = useState<{ [categorySlug: string]: TCategoryResults }>({
    All: toCategoryResults(vespaSearchResults, isNewSearch, geographiesForCards),
  });

  /* Blocks */

  const blocksToRender = themeConfig.pageBlocks.geography;
  const blockDefinitions: TBlockDefinitions<TGeographyPageBlock> = {
    debug: {
      render: () => (
        <Section key="debug" block="debug" title="Debug">
          <div className="col-start-1 -col-end-1">
            <Debug data={geographyV2} title="Geography V2" />
            <Debug data={parentGeographyV2} title="Parent geography V2" />
          </div>
        </Section>
      ),
    },
    intro: {
      render: () => <IntroBlock key="intro" geography={geographyV2} />,
      sideBarItem: { display: INTRO_BLOCK_TITLE },
    },
    legislativeProcess: {
      render: useCallback(() => {
        const legislativeProcess = geographyV2.statistics?.legislative_process || "";
        if (legislativeProcess.length === 0) return null;

        return (
          <TextBlock
            key="legislative-process"
            context="legislative-process-block"
            block="legislativeProcess"
            title="Legislative process"
            maxHeight={168}
          >
            <div className="text-content" dangerouslySetInnerHTML={{ __html: legislativeProcess }} />
          </TextBlock>
        );
      }, [geographyV2]),
      sideBarItem: { display: "Legislative process" },
    },
    recents: {
      render: useCallback(() => {
        const backendApiClient = new ApiClient(envConfig.BACKEND_API_URL, envConfig.BACKEND_API_TOKEN);

        const fetchFamiliesByCategory = async (category: string) => {
          // New search reads the search API, the same store the search page reads. The legacy
          // `/searches` call holds none of the new Nature data documents.
          const results = isNewSearch
            ? toCategoryResults(
                await fetchSearchPrincipalDocuments({
                  apiUrl: envConfig.API_URL,
                  themeConfig,
                  filters: filterPathsToQueryGroup(geographyLabelPaths(geographyLabel, category), null, "and"),
                  page_size: "4",
                }),
                true,
                geographiesForCards
              )
            : toCategoryResults(
                await backendApiClient
                  .post<TApiSearch>("/searches", buildSearchQuery({ l: geographyV2.slug, c: category, page_size: "4" }, themeConfig), {
                    headers: {
                      accept: "application/json",
                      "Content-Type": "application/json",
                    },
                  })
                  .then((response) => response.data),
                false,
                geographiesForCards
              );

          setSummariesByCategory((currentResults) => ({
            ...currentResults,
            [category]: results,
          }));
        };

        const documentCategories = themeConfig.deprecatedCategories
          ? themeConfig.deprecatedCategories.options.map((category) => {
              return {
                // We need to maintain the slug to to know what to send to Vespa for querying.
                slug: category.slug,
                title: category.label,
              };
            })
          : [
              {
                // We generate an `All` for when themeConfig.deprecatedCategories are not available e.g. MCFs
                slug: "All",
                title: "All",
              },
            ];

        return (
          <RecentFamiliesBlock
            key="recents"
            categorySummaries={documentCategories.map((categorySummary) => {
              return {
                id: categorySummary.slug,
                title: categorySummary.title,
                families: summariesByCategory[categorySummary.slug]?.families || [],
                count: summariesByCategory[categorySummary.slug]?.count,
                singularAndPlural: [getAppText("familySingular"), getAppText("familyPlural")],
              };
            })}
            onAccordionClick={(id) => fetchFamiliesByCategory(id)}
            geography={geographyV2}
            geographyLabel={geographyLabel}
          />
        );
      }, [envConfig, geographiesForCards, geographyLabel, geographyV2, getAppText, isNewSearch, summariesByCategory, themeConfig]),
      sideBarItem: { display: "Recent " + getAppText("familyPlural") },
    },
    statistics: {
      render: useCallback(() => {
        const geographyMetaData = geographyV2.statistics ? getGeographyMetaData(geographyV2.statistics) : [];
        if (geographyMetaData.length === 0) return null;

        return <MetadataBlock key="statistics" block="statistics" title="About this geography" metadata={geographyMetaData} />;
      }, [geographyV2]),
    },
    subdivisions: {
      render: useCallback(() => {
        const subdivisions = sortBy(
          "name",
          isCountry
            ? geographyV2.has_subconcept
            : (parentGeographyV2?.has_subconcept || []).filter((subdivision) => subdivision.id !== geographyV2.id)
        );

        return <SubDivisionBlock key="subdivisions" subdivisions={subdivisions} title={subdivisionsTitle} />;
      }, [geographyV2, isCountry, parentGeographyV2, subdivisionsTitle]),
      sideBarItem: { display: subdivisionsTitle },
    },
  };

  /* Render */

  return (
    <FeaturesContext.Provider value={features}>
      <Layout metadataKey="geography" theme={theme as TTheme} themeConfig={themeConfig} title={geographyV2.name} text={geographyV2.name}>
        <GeographiesContext.Provider value={allGeographies}>
          <BreadCrumbs
            dark
            geography={{ label: geographyV2.name, href: `/geographies/${geographyV2.slug}` }}
            parentGeography={parentGeographyV2 ? { label: parentGeographyV2.name, href: `/geographies/${parentGeographyV2.slug}` } : null}
            isSubdivision={!isCountry}
          />
          <PageHeader dark label="Geography" title={geographyV2.name} metadata={pageHeaderMetadata} />
          <BlocksLayout blockDefinitions={blockDefinitions} blocksToRender={blocksToRender} />
        </GeographiesContext.Provider>
      </Layout>
    </FeaturesContext.Provider>
  );
};
