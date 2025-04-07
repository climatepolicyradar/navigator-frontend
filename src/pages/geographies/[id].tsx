import { useState } from "react";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { ApiClient } from "@/api/http-common";

import { SiteWidth } from "@/components/panels/SiteWidth";
import { SingleCol } from "@/components/panels/SingleCol";

import Layout from "@/components/layouts/Main";
import { Timeline } from "@/components/timeline/Timeline";
import { Event } from "@/components/timeline/Event";
import { CountryHeader } from "@/components/blocks/CountryHeader";
import { Divider } from "@/components/dividers/Divider";
import { Icon } from "@/components/atoms/icon/Icon";
import { FamilyListItem } from "@/components/document/FamilyListItem";
import { Targets } from "@/components/Targets";
import { Button } from "@/components/atoms/button/Button";
import TabbedNav from "@/components/nav/TabbedNav";
import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { Alert } from "@/components/Alert";
import { SubNav } from "@/components/nav/SubNav";
import { Heading } from "@/components/typography/Heading";

import { getCountryCode } from "@/helpers/getCountryFields";

import { extractNestedData } from "@/utils/extractNestedData";
import { sortFilterTargets } from "@/utils/sortFilterTargets";
import { readConfigFile } from "@/utils/readConfigFile";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { systemGeoNames } from "@/constants/systemGeos";

import { TGeographyStats, TGeographySummary, TThemeConfig } from "@/types";
import { TTarget, TEvent, TGeography, TTheme } from "@/types";

type TProps = {
  geography: TGeographyStats;
  summary: TGeographySummary;
  targets: TTarget[];
  theme: TTheme;
  themeConfig: TThemeConfig;
};

// Mapping of category index to category name in search
const categoryByIndex = {
  0: "All",
  1: "laws",
  2: "policies",
  3: "UNFCCC",
  4: "laws",
  5: "multilateral-climate-funds",
  6: "reports",
};

const MAX_NUMBER_OF_FAMILIES = 3;

const CountryPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ geography, summary, targets, theme, themeConfig }: TProps) => {
  const router = useRouter();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [selectedCategoryIndex, setselectedCategoryIndex] = useState(0);

  const hasEvents = !!summary?.events && summary?.events?.length > 0;
  const hasFamilies = !!summary?.top_families;

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;
  const allDocumentsCount = Object.values(summary.family_counts).reduce((acc, count) => acc + (count || 0), 0);

  const documentCategories = themeConfig.documentCategories.map((category) => {
    let count = null;
    switch (category) {
      case "All":
        count = allDocumentsCount;
        break;
      case "Laws":
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
      case "MCF":
        count = summary.family_counts.MCF;
        break;
      case "Reports":
        count = summary.family_counts.Reports;
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

  const renderEmpty = (documentType: string = "") => <p className="mt-4">{`There are no ${documentType} documents for ${geography.name}.`}</p>;

  const renderDocuments = () => {
    // All docs || All MCF docs if theme is MCF
    if (selectedCategoryIndex === 0) {
      let allFamilies = Object.values(summary.top_families).reduce((acc, curr) => acc.concat(curr), []);
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
            <div key={family.family_slug} className="mb-10">
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
            <div key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Executive
    if (selectedCategoryIndex === 2) {
      return summary.top_families.Executive.length === 0
        ? renderEmpty("Executive")
        : summary.top_families.Executive.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // UNFCCC
    if (selectedCategoryIndex === 3) {
      return summary.top_families.UNFCCC.length === 0
        ? renderEmpty("UNFCCC")
        : summary.top_families.UNFCCC.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Litigation
    if (selectedCategoryIndex === 4) {
      return (
        <div className="mt-4 pb-4 border-b">
          Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center’s{" "}
          <ExternalLink url="http://climatecasechart.com/" className="underline text-blue-600 hover:text-blue-800">
            Climate Change Litigation Databases
          </ExternalLink>
          .
        </div>
      );
    }
    // MCF
    if (selectedCategoryIndex === 5) {
      return summary.top_families.MCF.length === 0
        ? renderEmpty("multilateral climate funds")
        : summary.top_families.MCF.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
    // Reports
    if (selectedCategoryIndex === 6) {
      return summary.top_families.Reports.length === 0
        ? renderEmpty("reports")
        : summary.top_families.Reports.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <div key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </div>
          ));
    }
  };

  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="geography" text={geography.name}>
      {!geography ? (
        <SingleCol>
          <Button variant="ghost" onClick={() => router.back()}>
            Go back
          </Button>
          <p>We were not able to load the data for the country.</p>
        </SingleCol>
      ) : (
        <section className="mb-8">
          <SubNav>
            <BreadCrumbs label={geography.name} />
          </SubNav>
          <SiteWidth>
            <SingleCol extraClasses="mt-8">
              <CountryHeader
                country={geography}
                targetCount={hasTargets ? publishedTargets?.length : 0}
                onTargetClick={handleTargetClick}
                theme={theme}
                totalProjects={allDocumentsCount}
              />
              {theme !== "mcf" && geography.name === "United States of America" && (
                <section className="mt-8">
                  <div className="flex mt-4">
                    <Alert
                      message={
                        <>
                          To see developments in the Trump-Vance administration's climate rollback, visit the{" "}
                          <ExternalLink
                            url="https://climate.law.columbia.edu/content/climate-backtracker"
                            className="underline text-blue-600 hover:text-blue-800"
                          >
                            Sabin Center's Climate Backtracker
                          </ExternalLink>
                          .
                        </>
                      }
                      icon={<Icon name="alertCircle" height="16" width="16" />}
                    />
                  </div>
                </section>
              )}
              <section className="mt-8">
                <Heading level={2}>Documents</Heading>
              </section>
              {hasFamilies && (
                <>
                  <section className="mt-10" data-cy="top-documents">
                    <div className="my-4 md:flex">
                      <div className="flex-grow">
                        <TabbedNav activeIndex={selectedCategoryIndex} items={documentCategories} handleTabClick={handleDocumentCategoryClick} />
                      </div>
                    </div>
                    {renderDocuments()}
                  </section>
                  {selectedCategoryIndex !== 4 && (
                    <div data-cy="see-more-button">
                      <Button rounded variant="outlined" className="my-5" onClick={handleDocumentSeeMoreClick}>
                        View more documents
                      </Button>
                      <Divider />
                    </div>
                  )}
                </>
              )}
              {hasTargets && (
                <>
                  <section className="mt-10" id="targets">
                    <div>
                      <div>
                        <Heading level={2}>
                          Targets <span className="font-normal">({publishedTargets.length})</span>
                        </Heading>

                        <ExternalLink
                          url="https://form.jotform.com/233542296946365"
                          className="text-sm underline text-blue-600 hover:text-blue-800"
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
                      <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} showFamilyInfo />
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
                      <Divider />
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
                      <Divider />
                    </div>
                  )}
                </>
              )}
              {hasEvents && (
                <section className="mt-10 hidden">
                  <Heading level={2}>Events</Heading>
                  <Timeline>
                    {summary.events.map((event: TEvent, index: number) => (
                      <Event event={event} key={`event-${index}`} index={index} last={index === summary.events.length - 1 ? true : false} />
                    ))}
                  </Timeline>
                </section>
              )}
              {geography.legislative_process && theme !== "mcf" && (
                <section className="mt-10" data-cy="legislative-process">
                  <Heading level={2} extraClasses="flex items-center gap-2">
                    Legislative Process
                  </Heading>
                  <div className="text-content" dangerouslySetInnerHTML={{ __html: geography.legislative_process }} />
                </section>
              )}
            </SingleCol>
          </SiteWidth>
        </section>
      )}
    </Layout>
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
  const theme = process.env.THEME;

  let geographyData: TGeographyStats;
  let summaryData: TGeographySummary;
  let targetsData: TTarget[] = [];
  let themeConfig = {};

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
    const configData = await client.getConfig();
    const response_geo = extractNestedData<TGeography>(configData.data?.geographies, 2, "");
    countries = response_geo.level2;
    const country = getCountryCode(id as string, countries);
    if (country) {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.TARGETS_URL}/geographies/${country.toLowerCase()}.json`);
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

  try {
    themeConfig = await readConfigFile(theme);
  } catch {
    // TODO: handler error more elegantly
  }

  return {
    props: {
      geography: geographyData,
      summary: summaryData,
      targets: theme === "mcf" ? [] : targetsData,
      theme: theme,
      themeConfig,
    },
  };
};
