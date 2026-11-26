import { useCallback, useContext, useMemo, useState } from "react";

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
import { ThemeContext } from "@/context/ThemeContext";
import { useText } from "@/hooks/useText";
import {
  TGeographyPageBlock,
  IMetadata,
  ISearchDocumentsResponse,
  TTheme,
  TFeatures,
  TFilterPathLabel,
  TGeographyStatistics,
  TNestedSearchLabel,
} from "@/types";
import { TCategoryResults, toCategoryResults } from "@/utils/cards/getFamilySummaries";
import { getGeographySlug } from "@/utils/geography";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";
import { CATEGORY_LABEL_PATH_LOOKUP, createLabel } from "@/utils/links/getGeoSearchLink";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

// The recents block shows a single row of cards per category.
const RECENT_FAMILIES_PAGE_SIZE = 4;

const geographyLabelPaths = (geographyPath: TFilterPathLabel[], categoryId: string): TFilterPathLabel[][] => {
  const labelPaths: TFilterPathLabel[][] = [geographyPath];

  // The cards and the "All" link beside them need to show the same documents, so this
  // mirrors @see getGeoSearchLink's scoping (@see FUS-875)
  const categoryLabelPath = CATEGORY_LABEL_PATH_LOOKUP[categoryId];
  if (categoryLabelPath) labelPaths.push(categoryLabelPath.map(createLabel));

  return labelPaths;
};

interface IProps {
  features: TFeatures;
  current: TNestedSearchLabel;
  parent: TNestedSearchLabel | null;
  statistics: TGeographyStatistics | null;
  name: string;
  theme: TTheme;
  vespaSearchResults: ISearchDocumentsResponse;
  envConfig: TPublicEnvConfig;
}

export const GeographyPage = ({ current, parent, statistics, name, theme, features, vespaSearchResults, envConfig }: IProps) => {
  const { themeConfig } = useContext(ThemeContext);
  const { getAppText } = useText();
  const geographyPath = useMemo(() => [current.id, parent?.id].filter(Boolean).map(createLabel), [current, parent]);

  const isCountry = current.type === "country";
  const slug = getGeographySlug(current);
  const parentSlug = !isCountry && parent ? getGeographySlug(parent) : null;
  const pageParent = parentSlug ? { label: parent.value, href: `/geographies/${parentSlug}` } : null;
  const subdivisionsTitle = isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions";

  /* Page header */

  const pageHeaderMetadata: IMetadata[] = [];
  if (pageParent) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: (
        <LinkWithQuery href={pageParent.href} className="underline">
          {pageParent.label}
        </LinkWithQuery>
      ),
    });
  }

  /* Search requests */

  const [summariesByCategory, setSummariesByCategory] = useState<{ [categorySlug: string]: TCategoryResults }>({
    All: toCategoryResults(vespaSearchResults),
  });

  /* Blocks */

  const blocksToRender = themeConfig.pageBlocks.geography;
  const blockDefinitions: TBlockDefinitions<TGeographyPageBlock> = {
    debug: {
      render: () => (
        <Section key="debug" block="debug" title="Debug">
          <div className="col-start-1 -col-end-1">
            <Debug data={current} title="Geography" />
            <Debug data={parent} title="Parent geography" />
          </div>
        </Section>
      ),
    },
    intro: {
      render: () => <IntroBlock key="intro" name={name} slug={slug} />,
      sideBarItem: { display: INTRO_BLOCK_TITLE },
    },
    legislativeProcess: {
      render: useCallback(() => {
        const legislativeProcess = statistics?.legislative_process || "";
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
      }, [statistics]),
      sideBarItem: { display: "Legislative process" },
    },
    recents: {
      render: useCallback(() => {
        const fetchFamiliesByCategory = async (category: string) => {
          // Reads the search API, the same store the search page reads
          const results = toCategoryResults(
            await fetchSearchPrincipalDocuments({
              apiUrl: envConfig.API_URL,
              themeConfig,
              features,
              filters: filterPathsToQueryGroup(geographyLabelPaths(geographyPath, category), null, "and"),
              page_size: String(RECENT_FAMILIES_PAGE_SIZE),
              sort: "recent",
            })
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
            geographyPath={geographyPath}
          />
        );
      }, [envConfig, features, geographyPath, getAppText, summariesByCategory, themeConfig]),
      sideBarItem: { display: "Recent " + getAppText("familyPlural") },
    },
    statistics: {
      render: useCallback(() => {
        const geographyMetaData = statistics ? getGeographyMetaData(statistics) : [];
        if (geographyMetaData.length === 0) return null;

        return <MetadataBlock key="statistics" block="statistics" title="About this geography" metadata={geographyMetaData} />;
      }, [statistics]),
    },
    subdivisions: {
      render: useCallback(() => {
        const country = isCountry ? current : parent;
        if (!country) return null;

        return <SubDivisionBlock key="subdivisions" country={country} exclude={isCountry ? undefined : slug} title={subdivisionsTitle} />;
      }, [current, parent, isCountry, slug, subdivisionsTitle]),
      sideBarItem: { display: subdivisionsTitle },
    },
  };

  /* Render */

  return (
    <FeaturesContext.Provider value={features}>
      <Layout metadataKey="geography" theme={theme} title={name} text={name}>
        <BreadCrumbs dark geography={{ label: name, href: `/geographies/${slug}` }} parentGeography={pageParent} isSubdivision={!isCountry} />
        <PageHeader dark label="Geography" title={name} metadata={pageHeaderMetadata} />
        <BlocksLayout blockDefinitions={blockDefinitions} blocksToRender={blocksToRender} />
      </Layout>
    </FeaturesContext.Provider>
  );
};
