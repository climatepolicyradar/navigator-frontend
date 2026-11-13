import { GetServerSidePropsContext } from "next";

import { getSitemap } from "@/bff/methods/getSitemap";
import { toSitemapXml } from "@/utils/sitemap";

function Sitemap() {}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const { data, errors } = await getSitemap();
  errors.forEach((err) => console.error(err));

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", errors.length > 0 ? "no-store" : "public, s-maxage=86400, stale-while-revalidate=86400");
  res.write(toSitemapXml(data));
  res.end();

  return {
    props: {},
  };
}

export default Sitemap;
