import { ApiClient } from "@/api/http-common";
import { EXCLUDED_ISO_CODES, INCLUDED_GEO_TYPES } from "@/constants/geography";
import { TDataNode, TGeography } from "@/types";

// Determines which geographies to include/exclude
const geographyFilter = (geography: TDataNode<TGeography>): boolean => {
  if (EXCLUDED_ISO_CODES.includes(geography.node.value)) return false;
  if (!INCLUDED_GEO_TYPES.includes(geography.node.type)) return false;
  return true;
};

// Recursively transform node structure into flat list of geo slugs
const extractGeographySlugs = (config: TDataNode<TGeography>): string[] => {
  const childrenSlugs: string[] = config.children.flatMap((node): string[] => extractGeographySlugs(node));
  return (geographyFilter(config) ? [config.node.slug] : []).concat(childrenSlugs);
};

export async function getServerSideProps({ res }) {
  const client = new ApiClient();
  const {
    data: { geographies: geographiesData },
  } = await client.getConfig();

  const geographySlugs = geographiesData.flatMap((item) => extractGeographySlugs(item));
  const urls = geographySlugs.map((slug) => `${process.env.HOSTNAME ?? ""}/geographies/${slug}`);

  res.setHeader("Content-Type", "text/plain");
  res.write(urls.join("\n"));
  res.end();

  return {
    props: {},
  };
}

// Needed so Next.js recognises this as a page
const Sitemap = () => {};

export default Sitemap;
