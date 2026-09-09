import kebabCase from "lodash/kebabCase";

import { EXCLUDED_ISO_CODES, GEOGRAPHY_SLUG_CONVERSIONS, INCLUDED_GEO_TYPES } from "@/constants/geography";
import { TDataNode, TGeography } from "@/types";

export const codeIsCountry = (geoCode: string) => !geoCode.includes("-");

export const getGeographySlug = (geoCode: string, geoName: string) => {
  if (!codeIsCountry(geoCode)) return geoCode.toLowerCase();

  const slug = kebabCase(geoName);
  return GEOGRAPHY_SLUG_CONVERSIONS[slug] ?? slug;
};

// Recursively transform node structure into flat list of geo slugs
export const extractGeographySlugs = (config: TDataNode<TGeography>): string[] => {
  const childrenSlugs: string[] = config.children.flatMap((node): string[] => extractGeographySlugs(node));

  if (EXCLUDED_ISO_CODES.includes(config.node.value) || !INCLUDED_GEO_TYPES.includes(config.node.type)) {
    return childrenSlugs;
  } else {
    return [config.node.slug, ...childrenSlugs];
  }
};
