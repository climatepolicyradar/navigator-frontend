import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { Alert } from "@/components/Alert";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Targets } from "@/components/Targets";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { ConceptsPanel } from "@/components/concepts/ConceptsPanel";
import { ShowHide } from "@/components/controls/ShowHide";
import { Divider } from "@/components/dividers/Divider";
import { FamilyDocument } from "@/components/document/FamilyDocument";
import { FamilyHead } from "@/components/document/FamilyHead";
import Layout from "@/components/layouts/Main";
import { MultiCol } from "@/components/panels/MultiCol";
import { SingleCol } from "@/components/panels/SingleCol";
import { Event } from "@/components/timeline/Event";
import { Timeline } from "@/components/timeline/Timeline";
import Tooltip from "@/components/tooltip";
import { Heading } from "@/components/typography/Heading";
import { MAX_FAMILY_SUMMARY_LENGTH } from "@/constants/document";
import { MAX_PASSAGES } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TPublicEnvConfig } from "@/context/EnvConfig";
import { FeatureFlagsContext } from "@/context/FeatureFlagsContext";
import { getCorpusInfo } from "@/helpers/getCorpusInfo";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getMainDocuments } from "@/helpers/getMainDocuments";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import useSearch from "@/hooks/useSearch";
import {
  TConcept,
  TCorpusTypeDictionary,
  TDocumentPage,
  TFamilyPublic,
  TFeatureFlags,
  TGeography,
  TGeographySubdivision,
  TMatchedFamily,
  TSearchResponse,
  TTarget,
  TTheme,
  TThemeConfig,
} from "@/types";
import { getFamilyMetaDescription } from "@/utils/getFamilyMetaDescription";
import { pluralise } from "@/utils/pluralise";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { sortFilterTargets } from "@/utils/sortFilterTargets";
import { truncateString } from "@/utils/truncateString";

export interface IProps {
  corpus_types: TCorpusTypeDictionary;
  countries: TGeography[];
  family: TFamilyPublic;
  featureFlags: TFeatureFlags;
  subdivisions: TGeographySubdivision[];
  targets: TTarget[];
  theme: TTheme;
  themeConfig: TThemeConfig;
  vespaFamilyData?: TSearchResponse;
  envConfig: TPublicEnvConfig;
}

// Only published documents are returned in the family page call, so we can cross reference the import ID with those
const documentIsPublished = (familyDocuments: TDocumentPage[], documentImportId: string) => {
  let isPublished = false;

  familyDocuments.forEach((familyDocument) => {
    if (familyDocument.import_id === documentImportId) isPublished = true;
  });

  return isPublished;
};

