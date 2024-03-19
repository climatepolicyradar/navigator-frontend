import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Script from "next/script";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import axios from "axios";
import { ApiClient } from "@api/http-common";
import Layout from "@components/layouts/Main";
import { Timeline } from "@components/blocks/Timeline";
import Event from "@components/blocks/Event";
import { FamilyHead } from "@components/document/FamilyHead";
import { FamilyDocument } from "@components/document/FamilyDocument";
import { ExternalLink } from "@components/ExternalLink";
import { Targets } from "@components/Targets";
import { ShowHide } from "@components/controls/ShowHide";
import { Divider } from "@components/dividers/Divider";
import { QUERY_PARAMS } from "@constants/queryParams";
import { DownArrowIcon, TargetIcon, AlertCircleIcon } from "@components/svg/Icons";
import Button from "@components/buttons/Button";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { SingleCol } from "@components/SingleCol";
import useSearch from "@hooks/useSearch";
import useConfig from "@hooks/useConfig";
import { truncateString } from "@helpers/index";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";
import { getOrganisationNote } from "@helpers/getOrganisationNote";
import { sortFilterTargets } from "@utils/sortFilterTargets";
import { MAX_FAMILY_SUMMARY_LENGTH } from "@constants/document";
import { TFamilyPage, TMatchedFamily, TTarget, TGeographySummary } from "@types";
import Tooltip from "@components/tooltip";
import DocumentSearchForm from "@components/forms/DocumentSearchForm";
import { Alert } from "@components/Alert";

type TProps = {
  page: TFamilyPage;
  targets: TTarget[];
  geographySummary: TGeographySummary;
};

const FEATURED_SEARCHES = ["Resilient infrastructure", "Fossil fuel divestment", "Net zero growth plan", "Sustainable fishing"];

