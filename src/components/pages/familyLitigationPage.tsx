import Head from "next/head";
import { useRouter } from "next/router";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { Debug } from "@/components/atoms/debug/Debug";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { SubNav } from "@/components/nav/SubNav";
import { ContentsSideBar } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IPageHeaderMetadata, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { FAMILY_PAGE_SIDE_BAR_ITEMS } from "@/constants/sideBarItems";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import useSearch from "@/hooks/useSearch";
import { TMatchedFamily } from "@/types";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { getFamilyMetadata } from "@/utils/getFamilyMetadata";
import { getLitigationJSONLD } from "@/utils/json-ld/getLitigationCaseJSONLD";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

import { IProps, isNewEndpointData } from "./familyOriginalPage";

export const FamilyLitigationPage = ({ countries, subdivisions, family, theme, themeConfig }: IProps) => {
  // TODO remove when only the newer API endpoint is being called in getServerSideProps
  if (!isNewEndpointData(family)) {
    throw new Error("Cannot render FamilyLitigationPage with V1 API data");
  }

  /* Search matches */

  const router = useRouter();
  const hasSearch = Boolean(
    router.query[QUERY_PARAMS.query_string] || router.query[QUERY_PARAMS.concept_id] || router.query[QUERY_PARAMS.concept_name]
  );

  let matchesFamily: TMatchedFamily = null;
  const { status: matchesStatus, families: searchFamilyResults } = useSearch(router.query, family.import_id, null, hasSearch, MAX_PASSAGES);
  if (hasSearch) {
    searchFamilyResults.forEach((searchFamilyResult) => {
      if (family.slug === searchFamilyResult.family_slug) {
        matchesFamily = searchFamilyResult;
      }
    });
  }

  /* Page header */

  const categoryName = getCategoryName(family.category, family.corpus_type_name, family.organisation);
  const [year] = convertDate(family.published_date);
  const attributionUrl = family?.organisation_attribution_url;

  // TODO use the new geography endpoint + GeographyV2
  const geographiesToDisplay = family.geographies.some((code) => code.includes("-"))
    ? family.geographies.filter((code) => code.includes("-"))
    : family.geographies;

  const firstGeography = geographiesToDisplay[0];
  const isCountry = !firstGeography.includes("-");
  let breadcrumbGeography = null;
  let breadcrumbSubGeography = null;

  if (isCountry) {
    const geographySlug = getCountrySlug(firstGeography, countries);
    const geographyName = getCountryName(firstGeography, countries);
    breadcrumbGeography = { label: geographyName, href: `/geographies/${geographySlug}` };
  } else {
    // Get both country and subdivision.
    const subdivisionData = subdivisions.find((sub) => sub.code === firstGeography);
    const subdivisionSlug = firstGeography.toLowerCase();
    const subdivisionName = getSubdivisionName(firstGeography, subdivisions);

    if (subdivisionData) {
      const countrySlug = getCountrySlug(subdivisionData.country_alpha_3, countries);
      const countryName = getCountryName(subdivisionData.country_alpha_3, countries);

      breadcrumbGeography = { label: countryName, href: `/geographies/${countrySlug}` };
      breadcrumbSubGeography = { label: subdivisionName, href: `/geographies/${subdivisionSlug}` };
    } else {
      const countryCode = firstGeography.split("-")[0];
      const countrySlug = getCountrySlug(countryCode, countries);
      const countryName = getCountryName(countryCode, countries);

      breadcrumbGeography = { label: countryName, href: `/geographies/${countrySlug}` };
      breadcrumbSubGeography = { label: subdivisionName, href: `/geographies/${subdivisionSlug}` };
    }
  }

  const pageHeaderMetadata: IPageHeaderMetadata[] = [
    { label: "Date", value: isNaN(year) ? "" : year },
    {
      label: "Geography",
      value: joinNodes(
        geographiesToDisplay.map((code) => {
          const isCountry = !code.includes("-");
          const slug = isCountry ? getCountrySlug(code, countries) : code.toLowerCase();
          const name = isCountry ? getCountryName(code, countries) : getSubdivisionName(code, subdivisions);

          return (
            <LinkWithQuery key={code} href={`/geographies/${slug}`} className="underline">
              {name}
            </LinkWithQuery>
          );
        }),
        ", "
      ),
    },
  ];
  if (family.collections.length) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: joinNodes(
        family.collections.map((collection) => (
          <LinkWithQuery key={collection.import_id} href={`/collection/${collection.import_id}`} className="underline">
            {collection.title}
          </LinkWithQuery>
        )),
        ", "
      ),
    });
  }

  /* Render */

  return (
    <Layout
      title={family.title}
      description={getFamilyMetaDescription(family.summary, family.geographies.join(", "), family.category)}
      theme={theme}
      themeConfig={themeConfig}
      metadataKey="family"
      attributionUrl={attributionUrl}
    >
      <PageHeader label={categoryName} title={family.title} metadata={pageHeaderMetadata} />
      <SubNav>
        <BreadCrumbs
          geography={isCountry ? breadcrumbGeography : breadcrumbSubGeography}
          parentGeography={isCountry ? null : breadcrumbGeography}
          isSubdivision={!isCountry}
          label={family.title}
        />
      </SubNav>
      <Columns>
        <ContentsSideBar items={FAMILY_PAGE_SIDE_BAR_ITEMS} stickyClasses="!top-[72px] pt-3 cols-2:pt-6 cols-3:pt-8" />
        <main className="flex flex-col py-3 gap-3 cols-2:py-6 cols-2:gap-6 cols-2:col-span-2 cols-3:py-8 cols-3:gap-8 cols-4:col-span-3">
          <DocumentsBlock countries={countries} family={family} matchesFamily={matchesFamily} matchesStatus={matchesStatus} showMatches={hasSearch} />
          <TextBlock id="section-summary" title="Summary">
            <div className="text-content" dangerouslySetInnerHTML={{ __html: family.summary }} />
          </TextBlock>
          <MetadataBlock title="About this case" metadata={getFamilyMetadata(family, countries, subdivisions)} id="section-metadata" />
          {/* <Section id="section-debug" title="Debug">
            <Debug data={family} title="Family" />
            <Debug data={countries} title="Countries" />
            <Debug data={subdivisions} title="Subdivisions" />
          </Section> */}
        </main>
      </Columns>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLitigationJSONLD(family, countries, subdivisions)),
          }}
        />
      </Head>
    </Layout>
  );
};
