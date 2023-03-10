import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { TTarget, TEvent } from "@types";
import Layout from "@components/layouts/Main";
import { SingleCol } from "@components/SingleCol";
import Event from "@components/blocks/Event";
import { Timeline } from "@components/blocks/Timeline";
import { CountryHeader } from "@components/blocks/CountryHeader";
import { KeyDetail } from "@components/KeyDetail";
import { Divider } from "@components/dividers/Divider";
import { RightArrowIcon } from "@components/svg/Icons";
import Button from "@components/buttons/Button";
import { RelatedDocumentFull } from "@components/blocks/RelatedDocumentFull";
import TabbedNav from "@components/nav/TabbedNav";
import TextLink from "@components/nav/TextLink";
import { LawIcon, PolicyIcon, CaseIcon, TargetIcon } from "@components/svg/Icons";
import { ExternalLink } from "@components/ExternalLink";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import { QUERY_PARAMS } from "@constants/queryParams";

import { ApiClient } from "@api/http-common";
import { TGeographyStats, TGeographySummary } from "@types";

type TTargets = {
  targets: TTarget[];
};

const Targets = ({ targets }: TTargets) => {
  return (
    <ul className="ml-4 list-disc list-outside">
      {targets.map((target) => (
        <li className="mb-4" key={target.target}>
          <span className="text-blue-700 text-lg">{target.target}</span>
          <span className="block">
            <span className="font-semibold mr-1">{target.group}</span>
            <span>
              | Base year: {target.base_year} | Target year: {target.target_year}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

type TProps = {
  geography: TGeographyStats;
  summary: TGeographySummary;
};

const CountryPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ geography, summary }: TProps) => {
  const router = useRouter();
  const [showAllTargets, setShowAllTargets] = useState(false);
  const [selectedCategoryIndex, setselectedCategoryIndex] = useState(0);

  const hasEvents = !!summary?.events && summary?.events?.length > 0;
  const hasTargets = !!summary?.targets && summary?.targets?.length > 0;
  const hasDocuments = !!summary?.top_documents;

  const documentCategories = DOCUMENT_CATEGORIES;
  const TARGETS_SHOW = 5;

  const handleDocumentCategoryClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    e.preventDefault();
    return setselectedCategoryIndex(index);
  };

  const handleDocumentSeeMoreClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newQuery = {};
    newQuery[QUERY_PARAMS.country] = geography.geography_slug;
    const documentCategory = selectedCategoryIndex === 1 ? "Legislation" : selectedCategoryIndex === 2 ? "Policies" : null;
    if (documentCategory) {
      newQuery[QUERY_PARAMS.category] = documentCategory;
    }
    router.push({ pathname: "/search", query: { ...newQuery } });
  };

  const renderEmpty = (documentType: string = "") => <p className="mt-4">{`There are no ${documentType} documents for ${geography.name}`}</p>;

  const renderDocuments = () => {
    // All
    if (selectedCategoryIndex === 0) {
      const allDocuments = summary.top_documents.Policy.concat(summary.top_documents.Law).concat(summary.top_documents.Case);
      if (allDocuments.length === 0) {
        return renderEmpty();
      }
      allDocuments.sort((a, b) => {
        return new Date(b.document_date).getTime() - new Date(a.document_date).getTime();
      });
      return allDocuments.slice(0, 5).map((doc) => (
        <div key={doc.document_slug} className="mt-4 mb-10">
          <RelatedDocumentFull document={doc} />
        </div>
      ));
    }
    // Legislative
    if (selectedCategoryIndex === 1) {
      return summary.top_documents.Law.length === 0
        ? renderEmpty("Legislative")
        : summary.top_documents.Law.map((doc) => (
            <div key={doc.document_slug} className="mt-4 mb-10">
              <RelatedDocumentFull document={doc} />
            </div>
          ));
    }
    // Executive
    if (selectedCategoryIndex === 2) {
      return summary.top_documents.Policy.length === 0
        ? renderEmpty("Executive")
        : summary.top_documents.Policy.map((doc) => (
            <div key={doc.document_slug} className="mt-4 mb-10">
              <RelatedDocumentFull document={doc} />
            </div>
          ));
    }
    // Litigation
    if (selectedCategoryIndex === 3) {
      return (
        <div className="mt-4">
          Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center???s{" "}
          <ExternalLink url="http://climatecasechart.com/" className="text-blue-500 transition duration-300 hover:text-indigo-600">
            Climate Change Litigation Databases
          </ExternalLink>
          .
        </div>
      );
    }
  };

  let targets = [];
  if (!!summary?.targets) targets = showAllTargets ? summary.targets : summary.targets.slice(0, TARGETS_SHOW);

  return (
    <>
      <Layout title={geography?.name ?? "Loading..."}>
        {!geography ? (
          <SingleCol>
            <TextLink onClick={() => router.back()}>Go back</TextLink>
            <p>We were not able to load the data for the country.</p>
          </SingleCol>
        ) : (
          <section className="mb-8">
            <CountryHeader country={geography} />
            <SingleCol>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-px rounded mb-8">
                {
                  <KeyDetail
                    detail="Legislation"
                    extraDetail="Laws, Acts, Constitutions (legislative branch)"
                    amount={summary.document_counts.Law}
                    icon={<LawIcon />}
                    onClick={() => setselectedCategoryIndex(1)}
                  />
                }
                {
                  <KeyDetail
                    detail="Policies"
                    extraDetail="Policies, strategies, decrees, action plans (from executive branch)"
                    amount={summary.document_counts.Policy}
                    icon={<PolicyIcon />}
                    onClick={() => setselectedCategoryIndex(2)}
                  />
                }
                {
                  <KeyDetail
                    detail="Litigation"
                    extraDetail="Court cases and tribunal proceedings"
                    amount={<span className="text-sm font-normal">Coming soon</span>}
                    icon={<CaseIcon />}
                    onClick={() => setselectedCategoryIndex(3)}
                  />
                }
              </section>
              {hasEvents && (
                <section className="mt-12 hidden">
                  <h3 className="mb-4">Events</h3>
                  <Timeline>
                    {summary.events.map((event: TEvent, index: number) => (
                      <Event event={event} key={`event-${index}`} index={index} last={index === summary.events.length - 1 ? true : false} />
                    ))}
                  </Timeline>
                </section>
              )}

              {hasTargets && (
                <section className="mt-12">
                  <div>
                    <h3 className="flex mb-4">
                      <span className="mr-2">
                        <TargetIcon />
                      </span>
                      Targets ({summary.targets.length})
                    </h3>
                    <Targets targets={targets} />
                  </div>
                </section>
              )}
              {!showAllTargets && summary?.targets?.length > TARGETS_SHOW && (
                <div className="mt-12">
                  <Divider>
                    <Button color="secondary" wider onClick={() => setShowAllTargets(true)}>
                      See more
                    </Button>
                  </Divider>
                </div>
              )}
              {hasDocuments && (
                <>
                  <section className="mt-12" data-cy="top-documents">
                    <h3>Latest Documents</h3>
                    <div className="mt-4 md:flex">
                      <div className="flex-grow">
                        <TabbedNav
                          activeIndex={selectedCategoryIndex}
                          items={documentCategories}
                          handleTabClick={handleDocumentCategoryClick}
                          indent={false}
                        />
                      </div>
                    </div>
                    {renderDocuments()}
                  </section>
                  {selectedCategoryIndex !== 3 && (
                    <div className="mt-12" data-cy="see-more-button">
                      <Divider>
                        <Button color="secondary" extraClasses="flex items-center" onClick={handleDocumentSeeMoreClick}>
                          <>
                            See more
                            <span className="ml-8">
                              <RightArrowIcon height="20" width="20" />
                            </span>
                          </>
                        </Button>
                      </Divider>
                    </div>
                  )}
                </>
              )}
              {geography.legislative_process && (
                <section className="mt-12" data-cy="legislative-process">
                  <h3 className="mb-4">Legislative Process</h3>
                  <div className="text-content" dangerouslySetInnerHTML={{ __html: geography.legislative_process }} />
                </section>
              )}
            </SingleCol>
          </section>
        )}
      </Layout>
    </>
  );
};

export default CountryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.geographyId;
  const client = new ApiClient();

  let geographyData: TGeographyStats;
  let summaryData: TGeographySummary;

  try {
    const { data: returnedData }: { data: TGeographyStats } = await client.get(`/geo_stats/${id}`, null);
    geographyData = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }
  try {
    const { data: returnedData }: { data: TGeographySummary } = await client.get(`/summaries/country/${id}`, null);
    summaryData = returnedData;
  } catch {
    // TODO: handle error more elegantly
  }

  if (!geographyData || !summaryData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      geography: geographyData,
      summary: summaryData,
    },
  };
};
