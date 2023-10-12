import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ApiClient } from "@api/http-common";
import useSearch from "@hooks/useSearch";
import { DocumentHead } from "@components/document/DocumentHead";
import Layout from "@components/layouts/Main";
import EmbeddedPDF from "@components/EmbeddedPDF";
import PassageMatches from "@components/PassageMatches";
import Loader from "@components/Loader";
import { ExternalLink } from "@components/ExternalLink";
import { BookOpenIcon } from "@components/svg/Icons";
import { QUERY_PARAMS } from "@constants/queryParams";
import { getDocumentDescription } from "@constants/metaDescriptions";
import { TDocumentFamily, TDocumentPage, TGeographySummary } from "@types";
import DocumentSearchForm from "@components/forms/DocumentSearchForm";
import useConfig from "@hooks/useConfig";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";

type TProps = {
  document: TDocumentPage;
  family: TDocumentFamily;
  geographySummary: TGeographySummary;
};

const FEATURED_SEARCHES = ["Resilient infrastructure", "Fossil fuel divestment", "Net zero growth plan", "Sustainable fishing"];

const passageClasses = (docType: string) => {
  if (docType === "application/pdf") {
    return "md:w-1/3";
  }
  return "md:w-2/3";
};

/*
  # DEV NOTES
  - This page displays a 'physical' document, which is a single document within a document family.
  - The default view will display a preview of the document if it is a PDF.
  - If there are search matches for the document, the page will display a list of passages that match the search query.
  - If the document is an HTML, the passages will be displayed in a list on the left side of the page but the document will not be displayed.
*/

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document, family, geographySummary }: TProps) => {
  const [passageIndex, setPassageIndex] = useState(null);
  const router = useRouter();
  const startingPassage = Number(router.query.passage) || 0;
  const { status, families, searchQuery } = useSearch(router.query, !!router.query[QUERY_PARAMS.query_string]);

  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  const geographyName = getCountryName(family.geography, countries);
  const geographySlug = getCountrySlug(family.geography, countries);

  const passageMatches = [];
  if (!!router.query[QUERY_PARAMS.query_string]) {
    families.forEach((family) => {
      family.family_documents.forEach((cacheDoc) => {
        if (document.slug === cacheDoc.document_slug) {
          passageMatches.push(...cacheDoc.document_passage_matches);
        }
      });
    });
  }
  const hasPassageMatches = passageMatches.length > 0;
  const canPreview = document.content_type === "application/pdf";

  const totalDocsInFamilyGeography = () => {
    if (!!geographySummary) {
      return geographySummary.family_counts.Legislative + geographySummary.family_counts.Executive + geographySummary.family_counts.UNFCCC;
    }
  };

  const scrollToPassage = (index: number) => {
    setTimeout(() => {
      const passage = window.document.getElementById(`passage-${index}`);
      if (!passage) return;
      const topPos = passage.offsetTop;
      const container = window.document.getElementById("passages-container");
      if (!container) return;
      container.scrollTo({ top: topPos - 10, behavior: "smooth" });
    }, 100);
  };

  const handlePassageClick = (index: number) => {
    if (!canPreview) return;
    setPassageIndex(index);
    scrollToPassage(index);
  };

  const handleViewSourceClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = document.content_type === "application/pdf" ? document.cdn_object : document.source_url;
    if (!url) return;
    window.open(url);
  };

  // Search handlers
  const handleSearchInput = (term: string) => {
    const queryObj = {};
    queryObj[QUERY_PARAMS.query_string] = term;
    queryObj[QUERY_PARAMS.country] = geographySlug;
    router.push({ pathname: "/search", query: queryObj });
  };

  useEffect(() => {
    // Scroll to starting passage on page load
    if (startingPassage) {
      scrollToPassage(startingPassage);
    }
  }, [startingPassage]);

  return (
    <Layout title={`${document.title}`} description={getDocumentDescription(document.title)}>
      <section
        className="pb-8 flex-1 flex flex-col bg-gray-100"
        data-analytics-date={family.published_date}
        data-analytics-geography={family.geography}
        data-analytics-variant={document.variant}
        data-analytics-type={document.content_type}
      >
        <DocumentHead document={document} family={family} handleViewSourceClick={handleViewSourceClick} />
        {status !== "success" ? (
          <div className="w-full flex justify-center flex-1 bg-white">
            <Loader />
          </div>
        ) : (
          <section className="flex-1 flex" id="document-viewer">
            <div className="container flex-1">
              <div className="md:flex md:h-[80vh]">
                {hasPassageMatches && (
                  <div
                    id="passages-container"
                    className={`pr-4 max-h-[30vh] md:block md:max-h-full ${passageClasses(
                      document.content_type
                    )} relative overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500`}
                  >
                    <div className="my-4" data-cy="document-matches-description">
                      <p className="">
                        {passageMatches.length} matches for "<b>{`${router.query[QUERY_PARAMS.query_string]}`}</b>"
                        {!searchQuery.exact_match && ` and related phrases`}
                      </p>
                      <p className="text-sm">Sorted by search relevance</p>
                    </div>
                    <PassageMatches passages={passageMatches} onClick={handlePassageClick} activeIndex={passageIndex ?? startingPassage} />
                  </div>
                )}
                {status === "success" && (
                  <div className={`pt-4 flex-1 h-[400px] md:block md:h-full ${hasPassageMatches ? "md:border-l md:border-l-gray-200" : ""}`}>
                    {canPreview && (
                      <EmbeddedPDF
                        document={document}
                        documentPassageMatches={passageMatches}
                        passageIndex={passageIndex}
                        startingPassageIndex={startingPassage}
                      />
                    )}
                    {!canPreview && (
                      <div className="ml-4 text-center text-gray-600">
                        <div className="mb-2 flex justify-center">
                          <BookOpenIcon />
                        </div>
                        <p className="mb-2">Document Preview</p>
                        <p className="mb-2 text-sm">
                          You’ll soon be able to view the full-text of the document here, along with any English translation.
                        </p>
                        <p className="text-sm">
                          <ExternalLink className="underline" url="https://forms.gle/yJTRdwTNBdTesexW8">
                            Sign up here
                          </ExternalLink>{" "}
                          to be notified when it’s available.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {!!geographySummary && totalDocsInFamilyGeography() > 0 && (
          <section className="flex mt-8 mx-auto max-w-screen-md px-4 lg:px-0" data-cy="country-search">
            <DocumentSearchForm
              placeholder={`Search the full text of ${totalDocsInFamilyGeography()} documents from ${geographyName}`}
              handleSearchInput={handleSearchInput}
              input={""}
              featuredSearches={FEATURED_SEARCHES}
            />
          </section>
        )}
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const id = context.params.id;
  const client = new ApiClient(process.env.API_URL);

  let documentData: TDocumentPage;
  let familyData: TDocumentFamily;
  let geographySummaryData: TGeographySummary;
  let geographyCode: string;

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`);
    documentData = returnedData.document;
    familyData = returnedData.family;
  } catch {
    // TODO: Handle error more gracefully
  }

  if (familyData) geographyCode = familyData.geography;

  if (geographyCode) {
    try {
      const { data: returnedData }: { data: TGeographySummary } = await client.get(`/summaries/geography/${geographyCode}`);
      geographySummaryData = returnedData;
    } catch (error) {}
  }

  if (!documentData || !familyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      document: documentData,
      family: familyData,
      geographySummary: geographySummaryData,
    },
  };
};
