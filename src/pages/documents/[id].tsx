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
import { BookOpenIcon, FindInDocIcon } from "@components/svg/Icons";
import { QUERY_PARAMS } from "@constants/queryParams";
import { getDocumentDescription } from "@constants/metaDescriptions";
import { TDocumentPage, TFamilyPage, TGeographySummary, TPassage } from "@types";
import SearchForm from "@components/forms/SearchForm";
import BySemanticSearch from "@components/filters/BySemanticSearch";
import { EXAMPLE_SEARCHES } from "@constants/exampleSearches";

type TProps = {
  document: TDocumentPage;
  family: TFamilyPage;
  geographySummary: TGeographySummary;
};

const passageClasses = (docType: string) => {
  if (docType === "application/pdf") {
    return "md:w-1/3";
  }
  return "md:w-2/3";
};

const scrollToPassage = (index: number) => {
  setTimeout(() => {
    const passage = window.document.getElementById(`passage-${index}`);
    if (!passage) return;
    const topPos = passage.offsetTop;
    const container = window.document.getElementById("document-sidebar");
    if (!container) return;
    container.scrollTo({ top: topPos - 10, behavior: "smooth" });
  }, 100);
};

/*
  # DEV NOTES
  - This page displays a 'physical' document, which is a single document within a document family.
  - The default view will display a preview of the document if it is a PDF.
  - If there are search matches for the document, the page will display a list of passages that match the search query.
  - If the document is an HTML, the passages will be displayed in a list on the left side of the page but the document will not be displayed.
*/

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document, family }: TProps) => {
  const [passageIndex, setPassageIndex] = useState(null);
  const [passageMatches, setPassageMatches] = useState<TPassage[]>([]);
  const router = useRouter();
  const startingPassage = Number(router.query.passage) || 0;
  const { status, families, searchQuery } = useSearch(router.query, null, document.import_id, !!router.query[QUERY_PARAMS.query_string]);

  const hasPassageMatches = passageMatches.length > 0;
  const canPreview = document.content_type === "application/pdf";

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

  const handleViewOtherDocsClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push({ pathname: `/document/${family.slug}`, query: router.query });
  };

  // Search input handler
  const handleSearchInput = (term: string) => {
    setPassageIndex(0);
    const queryObj = {};
    queryObj[QUERY_PARAMS.query_string] = term;
    if (term === "") return false;
    router.push({ pathname: `/documents/${document.slug}`, query: queryObj });
  };

  // Semantic search / exact match handler
  const handleSemanticSearchChange = (_: string, isExact: boolean) => {
    setPassageIndex(0);
    const queryObj = {};
    if (isExact) {
      queryObj[QUERY_PARAMS.exact_match] = isExact;
    }
    queryObj[QUERY_PARAMS.query_string] = router.query[QUERY_PARAMS.query_string] as string;
    router.push({ pathname: `/documents/${document.slug}`, query: queryObj });
  };

  useEffect(() => {
    let passageMatches: TPassage[] = [];
    families.forEach((family) => {
      family.family_documents.forEach((cacheDoc) => {
        if (document.slug === cacheDoc.document_slug) {
          passageMatches.push(...cacheDoc.document_passage_matches);
        }
      });
    });
    setPassageMatches(passageMatches);
    // comparing families as objects will cause an infinite loop as each collection is a new instance of an object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(families), document.slug]);

  useEffect(() => {
    // Scroll to starting passage on page load
    if (startingPassage) {
      scrollToPassage(startingPassage);
    }
  }, [startingPassage]);

  return (
    <Layout title={`${document.title}`} description={getDocumentDescription(document.title)}>
      <section
        className="pb-8 flex-1 flex flex-col"
        data-analytics-date={family.published_date}
        data-analytics-geography={family.geography}
        data-analytics-variant={document.variant}
        data-analytics-type={document.content_type}
      >
        <DocumentHead
          document={document}
          family={family}
          handleViewOtherDocsClick={handleViewOtherDocsClick}
          handleViewSourceClick={handleViewSourceClick}
        />
        {status !== "success" ? (
          <div className="w-full flex justify-center flex-1 bg-white">
            <Loader />
          </div>
        ) : (
          <section className="flex-1 flex" id="document-viewer">
            <div className="container flex-1">
              <div id="document-container" className="md:flex md:h-[80vh]">
                <div
                  id="document-sidebar"
                  className={`pr-4 py-4 max-h-[30vh] md:block md:max-h-full ${passageClasses(
                    document.content_type
                  )} relative overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500`}
                >
                  <div id="document-search" className="flex flex-col gap-2">
                    <SearchForm
                      placeholder="Search the full text of the document"
                      handleSearchInput={handleSearchInput}
                      input={router.query[QUERY_PARAMS.query_string] as string}
                    />
                    <BySemanticSearch
                      checked={(router.query[QUERY_PARAMS.exact_match] as string) === "true"}
                      handleSearchChange={handleSemanticSearchChange}
                    />
                    {!router.query[QUERY_PARAMS.query_string] && (
                      <div className="flex text-sm text-gray-600">
                        <div className="mr-2 flex-shrink-0 font-medium">Examples:</div>
                        <div className="">{EXAMPLE_SEARCHES.join(", ")}</div>
                      </div>
                    )}
                  </div>
                  {hasPassageMatches && (
                    <>
                      <div className="my-4 text-sm" data-cy="document-matches-description">
                        <p>
                          {passageMatches.length} matches for "<b>{`${router.query[QUERY_PARAMS.query_string]}`}</b>"
                          {!searchQuery.exact_match && ` and related phrases`}
                        </p>
                        <p>Sorted by search relevance</p>
                      </div>
                      <PassageMatches passages={passageMatches} onClick={handlePassageClick} activeIndex={passageIndex ?? startingPassage} />
                    </>
                  )}
                  {!hasPassageMatches && (
                    <>
                      <div className="flex flex-col gap-4 flex-1 mt-4 pt-10 border-t text-center text-gray-600 px-4">
                        <div className="text-blue-800 flex justify-center items-center">
                          <div className="rounded-full bg-blue-50 p-6 mb-2">
                            <FindInDocIcon width="48" height="48" />
                          </div>
                        </div>
                        <p className="text-xl font-medium">No {router.query[QUERY_PARAMS.query_string] ? "results" : "searches yet"}</p>
                        {router.query[QUERY_PARAMS.query_string] && <p>No results found for that search, please try a different term</p>}
                        {!router.query[QUERY_PARAMS.query_string] && (
                          <>
                            <p>We'll search for the meaning of your phrase. You'll see exact matches and related phrases highlighted in the text.</p>
                            <p>For example, a search for 'electric cars' will also show results for 'electric vehicles' and 'EVs'.</p>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div
                  id="document-preview"
                  className={`pt-4 flex-1 h-[400px] md:block md:h-full ${hasPassageMatches ? "md:border-l md:border-l-gray-200" : ""}`}
                >
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
                        <ExternalLink className="underline" url="https://form.jotform.com/233293886694373">
                          Sign up here
                        </ExternalLink>{" "}
                        to be notified when it’s available.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
  let familyData: TFamilyPage;

  try {
    const { data: returnedDocumentData } = await client.get(`/documents/${id}`);
    documentData = returnedDocumentData.document;
    const familySlug = returnedDocumentData.family?.slug;
    const { data: returnedFamilyData } = await client.get(`/documents/${familySlug}`);
    familyData = returnedFamilyData;
  } catch {
    // TODO: Handle error more gracefully
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
    },
  };
};
