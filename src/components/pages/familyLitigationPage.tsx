import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Debug } from "@/components/atoms/debug/Debug";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { IPageHeaderMetadata, PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import useSearch from "@/hooks/useSearch";
import { TMatchedFamily, TFamilyPageBlock } from "@/types";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { getFamilyMetadata } from "@/utils/getFamilyMetadata";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { getLitigationCaseJSONLD } from "@/utils/json-ld/getLitigationCaseJSONLD";
import { joinNodes } from "@/utils/reactNode";
import { convertDate } from "@/utils/timedate";

import { IProps } from "./familyOriginalPage";

export const FamilyLitigationPage = ({ countries, subdivisions, family, theme, themeConfig }: IProps) => {
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
  // Grabs the subdivision from the list of geographies if it exists.
  const geographiesToDisplay = family.geographies.some((code) => code.includes("-"))
    ? family.geographies.filter((code) => code.includes("-"))
    : family.geographies;

  const firstGeography = geographiesToDisplay[0];
  const isCountry = !firstGeography.includes("-");
  let breadcrumbGeography = null;
  let breadcrumbSubGeography = null;

  if (isCountry) {
    // Is a country not a subdivision.
    const geographySlug = getCountrySlug(firstGeography, countries);
    const geographyName = getCountryName(firstGeography, countries);
    breadcrumbGeography = !isSystemGeo(geographyName) ? { label: geographyName, href: `/geographies/${geographySlug}` } : null;
  } else {
    // Is a subdivision.
    const subdivisionData = subdivisions.find((sub) => sub.code === firstGeography);
    const subdivisionSlug = firstGeography.toLowerCase();
    const subdivisionName = getSubdivisionName(firstGeography, subdivisions);

    // Get parent geography data for the given subdivision.
    if (subdivisionData) {
      const countrySlug = getCountrySlug(subdivisionData.country_alpha_3, countries);
      const countryName = getCountryName(subdivisionData.country_alpha_3, countries);

      breadcrumbGeography = !isSystemGeo(countryName) ? { label: countryName, href: `/geographies/${countrySlug}` } : null;
      breadcrumbSubGeography = !isSystemGeo(subdivisionName) ? { label: subdivisionName, href: `/geographies/${subdivisionSlug}` } : null;
    } else {
      // Fallback to country if subdivision data lookup is not found.
      const countryCode = firstGeography.split("-")[0];
      const countrySlug = getCountrySlug(countryCode, countries);
      const countryName = getCountryName(countryCode, countries);

      breadcrumbGeography = !isSystemGeo(countryName) ? { label: countryName, href: `/geographies/${countrySlug}` } : null;
      breadcrumbSubGeography = !isSystemGeo(subdivisionName) ? { label: subdivisionName, href: `/geographies/${subdivisionSlug}` } : null;
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

          return !isSystemGeo(name) ? (
            <LinkWithQuery key={code} href={`/geographies/${slug}`} className="underline">
              {name}
            </LinkWithQuery>
          ) : (
            <span key={code}>{name}</span>
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
          <LinkWithQuery key={collection.import_id} href={`/collections/${collection.slug}`} className="underline">
            {collection.title}
          </LinkWithQuery>
        )),
        ", "
      ),
    });
  }

  /* Blocks */

  const blocksToRender = themeConfig.pageBlocks.family;
  const blockDefinitions: TBlockDefinitions<TFamilyPageBlock> = {
    debug: {
      render: () => (
        <Section key="debug" block="debug" title="Debug">
          <Debug data={family} title="Family" />
          <Debug data={countries} title="Countries" />
          <Debug data={subdivisions} title="Subdivisions" />
        </Section>
      ),
    },
    documents: {
      render: useCallback(
        () => <DocumentsBlock key="documents" family={family} matchesFamily={matchesFamily} matchesStatus={matchesStatus} showMatches={hasSearch} />,
        [family, hasSearch, matchesFamily, matchesStatus]
      ),
    },
    metadata: {
      render: useCallback(() => {
        const metadata = getFamilyMetadata(family, countries, subdivisions);
        if (metadata.length === 0) return null;

        return <MetadataBlock key="metadata" block="metadata" title="About this case" metadata={metadata} />;
      }, [countries, family, subdivisions]),
      sideBarItem: { display: "About" },
    },
    summary: {
      render: () => {
        if (!family.summary) return null;

        return (
          <TextBlock key="summary" block="summary" title="Summary">
            <div className="text-content" dangerouslySetInnerHTML={{ __html: family.summary }} />
          </TextBlock>
        );
      },
    },
  };

  /* Render */
  return (
    <Layout
      title={family.title}
      description={getFamilyMetaDescription(family?.metadata?.core_object?.[0] ?? family.summary, family.geographies.join(", "), family.category)}
      theme={theme}
      themeConfig={themeConfig}
      metadataKey="family"
      attributionUrl={attributionUrl}
    >
      <BreadCrumbs
        geography={isCountry ? breadcrumbGeography : breadcrumbSubGeography}
        parentGeography={isCountry ? null : breadcrumbGeography}
        isSubdivision={!isCountry}
        label={family.title}
      />
      <PageHeader label={categoryName} title={family.title} metadata={pageHeaderMetadata} />
      <BlocksLayout blockDefinitions={blockDefinitions} blocksToRender={blocksToRender} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLitigationCaseJSONLD(family, countries, subdivisions)),
          }}
        />
      </Head>
    </Layout>
  );
};
