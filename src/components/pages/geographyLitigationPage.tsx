import { Columns } from "@/components/atoms/columns/Columns";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { getGeographyPageSidebarItems } from "@/constants/sideBarItems";
import { getFamilyCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";
import { sortFilterTargets } from "@/utils/sortFilterTargets";

import { IProps } from "./geographyOriginalPage";
import { RecentFamiliesBlock } from "../blocks/recentFamiliesBlock/RecentFamiliesBlock";
import { TargetsBlock } from "../blocks/targetsBlock/TargetsBlock";
import { TextBlock } from "../blocks/textBlock/TextBlock";

export const GeographyLitigationPage = ({ geography, summary, targets, theme, themeConfig, geographyV2 }: IProps) => {
  const categorySummaries = themeConfig.documentCategories.map((category) => getFamilyCategorySummary(summary, category));
  const publishedTargets = sortFilterTargets(targets);

  const sidebarItems = getGeographyPageSidebarItems(geography, publishedTargets);

  return (
    <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geography.name} text={geography.name}>
      <PageHeader coloured label="Geography" title={geography.name} metadata={[]} />
      <Columns>
        <ContentsSideBar items={sidebarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
          <RecentFamiliesBlock categorySummaries={categorySummaries} />
          <SubDivisionBlock subdivisions={geographyV2.has_subconcept} />
          <MetadataBlock title="Statistics" metadata={getGeographyMetaData(geography)} id="section-statistics" />
          <TargetsBlock targets={publishedTargets} theme={theme} />
          {geography.legislative_process.length > 0 && (
            <TextBlock id="section-legislative-process" title="Legislative process">
              <div className="text-content" dangerouslySetInnerHTML={{ __html: geography.legislative_process }} />
            </TextBlock>
          )}
          <Section id="section-debug" title="Debug">
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(geography, null, 2)}</pre>
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(summary, null, 2)}</pre>
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">
              {JSON.stringify(geographyV2.has_subconcept, null, 2)}
            </pre>
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(targets, null, 2)}</pre>
          </Section>
        </main>
      </Columns>
    </Layout>
  );
};
