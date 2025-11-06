import type { MetadataRoute } from "next";

import { ApiClient } from "@/api/http-common";
import CPRthemeConfig from "@/cpr/config";
import { extractGeographySlugs } from "@/utils/geography";

/* Regenerate sitemap every 6 hours (21600 seconds) */
export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allCorpusIds = CPRthemeConfig.categories?.options.flatMap((option) => option.value) || [];
  const allCorpusIdsSearchParams = allCorpusIds.map((corpusId) => ["corpus.import_id", corpusId]);
  const urlSearchParams = new URLSearchParams(allCorpusIdsSearchParams);

  /**
   * UN Submissions
   * These are here while COP in Rio is on to true and get as much Google juice as possible
   */
  const UNSubmissionsCorpusIds = ["UN.corpus.UNCBD.n0000", "UN.corpus.UNCCD.n0000"];
  const UNSubmissionsSearchParams = UNSubmissionsCorpusIds.map((corpusId) => ["corpus.import_id", corpusId]);
  const UNSubmissionsUrlSearchParams = new URLSearchParams(UNSubmissionsSearchParams);
  const UNSubmissionsData = await fetch(`https://api.climatepolicyradar.org/families/?${UNSubmissionsUrlSearchParams.toString()}`).then((resp) =>
    resp.json()
  );
  const UNSubmissionsSiteMap = UNSubmissionsData.data.map((family) => {
    return {
      url: `https://app.climatepolicyradar.org/document/${family.slug}`,
      lastModified: family.last_updated_date,
      changeFrequency: "daily",
      priority: 1,
    };
  });

  /* Families */
  const familiesSiteMap = [];
  for (let page = 1; page <= 100; page++) {
    const familiesData = await fetch(`https://api.climatepolicyradar.org/families/?${urlSearchParams.toString()}&page=${page}`).then((resp) =>
      resp.json()
    );
    familiesSiteMap.push(
      ...familiesData.data.map((family) => {
        return {
          url: `https://app.climatepolicyradar.org/document/${family.slug}`,
          lastModified: family.last_updated_date,
          changeFrequency: "daily",
          priority: 1,
        };
      })
    );
  }

  /* Geographies */
  const client = new ApiClient();
  const {
    data: { geographies: geographiesData },
  } = await client.getConfig();

  const geographySlugs = geographiesData.flatMap((item) => extractGeographySlugs(item));
  const geographiesSiteMap = geographySlugs.map((slug) => ({
    url: `https://app.climatepolicyradar.org/geographies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.75,
  }));

  const deduplicatedFamiliesSiteMap = familiesSiteMap.filter(
    (family) => !UNSubmissionsSiteMap.some((unSubmission) => unSubmission.url === family.url)
  );

  // The manually added pages are taken from the footer
  return [
    {
      url: "https://app.climatepolicyradar.org",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://app.climatepolicyradar.org/search",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...deduplicatedFamiliesSiteMap,
    ...geographiesSiteMap,
    {
      url: "https://app.climatepolicyradar.org/terms-of-use",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: "https://climatepolicyradar.org/privacy-policy",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}
