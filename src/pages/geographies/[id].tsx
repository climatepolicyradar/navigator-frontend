import { useState } from "react";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { ApiClient } from "@api/http-common";
import Layout from "@components/layouts/Main";
import { SingleCol } from "@components/SingleCol";
import Event from "@components/blocks/Event";
import { Timeline } from "@components/blocks/Timeline";
import { CountryHeader } from "@components/blocks/CountryHeader";
import { Divider } from "@components/dividers/Divider";
import { DownArrowIcon, RightArrowIcon } from "@components/svg/Icons";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { Targets } from "@components/Targets";
import Button from "@components/buttons/Button";
import TabbedNav from "@components/nav/TabbedNav";
import TextLink from "@components/nav/TextLink";
import { TargetIcon } from "@components/svg/Icons";
import { ExternalLink } from "@components/ExternalLink";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { getCountryCode } from "@helpers/getCountryFields";
import { extractNestedData } from "@utils/extractNestedData";
import { sortFilterTargets } from "@utils/sortFilterTargets";
import { DOCUMENT_CATEGORIES } from "@constants/documentCategories";
import { QUERY_PARAMS } from "@constants/queryParams";
import { getGeoDescription } from "@constants/metaDescriptions";
import { systemGeoNames } from "@constants/systemGeos";
import { TGeographyStats, TGeographySummary } from "@types";
import { TTarget, TEvent, TGeography } from "@types";

type TProps = {
  geography: TGeographyStats;
  summary: TGeographySummary;
  targets: TTarget[];
};

const categoryByIndex = {
  0: "All",
  1: "Legislation",
  2: "Policies",
  3: "UNFCCC",
  4: "Litigation",
};

const MAX_NUMBER_OF_FAMILIES = 3;

const CountryPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ geography, summary, targets }: TProps) => {
  const router = useRouter();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [selectedCategoryIndex, setselectedCategoryIndex] = useState(0);

  const hasEvents = !!summary?.events && summary?.events?.length > 0;
  const hasFamilies = !!summary?.top_families;

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;

  const documentCategories = DOCUMENT_CATEGORIES.map((category) => {
    let count = null;
    switch (category) {
      case "All":
        count = summary.family_counts.Legislative + summary.family_counts.Executive + summary.family_counts.UNFCCC;
        break;
      case "Legislation":
        count = summary.family_counts.Legislative;
        break;
      case "Policies":
        count = summary.family_counts.Executive;
        break;
      case "UNFCCC":
        count = summary.family_counts.UNFCCC;
        break;
      case "Litigation":
        count = 0;
        break;
    }

    return {
      title: category,
      count,
    };
  });

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
    if (documentCategory && documentCategory !== "All") {
      newQuery[QUERY_PARAMS.category] = documentCategory;
    }
    router.push({ pathname: "/search", query: { ...newQuery } });
  };

  const renderEmpty = (documentType: string = "") => <p className="mt-4">{`There are no ${documentType} documents for ${geography.name}`}</p>;

  const renderDocuments = () => {
    // const executiveFamilies = summary.top_families.Executive;
    // All
    if (selectedCategoryIndex === 0) {
      let allFamilies = summary.top_families.Executive.concat(summary.top_families.Legislative).concat(summary.top_families.UNFCCC);
      if (allFamilies.length === 0) {
        return renderEmpty();
      }
      allFamilies.sort((a, b) => {
        return new Date(b.family_date).getTime() - new Date(a.family_date).getTime();
      });
      if (allFamilies.length > MAX_NUMBER_OF_FAMILIES) {
        allFamilies = allFamilies.slice(0, MAX_NUMBER_OF_FAMILIES);
      }
      return allFamilies.map((family) => {
        if (family)
          return (
            <div key={family.family_slug} className="mt-6">
              <FamilyListItem family={family} />
            </div>
          );
      });
    }
    // Legislative
    if (selectedCategoryIndex === 1) {
      return summary.top_families.Legislative.length === 0
        ? renderEmpty("Legislative")
        : summary.top_families.Legislative.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mt-6">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Executive
    if (selectedCategoryIndex === 2) {
      return summary.top_families.Executive.length === 0
        ? renderEmpty("Executive")
        : summary.top_families.Executive.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mt-6">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // UNFCCC
    if (selectedCategoryIndex === 3) {
      return summary.top_families.UNFCCC.length === 0
        ? renderEmpty("UNFCCC")
        : summary.top_families.UNFCCC.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mt-6">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Litigation
    if (selectedCategoryIndex === 4) {
      return (
        <div className="mt-4 pb-4 border-b">
          Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center’s{" "}
          <ExternalLink url="http://climatecasechart.com/">Climate Change Litigation Databases</ExternalLink>.
        </div>
      );
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
            <div className="container">
              <BreadCrumbs label={geography.name} />
            </div>
            <SingleCol>
              <CountryHeader country={geography} targetCount={hasTargets ? publishedTargets?.length : 0} onTargetClick={handleTargetClick} />
              {hasEvents && (
                <section className="mt-10 hidden">
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
                  <section className="mt-10" data-cy="top-documents">
                    <div className="mt-4 md:flex">
                      <div className="flex-grow">
                        <TabbedNav activeIndex={selectedCategoryIndex} items={documentCategories} handleTabClick={handleDocumentCategoryClick} />
                      </div>
                    </div>
                    {renderDocuments()}
                  </section>
                  {selectedCategoryIndex !== 4 && (
                    <div data-cy="see-more-button">
                      <Button color="secondary" extraClasses="my-6" onClick={handleDocumentSeeMoreClick}>
                        View more documents
                      </Button>
                      <Divider></Divider>
                    </div>
                  )}
                </>
              )}
              {hasTargets && (
                <>
                  <section className="mt-10" id="targets">
                    <div>
                      <div className="justify-between items-end lg:flex">
                        <h3 className="flex items-center gap-2">
                          <TargetIcon />
                          Targets <span className="text-gray-700 font-normal">({publishedTargets.length})</span>
                        </h3>

                        <ExternalLink
                          url="https://docs.google.com/forms/d/e/1FAIpQLSfP2ECC6W92xF5HHvy5KAPVTim0Agrbr4dD2LhiWkDjcY2f6g/viewform"
                          className="block mt-4 underline md:mt-0"
                          cy="download-target-csv"
                        >
                          Request to download all target data (.csv)
                        </ExternalLink>
                      </div>
                      <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} showFamilyInfo />
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
                      <Divider></Divider>
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
                      <Divider></Divider>
                    </div>
                  )}
                </>
              )}
              {geography.legislative_process && (
                <section className="mt-10" data-cy="legislative-process">
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

  if (systemGeoNames.includes(id as string)) {
    return {
      notFound: true,
    };
  }

  const client = new ApiClient();

  let geographyData: TGeographyStats;
  let summaryData: TGeographySummary;
  let targetsData: TTarget[] = [];

  try {
    const { data: returnedData }: { data: TGeographyStats } = await client.get(`/geo_stats/${id}`);
    geographyData = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }
  try {
    const { data: returnedData }: { data: TGeographySummary } = await client.get(`/summaries/geography/${id}`);
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