/*
  # DEV NOTES
  - This page displays a single document family and its associated documents, meta data, targets, and events.
  - Families can contain multiple documents, often referred to as 'physical documents'.
  - The 'physical document' view is within the folder: src/pages/documents/[id].tsx.
*/

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ page, targets = [] }: TProps) => {
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

  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  const geographyName = getCountryName(page.geography, countries);
  const geographySlug = getCountrySlug(page.geography, countries);
  const breadcrumbCategory = { label: "Search results", href: "/search" };
  const breadcrumbGeography = { label: geographyName, href: `/geographies/${geographySlug}` };

  let searchFamily: TMatchedFamily = null;
  const { status, families } = useSearch(router.query, null, null, !!router.query[QUERY_PARAMS.query_string]);
  if (!!router.query[QUERY_PARAMS.query_string]) {
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

  // TODO: align with BE on an approach to sources and their logos
  const sourceLogo = page?.organisation === "CCLW" ? "grantham-logo.png" : null;
  const sourceName = page?.organisation === "CCLW" ? "Grantham Research Institute" : page?.organisation;

  const mainDocs = page.documents.filter((doc) => doc.document_role && doc.document_role.toLowerCase().includes("main"));
  const otherDocs = page.documents.filter((doc) => !doc.document_role || !doc.document_role.toLowerCase().includes("main"));

  const getDocumentCategories = () => {
    // Some types are comma separated, so we need to split them
    let categories = page.documents.map((doc) => {
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

  // Search handlers
  const handleSearchInput = (term: string) => {
    const queryObj = {};
    queryObj[QUERY_PARAMS.query_string] = term;
    if (term === "") return false;
    router.push({ pathname: `/document/${page.slug}`, query: queryObj });
  };

  return (
    <Layout title={`${page.title}`} description={page.summary.substring(0, 164)}>
      <Script id="analytics">
        analytics.category = "{page.category}"; analytics.type = "{getDocumentCategories().join(",")}"; analytics.geography = "{page.geography}";
      </Script>
      <section
        className="mb-8"
        data-analytics-category={page.category}
        data-analytics-type={getDocumentCategories().join(",")}
        data-analytics-geography={page.geography}
      >
        <div className="container">
          <BreadCrumbs geography={breadcrumbGeography} category={breadcrumbCategory} label={page.title} />
        </div>
        <SingleCol>
          <FamilyHead family={page} geographyName={geographyName} onCollectionClick={handleCollectionClick} />
          <section className="mt-6">
            <div className="text-content mt-4" dangerouslySetInnerHTML={{ __html: summary }} />
            {page.summary.length > MAX_FAMILY_SUMMARY_LENGTH && (
              <div className="mt-4">
                <button onClick={() => setShowFullSummary(!showFullSummary)} className="anchor alt text-sm">
                  {showFullSummary ? "Hide full summary" : "View full summary"}
                </button>
              </div>
            )}
          </section>

          <section className="mt-8" data-cy="top-documents">
            <DocumentSearchForm
              placeholder={`Search the full text of the ${page.title}`}
              handleSearchInput={handleSearchInput}
              input={router.query[QUERY_PARAMS.query_string] as string}
              featuredSearches={FEATURED_SEARCHES}
              showSuggestions
            />
          </section>

          <section className="mt-8">
            <h2 className="text-base">Main documents</h2>
            <div data-cy="main-documents">
              {mainDocs.map((doc) => (
                <FamilyDocument matches={getDocumentMatches(doc.slug)} document={doc} key={doc.import_id} status={status} />
              ))}
            </div>
          </section>

          {otherDocs.length > 0 && (
            <>
              <section className="mt-8">
                <h2 className="flex items-center gap-2 text-base">
                  Other documents in this entry{" "}
                  <Tooltip
                    id="related-documents-info"
                    place="right"
                    icon="i"
                    tooltip="Other documents can be previous versions, amendments, annexes, supporting legislation, and more."
                  />
                </h2>
                <div data-cy="related-documents">
                  {otherDocs.map((doc) => (
                    <div key={doc.import_id} className="mt-4">
                      <FamilyDocument matches={getDocumentMatches(doc.slug)} document={doc} status={status} />
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
                  <div className="lg:flex justify-between items-center">
                    <h2 className="flex items-center text-base">
                      <span className="mr-2">
                        <TargetIcon />
                      </span>
                      Targets ({publishedTargets.length})
                    </h2>
                    <ExternalLink url="https://form.jotform.com/233542296946365" className="block text-sm my-4 md:my-0" cy="download-target-csv">
                      Request to download all target data (.csv)
                    </ExternalLink>
                  </div>
                  <div className="flex mt-4">
                    <Alert
                      message={
                        <>
                          We are developing the ability to detect targets in documents.{" "}
                          <ExternalLink url="https://form.jotform.com/233294139336358">Get notified when this is ready</ExternalLink>.
                        </>
                      }
                      icon={<AlertCircleIcon height="16" width="16" />}
                    />
                  </div>
                  <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} />
                </div>
              </section>
              {publishedTargets.length > numberOfTargetsToDisplay && (
                <div data-cy="more-targets-button">
                  <Button
                    color="secondary"
                    extraClasses="flex gap-2 items-center my-6"
                    onClick={() => setNumberOfTargetsToDisplay(numberOfTargetsToDisplay + 3)}
                  >
                    <DownArrowIcon /> View more targets
                  </Button>
                </div>
              )}

              {publishedTargets.length > startingNumberOfTargetsToDisplay && publishedTargets.length <= numberOfTargetsToDisplay && (
                <div>
                  <Button color="secondary" extraClasses="flex gap-2 items-center my-6" onClick={() => setNumberOfTargetsToDisplay(5)}>
                    <div className="rotate-180">
                      <DownArrowIcon />
                    </div>{" "}
                    Hide targets
                  </Button>
                </div>
              )}
            </>
          )}

          {page.events.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base">Timeline</h2>
              <ShowHide show={showTimeline} onClick={() => setShowTimeline(!showTimeline)} className="mt-4" />
              {showTimeline && (
                <Timeline>
                  {page.events.map((event, index: number) => (
                    <React.Fragment key={`event-${index}`}>
                      <Event event={event} index={index} last={index === page.events.length - 1 ? true : false} />
                    </React.Fragment>
                  ))}
                </Timeline>
              )}
            </section>
          )}

          <section className="mt-8">
            <h2 className="my-4 text-base">Note</h2>
            <div className="flex text-sm">
              {sourceLogo && (
                <div className="relative max-w-[144px] mt-1 mr-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/partners/${sourceLogo}`} alt={page.organisation} />
                </div>
              )}
              {getOrganisationNote(page.organisation)}
            </div>
          </section>

          {page.collections.length > 0 && (
            <div className="mt-8">
              <Divider />
            </div>
          )}

          {page.collections.map((collection, i) => (
            <section className="pt-12" id={`collection-${i}`} key={collection.import_id}>
              <h2 className="text-base">About the {collection.title}</h2>
              <ShowHide show={showCollectionDetail} onClick={() => setShowCollectionDetail(!showCollectionDetail)} className="mt-4" />
              {showCollectionDetail && (
                <div>
                  <div className="mb-8 text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
                  <h4>Other documents in the {collection.title}</h4>
                  <div className="divide-solid divide-y">
                    {collection.families.map((collFamily, i) => (
                      <div key={collFamily.slug} className="pt-4 pb-4">
                        <LinkWithQuery href={`/document/${collFamily.slug}`}>{collFamily.title}</LinkWithQuery>
                        <p className="mt-2">{collFamily.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </SingleCol>
      </section>
    </Layout>
  );
};
export default FamilyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const id = context.params.id;
  const query = context.query[QUERY_PARAMS.query_string];
  console.log(query);
  const client = new ApiClient(process.env.API_URL);

  let familyData: TFamilyPage;
  let targetsData: TTarget[] = [];

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`);
    familyData = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }

  if (familyData) {
    try {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.S3_PATH}/families/${familyData.import_id}.json`);
      targetsData = targetsRaw.data;
    } catch (error) {}
  }

  if (!familyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page: familyData,
      targets: targetsData,
    },
  };
};
