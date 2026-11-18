import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { fetchSearchPrincipalDocuments } from "@/api/search";
import { GeographyPage } from "@/components/pages/geographyPage";
import { COUNTRY_LABEL_PATTERN, SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { SYSTEM_GEO_NAMES } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getCountryCode, getCountryName } from "@/helpers/getCountryFields";
import { loadTaxonomy } from "@/hooks/useLabelSearch";
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

const findLabelInTaxonomy = (labels: TNestedSearchLabel[], id: string, parent?: TNestedSearchLabel): TSearchLabel | null => {
  for (const label of labels) {
    if (label.id === id) {
      const relations: TSearchLabelRelation[] = parent
        ? [{ type: "subconcept_of", value: toSearchLabel(parent), timestamp: null, passages_id: null, count: null }]
        : [];
      return toSearchLabel(label, relations);
    }
    const nested = findLabelInTaxonomy(label.children, id, label);
    if (nested) return nested;
  }
  return null;
};

/**
 * Count and list the most recent principals for a geography.
 *
 * Scoped the same way the search page scopes a geography filter, so both show the same documents.
 */
const fetchGeographyPrincipals = (apiUrl: string, geographyLabel: TSearchLabel, themeConfig: TThemeConfig): Promise<ISearchDocumentsResponse> => {
  const parentType = geographyLabel.type === "subdivision" ? "country" : "region";
  const parentLabel = geographyLabel.labels.find((label) => label.type === "subconcept_of" && label.value.type === parentType);
  const labelPaths: TFilterPathLabel[][] = [parentLabel ? [geographyLabel, parentLabel.value] : [geographyLabel]];

  return fetchSearchPrincipalDocuments({
    apiUrl,
    themeConfig,
    filters: filterPathsToQueryGroup(labelPaths, null, "and"),
    page_size: String(GEOGRAPHY_PRINCIPALS_PAGE_SIZE),
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

  const isSubdivision = geographyV2.type === "subdivision";
  const labelType = isSubdivision ? "subdivision" : "country";
  const pattern = isSubdivision ? SUBDIVISION_LABEL_PATTERN : COUNTRY_LABEL_PATTERN;

  const taxonomy = await loadTaxonomy(process.env.API_URL, { patterns: [pattern] });
  const expectedId = `${labelType}::${geographyV2.id}`;
  const geographyLabel = findLabelInTaxonomy(taxonomy, expectedId);

  if (!geographyLabel) return { notFound: true };

  const vespaSearchResults = await fetchGeographyPrincipals(process.env.API_URL, geographyLabel, themeConfig).catch(
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
