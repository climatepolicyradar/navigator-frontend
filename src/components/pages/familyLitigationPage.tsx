import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { Debug } from "@/components/atoms/debug/Debug";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { useFamilyPageHeaderData } from "@/hooks/useFamilyPageHeaderData";
import useSearch from "@/hooks/useSearch";
import { useText } from "@/hooks/useText";
import { TMatchedFamily, TFamilyPageBlock } from "@/types";
import { getFamilyMetadata } from "@/utils/family-metadata/getFamilyMetadata";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { getLitigationCaseJSONLD } from "@/utils/json-ld/getLitigationCaseJSONLD";

import { IProps } from "./familyOriginalPage";

export const FamilyLitigationPage = ({ countries, subdivisions, family, theme, themeConfig }: IProps) => {
  const { getText } = useText();
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

  const { pageHeaderMetadata, breadcrumbGeography, breadcrumbParentGeography } = useFamilyPageHeaderData({ countries, family, subdivisions });

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

        return <MetadataBlock key="metadata" block="metadata" title={`About this ${getText("familySingular")}`} metadata={metadata} />;
      }, [countries, family, subdivisions, getText]),
      sideBarItem: { display: "About" },
    },
    summary: {
      render: () => {
        if (!family.summary) return null;

        return (
          <TextBlock key="summary" id="summary" title="Summary">
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
      attributionUrl={family?.organisation_attribution_url}
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
