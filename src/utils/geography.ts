import { EXCLUDED_ISO_CODES, INCLUDED_GEO_TYPES } from "@/constants/geography";
import { TDataNode, TGeography } from "@/types";

// Recursively transform node structure into flat list of geo slugs
export const extractGeographySlugs = (config: TDataNode<TGeography>): string[] => {
  const childrenSlugs: string[] = config.children.flatMap((node): string[] => extractGeographySlugs(node));

  if (EXCLUDED_ISO_CODES.includes(config.node.value) || !INCLUDED_GEO_TYPES.includes(config.node.type)) {
    return childrenSlugs;
  } else {
    return [config.node.slug, ...childrenSlugs];
  }
};
