import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import Layout from "@/components/layouts/Main";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderMetadata, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { FAMILY_PAGE_SIDE_BAR_ITEMS_SORTED } from "@/constants/sideBarItems";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { TFamilyNew, TFamilyPage } from "@/types";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { getFamilyMetadata } from "@/utils/getFamilyMetadata";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

import { IProps } from "./familyOriginalPage";

const isNewEndpointData = (family: TFamilyPage | TFamilyNew): family is TFamilyNew => "concepts" in family;

export const FamilyLitigationPage = ({ countries, family, theme, themeConfig }: IProps) => {
  // TODO remove when only the newer API endpoint is being called in getServerSideProps
  if (!isNewEndpointData(family)) {
    throw new Error("Cannot render FamilyLitigationPage with V1 API data");
  }

  const categoryName = getCategoryName(family.category, family.corpus_type_name, family.organisation);
  const [year] = convertDate(family.published_date);

  const pageHeaderMetadata: IPageHeaderMetadata[] = [
    { label: "Date", value: isNaN(year) ? "" : year },
    {
      label: "Geography",
      value: joinNodes(
        family.geographies.map((geo) => (
          <LinkWithQuery key={geo} href={`/geographies/${getCountrySlug(geo, countries)}`} className="underline">
            {getCountryName(geo, countries)}
          </LinkWithQuery>
        )),
        ", "
      ),
    },
  ];
  if (family.collections.length) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: joinNodes(
        family.collections.map((collection) => collection.title),
        ", "
      ),
    });
  }

  return (
    <Layout
      title={family.title}
      description={getFamilyMetaDescription(family.summary, "", family.category)}
      theme={theme}
      themeConfig={themeConfig}
      metadataKey="family"
    >
      <PageHeader label={categoryName} title={family.title} metadata={pageHeaderMetadata} />
      <Columns>
        <ContentsSideBar items={FAMILY_PAGE_SIDE_BAR_ITEMS_SORTED} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-3:py-8 cols-3:gap-8 cols-3:col-span-2 cols-4:col-span-3">
          <DocumentsBlock countries={countries} family={family} status="success" />
          <TextBlock>
            <div className="text-content" dangerouslySetInnerHTML={{ __html: family.summary }} />
          </TextBlock>
          <MetadataBlock title="About this case" metadata={getFamilyMetadata(family, countries)} />
          <pre className="w-full max-h-[1000px] bg-surface-ui text-sm text-text-tertiary overflow-scroll">{JSON.stringify(family, null, 2)}</pre>
        </main>
      </Columns>
    </Layout>
  );
};
