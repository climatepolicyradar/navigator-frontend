import { Columns } from "@/components/atoms/columns/Columns";
import Layout from "@/components/layouts/Main";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { FAMILY_PAGE_SIDE_BAR_ITEMS_SORTED } from "@/constants/sideBarItems";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";

import { IProps } from "./familyOriginalPage";

export const FamilyLitigationPage = ({ family, theme, themeConfig }: IProps) => {
  return (
    <Layout
      title={family.title}
      description={getFamilyMetaDescription(family.summary, "", family.category)}
      theme={theme}
      themeConfig={themeConfig}
      metadataKey="family"
    >
      <Columns>
        <ContentsSideBar items={FAMILY_PAGE_SIDE_BAR_ITEMS_SORTED} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="py-3 cols-2:py-6 cols-3:py-8 cols-3:col-span-2 cols-4:col-span-3">
          <pre className="w-full max-h-[700px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(family, null, 2)}</pre>
        </main>
      </Columns>
    </Layout>
  );
};
