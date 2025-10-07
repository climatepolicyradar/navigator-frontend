import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /** TODO: These should be stored somewhere centrally. Currently this is from themes/cpr/config.ts */
  const allCorpusIds = [
    "CCLW.corpus.i00000001.n0000",
    "CPR.corpus.Goldstandard.n0000",
    "CPR.corpus.i00000001.n0000",
    "CPR.corpus.i00000589.n0000",
    "CPR.corpus.i00000591.n0000",
    "CPR.corpus.i00000592.n0000",
    "MCF.corpus.AF.Guidance",
    "MCF.corpus.AF.n0000",
    "MCF.corpus.CIF.Guidance",
    "MCF.corpus.CIF.n0000",
    "MCF.corpus.GCF.Guidance",
    "MCF.corpus.GCF.n0000",
    "MCF.corpus.GEF.Guidance",
    "MCF.corpus.GEF.n0000",
    "OEP.corpus.i00000001.n0000",
    "UNFCCC.corpus.i00000001.n0000",
  ];
  const allCorpusIdsSearchParams = allCorpusIds.map((corpusId) => ["corpus.import_id", corpusId]);
  const urlSearchParams = new URLSearchParams(allCorpusIdsSearchParams);

  /** families */
  const familiesData = await fetch(`https://api.climatepolicyradar.org/families/?${urlSearchParams.toString()}`).then((resp) => resp.json());
  const familiesSiteMap = familiesData.data.map((family) => {
    return {
      url: `https://www.climatecasechart.com/document/${family.slug}`,
      lastModified: family.last_updated_date,
      changeFrequency: "daily",
      priority: 1,
    };
  });

  /** geographies */
  const geographiesData = await fetch(`https://api.climatepolicyradar.org/families/aggregations/by-geography?${urlSearchParams.toString()}`).then(
    (resp) => resp.json()
  );
  const geographiesSiteMap = geographiesData.data.map((geography) => {
    return {
      url: `https://www.climatecasechart.com/geographies/${geography.code.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.75,
    };
  });

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
    /** The manually added pages are taken from the footer */
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
