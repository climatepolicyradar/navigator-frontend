import orderBy from "lodash/orderBy";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Debug } from "@/components/atoms/debug/Debug";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs, TBreadcrumbLink } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { GeographyLink, IProps as GeographyLinkProps } from "@/components/molecules/geographyLink/GeographyLink";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { getCategoryName } from "@/helpers/getCategoryName";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import useSearch from "@/hooks/useSearch";
import { TMatchedFamily, TFamilyPageBlock, IMetadata } from "@/types";
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

  const codeIsCountry = (code: string) => !code.includes("-");

  // TODO use the new geography endpoint + GeographyV2
  const geographiesToDisplay: GeographyLinkProps[] = orderBy(
    family.geographies
      .map((code) => {
        const isSubdivision = !codeIsCountry(code);
        const name = isSubdivision ? getSubdivisionName(code, subdivisions) : getCountryName(code, countries);
        const slug = isSubdivision ? code.toLowerCase() : getCountrySlug(code, countries);
        return name && slug ? { code, name, slug: isSystemGeo(name) ? undefined : slug } : null;
      })
      .filter((data) => data),
    [(data) => data.code.includes("-"), "name"],
    ["asc", "asc"]
  );

  let breadcrumbGeography: TBreadcrumbLink = null;
  let breadcrumbParentGeography: TBreadcrumbLink = null;

  if (geographiesToDisplay.length > 0) {
    if (geographiesToDisplay.some((geo) => !codeIsCountry(geo.code))) {
      // Includes a subdivision
      const subdivision = geographiesToDisplay.find((geo) => !codeIsCountry(geo.code));
      breadcrumbGeography = { label: subdivision.name, href: `/geographies/${subdivision.slug}` };

      // Get the subdivision's parent country
      const subdivisionData = subdivisions.find((sub) => sub.code === subdivision.code);
      const parentCountryCode = subdivisionData.country_alpha_3;
      if (subdivisionData) {
        const countryName = getCountryName(parentCountryCode, countries);
        const countrySlug = getCountrySlug(parentCountryCode, countries);
        if (countryName && countrySlug && !isSystemGeo(countryName)) {
          breadcrumbParentGeography = { label: countryName, href: `/geographies/${countrySlug}` };
        }
      }
    } else {
      // Countries only
      const country = geographiesToDisplay[0];
      if (!isSystemGeo(country.name)) breadcrumbGeography = { label: country.name, href: `/geographies/${country.slug}` };
    }
  }

  const isGeographyParentChild =
    geographiesToDisplay.length === 2 && !geographiesToDisplay[0].code.includes("-") && geographiesToDisplay[1].code.includes("-");

  const pageHeaderMetadata: IMetadata[] = [
    {
      label: "Geography",
      value: joinNodes(
        geographiesToDisplay.map(({ code, name, slug }) => {
          return <GeographyLink key={code} code={code} name={name} slug={isSystemGeo(name) ? null : slug} />;
        }),
        isGeographyParentChild ? <span className="text-gray-400"> / </span> : <>&ensp;</>
      ),
    },
    { label: "Date", value: isNaN(year) ? "" : year },
    {
      label: "Document type",
      value: categoryName,
    },
  ];
  if (family.collections.length) {
    pageHeaderMetadata.push({
      label: "Part of",
      value: joinNodes(
        family.collections.map((collection) => (
          <LinkWithQuery key={collection.import_id} href={`/collections/${collection.slug}`} className="hover:underline">
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
            <div className="text-content whitespace-pre-line" dangerouslySetInnerHTML={{ __html: family.summary }} />
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
        geography={breadcrumbGeography}
        parentGeography={breadcrumbParentGeography}
        isSubdivision={Boolean(breadcrumbParentGeography)}
        label={family.title}
      />
      <PageHeader title={family.title} metadata={pageHeaderMetadata} />
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
