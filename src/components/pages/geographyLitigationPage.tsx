import sortBy from "lodash/fp/sortBy";
import { useMemo } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { Debug } from "@/components/atoms/debug/Debug";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { RecentFamiliesBlock } from "@/components/blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import { TargetsBlock } from "@/components/blocks/targetsBlock/TargetsBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { getGeographyPageSidebarItems } from "@/constants/sideBarItems";
import { getFamilyCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { v2GeoSlugToV1 } from "@/utils/geography";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";
import { sortFilterTargets } from "@/utils/sortFilterTargets";

import { IProps } from "./geographyOriginalPage";

export const GeographyLitigationPage = ({ geographyV2, parentGeographyV2, summary, targets, theme, themeConfig }: IProps) => {
  const categorySummaries = themeConfig.documentCategories.map((category) => getFamilyCategorySummary(summary, category));
  const publishedTargets = sortFilterTargets(targets);

  const legislativeProcess = geographyV2.statistics?.legislative_process || "";
  const geographyMetaData = geographyV2.statistics ? getGeographyMetaData(geographyV2.statistics) : [];

  const isCountry = geographyV2.type === "country";

  const subdivisions = useMemo(
    () =>
      sortBy(
        "name",
        isCountry ? geographyV2.has_subconcept : (parentGeographyV2?.has_subconcept || []).filter((subdivision) => subdivision.id !== geographyV2.id)
      ),
    [isCountry, geographyV2, parentGeographyV2]
  );

  const pageTitle = isCountry ? (
    geographyV2.name
  ) : (
    <>
      <LinkWithQuery href={`/geographies/${v2GeoSlugToV1(parentGeographyV2.slug)}`} className="hover:underline">
        {parentGeographyV2.name}
      </LinkWithQuery>
      <span className="text-text-light/60"> / </span>
      <span>{geographyV2.name}</span>
    </>
  );

  const sidebarItems = getGeographyPageSidebarItems({
    isCountry,
    metadata: geographyMetaData.length > 0,
    targets: targets.length > 0,
    legislativeProcess: Boolean(legislativeProcess),
    subdivisions: subdivisions.length > 0,
  });

  return (
    <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geographyV2.name} text={geographyV2.name}>
      <PageHeader coloured label="Geography" title={pageTitle} metadata={[]} />
      <Columns>
        <ContentsSideBar items={sidebarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-2:col-span-2 cols-3:py-8 cols-3:gap-8 cols-4:col-span-3">
          <RecentFamiliesBlock categorySummaries={categorySummaries} />
          <SubDivisionBlock subdivisions={subdivisions} title={isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions"} />
          <MetadataBlock title="Statistics" metadata={geographyMetaData} id="section-statistics" />
          <TargetsBlock targets={publishedTargets} theme={theme} />
          {legislativeProcess.length > 0 && (
            <TextBlock id="section-legislative-process" title="Legislative process">
              <div className="text-content" dangerouslySetInnerHTML={{ __html: legislativeProcess }} />
            </TextBlock>
          )}
          <Section id="section-debug" title="Debug">
            <Debug data={geographyV2} title="Geography V2" />
            <Debug data={parentGeographyV2} title="Parent geography V2" />
            <Debug data={summary} title="Summary" />
            <Debug data={targets} title="Targets" />
          </Section>
        </main>
      </Columns>
    </Layout>
  );
};
