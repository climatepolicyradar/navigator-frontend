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
          <div className="mb-19">
            <h1 className="text-4xl leading-tight font-[640] text-text-primary">{family.title}</h1>
          </div>
          <div className="flex flex-col gap-24">
            {/* Each section should eventually be its own component */}
            {FAMILY_PAGE_SIDE_BAR_ITEMS_SORTED.map((item) => (
              <section key={item.id} id={item.id} className="scroll-m-21 cols-2:scroll-m-24 cols-3:scroll-m-26">
                <h2 className="text-2xl leading-tight font-[640] text-text-primary mb-4">{item.display}</h2>
                <div className="h-[500px] bg-[rgb(230,230,230)] rounded-xl" />
              </section>
            ))}
          </div>
        </main>
      </Columns>
    </Layout>
  );
};
