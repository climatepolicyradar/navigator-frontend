import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useContext } from "react";

import { Debug } from "@/components/atoms/debug/Debug";
import { CollectionsBlock } from "@/components/blocks/collectionsBlock/CollectionsBlock";
import { DocumentsBlock } from "@/components/blocks/documentsBlock/DocumentsBlock";
import { MetadataBlock } from "@/components/blocks/metadataBlock/MetadataBlock";
import { NoteBlock } from "@/components/blocks/noteBlock/NoteBlock";
import { TextBlock } from "@/components/blocks/textBlock/TextBlock";
import { TopicsBlock } from "@/components/blocks/topicsBlock/TopicsBlock";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { BlocksLayout, TBlockDefinitions } from "@/components/organisms/blocksLayout/BlocksLayout";
import { PageHeader } from "@/components/organisms/pageHeader/PageHeader";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TutorialContext } from "@/context/TutorialContext";
import { useFamilyPageHeaderData } from "@/hooks/useFamilyPageHeaderData";
import useSearch from "@/hooks/useSearch";
import { useText } from "@/hooks/useText";
import { TMatchedFamily, TFamilyPageBlock } from "@/types";
import { getFamilyMetadata } from "@/utils/family-metadata/getFamilyMetadata";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { getLitigationCaseJSONLD } from "@/utils/json-ld/getLitigationCaseJSONLD";
import { pluralise } from "@/utils/pluralise";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";
import { getIncompleteTutorialNames } from "@/utils/tutorials";

import { IProps } from "./familyOriginalPage";

export const FamilyLitigationPage = ({
  collections,
  corpus_types,
  countries,
  family,
  familyTopics,
  featureFlags,
  subdivisions,
  theme,
  themeConfig,
}: IProps) => {
  const { completedTutorials } = useContext(TutorialContext);
  const { getText } = useText();

  const showKnowledgeGraphTutorial = getIncompleteTutorialNames(completedTutorials, themeConfig, featureFlags).includes("knowledgeGraph");

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
    collections: {
      render: () => <CollectionsBlock key="collections" collections={collections} />,
      sideBarItem: { display: pluralise(collections.length, ["Collection", "Collections"]) },
    },
    debug: {
      render: () => (
        <Section key="debug" block="debug" title="Debug">
          <div className="col-start-1 -col-end-1">
            <Debug data={family} title="Family" />
            <Debug data={collections} title="Collections" />
            <Debug data={countries} title="Countries" />
            <Debug data={subdivisions} title="Subdivisions" />
          </div>
        </Section>
      ),
    },
    documents: {
      render: useCallback(
        () => (
          <DocumentsBlock
            key="documents"
            family={family}
            familyTopics={familyTopics}
            matchesFamily={matchesFamily}
            matchesStatus={matchesStatus}
            showMatches={hasSearch}
            showKnowledgeGraphTutorial={showKnowledgeGraphTutorial}
          />
        ),
        [family, familyTopics, hasSearch, matchesFamily, matchesStatus, showKnowledgeGraphTutorial]
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
    note: {
      render: () => <NoteBlock key="note" corpusId={family.corpus_id} corpusTypes={corpus_types} />,
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
    topics: {
      render: useCallback(() => {
        if (!familyTopicsHasTopics(familyTopics)) return null;
        return <TopicsBlock key="topics" familyTopics={familyTopics} />;
      }, [familyTopics]),
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
