import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { fetchSearchPrincipalDocuments } from "@/api/search";
import { loadTaxonomy } from "@/api/taxonomy";
import { findGeographyBySlug, labelToGeographyV2 } from "@/bff/methods/getGeography";
import { GeographyPage } from "@/components/pages/geographyPage";
import { COUNTRY_LABEL_PATTERN, SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { SYSTEM_GEO_NAMES } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getCountryCode, getCountryName } from "@/helpers/getCountryFields";
import {
  TApiItemResponse,
  GeographyV2,
  ISearchDocumentsResponse,
  TGeography,
  TFilterPathLabel,
  TSearchLabel,
  TSearchLabelRelation,
  TNestedSearchLabel,
  TThemeConfig,
  GeographyTypeV2,
  TFeatures,
} from "@/types";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { readConfigFile } from "@/utils/readConfigFile";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

// The geography page shows a short, horizontally scrolling list of recent principals.
const GEOGRAPHY_PRINCIPALS_PAGE_SIZE = 4;

const toSearchLabel = ({ id, type, value, alternative_labels }: TNestedSearchLabel, labels: TSearchLabelRelation[] = []): TSearchLabel => ({
  id,
  type,
  value,
  alternative_labels,
  labels,
});

const toGeographySearchLabel = ({ label, parent }: NonNullable<ReturnType<typeof findGeographyBySlug>>): TSearchLabel => {
  const relations: TSearchLabelRelation[] = parent
    ? [{ type: "subconcept_of", value: toSearchLabel(parent), timestamp: null, passages_id: null, count: null }]
    : [];
  return toSearchLabel(label, relations);
};

/**
 * Count and list the most recent principals for a geography.
 *
 * Scoped the same way the search page scopes a geography filter, so both show the same documents.
 */
const fetchGeographyPrincipals = (
  apiUrl: string,
  geographyLabel: TSearchLabel,
  themeConfig: TThemeConfig,
  features: TFeatures
): Promise<ISearchDocumentsResponse> => {
  const parentType = geographyLabel.type === "subdivision" ? "country" : "region";
  const parentLabel = geographyLabel.labels.find((label) => label.type === "subconcept_of" && label.value.type === parentType);
  const labelPaths: TFilterPathLabel[][] = [parentLabel ? [geographyLabel, parentLabel.value] : [geographyLabel]];

  return fetchSearchPrincipalDocuments({
    apiUrl,
    themeConfig,
    features,
    filters: filterPathsToQueryGroup(labelPaths, null, "and"),
    page_size: String(GEOGRAPHY_PRINCIPALS_PAGE_SIZE),
    sort: "recent",
  });
};

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

  const slug = Array.isArray(id) ? id[0] : id;
  const taxonomyPatterns = features.subdivisions ? [COUNTRY_LABEL_PATTERN, SUBDIVISION_LABEL_PATTERN] : [COUNTRY_LABEL_PATTERN];
  const taxonomy = await loadTaxonomy(process.env.API_URL, { patterns: taxonomyPatterns });

  const lookup = findGeographyBySlug(taxonomy, slug);
  if (!lookup) return { notFound: true };

  const geographyV2 = labelToGeographyV2(lookup.label);
  if (!geographyV2) return { notFound: true };
  // Only subdivisions have a parent geography page (a country's parent is a region, which has no page).
  const parentGeographyV2 = geographyV2.type === "subdivision" && lookup.parent ? labelToGeographyV2(lookup.parent) : null;

  // The country that owns the subdivision list: the page's own geography for a country, its parent for a subdivision.
  // This is the only remaining geographies-api call. It goes when the subdivision block is revisited.
  const countryGeography = geographyV2.type === "country" ? geographyV2 : parentGeographyV2;
  if (countryGeography) {
    try {
      const countryResponse = await apiClient.get<TApiItemResponse<GeographyV2>>(`/geographies/${countryGeography.slug}`);
      countryGeography.has_subconcept = countryResponse.data.data.has_subconcept || [];
    } catch {
      // Without it the subdivision block does not render
    }
  }

  // Prevent rendering geography pages for types we don't support
  const disallowedGeoTypes: GeographyTypeV2[] = ["region"];
  if (!features.subdivisions) disallowedGeoTypes.push("subdivision");
  if (disallowedGeoTypes.includes(geographyV2.type)) return { notFound: true };

  if (countryNameFromConfig) {
    geographyV2.name = countryNameFromConfig;
  }

  const geographyLabel = toGeographySearchLabel(lookup);

  const vespaSearchResults = await fetchGeographyPrincipals(process.env.API_URL, geographyLabel, themeConfig, features).catch(
    (err): ISearchDocumentsResponse => {
      console.error(`Could not find search results for geography ${geographyV2.slug}:`, err);
      return null;
    }
  );

  if (!vespaSearchResults) {
    return { notFound: true };
  }

  return {
    props: withEnvConfig({
      features,
      geographyV2,
      parentGeographyV2,
      geographyLabel,
      theme,
      themeConfig,
      vespaSearchResults,
    }),
  };
}) satisfies GetServerSideProps;
