import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { ApiClient } from "@/api/http-common";
import { configureDocumentsFilters, fetchSearchPrincipalDocuments, PRINCIPAL_DOCUMENTS_FILTER } from "@/api/search";
import { loadTaxonomy } from "@/api/taxonomy";
import { findGeographyBySlug, getGeographyStatistics } from "@/bff/methods/getGeography";
import { GeographyPage } from "@/components/pages/geographyPage";
import { COUNTRY_LABEL_PATTERN, SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { SYSTEM_GEO_NAMES } from "@/constants/systemGeos";
import { withEnvConfig } from "@/context/EnvConfig";
import { getCountryCode, getCountryName } from "@/helpers/getCountryFields";
import themeConfig from "@/themes/config";
import { GeographyTypeV2, ISearchDocumentsResponse, TFeatures, TFilterPathLabel, TGeography, TTheme, TThemeConfig } from "@/types";
import { extractNestedData } from "@/utils/extractNestedData";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { getGeographyPath } from "@/utils/links/getGeoSearchLink";
import { filterPathsToQueryGroup } from "@/utils/search/filterPathsToQueryGroup";

// The geography page shows a short, horizontally scrolling list of recent principals.
const GEOGRAPHY_PRINCIPALS_PAGE_SIZE = 4;

/**
 * Count and list the most recent principals for a geography.
 *
 * Scoped the same way the search page scopes a geography filter, so both show the same documents.
 */
const fetchGeographyPrincipals = (
  apiUrl: string,
  geographyPath: TFilterPathLabel[],
  themeConfig: TThemeConfig,
  features: TFeatures
): Promise<ISearchDocumentsResponse> => {
  return fetchSearchPrincipalDocuments({
    apiUrl,
    themeConfig,
    features,
    filters: filterPathsToQueryGroup([geographyPath], null, "and"),
    page_size: String(GEOGRAPHY_PRINCIPALS_PAGE_SIZE),
    sort: "recent",
  });
};

const CountryPage = ({ ...props }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <GeographyPage key={props.current.id} {...props} />;
};

export default CountryPage;

export const getServerSideProps = (async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");

  const theme = process.env.THEME as TTheme;
  const featureFlags = getFeatureFlags(context.req.cookies);
  const features = getFeatures(themeConfig, featureFlags);

  const id = context.params.id;

  if (SYSTEM_GEO_NAMES.includes(id as string)) {
    return {
      notFound: true,
    };
  }

  const backendApiClient = new ApiClient();

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
  const taxonomy = await loadTaxonomy(process.env.API_URL, {
    patterns: taxonomyPatterns,
    filters: configureDocumentsFilters({ op: "and", filters: [PRINCIPAL_DOCUMENTS_FILTER] }, themeConfig, features),
  });

  const lookup = findGeographyBySlug(taxonomy, slug);
  if (!lookup) return { notFound: true };

  const { label: current, parent } = lookup;

  // Prevent rendering geography pages for types we don't support
  const disallowedGeoTypes: GeographyTypeV2[] = ["region"];
  if (!features.subdivisions) disallowedGeoTypes.push("subdivision");
  if (disallowedGeoTypes.includes(current.type as GeographyTypeV2)) return { notFound: true };

  const vespaSearchResults = await fetchGeographyPrincipals(process.env.API_URL, getGeographyPath(current, parent), themeConfig, features).catch(
    (err): ISearchDocumentsResponse => {
      console.error(`Could not find search results for geography ${slug}:`, err);
      return null;
    }
  );

  if (!vespaSearchResults) {
    return { notFound: true };
  }

  return {
    props: withEnvConfig({
      features,
      current,
      parent: current.type === "country" && parent ? { ...parent, children: [] } : parent,
      statistics: getGeographyStatistics(current),
      name: countryNameFromConfig ?? current.value,
      theme,
      vespaSearchResults,
    }),
  };
}) satisfies GetServerSideProps;
