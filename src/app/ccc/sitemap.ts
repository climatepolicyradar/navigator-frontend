import type { MetadataRoute } from "next";

import { ApiClient } from "@/api/http-common";
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

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* Families */

  const urlSearchParams = new URLSearchParams({
    "corpus.import_id": "Academic.corpus.Litigation.n0000",
  });
  const familiesData = await fetch(`https://api.climatepolicyradar.org/families/?${urlSearchParams.toString()}`).then((resp) => resp.json());
  const familiesSiteMap = familiesData.data.map((family) => {
    return {
      url: `https://www.climatecasechart.com/document/${family.slug}`,
      lastModified: family.last_updated_date,
      changeFrequency: "daily",
      priority: 1,
    };
  });

  /* Geographies */

  const client = new ApiClient();
  const {
    data: { geographies: geographiesData },
  } = await client.getConfig();

  const geographySlugs = geographiesData.flatMap((item) => extractGeographySlugs(item));
  const geographiesSiteMap = geographySlugs.map((slug) => ({
    url: `https://www.climatecasechart.com/geographies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.75,
  }));

  /** The manually added pages are taken from the footer */
  return [
    {
      url: "https://www.climatecasechart.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://www.climatecasechart.com/search",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...familiesSiteMap,
    ...geographiesSiteMap,
    {
      url: "https://www.climatecasechart.com/about",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: "https://www.climatecasechart.com/faq",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}
