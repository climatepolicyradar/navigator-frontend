import sortBy from "lodash/sortBy";

import { getTaxonomyFromV1 } from "@/bff/methods/getTaxonomy";
import { GeographyTypeV2, GeographyV2, ISearchDocument, ISearchDocumentsResponse, TFamilySummary, TMatchedFamily, TSearch } from "@/types";
import { formatDate } from "@/utils/timedate";

const getMostSpecificGeography = (geographies: GeographyV2[]): GeographyV2 => {
  if (!geographies.length) return null;

  const GEOGRAPHY_TYPE_WEIGHTING: GeographyTypeV2[] = ["subdivision", "country", "region"];
  return sortBy(geographies, (geo) => GEOGRAPHY_TYPE_WEIGHTING.indexOf(geo.type))[0];
};

export const familyToSummary = (family: TMatchedFamily, allGeographies: GeographyV2[]): TFamilySummary => {
  const geographies = family.family_geographies.map((familyGeo) => allGeographies.find((geo) => geo.id === familyGeo)).filter((geo) => geo);

  // Build a card from a legacy search family.
  return {
    href: `/document/${family.family_slug}`,
    title: family.family_name,
    metadata: [
      getTaxonomyFromV1(family.family_category, family.corpus_type_name, family.family_source, family.corpus_import_id),
      getMostSpecificGeography(geographies)?.name,
      formatDate(family.family_date)[0].toString(),
    ].filter((line) => Boolean(line)),
  };
};

export const principalToSummary = (principal: ISearchDocument): TFamilySummary => {
  const labelValue = (type: string): string | undefined => principal.labels.find((label) => label.value.type === type)?.value.value;
  const publishedDate = principal.attributes.published_date;

  // Build a card from a new search principal.
  return {
    href: `/document/${principal.attributes.deprecated_slug}`,
    title: principal.title,
    metadata: [
      labelValue("category"),
      labelValue("subdivision") ?? labelValue("country"),
      publishedDate && formatDate(String(publishedDate))[0].toString(),
    ].filter((line) => Boolean(line)),
  };
};

export type TCategoryResults = {
  families: TFamilySummary[];
  count: number;
};

/**
 * Normalise either search's response into the cards and count the recents block renders.
 *
 * The two searches return different shapes, so this is the one place that knows about both.
 */
export const toCategoryResults = (
  results: ISearchDocumentsResponse | TSearch | undefined,
  isNewSearch: boolean,
  allGeographies: GeographyV2[]
): TCategoryResults => {
  if (!results) return { families: [], count: 0 };

  if (isNewSearch) {
    const { results: principals, total_size } = results as ISearchDocumentsResponse;
    return { families: principals.map(principalToSummary), count: total_size ?? 0 };
  }

  const { families, total_family_hits } = results as TSearch;
  return { families: (families || []).map((family) => familyToSummary(family, allGeographies)), count: total_family_hits ?? 0 };
};
