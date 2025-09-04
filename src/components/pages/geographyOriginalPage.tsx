import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { BrazilImplementingNDCCard } from "@/cclw/components/BrazilImplementingNDCCard";
import { Alert } from "@/components/Alert";
import { ExternalLink } from "@/components/ExternalLink";
import { Targets } from "@/components/Targets";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { CountryHeader } from "@/components/deprecated/CountryHeader";
import { Divider } from "@/components/dividers/Divider";
import { FamilyListItem } from "@/components/document/FamilyListItem";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import TabbedNav from "@/components/nav/TabbedNav";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Event } from "@/components/timeline/Event";
import { Timeline } from "@/components/timeline/Timeline";
import { Heading } from "@/components/typography/Heading";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TPublicEnvConfig } from "@/context/EnvConfig";
import { GeographyCountsResponse } from "@/pages/api/geography-counts";
import {
  GeographyV2,
  TDocumentCategory,
  TEvent,
  TFeatureFlags,
  TGeographySummary,
  TSearch,
  TSearchCriteria,
  TTarget,
  TTheme,
  TThemeConfig,
} from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { sortFilterTargets } from "@/utils/sortFilterTargets";

export interface IProps {
  featureFlags: TFeatureFlags;
  geographyV2: GeographyV2;
  summary: TGeographySummary;
  targets: TTarget[];
  theme: TTheme;
  themeConfig: TThemeConfig;
  vespaSearchResults?: TSearch;
  envConfig: TPublicEnvConfig;
}

const categories: { title: TDocumentCategory; slug: string }[] = [
  { title: "All", slug: "all" },
  { title: "UNFCCC Submissions", slug: "unfccc" },
  { title: "Laws", slug: "laws" },
  { title: "Policies", slug: "policies" },
  { title: "Climate Finance Projects", slug: "climate-finance-projects" },
  { title: "Offshore Wind Reports", slug: "offshore-wind-reports" },
  { title: "Litigation", slug: "litigation" },
];

const MAX_NUMBER_OF_FAMILIES = 3;

