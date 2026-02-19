import { ParsedUrlQuery } from "querystring";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { getDocumentData } from "@/bff/methods/getDocumentData";
import { ConceptsDocumentViewer } from "@/components/documents/ConceptsDocumentViewer";
import { DocumentHead } from "@/components/documents/DocumentHead";
import Layout from "@/components/layouts/Main";
import { getDocumentDescription } from "@/constants/metaDescriptions";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TopicsContext } from "@/context/TopicsContext";
import useConfig from "@/hooks/useConfig";
import useSearch from "@/hooks/useSearch";
import { TTheme } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { getLitigationDocumentJSONLD } from "@/utils/json-ld/getLitigationDocumentJSONLD";
import { readConfigFile } from "@/utils/readConfigFile";

// If we don't have a query string or a concept selected, we do't have a search
const isEmptySearch = (query: ParsedUrlQuery) => {
  return !(query[QUERY_PARAMS.query_string] || query[QUERY_PARAMS.concept_id] || query[QUERY_PARAMS.concept_name]);
};

/*
  # DEV NOTES
  - This page displays a 'physical' document, which is a single document within a document family.
  - The default view will display a preview of the document if it is a PDF.
  - If there are search matches for the document, the page will display a list of passages that match the search query.
  - If the document is an HTML, the passages will be displayed in a list on the left side of the page but the document will not be displayed.
*/

const DocumentPage = ({
  document,
  family,
  features,
  theme,
  themeConfig,
  topicsData,
  vespaDocumentData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const qsSearchString = router.query[QUERY_PARAMS.query_string];
  // exact match is default, so only instances where it is explicitly set to false do we check against
  const exactMatchQuery = router.query[QUERY_PARAMS.exact_match] === undefined || router.query[QUERY_PARAMS.exact_match] !== "false";
  const startingPageNumber = Number(router.query.page) || 0;
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  // Note: only runs a fresh start if either a query string or concept data is provided
  const { status, families } = useSearch(router.query, null, document.import_id, !isEmptySearch(router.query), MAX_PASSAGES);

  const handleViewSourceClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = document.content_type === "application/pdf" ? document.cdn_object : document.source_url;
    if (!url) return;
    window.open(url);
  };

  const handleViewOtherDocsClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push({ pathname: `/document/${family.slug}`, query: router.query });
  };

  // Semantic search / exact match handler
  const handleSemanticSearchChange = (_: string, isExact: string) => {
    const queryObj = CleanRouterQuery({ ...router.query });
    if (isExact === "false") {
      queryObj[QUERY_PARAMS.exact_match] = "false";
    } else if (isExact === "true") {
      queryObj[QUERY_PARAMS.exact_match] = "true";
    }
    queryObj[QUERY_PARAMS.query_string] = router.query[QUERY_PARAMS.query_string] as string;
    queryObj["id"] = document.slug;
    router.push(
      {
        query: queryObj,
      },
      undefined,
      { shallow: true }
    );
  };

  const handlePassagesOrderChange = (orderValue: string) => {
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj["id"] = document.slug;
    queryObj[QUERY_PARAMS.passages_by_position] = orderValue;
    router.push({ query: queryObj }, undefined, { shallow: true });
  };

  const conceptFiltersQuery = router.query[QUERY_PARAMS.concept_name];

  const conceptFilters = useMemo(
    () => (conceptFiltersQuery ? (Array.isArray(conceptFiltersQuery) ? conceptFiltersQuery : [conceptFiltersQuery]) : undefined),
    [conceptFiltersQuery]
  );

  return (
    <Layout
      title={`${document.title}`}
      description={getDocumentDescription(document.title)}
      theme={theme as TTheme}
      themeConfig={themeConfig}
      attributionUrl={family.corpus.attribution_url}
    >
      <FeaturesContext.Provider value={features}>
        <TopicsContext.Provider value={topicsData}>
          <section
            className="pb-8 flex-1 flex flex-col"
            data-analytics-date={family.published_date}
            data-analytics-geography={family.geographies?.join(",")}
            data-analytics-variant={document.variant}
            data-analytics-type={document.content_type}
          >
            <DocumentHead
              document={document}
              family={family}
              handleViewOtherDocsClick={handleViewOtherDocsClick}
              handleViewSourceClick={handleViewSourceClick}
            />

            <ConceptsDocumentViewer
              initialQueryTerm={qsSearchString}
              initialExactMatch={exactMatchQuery}
              initialPageNumber={startingPageNumber}
              initialConceptFilters={conceptFilters}
              vespaDocumentData={vespaDocumentData}
              document={document}
              searchStatus={status}
              searchResultFamilies={isEmptySearch(router.query) ? [] : families}
              handleSemanticSearchChange={handleSemanticSearchChange}
              handlePassagesOrderChange={handlePassagesOrderChange}
            />
          </section>
          {["Litigation", "LITIGATION"].includes(family.category) && (
            <Head>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getLitigationDocumentJSONLD(document, family, countries)) }}
              />
            </Head>
          )}
        </TopicsContext.Provider>
      </FeaturesContext.Provider>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const slug = context.params.id as string;

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const { data: documentData, errors } = await getDocumentData(slug, features);
  errors.forEach(console.error); // eslint-disable-line no-console
  if (documentData === null) return { notFound: true };

  return {
    props: withEnvConfig({
      ...documentData,
      features,
      theme,
      themeConfig,
    }),
  };
}) satisfies GetServerSideProps;
