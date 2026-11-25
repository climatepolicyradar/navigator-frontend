import { ID_SEPARATOR } from "@/constants/chars";
import { GeographyTypeV2, GeographyV2, TNestedSearchLabel } from "@/types";
import { getGeographySlug } from "@/utils/geography";

import geographyStatistics from "../../data/geographyStatistics.json";

type TGeographyStatistics = NonNullable<GeographyV2["statistics"]>;

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

/**
 * Build the GeographyV2 the geography page consumes from a taxonomy label.
 *
 * `statistics` is left off, not set to undefined, when there are none: Next.js cannot serialise undefined props.
 */
export const labelToGeographyV2 = (label: TNestedSearchLabel): GeographyV2 | null => {
  const slug = getGeographySlug(label);
  if (!slug) return null;

  const id = label.id.split(ID_SEPARATOR)[1];
  const statistics = label.type === "country" ? STATISTICS_BY_ALPHA_3[id] : undefined;

  return {
    id,
    type: label.type as GeographyTypeV2,
    slug,
    name: label.value,
    subconcept_of: [],
    has_subconcept: [],
    ...(statistics && { statistics }),
  };
};

/**
 * Build the subdivisions listed under a country label, for the page's subdivision block.
 *
 * A child with no page (see `getGeographySlug`) is left out.
 */
export const labelToSubdivisions = (countryLabel: TNestedSearchLabel): GeographyV2[] =>
  countryLabel.children.map(labelToGeographyV2).filter((geography): geography is GeographyV2 => geography?.type === "subdivision");
