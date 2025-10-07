import { EXCLUDED_ISO_CODES, INCLUDED_GEO_TYPES } from "@/constants/geography";
import { TDataNode, TGeography } from "@/types";

export const getCountryNameFromCode = (code: string, geos): string => {
  const match = geos.filter((geo) => code === geo.code);
  return match[0].name;
};

export const getCountryFromId = (id: number, geos): string => {
  const match = geos.find((geo) => id === geo.geography_id);
  return match.english_shortname;
};

export const v1GeoSlugToV2 = (slug: string): string => (slug === "united-states-of-america" ? "united-states" : slug);
export const v2GeoSlugToV1 = (slug: string): string => (slug === "united-states" ? "united-states-of-america" : slug);

// Recursively transform node structure into flat list of geo slugs
export const extractGeographySlugs = (config: TDataNode<TGeography>): string[] => {
  const childrenSlugs: string[] = config.children.flatMap((node): string[] => extractGeographySlugs(node));

  if (EXCLUDED_ISO_CODES.includes(config.node.value) || !INCLUDED_GEO_TYPES.includes(config.node.type)) {
    return childrenSlugs;
  } else {
    return [config.node.slug, ...childrenSlugs];
  }
};
