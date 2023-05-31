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
import { getGeoDescription } from "@constants/metaDescriptions";
import { sortFilterTargets } from "@utils/sortFilterTargets";

type TProps = {
  geography: TGeographyStats;
  summary: TGeographySummary;
  targets: TTarget[];
};

const categoryByIndex = {
  0: "All",
  1: "Legislation",
  2: "Policies",
  3: "Litigation",
  4: "UNFCCC",
};

const CountryPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ geography, summary, targets }: TProps) => {
  const router = useRouter();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [selectedCategoryIndex, setselectedCategoryIndex] = useState(0);

  const hasEvents = !!summary?.events && summary?.events?.length > 0;
  const hasFamilies = !!summary?.top_families;

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;

  const documentCategories = DOCUMENT_CATEGORIES;

  const handleDocumentCategoryClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    e.preventDefault();
    return setselectedCategoryIndex(index);
  };

  const handleTargetClick = () => {
    setTimeout(() => {
      if (document.getElementById("targets")) {
        document.getElementById("targets").scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleDocumentSeeMoreClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newQuery = {};
    newQuery[QUERY_PARAMS.country] = geography.geography_slug;
    const documentCategory = categoryByIndex[selectedCategoryIndex] ?? null;
    if (documentCategory) {
      newQuery[QUERY_PARAMS.category] = documentCategory;
    }
    router.push({ pathname: "/search", query: { ...newQuery } });
  };

  const renderEmpty = (documentType: string = "") => <p className="mt-4">{`There are no ${documentType} documents for ${geography.name}`}</p>;

  const renderDocuments = () => {
    // All
    if (selectedCategoryIndex === 0) {
      let allFamilies = summary.top_families.Executive.concat(summary.top_families.Legislative).concat(summary.top_families.UNFCCC);
      if (allFamilies.length === 0) {
        return renderEmpty();
      }
      allFamilies.sort((a, b) => {
        return new Date(b.family_date).getTime() - new Date(a.family_date).getTime();
      });
      if (allFamilies.length > 5) {
        allFamilies = allFamilies.slice(0, 5);
      }
      return allFamilies.map((family) => {
        if (family)
          return (
            <div key={family.family_slug} className="mt-4 mb-10">
              <FamilyListItem family={family} />
            </div>
          );
      });
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
    // UNFCCC
    if (selectedCategoryIndex === 4) {
      return summary.top_families.UNFCCC.length === 0
        ? renderEmpty("UNFCCC")
        : summary.top_families.UNFCCC.map((family) => (
            <div key={family.family_slug} className="mt-4 mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
  };

  return (
    <>
      <Layout title={geography.name} description={getGeoDescription(geography.name)}>
        {!geography ? (
          <SingleCol>
            <TextLink onClick={() => router.back()}>Go back</TextLink>
            <p>We were not able to load the data for the country.</p>
          </SingleCol>
        ) : (
          <section className="mb-8">
            <CountryHeader country={geography} />
            <div className="container mt-12">
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px rounded mb-8">
                <KeyDetail
                  detail="Legislation"
                  extraDetail="Laws, Acts, Constitutions (legislative branch)"
                  amount={summary.family_counts.Legislative}
                  icon={<LawIcon />}
                  onClick={() => setselectedCategoryIndex(1)}
                />
                <KeyDetail
                  detail="Policies"
                  extraDetail="Policies, strategies, decrees, action plans (from executive branch)"
                  amount={summary.family_counts.Executive}
                  icon={<PolicyIcon />}
                  onClick={() => setselectedCategoryIndex(2)}
                />
                <KeyDetail
                  detail="Litigation"
                  extraDetail="Court cases and tribunal proceedings"
                  amount={<span className="text-sm font-normal">Coming soon</span>}
                  icon={<CaseIcon />}
                  onClick={() => setselectedCategoryIndex(3)}
                />
                <KeyDetail
                  detail="Targets"
                  extraDetail="Climate targets in National Law & Policy"
                  amount={targets.length}
                  icon={<TargetIcon />}
                  onClick={() => handleTargetClick()}
                />
              </section>
            </div>
            <SingleCol>
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
              {hasTargets && (
                <>
                  <section className="mt-12" id="targets">
                    <div>
                      <div className="lg:flex justify-between items-end">
                        <h3 className="flex mb-4">
                          <span className="mr-2">
                            <TargetIcon />
                          </span>
                          Targets ({publishedTargets.length})
                        </h3>

                        <ExternalLink
                          url="https://docs.google.com/forms/d/e/1FAIpQLSfP2ECC6W92xF5HHvy5KAPVTim0Agrbr4dD2LhiWkDjcY2f6g/viewform"
                          className="block text-sm text-blue-600 my-4 md:mt-0 hover:underline"
                          cy="download-target-csv"
                        >
                          Request to download all target data (.csv)
                        </ExternalLink>
                      </div>
                      <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} showFamilyInfo />
                    </div>
                  </section>
                  {publishedTargets.length > numberOfTargetsToDisplay && (
                    <div className="mt-12">
                      <Divider>
                        <Button color="secondary" wider onClick={() => setNumberOfTargetsToDisplay(numberOfTargetsToDisplay + 3)}>
                          See more
                        </Button>
                      </Divider>
                    </div>
                  )}
                  {publishedTargets.length > startingNumberOfTargetsToDisplay && publishedTargets.length <= numberOfTargetsToDisplay && (
                    <div className="mt-12">
                      <Divider>
                        <Button color="secondary" wider onClick={() => setNumberOfTargetsToDisplay(5)}>
                          Hide &#8679;
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
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const id = context.params.id;

  const ignoredSlugs = [
    "xaa", // No Geography
    "xab", // International
  ];

  if (ignoredSlugs.includes(id as string)) {
    return {
      notFound: true,
    };
  }

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
    const { data: returnedData }: { data: TGeographySummary } = await client.get(`/summaries/geography/${id}`, { group_documents: true });
    summaryData = returnedData;
  } catch {
    // TODO: handle error more elegantly
  }
  try {
    let countries: TGeography[] = [];
    const configData = await client.get(`/config`, null);
    const response_geo = extractNestedData<TGeography>(configData.data?.geographies, 2, "");
    countries = response_geo.level2;
    const country = getCountryCode(id as string, countries);
    if (country) {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.S3_PATH}/geographies/${country.toLowerCase()}.json`);
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
