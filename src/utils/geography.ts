import kebabCase from "lodash/kebabCase";

import { ID_SEPARATOR } from "@/constants/chars";
import { EXCLUDED_ISO_CODES, GEOGRAPHY_SLUG_CONVERSIONS, INCLUDED_GEO_TYPES } from "@/constants/geography";
import { TDataNode, TGeography, TLabel } from "@/types";

export const getGeographySlug = (geographyLabel: TLabel): string | null => {
  const geoCode = geographyLabel.id.split(ID_SEPARATOR)[1];
  const slug = kebabCase(geographyLabel.value);

  if (EXCLUDED_ISO_CODES.includes(geoCode.toUpperCase())) return null;

  switch (geographyLabel.type) {
    case "subdivision":
      return geoCode.toLowerCase();
    case "country":
      return GEOGRAPHY_SLUG_CONVERSIONS[slug] ?? slug;
    default:
      return null;
  }
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
