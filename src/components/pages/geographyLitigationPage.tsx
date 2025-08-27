import { Columns } from "@/components/atoms/columns/Columns";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { SubDivisionBlock } from "@/components/blocks/subDivisionBlock/SubDivisionBlock";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { getGeographyPageSidebarItems } from "@/constants/sideBarItems";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";

import { IProps } from "./geographyOriginalPage";
import { TextBlock } from "../blocks/textBlock/TextBlock";

export const GeographyLitigationPage = ({ geography, summary, theme, themeConfig, subdivisions }: IProps) => {
  const sidebarItems = getGeographyPageSidebarItems(geography);

  return (
    <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geography.name} text={geography.name}>
      <PageHeader coloured label="Geography" title={geography.name} metadata={[]} />
      <Columns>
        <ContentsSideBar items={sidebarItems} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
          <SubDivisionBlock
            id="section-subdivisions"
            subdivisions={subdivisions}
            title={
              <>
                <span>Geographic sub-divisions</span>
                <span className="font-normal text-text-tertiary ml-2">{subdivisions.length}</span>
              </>
            }
          />
          <MetadataBlock title="Statistics" metadata={getGeographyMetaData(geography)} id="section-statistics" />
          {geography.legislative_process.length > 0 && (
            <TextBlock id="section-legislative-process" title="Legislative process">
              <div className="text-content" dangerouslySetInnerHTML={{ __html: geography.legislative_process }} />
            </TextBlock>
          )}
          <Section id="section-debug" title="Debug">
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(geography, null, 2)}</pre>
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(summary, null, 2)}</pre>
            <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">
              {JSON.stringify(subdivisions, null, 2)}
            </pre>
          </Section>
        </main>
      </Columns>
    </Layout>
  );
};