export const GeographyOriginalPage = ({ geographyV2, summary, targets, theme, themeConfig, vespaSearchResults, envConfig }: IProps) => {
  const router = useRouter();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [selectedCategory, setselectedCategory] = useState<TDocumentCategory>(themeConfig.defaultDocumentCategory);

  const hasEvents = !!summary?.events && summary?.events?.length > 0;
  const hasFamilies = !!summary?.top_families;

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;
  const allDocumentsCount = Object.values(summary.family_counts).reduce((acc, count) => acc + (count || 0), 0);

  const displayBrazilNDCBanner = theme === "cclw" && geographyV2.slug.toLowerCase() === "brazil";

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
      case "UNFCCC Submissions":
        count = summary.family_counts.UNFCCC;
        break;
      case "Litigation":
        count = 0;
        break;
      case "Climate Finance Projects":
        count = summary.family_counts.MCF;
        break;
      case "Offshore Wind Reports":
        count = summary.family_counts.Reports;
        break;
    }

    return {
      title: category,
      count,
    };
  });

  const handleDocumentCategoryClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, value: TDocumentCategory) => {
    e.preventDefault();
    return setselectedCategory(value);
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
    newQuery[QUERY_PARAMS.country] = geographyV2.slug;
    const documentCategory = categories.find((cat) => cat.title === selectedCategory) || undefined;
    if (documentCategory && documentCategory.title !== "All") {
      newQuery[QUERY_PARAMS.category] = documentCategory.slug;
    }
    router.push({ pathname: "/search", query: { ...newQuery } });
  };

  const renderEmpty = (documentType: string = "") => <p className="mt-4">{`There are no ${documentType} documents for ${geographyV2.name}.`}</p>;

  const renderDocuments = () => {
    // All docs || All MCF docs if theme is MCF
    if (selectedCategory === "All") {
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
            <ol key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </ol>
          );
      });
    }
    // Legislative
    if (selectedCategory === "Laws") {
      return summary.top_families.Legislative.length === 0
        ? renderEmpty("Legislative")
        : summary.top_families.Legislative.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <ol key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </ol>
          ));
    }
    // Executive
    if (selectedCategory === "Policies") {
      return summary.top_families.Executive.length === 0
        ? renderEmpty("Executive")
        : summary.top_families.Executive.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <ol key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </ol>
          ));
    }
    // UNFCCC
    if (selectedCategory === "UNFCCC Submissions") {
      return summary.top_families.UNFCCC.length === 0
        ? renderEmpty("UNFCCC")
        : summary.top_families.UNFCCC.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <ol key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </ol>
          ));
    }
    // Litigation
    if (selectedCategory === "Litigation") {
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
    if (selectedCategory === "Climate Finance Projects") {
      return summary.top_families.MCF.length === 0
        ? renderEmpty("multilateral climate funds")
        : summary.top_families.MCF.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <ol key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </ol>
          ));
    }
    // Reports
    if (selectedCategory === "Offshore Wind Reports") {
      return summary.top_families.Reports.length === 0
        ? renderEmpty("reports")
        : summary.top_families.Reports.slice(0, MAX_NUMBER_OF_FAMILIES).map((family) => (
            <ol key={family.family_slug} className="mb-10">
              <FamilyListItem family={family} />
            </ol>
          ));
    }
  };

  /** Vespa search results */
  const [counts, setCounts] = useState<GeographyCountsResponse["counts"]>({});
  const vespaSearchTabbedNavItems = useMemo(
    () =>
      themeConfig.categories
        ? themeConfig.categories.options.map((category) => {
            return {
              title: category.label,
              /** We need to maintain the slug to to know what to send to Vespa for querying. */
              slug: category.slug,
            };
          })
        : /** We generate an `All` for when themeConfig.categories are not available e.g. MCFs */
          [
            {
              title: "All",
              slug: "All",
            },
          ],
    [themeConfig.categories]
  );

  const countCategories = useMemo(
    () => vespaSearchTabbedNavItems.map((item) => item.slug.toLocaleLowerCase()).filter((slug) => slug !== "litigation"),
    [vespaSearchTabbedNavItems]
  );

  useEffect(() => {
    fetch(`/api/geography-counts?l=${geographyV2.slug}&c=${countCategories.join("&c=")}`)
      .then((res) => res.json() as Promise<GeographyCountsResponse>)
      .then((data) => setCounts(data.counts));
  }, [geographyV2.slug, countCategories]);

  const [currentVespaSearchSelectedCategory, setCurrentVespaSearchSelectedCategory] = useState(vespaSearchTabbedNavItems[0].title);
  const [currentVespaSearchResults, setCurrentVespaSearchResults] = useState(vespaSearchResults);

  const backendApiClient = new ApiClient(envConfig.BACKEND_API_URL, envConfig.BACKEND_API_TOKEN);
  const vespaSearch = async (searchQuery: TSearchCriteria) => {
    const search: Promise<TSearch> = await backendApiClient
      .post("/searches", searchQuery, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);
    return search;
  };

  const handleVespaSearchTabClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, value: string) => {
    const selectedThemeCategory = vespaSearchTabbedNavItems.find((category) => category.title === value);
    const categoryFilter = selectedThemeCategory.slug;

    const searchQuery = buildSearchQuery({ l: geographyV2.slug, c: categoryFilter }, themeConfig);

    const newVespaSearchResults = await vespaSearch(searchQuery);
    setCurrentVespaSearchResults(newVespaSearchResults);
    setCurrentVespaSearchSelectedCategory(value);
  };

  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="geography" text={geographyV2.name}>
      <section className="mb-8">
        <SubNav>
          <BreadCrumbs label={geographyV2.name} />
        </SubNav>
        <SiteWidth>
          <SingleCol extraClasses="mt-8">
            {displayBrazilNDCBanner && <BrazilImplementingNDCCard />}
            <CountryHeader
              country={geographyV2}
              targetCount={hasTargets ? publishedTargets?.length : 0}
              onTargetClick={handleTargetClick}
              theme={theme}
              totalProjects={allDocumentsCount}
            />
            {theme !== "mcf" && geographyV2.name === "United States" && (
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
            {!vespaSearchResults && hasFamilies && (
              <>
                <section className="" data-cy="top-documents">
                  <div className="my-4 md:flex">
                    <div className="flex-grow">
                      <TabbedNav activeItem={selectedCategory} items={documentCategories} handleTabClick={handleDocumentCategoryClick} />
                    </div>
                  </div>
                  {renderDocuments()}
                </section>
                {selectedCategory !== "Litigation" && (
                  <div data-cy="see-more-button">
                    <Button rounded variant="outlined" className="my-5" onClick={handleDocumentSeeMoreClick}>
                      View more documents
                    </Button>
                    <Divider />
                  </div>
                )}
              </>
            )}
            {currentVespaSearchResults && (
              <>
                <section className="" data-cy="top-documents">
                  <div className="my-4 md:flex">
                    <div className="flex-grow">
                      <TabbedNav
                        activeItem={currentVespaSearchSelectedCategory}
                        items={vespaSearchTabbedNavItems.map((item) => {
                          return {
                            ...item,
                            count: item.slug !== "Litigation" ? counts[item.slug.toLocaleLowerCase()] : undefined,
                          };
                        })}
                        handleTabClick={handleVespaSearchTabClick}
                      />
                    </div>
                  </div>
                  <ol className="mb-10">
                    {currentVespaSearchResults.families.map((family) => (
                      <FamilyListItem family={family} key={family.family_slug} />
                    ))}
                  </ol>
                </section>
                {selectedCategory !== "Litigation" && (
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
            {geographyV2.statistics?.legislative_process && theme !== "mcf" && (
              <section className="mt-10" data-cy="legislative-process">
                <Heading level={2} extraClasses="flex items-center gap-2">
                  Legislative Process
                </Heading>
                <div
                  className="text-content"
                  dangerouslySetInnerHTML={{
                    __html: geographyV2.statistics?.legislative_process,
                  }}
                />
              </section>
            )}
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
