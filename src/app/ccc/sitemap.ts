import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    {
      url: "https://www.climatecasechart.com/about",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}
