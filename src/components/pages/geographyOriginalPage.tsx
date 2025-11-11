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
import TabbedNav from "@/components/nav/TabbedNav";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TPublicEnvConfig } from "@/context/EnvConfig";
import { GeographyCountsResponse } from "@/pages/api/geography-counts";
import { GeographyV2, TDocumentCategory, TFeatureFlags, TSearch, TSearchCriteria, TTarget, TTheme, TThemeConfig } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { isRioPolicyRadarEnabled } from "@/utils/features";
import { sortFilterTargets } from "@/utils/sortFilterTargets";

export interface IProps {
  featureFlags: TFeatureFlags;
  geographyV2: GeographyV2;
  parentGeographyV2?: GeographyV2;
  targets: TTarget[];
  theme: TTheme;
  themeConfig: TThemeConfig;
  vespaSearchResults?: TSearch;
  envConfig: TPublicEnvConfig;
}

const categories: { title: TDocumentCategory; slug: string }[] = [
  { title: "All", slug: "all" },
  { title: "UN Submissions", slug: "UN-submissions" },
  { title: "Laws", slug: "laws" },
  { title: "Policies", slug: "policies" },
  { title: "Climate Finance Projects", slug: "climate-finance-projects" },
  { title: "Offshore Wind Reports", slug: "offshore-wind-reports" },
  { title: "Litigation", slug: "litigation" },
];

export const GeographyOriginalPage = ({
  geographyV2,
  parentGeographyV2,
  targets,
  theme,
  themeConfig,
  vespaSearchResults,
  envConfig,
  featureFlags,
}: IProps) => {
  const router = useRouter();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;
  const allDocumentsCount = vespaSearchResults.total_family_hits;

  const displayBrazilNDCBanner = theme === "cclw" && geographyV2.slug.toLowerCase() === "brazil";

  // Determine if this is a subdivision
  const isCountry = geographyV2.type === "country";

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
    const documentCategory = categories.find((cat) => cat.title === currentVespaSearchSelectedCategory) || undefined;
    if (documentCategory && documentCategory.title !== "All") {
      newQuery[QUERY_PARAMS.category] = documentCategory.slug;
    }
    router.push({ pathname: "/search", query: { ...newQuery } });
  };

  /** Vespa search results */
  const [counts, setCounts] = useState<GeographyCountsResponse["counts"]>({});
  const vespaSearchTabbedNavItems = useMemo(
    () =>
      themeConfig.categories
        ? themeConfig.categories.options.reduce((items, category) => {
            // TODO: remove this when FF is removed and UN docs are released
            if (category.label === (isRioPolicyRadarEnabled(featureFlags, themeConfig) ? "UNFCCC Submissions" : "UN Submissions")) return items;
            return [
              ...items,
              {
                title: category.label,
                /** We need to maintain the slug to to know what to send to Vespa for querying. */
                slug: category.slug,
              },
            ];
          }, [])
        : /** We generate an `All` for when themeConfig.categories are not available e.g. MCFs */
          [
            {
              title: "All",
              slug: "All",
            },
          ],
    [themeConfig, featureFlags]
  );

  const countCategories = useMemo(
    // This is a hack to get around the hacked value we have for litigation in `themes/cpr/config.ts`
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
    setCurrentVespaSearchSelectedCategory(value);

    // This is a hack to get around the hacked value we have for litigation in `themes/cpr/config.ts`
    if (value.startsWith("Litigation")) {
      setCurrentVespaSearchResults({ families: [], total_family_hits: 0, hits: 0, query_time_ms: 0 });
      return;
    }

    const selectedThemeCategory = vespaSearchTabbedNavItems.find((category) => category.title === value);
    const categoryFilter = selectedThemeCategory.slug;

    const searchQuery = buildSearchQuery({ l: geographyV2.slug, c: categoryFilter, page_size: "3" }, themeConfig);

    const newVespaSearchResults = await vespaSearch(searchQuery);
    setCurrentVespaSearchResults(newVespaSearchResults);
    setCurrentVespaSearchSelectedCategory(value);
  };

  return (
    <Layout theme={theme} themeConfig={themeConfig} metadataKey="geography" text={geographyV2.name}>
      <section className="mb-8">
        <BreadCrumbs
          geography={{ label: geographyV2.name, href: `/geographies/${geographyV2.slug}` }}
          parentGeography={parentGeographyV2 ? { label: parentGeographyV2.name, href: `/geographies/${parentGeographyV2.slug}` } : null}
          isSubdivision={!isCountry}
        />
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
                {currentVespaSearchResults.families.length > 0 &&
                  currentVespaSearchResults.families.map((family) => <FamilyListItem family={family} key={family.family_slug} />)}

                {currentVespaSearchResults.families.length === 0 && (
                  <li className="mb-4 text-sm">{`There are no ${currentVespaSearchSelectedCategory} documents for ${geographyV2.name}.`}</li>
                )}
              </ol>
              {currentVespaSearchSelectedCategory.startsWith("Litigation") && (
                <p className="my-4 md:mt-0">
                  Climate litigation case documents are coming soon. In the meantime, visit the Sabin Center's{" "}
                  <ExternalLink url="http://climatecasechart.com/" className="underline text-blue-600 hover:text-blue-800">
                    Climate Change Litigation Databases
                  </ExternalLink>
                </p>
              )}
            </section>
            {currentVespaSearchSelectedCategory !== "Litigation" && (
              <div data-cy="see-more-button">
                <Button rounded variant="outlined" className="my-5" onClick={handleDocumentSeeMoreClick}>
                  View more documents
                </Button>
                <Divider />
              </div>
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
