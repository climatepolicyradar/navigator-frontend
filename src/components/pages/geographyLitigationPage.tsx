import { Columns } from "@/components/atoms/columns/Columns";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import Layout from "@/components/layouts/Main";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderMetadata, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { getGeographyMetaData } from "@/utils/getGeographyMetadata";

import { IProps } from "./geographyOriginalPage";

export const GeographyLitigationPage = ({ geography, theme, themeConfig }: IProps) => {
  const pageHeaderMetadata: IPageHeaderMetadata[] = [{ label: "Metadata", value: "TODO" }];

  return (
    <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geography.name} text={geography.name}>
      <PageHeader label="Geography" title={geography.name} metadata={pageHeaderMetadata} />
      <Columns>
        <ContentsSideBar items={[]} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
          <MetadataBlock title="Statistics" metadata={getGeographyMetaData(geography)} id="section-metadata" />
          <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(geography, null, 2)}</pre>
        </main>
      </Columns>
    </Layout>
  );
};
