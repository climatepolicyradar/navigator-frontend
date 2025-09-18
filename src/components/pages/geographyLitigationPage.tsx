import sortBy from "lodash/fp/sortBy";
import { useCallback, useEffect, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Debug } from "@/components/atoms/debug/Debug";
import { RecentFamiliesBlock } from "@/components/blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import { TargetsBlock } from "@/components/blocks/targetsBlock/TargetsBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { IPageHeaderMetadata, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { GeographiesContext } from "@/context/GeographiesContext";
import { TSearch, TGeographyPageBlock } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { sortFilterTargets } from "@/utils/sortFilterTargets";

import { IProps } from "./geographyOriginalPage";

export const GeographyLitigationPage = ({ geographyV2, parentGeographyV2, targets, theme, themeConfig, vespaSearchResults, envConfig }: IProps) => {
  const isCountry = geographyV2.type === "country";
  const subdivisionsTitle = isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions";

  const allGeographies = [geographyV2, ...(geographyV2.has_subconcept || [])];
  if (parentGeographyV2) allGeographies.push(parentGeographyV2);

  /* Page header */

  const pageHeaderMetadata: IPageHeaderMetadata[] = [];
  if (!isCountry) {
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

  const [searchResultsByCategory, setSearchResultsByCategory] = useState<{ [categorySlug: string]: TSearch }>({
    All: vespaSearchResults,
  });
  // re-render when the page has changed
  useEffect(() => {
    setSearchResultsByCategory({
      All: vespaSearchResults,
    });
  }, [vespaSearchResults]);

  /* Blocks */

  // TODO better app-specific family taxonomy
  const recentFamiliesTitle = theme === "ccc" ? "Recent cases" : "Recent families";

  const blocksToRender = themeConfig.pageBlocks.geography;
  const blockDefinitions: TBlockDefinitions<TGeographyPageBlock> = {
    debug: {
      render: () => (
        <Section key="debug" block="debug" title="Debug">
          <Debug data={geographyV2} title="Geography V2" />
          <Debug data={parentGeographyV2} title="Parent geography V2" />
          <Debug data={targets} title="Targets" />
        </Section>
      ),
    },
    "legislative-process": {
      render: useCallback(() => {
        const legislativeProcess = geographyV2.statistics?.legislative_process || "";
        if (legislativeProcess.length === 0) return null;

        return (
          <TextBlock key="legislative-process" block="legislative-process" title="Legislative process">
            <div className="text-content" dangerouslySetInnerHTML={{ __html: legislativeProcess }} />
          </TextBlock>
        );
      }, [geographyV2]),
      sideBarItem: { display: "Legislative Process" },
    },
    recents: {
      render: useCallback(() => {
        const backendApiClient = new ApiClient(envConfig.BACKEND_API_URL, envConfig.BACKEND_API_TOKEN);

        const fetchFamiliesByCategory = async (category: string) => {
          if (searchResultsByCategory[category]) {
            return searchResultsByCategory[category];
          } else {
            const searchQuery = buildSearchQuery({ l: geographyV2.slug, c: category }, themeConfig);
            const search: TSearch = await backendApiClient
              .post("/searches", searchQuery, {
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                },
              })
              .then((response) => response.data);

            setSearchResultsByCategory((currentFamilies) => ({
              ...currentFamilies,
              [category]: search,
            }));
          }
        };

        const documentCategories = themeConfig.categories
          ? themeConfig.categories.options.map((category) => {
              return {
                // We need to maintain the slug to to know what to send to Vespa for querying.
                slug: category.slug,
                title: category.label,
              };
            })
          : [
              {
                // We generate an `All` for when themeConfig.categories are not available e.g. MCFs
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
                families: searchResultsByCategory[categorySummary.slug]?.families || [],
                count: searchResultsByCategory[categorySummary.slug]?.total_family_hits,
                // TODO better app-specific family taxonomy
                singularAndPlural: theme === "ccc" ? ["case", "cases"] : ["document", "documents"],
              };
            })}
            onAccordionClick={(id) => {
              fetchFamiliesByCategory(id);
            }}
            geography={geographyV2}
            title={recentFamiliesTitle}
          />
        );
      }, [envConfig, geographyV2, recentFamiliesTitle, searchResultsByCategory, theme, themeConfig]),
      sideBarItem: { display: recentFamiliesTitle },
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
    targets: {
      render: useCallback(() => {
        const publishedTargets = sortFilterTargets(targets);
        return <TargetsBlock key="targets" targets={publishedTargets} theme={theme} />;
      }, [targets, theme]),
    },
  };

  /* Render */

  return (
    <GeographiesContext.Provider value={allGeographies}>
      <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geographyV2.name} text={geographyV2.name}>
        <BreadCrumbs
          geography={{ label: geographyV2.name, href: `/geographies/${geographyV2.slug}` }}
          parentGeography={parentGeographyV2 ? { label: parentGeographyV2.name, href: `/geographies/${parentGeographyV2.slug}` } : null}
          isSubdivision={!isCountry}
        />
        <PageHeader coloured label="Geography" title={geographyV2.name} metadata={pageHeaderMetadata} />
        <BlocksLayout blockDefinitions={blockDefinitions} blocksToRender={blocksToRender} />
      </Layout>
    </GeographiesContext.Provider>
  );
};
