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
import SearchForm from "@components/forms/SearchForm";
import BySemanticSearch from "@components/filters/BySemanticSearch";
import { EmptyPassages } from "@components/documents/EmptyPassages";
import { EmptyDocument } from "@components/documents/EmptyDocument";

import { QUERY_PARAMS } from "@constants/queryParams";
import { getDocumentDescription } from "@constants/metaDescriptions";
import { EXAMPLE_SEARCHES } from "@constants/exampleSearches";
import { PASSAGES_PER_CONTINUATION_TOKEN } from "@constants/paging";

import { TDocumentPage, TFamilyPage, TGeographySummary, TPassage } from "@types";
import { set } from "react-hook-form";

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
    const container = window.document.getElementById("document-passage-matches");
    if (!container) return;
    container.scrollTo({ top: topPos - 10, behavior: "smooth" });
  }, 100);
};

const renderPassageCount = (count: number) => {
  return count > PASSAGES_PER_CONTINUATION_TOKEN ? `${PASSAGES_PER_CONTINUATION_TOKEN} / ${count}` : count;
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
  const [totalNoOfMatches, setTotalNoOfMatches] = useState(0);
  const router = useRouter();
  const startingPassage = Number(router.query.passage) || 0;
  const { status, families, searchQuery } = useSearch(router.query, null, document.import_id, !!router.query[QUERY_PARAMS.query_string], 500);

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

  // TODO: confirm we need this or delete
  const handleLoadMorePassages = () => {
    if (families.length === 0) return;
    const queryObj = router.query;
    queryObj[QUERY_PARAMS.active_passage_token] = families[0].continuation_token;
    router.push({ pathname: `/documents/${document.slug}`, query: queryObj });
  };

  useEffect(() => {
    let passageMatches: TPassage[] = [];
    let totalNoOfMatches = 0;
    families.forEach((family) => {
      family.family_documents.forEach((cacheDoc) => {
        if (document.slug === cacheDoc.document_slug) {
          passageMatches.push(...cacheDoc.document_passage_matches);
          totalNoOfMatches = family.total_passage_hits;
        }
      });
    });
    setPassageMatches(passageMatches);
    setTotalNoOfMatches(totalNoOfMatches);
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
                <div id="document-sidebar" className={`py-4 max-h-[30vh] md:max-h-full flex flex-col ${passageClasses(document.content_type)}`}>
                  <div id="document-search" className="flex flex-col gap-2 pr-4">
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
                  {totalNoOfMatches > 0 && (
                    <>
                      <div className="my-4 text-sm pr-4 pb-4 border-b" data-cy="document-matches-description">
                        <p>
                          Displaying {renderPassageCount(totalNoOfMatches)} matches for "<b>{`${router.query[QUERY_PARAMS.query_string]}`}</b>"
                          {!searchQuery.exact_match && ` and related phrases`}
                        </p>
                        <p>Sorted by search relevance</p>
                      </div>
                      <div
                        id="document-passage-matches"
                        className="relative pr-4 overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500"
                      >
                        <PassageMatches
                          passages={passageMatches}
                          onClick={handlePassageClick}
                          activeIndex={passageIndex ?? startingPassage}
                          showLoadMore={totalNoOfMatches > PASSAGES_PER_CONTINUATION_TOKEN}
                          loadMore={handleLoadMorePassages}
                        />
                      </div>
                    </>
                  )}
                  {totalNoOfMatches === 0 && <EmptyPassages hasQueryString={!!router.query[QUERY_PARAMS.query_string]} />}
                </div>
                <div
                  id="document-preview"
                  className={`pt-4 flex-1 h-[400px] md:block md:h-full ${totalNoOfMatches ? "md:border-l md:border-l-gray-200" : ""}`}
                >
                  {canPreview && (
                    <EmbeddedPDF
                      document={document}
                      documentPassageMatches={passageMatches}
                      passageIndex={passageIndex}
                      startingPassageIndex={startingPassage}
                    />
                  )}
                  {!canPreview && <EmptyDocument />}
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
