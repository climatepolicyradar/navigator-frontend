import kebabCase from "lodash/kebabCase";

import { EXCLUDED_ISO_CODES, INCLUDED_GEO_TYPES } from "@/constants/geography";
import { TDataNode, TGeography } from "@/types";

const COUNTRY_SLUGS: Record<string, string> = {
  "United States": "united-states-of-america",
};

export const codeIsCountry = (geoCode: string) => !geoCode.includes("-");

export const getGeographySlug = (geoCode: string, geoName: string) => {
  const isCountry = codeIsCountry(geoCode);
  return isCountry ? (COUNTRY_SLUGS[geoName] ?? kebabCase(geoName)) : geoCode.toLowerCase();
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