type CollectionProps = { collection: TFamilyPublic["collections"][number]; envConfig: TPublicEnvConfig };
const Collection = ({ collection, envConfig }: CollectionProps) => {
  const [show, setShow] = useState(false);
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    if (show && families.length === 0) {
      const apiClient = new ApiClient(envConfig.CONCEPTS_API_URL);
      apiClient.get(`/families/collections/${collection.import_id}`).then((collectionData) => setFamilies(collectionData.data.data.families));
    }
  }, [show, families, collection.import_id, envConfig.CONCEPTS_API_URL]);

  return (
    <section className="pt-12" key={collection.import_id}>
      <div className="mb-5">
        <Heading level={4} extraClasses="mb-0">
          About the {collection.title}
        </Heading>
        <ShowHide show={show} onClick={() => setShow(!show)} />
      </div>
      {show && (
        <div>
          <div
            className="mb-8 text-content"
            dangerouslySetInnerHTML={{
              __html: collection.description,
            }}
          />
          <Heading level={4}>Other documents in the {collection.title}</Heading>
          <div className="divide-y flex flex-col gap-4">
            {families.map((family, i) => (
              <div key={family.slug} className="border-border-light">
                <LinkWithQuery href={`/document/${family.slug}`} className="text-[#0041A3] text-left font-medium text-lg underline">
                  {family.title}
                </LinkWithQuery>
                <div
                  className="text-content text-sm"
                  dangerouslySetInnerHTML={{
                    __html: family.description,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export const FamilyOriginalPage = ({
  corpus_types,
  countries = [],
  family: page,
  featureFlags,
  targets = [],
  theme,
  themeConfig,
  vespaFamilyData,
  envConfig,
}: IProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCollectionDetail, setShowCollectionDetail] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;
  const attributionUrl = page?.organisation_attribution_url;

  const geographyNames = page.geographies ? page.geographies.map((geo) => getCountryName(geo, countries)) : null;
  const geographyName = geographyNames ? geographyNames[0] : "";
  const geographySlug = page.geographies ? getCountrySlug(page.geographies[0], countries) : "";
  const breadcrumbGeography =
    page.geographies && page.geographies.length > 1 ? null : { label: geographyName, href: `/geographies/${geographySlug}` };

  let searchFamily: TMatchedFamily = null;
  const { status, families } = useSearch(
    router.query,
    page.import_id,
    null,
    !!(router.query[QUERY_PARAMS.query_string] || router.query[QUERY_PARAMS.concept_id] || router.query[QUERY_PARAMS.concept_name]),
    MAX_PASSAGES
  );
  if (!!(router.query[QUERY_PARAMS.query_string] || router.query[QUERY_PARAMS.concept_id] || router.query[QUERY_PARAMS.concept_name])) {
    families.forEach((family) => {
      if (page.slug === family.family_slug) {
        searchFamily = family;
      }
    });
  }

  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>, collectionIndex: number) => {
    e.preventDefault();
    setShowCollectionDetail(true);
    setTimeout(() => {
      const collectionElement = document.getElementById("collection-" + collectionIndex);
      if (collectionElement) collectionElement.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getDocumentMatches = (docSlug: string) => {
    if (searchFamily) {
      const searchDocument = searchFamily.family_documents.find((doc) => docSlug === doc.document_slug);
      if (searchDocument) {
        return searchDocument.document_passage_matches.length;
      }
    }
  };

  const { corpusImage, corpusAltImage, corpusNote } = getCorpusInfo({
    corpus_types,
    corpus_id: page.corpus_id,
  });

  const [mainDocuments, otherDocuments] = getMainDocuments(page.documents);
  const mainDocumentImportIds = mainDocuments.map((document) => document.import_id);
  const firstMainDocumentId = mainDocumentImportIds[0];
  const otherDocumentImportIds = otherDocuments.map((document) => document.import_id);
  const firstOtherDocumentId = otherDocumentImportIds[0];
  const conceptsFromDocumentId = firstMainDocumentId ?? firstOtherDocumentId;

  const getDocumentCategories = () => {
    // Some types are comma separated, so we need to split them
    const categories = page.documents.map((doc) => {
      if (doc.document_type?.includes(",")) {
        return doc.document_type.split(",");
      } else return doc.document_type || "";
    });
    return [...new Set(categories.flat())];
  };

  useEffect(() => {
    if (page?.summary) {
      const text = page?.summary;
      if (showFullSummary) {
        setSummary(text);
      } else {
        setSummary(truncateString(text, MAX_FAMILY_SUMMARY_LENGTH));
      }
    }
  }, [page, showFullSummary]);

  useEffect(() => {
    setShowCollectionDetail(false);
  }, [pathname]);

  /** Concepts */
  const [concepts, setConcepts] = useState<TConcept[]>([]);
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);
  const conceptCounts: { conceptKey: string; count: number }[] = useMemo(() => {
    const uniqueConceptMap = new Map<string, number>();

    (vespaFamilyData?.families ?? []).forEach((family) => {
      family.hits.forEach((hit) => {
        // Check the document id against the documents in the page
        if (documentIsPublished(page.documents, hit.document_import_id) && conceptsFromDocumentId === hit.document_import_id) {
          Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
            const existingCount = uniqueConceptMap.get(conceptKey) || 0;
            uniqueConceptMap.set(conceptKey, existingCount + count);
          });
        }
      });
    });

    return Array.from(uniqueConceptMap.entries())
      .map(([conceptKey, count]) => ({ conceptKey, count }))
      .sort((a, b) => b.count - a.count);
  }, [vespaFamilyData, page.documents, conceptsFromDocumentId]);

  const conceptIds = conceptCounts.map(({ conceptKey }) => conceptKey.split(":")[0]);

  useEffectOnce(() => {
    fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
      setRootConcepts(rootConcepts);
      setConcepts(concepts);
    });
  });

  const handleConceptClick = (conceptLabel: string) => {
    let conceptDocumentLink: string | undefined;
    if (mainDocuments.length > 0) {
      conceptDocumentLink = `/documents/${mainDocuments[0].slug}`;
    } else if (otherDocuments.length > 0) {
      conceptDocumentLink = `/documents/${otherDocuments[0].slug}`;
    } else {
      conceptDocumentLink = undefined;
    }

    if (conceptDocumentLink) {
      const url = `${conceptDocumentLink}?cfn=${encodeURIComponent(conceptLabel)}`;
      router.push(url);
    }
  };

  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      <Layout
        title={`${page.title}`}
        description={getFamilyMetaDescription(page.summary, geographyNames?.join(", "), page.category)}
        theme={theme}
        themeConfig={themeConfig}
        attributionUrl={attributionUrl}
      >
        <Script id="analytics">
          analytics.category = "{page.category}"; analytics.type = "{getDocumentCategories().join(",")}"; analytics.geography = "
          {page.geographies?.join(",")}";
        </Script>
        <section
          className="mb-8"
          data-analytics-category={page.category}
          data-analytics-type={getDocumentCategories().join(",")}
          data-analytics-geography={page.geographies?.join(",")}
        >
          <BreadCrumbs geography={breadcrumbGeography} label={page.title} />
          <MultiCol extraClasses="flex-wrap md:flex-nowrap">
            <SingleCol extraClasses={`mt-8 px-5 w-full`}>
              <FamilyHead family={page} onCollectionClick={handleCollectionClick} />
              <section className="mt-6">
                {/* SSR summary */}
                <div className={`text-content mt-4 ${summary && "hidden"}`} dangerouslySetInnerHTML={{ __html: page.summary }} />
                <div className="text-content mt-4" dangerouslySetInnerHTML={{ __html: summary }} />
                {page.summary.length > MAX_FAMILY_SUMMARY_LENGTH && (
                  <div className="mt-4">
                    <button onClick={() => setShowFullSummary(!showFullSummary)} className="anchor alt text-sm">
                      {showFullSummary ? "Hide full summary" : "View full summary"}
                    </button>
                  </div>
                )}
              </section>

              {mainDocuments.length > 0 && theme !== "mcf" && (
                <section className="mt-10">
                  <Heading level={2}>Main {pluralise(mainDocuments.length, ["document", "documents"])}</Heading>
                  <div data-cy="main-documents">
                    {mainDocuments.map((doc) => (
                      <FamilyDocument
                        matches={getDocumentMatches(doc.slug)}
                        document={doc}
                        key={doc.import_id}
                        status={status}
                        familyMatches={searchFamily?.total_passage_hits}
                        concepts={concepts}
                      />
                    ))}
                  </div>
                </section>
              )}

              {otherDocuments.length > 0 && (
                <>
                  <section className="mt-8">
                    <div className="flex items-center gap-2">
                      <Heading level={2} extraClasses="!mb-0">
                        {theme === "mcf"
                          ? "Project documents"
                          : mainDocuments.length > 0
                            ? "Other documents in this entry"
                            : "Documents in this entry"}
                      </Heading>
                      {theme !== "mcf" && (
                        <Tooltip
                          id="related-documents-info"
                          place="right"
                          icon="i"
                          tooltip="Other documents can be previous versions, amendments, annexes, supporting legislation, and more."
                        />
                      )}
                    </div>
                    <div data-cy="related-documents">
                      {otherDocuments.map((doc) => (
                        <div key={doc.import_id} className="mt-4">
                          <FamilyDocument
                            matches={getDocumentMatches(doc.slug)}
                            document={doc}
                            status={status}
                            familyMatches={searchFamily?.total_passage_hits}
                            concepts={concepts}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {hasTargets && (
                <>
                  <section className="mt-8">
                    <div>
                      <div>
                        <Heading level={2}>Targets</Heading>
                        <ExternalLink
                          url="https://form.jotform.com/233542296946365"
                          className="block text-sm my-4 md:my-0 underline text-blue-600 hover:text-blue-800"
                          cy="download-target-csv"
                        >
                          Request to download all target data (.csv)
                        </ExternalLink>
                      </div>
                      <div className="flex mt-4">
                        <Alert
                          message={
                            <>
                              We are developing the ability to detect targets in documents.{" "}
                              <ExternalLink url="https://form.jotform.com/233294139336358" className="underline text-blue-600 hover:text-blue-800">
                                Get notified when this is ready
                              </ExternalLink>
                              .
                            </>
                          }
                          icon={<Icon name="alertCircle" height="16" width="16" />}
                        />
                      </div>
                      <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} />
                    </div>
                  </section>
                  {publishedTargets.length > numberOfTargetsToDisplay && (
                    <div data-cy="more-targets-button">
                      <Button
                        content="both"
                        rounded
                        variant="outlined"
                        className="my-5"
                        onClick={() => setNumberOfTargetsToDisplay(numberOfTargetsToDisplay + 3)}
                      >
                        <Icon name="downChevron" />
                        View more targets
                      </Button>
                    </div>
                  )}

                  {publishedTargets.length > startingNumberOfTargetsToDisplay && publishedTargets.length <= numberOfTargetsToDisplay && (
                    <div>
                      <Button content="both" rounded variant="outlined" className="my-5" onClick={() => setNumberOfTargetsToDisplay(5)}>
                        <div className="rotate-180">
                          <Icon name="downChevron" />
                        </div>
                        Hide targets
                      </Button>
                    </div>
                  )}
                </>
              )}

              {page.events.length > 0 && (
                <section className="mt-8">
                  <Heading level={3} extraClasses="mb-0">
                    Timeline
                  </Heading>
                  <ShowHide show={showTimeline} onClick={() => setShowTimeline(!showTimeline)} className="mt-4" />
                  {showTimeline && (
                    <Timeline>
                      {page.events.map((event, index: number) => (
                        <Event event={event} index={index} last={index === page.events.length - 1 ? true : false} key={`event-${index}`} />
                      ))}
                    </Timeline>
                  )}
                </section>
              )}

              {corpusNote && (
                <section className="mt-8">
                  <Heading level={4}>Note</Heading>
                  <div className="flex text-sm">
                    {corpusImage && (
                      <div className="relative max-w-[144px] mt-1 mr-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${corpusImage}`} alt={corpusAltImage} className="h-auto w-full" />
                      </div>
                    )}
                    <span dangerouslySetInnerHTML={{ __html: corpusNote }} className="text-content" />
                  </div>
                </section>
              )}

              {page.collections.length > 0 && (
                <div className="mt-8">
                  <Divider />
                </div>
              )}

              {page.collections.map((collection, i) => (
                <Collection collection={collection} envConfig={envConfig} key={collection.import_id} />
              ))}
            </SingleCol>
            {concepts.length > 0 && (
              <div className="border-gray-300 grow-0 shrink-0 px-5 border-l pt-4 md:pt-8 basis-full md:basis-[320px] lg:basis-[380px] xl:basis-[460px]">
                <ConceptsPanel rootConcepts={rootConcepts} concepts={concepts} onConceptClick={handleConceptClick}></ConceptsPanel>
              </div>
            )}
          </MultiCol>
        </section>
      </Layout>
    </FeatureFlagsContext.Provider>
  );
};
