import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { TLabelsResponse } from "@/components/_experiment/intellisearch";
import { GeographyPage } from "@/components/pages/geographyPage";
import { SYSTEM_GEO_NAMES } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getCountryCode, getCountryName } from "@/helpers/getCountryFields";
import { TApiItemResponse, GeographyV2, TSearch, TGeography, TSearchLabel, GeographyTypeV2 } from "@/types";
import buildSearchQuery from "@/utils/buildSearchQuery";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";

const CountryPage = ({ ...props }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <GeographyPage key={props.geographyV2.slug} {...props} />;
};

export default CountryPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const id = context.params.id;

  if (SYSTEM_GEO_NAMES.includes(id as string)) {
    return {
      notFound: true,
    };
  }

  const backendApiClient = new ApiClient();
  const apiClient = new ApiClient(process.env.CONCEPTS_API_URL);

  let countryNameFromConfig;
  try {
    let geographies: TGeography[] = [];
    const { config, error: configError } = await backendApiClient.getConfig();
    if (configError) console.error(configError);
    const response_geo = extractNestedData<TGeography>(config.geographies || []);
    geographies = [...response_geo[1], ...response_geo[2]];
    const geography = getCountryCode(id as string, geographies);

    if (geography) {
      countryNameFromConfig = getCountryName(id as string, geographies);
    }
  } catch {
    // TODO: handle error more elegantly
  }

  let geographyV2: GeographyV2;
  let parentGeographyV2: GeographyV2 = null;

  try {
    const slug = Array.isArray(id) ? id[0] : id;
    const geographyV2Data = await apiClient.get<TApiItemResponse<GeographyV2>>(`/geographies/${slug}`);
    geographyV2 = geographyV2Data.data.data;

    if (geographyV2.subconcept_of[0]) {
      const parentGeographyV2Data = await apiClient.get<TApiItemResponse<GeographyV2>>(`/geographies/${geographyV2.subconcept_of[0].slug}`);
      parentGeographyV2 = parentGeographyV2Data.data.data;
    }
  } catch {
    // Do nothing
  }

  if (!geographyV2) return { notFound: true };

  // Prevent rendering geography pages for types we don't support
  const disallowedGeoTypes: GeographyTypeV2[] = ["region"];
  if (!features.subdivisions) disallowedGeoTypes.push("subdivision");
  if (disallowedGeoTypes.includes(geographyV2.type)) return { notFound: true };

  if (countryNameFromConfig) {
    geographyV2.name = countryNameFromConfig;
  }

  let vespaSearchResults: TSearch = null;
  const searchQuery = buildSearchQuery(
    {
      l: geographyV2.slug,
      page_size: "4",
    },
    themeConfig
  );
  vespaSearchResults = await backendApiClient
    .post<TSearch>("/searches", searchQuery, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch((err) => console.error(`Could not find search results for geography ${geographyV2.slug}:`, err));

  if (!vespaSearchResults) {
    return { notFound: true };
  }

  let geographyLabel: TSearchLabel = null;
  // TODO support subdivisions and therefore CCC
  if (features["new-search"] && theme !== "ccc") {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org";
    const client = new ApiClient(apiUrl);
    const filters = {
      op: "and",
      filters: [
        {
          field: "type",
          op: "contains",
          value: "country",
        },
      ],
    };
    const response = await client.get<TLabelsResponse>(`/search/labels?page_size=10000&filters=${encodeURIComponent(JSON.stringify(filters))}`, null);

    // Ensure there is a label for this geography that includes a parent region as we need it to build a search query
    const expectedId = `country::${geographyV2.id}`;
    geographyLabel =
      response.data.results.find(
        (label) => label.id === expectedId && label.labels.some((subLabel) => subLabel.type === "subconcept_of" && subLabel.value.type === "region")
      ) ?? null;

    if (!geographyLabel) return { notFound: true };
  }

  return {
    props: withEnvConfig({
      features,
      geographyV2,
      parentGeographyV2,
      geographyLabel,
      theme,
      themeConfig,
      vespaSearchResults: vespaSearchResults,
    }),
  };
}) satisfies GetServerSideProps;
