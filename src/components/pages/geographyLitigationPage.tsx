import { Columns } from "@/components/atoms/columns/Columns";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
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
import { LinkWithQuery } from "../LinkWithQuery";
import { Debug } from "../atoms/debug/Debug";
import { RecentFamiliesBlock } from "../blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { TargetsBlock } from "../blocks/targetsBlock/TargetsBlock";
import { TextBlock } from "../blocks/textBlock/TextBlock";

export const GeographyLitigationPage = ({ geography, geographyV2, parentGeographyV2, summary, targets, theme, themeConfig }: IProps) => {
  const categorySummaries = themeConfig.documentCategories.map((category) => getFamilyCategorySummary(summary, category));
  const publishedTargets = sortFilterTargets(targets);

  const legislativeProcess = geography?.legislative_process || "";
  const geographyMetaData = geography ? getGeographyMetaData(geography) : [];

  const sidebarItems = getGeographyPageSidebarItems({
    metadata: geographyMetaData.length > 0,
    targets: targets.length > 0,
    legislativeProcess: Boolean(legislativeProcess),
  });

  const pageTitle = parentGeographyV2 ? (
    <>
      <LinkWithQuery href={`/geographies/${v2GeoSlugToV1(parentGeographyV2.slug)}`} className="hover:underline">
        {parentGeographyV2.name}
      </LinkWithQuery>
      <span className="text-text-light/60"> / </span>
      <span>{geographyV2.name}</span>
    </>
  ) : (
    geographyV2.name
  );

  return (
    <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geographyV2.name} text={geographyV2.name}>
      <PageHeader coloured label="Geography" title={pageTitle} metadata={[]} />
      <Columns>
        <ContentsSideBar items={sidebarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
          <RecentFamiliesBlock categorySummaries={categorySummaries} />
          <SubDivisionBlock subdivisions={geographyV2.has_subconcept} />
          <MetadataBlock title="Statistics" metadata={geographyMetaData} id="section-statistics" />
          <TargetsBlock targets={publishedTargets} theme={theme} />
          {legislativeProcess.length > 0 && (
            <TextBlock id="section-legislative-process" title="Legislative process">
              <div className="text-content" dangerouslySetInnerHTML={{ __html: legislativeProcess }} />
            </TextBlock>
          )}
          <Section id="section-debug" title="Debug">
            <Debug data={geography} title="Geography V1" />
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
