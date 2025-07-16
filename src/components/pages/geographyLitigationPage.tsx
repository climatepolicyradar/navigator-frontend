import { Columns } from "@/components/atoms/columns/Columns";
import Layout from "@/components/layouts/Main";

import { IProps } from "./geographyOriginalPage";
import { ContentsSideBar } from "../organisms/contentsSideBar/ContentsSideBar";

export const GeographyLitigationPage = ({ geography, theme, themeConfig }: IProps) => {
  return (
    <Layout metadataKey="geography" theme={theme} themeConfig={themeConfig} title={geography.name}>
      <Columns>
        <ContentsSideBar items={[]} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="py-3 cols-2:py-6 cols-3:py-8 cols-3:col-span-2 cols-4:col-span-3">
          <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(geography, null, 2)}</pre>
        </main>
      </Columns>
    </Layout>
  );
};
