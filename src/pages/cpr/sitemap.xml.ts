import { GetServerSidePropsContext, MetadataRoute } from "next";

import { ApiClient } from "@/api/http-common";
import CPRthemeConfig from "@/cpr/config";
import { TApiFamilyPublic } from "@/types";
import { extractGeographySlugs } from "@/utils/geography";
import { toSitemapXml } from "@/utils/sitemap";

const buildSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const allCorpusIds = CPRthemeConfig.categories?.options.flatMap((option) => option.value) || [];
  const allCorpusIdsSearchParams = allCorpusIds.map((corpusId) => ["corpus.import_id", corpusId]);
  const urlSearchParams = new URLSearchParams(allCorpusIdsSearchParams);

  /* Families */

  const familiesData = await fetch(`https://api.climatepolicyradar.org/families/?${urlSearchParams.toString()}`).then((resp) => resp.json());
  const familiesSiteMap = familiesData.data.map((family: TApiFamilyPublic) => {
    return {
      url: `https://app.climatepolicyradar.org/document/${family.slug}`,
      lastModified: family.last_updated_date,
      changeFrequency: "daily",
      priority: 1,
    };
  });

  /* Geographies */

  const client = new ApiClient();
  const { config, error: configError } = await client.getConfig();
  if (configError) console.error(configError);

  const geographySlugs = config.geographies.flatMap((item) => extractGeographySlugs(item));
  const geographiesSiteMap = geographySlugs.map((slug) => ({
    url: `https://app.climatepolicyradar.org/geographies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.75,
  }));

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
    ...familiesSiteMap,
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
};

function Sitemap() {}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(toSitemapXml(await buildSitemap()));
  res.end();

  return {
    props: {},
  };
}

export default Sitemap;
