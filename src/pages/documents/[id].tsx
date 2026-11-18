import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { getDocumentData } from "@/bff/methods/getDocumentData";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { Debug } from "@/components/atoms/debug/Debug";
import { DocumentHead } from "@/components/documents/DocumentHead";
import Layout from "@/components/layouts/Main";
import { Section } from "@/components/molecules/section/Section";
import { PassageSearch } from "@/components/organisms/passageSearch/PassageSearch";
import { getDocumentDescription } from "@/constants/metaDescriptions";
import { ROBOTS_BLOCKED_SLUGS, X_ROBOTS_TAG_NOINDEX_VALUE } from "@/constants/robots";
import { withEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TTheme } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { getSiteDecision } from "@/utils/getDocumentSites";
import { getLitigationDocumentJSONLD } from "@/utils/json-ld/getLitigationDocumentJSONLD";
import { readConfigFile } from "@/utils/readConfigFile";

/*
  # DEV NOTES
  - This page displays a 'physical' document, which is a single document within a document family.
  - The default view will display a preview of the document if it is a PDF.
  - If there are search matches for the document, the page will display a list of passages that match the search query.
  - If the document is an HTML, the passages will be displayed in a list on the left side of the page but the document will not be displayed.
*/

const DocumentPage = ({
  canonicalUrl,
  debug,
  document,
  errors,
  family,
  features,
  theme,
  themeConfig,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

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

  return (
    <FeaturesContext.Provider value={features}>
      <Layout
        title={`${document.title}`}
        description={getDocumentDescription(document.title)}
        theme={theme as TTheme}
        themeConfig={themeConfig}
        canonicalUrl={canonicalUrl}
      >
        <section
          className="pb-8 flex-1 flex flex-col"
          data-analytics-date={family.published_date}
          data-analytics-geography={family.geographies?.map((geo) => geo.value).join(",")}
          data-analytics-variant={document.variant}
          data-analytics-type={document.content_type}
        >
          <DocumentHead
            document={document}
            family={family}
            handleViewOtherDocsClick={handleViewOtherDocsClick}
            handleViewSourceClick={handleViewSourceClick}
          />
          <PassageSearch documents={[document]} enablePreview />
        </section>
        {family.attribution.category === "Litigation" && (
          <Head>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getLitigationDocumentJSONLD(document, family)) }} />
          </Head>
        )}
        {features.debug && (
          <FiveColumns>
            <Section key="debug" block="debug" title="Debug">
              <Debug data={errors.map((error) => JSON.parse(error))} title="Transformation errors" />
              <Debug data={document} title="Document" />
              {debug?.dataInDocument && <Debug data={debug.dataInDocument} title="Data-in API document response" />}
            </Section>
          </FiveColumns>
        )}
      </Layout>
    </FeaturesContext.Provider>
  );
};

export default DocumentPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const slug = context.params.id as string;
  if ((ROBOTS_BLOCKED_SLUGS as readonly string[]).includes(slug)) {
    context.res.setHeader("X-Robots-Tag", X_ROBOTS_TAG_NOINDEX_VALUE);
  }

  const theme = process.env.THEME as TTheme;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const { data: documentData, errors } = await getDocumentData(slug);
  errors.forEach((err) => {
    console.error(`[documents.getServerSideProps]: url: ${context.req.url}, params: ${context.params}`);
    console.error(err);
  });
  if (documentData === null) return { notFound: true };

  const siteDecision = getSiteDecision(documentData.themeCriteria, theme, `/documents/${slug}`);

  if (siteDecision.action === "not_found") {
    return { notFound: true };
  }
  if (siteDecision.action === "redirect") {
    return { redirect: { destination: siteDecision.destination, permanent: true } };
  }

  return {
    props: withEnvConfig({
      ...documentData,
      canonicalUrl: siteDecision.canonicalUrl,
      errors: errors.map((error) => JSON.stringify(error, Object.getOwnPropertyNames(error))),
      features,
      theme,
      themeConfig,
    }),
  };
}) satisfies GetServerSideProps;
