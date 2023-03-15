import { useState } from "react";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { TTarget, TEvent, TGeography } from "@types";
import Layout from "@components/layouts/Main";
import { SingleCol } from "@components/SingleCol";
import Event from "@components/blocks/Event";
import { Timeline } from "@components/blocks/Timeline";
import { CountryHeader } from "@components/blocks/CountryHeader";
import { KeyDetail } from "@components/KeyDetail";
import { Divider } from "@components/dividers/Divider";
import { RightArrowIcon } from "@components/svg/Icons";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { Targets } from "@components/Targets";
import Button from "@components/buttons/Button";
import TabbedNav from "@components/nav/TabbedNav";
import TextLink from "@components/nav/TextLink";
import { LawIcon, PolicyIcon, CaseIcon, TargetIcon } from "@components/svg/Icons";
import { ExternalLink } from "@components/ExternalLink";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import { QUERY_PARAMS } from "@constants/queryParams";

import { ApiClient } from "@api/http-common";
import { TGeographyStats, TGeographySummary } from "@types";
import { extractNestedData } from "@utils/extractNestedData";
import { getCountryCode } from "@helpers/getCountryFields";

type TProps = {
  geography: TGeographyStats;
  summary: TGeographySummary;
  targets: TTarget[];
};

const CountryPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ geography, summary, targets }: TProps) => {
  const router = useRouter();
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(5);
  const [selectedCategoryIndex, setselectedCategoryIndex] = useState(0);

  const hasEvents = !!summary?.events && summary?.events?.length > 0;
  const hasFamilies = !!summary?.top_families;
  const publishedTargets = targets.filter((target) => target["Visibility status"] === "published");
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;

  const documentCategories = DOCUMENT_CATEGORIES;

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
      const allFamilies = summary.top_families.Executive.concat(summary.top_families.Legislative).concat(summary.top_families.Case);
      if (allFamilies.length === 0) {
        return renderEmpty();
      }
      allFamilies.sort((a, b) => {
        return new Date(b.family_date).getTime() - new Date(a.family_date).getTime();
      });
      return allFamilies.slice(0, 5).map((family) => (
        <div key={family.family_slug} className="mt-4 mb-10">
          <FamilyListItem family={family} />
        </div>
      ));
    }
    // Legislative
    if (selectedCategoryIndex === 1) {
      return summary.top_families.Legislative.length === 0
        ? renderEmpty("Legislative")
        : summary.top_families.Legislative.map((family) => (
            <div key={family.family_slug} className="mt-4 mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Executive
    if (selectedCategoryIndex === 2) {
      return summary.top_families.Executive.length === 0
        ? renderEmpty("Executive")
        : summary.top_families.Executive.map((family) => (
            <div key={family.family_slug} className="mt-4 mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Litigation
    if (selectedCategoryIndex === 3) {
      return (
        <div className="mt-4">
          Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center’s{" "}
          <ExternalLink url="http://climatecasechart.com/" className="text-blue-500 transition duration-300 hover:text-indigo-600">
            Climate Change Litigation Databases
          </ExternalLink>
          .
        </div>
      );
    }
  };

  // let targets = [];
  // if (!!summary?.targets) targets = showAllTargets ? summary.targets : summary.targets.slice(0, TARGETS_SHOW);

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
                    amount={summary.family_counts.Legislative}
                    icon={<LawIcon />}
                    onClick={() => setselectedCategoryIndex(1)}
                  />
                }
                {
                  <KeyDetail
                    detail="Policies"
                    extraDetail="Policies, strategies, decrees, action plans (from executive branch)"
                    amount={summary.family_counts.Executive}
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
                      Targets ({publishedTargets.length})
                    </h3>
                    <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} showFamilyInfo />
                  </div>
                </section>
              )}
              {publishedTargets.length > numberOfTargetsToDisplay && (
                <div className="mt-12">
                  <Divider>
                    <Button color="secondary" wider onClick={() => setNumberOfTargetsToDisplay(numberOfTargetsToDisplay + 3)}>
                      See more
                    </Button>
                  </Divider>
                </div>
              )}
              {hasFamilies && (
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
  let targetsData: TTarget[] = [];

  try {
    const { data: returnedData }: { data: TGeographyStats } = await client.get(`/geo_stats/${id}`, null);
    geographyData = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }
  try {
    const { data: returnedData }: { data: TGeographySummary } = await client.get(`/summaries/country/${id}`, { group_documents: true });
    summaryData = returnedData;
  } catch {
    // TODO: handle error more elegantly
  }
  try {
    let countries: TGeography[] = [];
    const configData = await client.get(`/config`, null);
    const response_geo = extractNestedData<TGeography>(configData.data?.metadata?.CCLW?.geographies, 2, "");
    countries = response_geo.level2;
    const country = getCountryCode(id as string, countries);
    if (country) {
      const targetsRaw = await axios.get<TTarget[]>(
        `https://cpr-staging-targets-json-store.s3.eu-west-1.amazonaws.com/geographies/${country.toLowerCase()}.json`
      );
      targetsData = targetsRaw.data;
    }
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
      targets: targetsData,
    },
  };
};
