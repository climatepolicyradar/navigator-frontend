import sortBy from "lodash/fp/sortBy";
import { useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { Debug } from "@/components/atoms/debug/Debug";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { RecentFamiliesBlock } from "@/components/blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderMetadata, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { getGeographyPageSidebarItems } from "@/constants/sideBarItems";
import { GeographiesContext } from "@/context/GeographiesContext";
import { getFamilyCategorySummary, TCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { GeographyCountsResponse } from "@/pages/api/geography-counts";
import { TFamily, TSearch } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { v2GeoSlugToV1 } from "@/utils/geography";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";

import { IProps } from "./geographyOriginalPage";

export const GeographyLitigationPage = ({ geographyV2, parentGeographyV2, targets, theme, themeConfig, vespaSearchResults, envConfig }: IProps) => {
  // TODO handle block sorting/hiding programmatically (APP-1110)
  // const publishedTargets = sortFilterTargets(targets);

  const legislativeProcess = geographyV2.statistics?.legislative_process || "";
  const geographyMetaData = geographyV2.statistics ? getGeographyMetaData(geographyV2.statistics) : [];

  const isCountry = geographyV2.type === "country";

  const allGeographies = [geographyV2, ...(geographyV2.has_subconcept || [])];
  if (parentGeographyV2) allGeographies.push(parentGeographyV2);

  const subdivisions = useMemo(
    () =>
      sortBy(
        "name",
        isCountry ? geographyV2.has_subconcept : (parentGeographyV2?.has_subconcept || []).filter((subdivision) => subdivision.id !== geographyV2.id)
      ),
    [isCountry, geographyV2, parentGeographyV2]
  );

  const pageHeaderMetadata: IPageHeaderMetadata[] = [];
  if (!isCountry) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: (
        <LinkWithQuery href={`/geographies/${v2GeoSlugToV1(parentGeographyV2.slug)}`} className="underline">
          {parentGeographyV2.name}
        </LinkWithQuery>
      ),
    });
  }

  const sidebarItems = getGeographyPageSidebarItems({
    isCountry,
    metadata: geographyMetaData.length > 0,
    targets: targets.length > 0,
    legislativeProcess: Boolean(legislativeProcess),
    subdivisions: subdivisions.length > 0,
  });

  const [searchResultsByCategory, setSearchResultsByCategory] = useState<{ [categorySlug: string]: TSearch }>({
    All: vespaSearchResults,
  });

  const documentCategories = useMemo(
    () =>
      themeConfig.categories
        ? themeConfig.categories.options.map((category) => {
            return {
              title: category.label,
              /** We need to maintain the slug to to know what to send to Vespa for querying. */
              slug: category.slug,
            };
          })
        : /** We generate an `All` for when themeConfig.categories are not available e.g. MCFs */
          [
            {
              title: "All",
              slug: "All",
            },
          ],
    [themeConfig.categories]
  );

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

  return (
    <GeographiesContext.Provider value={allGeographies}>
      <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geographyV2.name} text={geographyV2.name}>
        <PageHeader coloured label="Geography" title={geographyV2.name} metadata={pageHeaderMetadata} />
        <Columns>
          <ContentsSideBar items={sidebarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
          <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-2:col-span-2 cols-3:py-8 cols-3:gap-8 cols-4:col-span-3">
            <RecentFamiliesBlock
              categorySummaries={documentCategories.map((categorySummary) => {
                return {
                  id: categorySummary.slug,
                  title: categorySummary.title,
                  families: searchResultsByCategory[categorySummary.slug]?.families || [],
                  count: searchResultsByCategory[categorySummary.slug]?.total_family_hits,
                  unit: ["document", "documents"],
                };
              })}
              onAccordionClick={(id) => {
                fetchFamiliesByCategory(id);
              }}
            />

            <SubDivisionBlock subdivisions={subdivisions} title={isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions"} />
            <MetadataBlock title="Statistics" metadata={geographyMetaData} id="section-statistics" />
            {/* TODO handle block sorting/hiding programmatically (APP-1110)
              <TargetsBlock targets={publishedTargets} theme={theme} />
              {legislativeProcess.length > 0 && (
                <TextBlock id="section-legislative-process" title="Legislative process">
                  <div className="text-content" dangerouslySetInnerHTML={{ __html: legislativeProcess }} />
                </TextBlock>
            )} */}
            {/* <Section id="section-debug" title="Debug">
              <Debug data={geographyV2} title="Geography V2" />
              <Debug data={parentGeographyV2} title="Parent geography V2" />
              <Debug data={targets} title="Targets" />
            </Section> */}
          </main>
        </Columns>
      </Layout>
    </GeographiesContext.Provider>
  );
};
