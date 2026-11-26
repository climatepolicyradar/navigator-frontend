import { ID_SEPARATOR } from "@/constants/chars";
import { TGeographyStatistics, TNestedSearchLabel } from "@/types";
import { getGeographySlug } from "@/utils/geography";

import geographyStatistics from "../../data/geographyStatistics.json";

type TGeographyLookup = {
  label: TNestedSearchLabel;
  parent: TNestedSearchLabel | null;
};

// Static data that geographies-api used to serve, keyed by ISO alpha-3 code. Countries only.
const STATISTICS_BY_ALPHA_3: Record<string, TGeographyStatistics> = geographyStatistics;

/**
 * Find the geography label whose page slug equals `slug`, along with its parent label.
 *
 * Regions and excluded system geographies have no slug (see `getGeographySlug`), so they never match.
 */
export const findGeographyBySlug = (
  labels: TNestedSearchLabel[],
  slug: string,
  parent: TNestedSearchLabel | null = null
): TGeographyLookup | null => {
  for (const label of labels) {
    if (getGeographySlug(label) === slug) return { label, parent };
    const nested = findGeographyBySlug(label.children, slug, label);
    if (nested) return nested;
  }
  return null;
};

export const getGeographyStatistics = (label: TNestedSearchLabel): TGeographyStatistics | null =>
  label.type === "country" ? (STATISTICS_BY_ALPHA_3[label.id.split(ID_SEPARATOR)[1]] ?? null) : null;
