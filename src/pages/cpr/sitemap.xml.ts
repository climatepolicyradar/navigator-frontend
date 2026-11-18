import { GetServerSidePropsContext, MetadataRoute } from "next";

import { ApiClient } from "@/api/http-common";
import { fetchSearchPrincipalDocuments } from "@/api/search";
import CPRthemeConfig from "@/cpr/config";
import { ISearchDocument } from "@/types";
import { extractGeographySlugs } from "@/utils/geography";
import { toSitemapXml } from "@/utils/sitemap";

const SITEMAP_PAGE_SIZE = "500";

const fetchAllPrincipalDocuments = async (): Promise<ISearchDocument[]> => {
  const { results } = await fetchSearchPrincipalDocuments({
    apiUrl: process.env.CONCEPTS_API_URL,
    themeConfig: CPRthemeConfig,
    page_size: SITEMAP_PAGE_SIZE,
    page_token: "1",
    sort: "recent",
  });

  return results;
};

const buildSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  /* Families */

  const principalDocuments = await fetchAllPrincipalDocuments();
  const familiesSiteMap = principalDocuments.map((document) => {
    return {
      url: `https://app.climatepolicyradar.org/document/${document.attributes.deprecated_slug}`,
      lastModified: document.attributes.last_updated_date as string,
      changeFrequency: "daily" as const,
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
    changeFrequency: "daily" as const,
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
