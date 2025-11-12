import sortBy from "lodash/fp/sortBy";
import { useCallback, useEffect, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Debug } from "@/components/atoms/debug/Debug";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { RecentFamiliesBlock } from "@/components/blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import { TargetsBlock } from "@/components/blocks/targetsBlock/TargetsBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { GeographiesContext } from "@/context/GeographiesContext";
import { useText } from "@/hooks/useText";
import { TSearch, TGeographyPageBlock, IMetadata } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";
import { sortFilterTargets } from "@/utils/sortFilterTargets";

import { IProps } from "./geographyOriginalPage";

export const GeographyLitigationPage = ({ geographyV2, parentGeographyV2, targets, theme, themeConfig, vespaSearchResults, envConfig }: IProps) => {
  const { getText } = useText();

  const isCountry = geographyV2.type === "country";
  const subdivisionsTitle = isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions";

  const allGeographies = [geographyV2, ...(geographyV2.has_subconcept || [])];
  if (parentGeographyV2) allGeographies.push(parentGeographyV2);

  /* Page header */

  const pageHeaderMetadata: IMetadata[] = [];
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

  /* Blocks */

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
    legislativeProcess: {
      render: useCallback(() => {
        const legislativeProcess = geographyV2.statistics?.legislative_process || "";
        if (legislativeProcess.length === 0) return null;

        return (
          <TextBlock key="legislative-process" block="legislative-process" title="Legislative process" maxHeight={168}>
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
          const searchQuery = buildSearchQuery({ l: geographyV2.slug, c: category, page_size: "4" }, themeConfig);
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
                singularAndPlural: [getText("familySingular"), getText("familyPlural")],
              };
            })}
            onAccordionClick={(id) => fetchFamiliesByCategory(id)}
            geography={geographyV2}
          />
        );
      }, [envConfig, geographyV2, getText, searchResultsByCategory, themeConfig]),
      sideBarItem: { display: getText("recentFamiliesBlockTitle") },
    },
    statistics: {
      render: useCallback(() => {
        const geographyMetaData = geographyV2.statistics ? getGeographyMetaData(geographyV2.statistics) : [];
        if (geographyMetaData.length === 0) return null;

        return <MetadataBlock key="statistics" block="statistics" title="Statistics" metadata={geographyMetaData} />;
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
          dark
          geography={{ label: geographyV2.name, href: `/geographies/${geographyV2.slug}` }}
          parentGeography={parentGeographyV2 ? { label: parentGeographyV2.name, href: `/geographies/${parentGeographyV2.slug}` } : null}
          isSubdivision={!isCountry}
        />
        <PageHeader dark label="Geography" title={geographyV2.name} metadata={pageHeaderMetadata} />
        <BlocksLayout blockDefinitions={blockDefinitions} blocksToRender={blocksToRender} />
      </Layout>
    </GeographiesContext.Provider>
  );
};
