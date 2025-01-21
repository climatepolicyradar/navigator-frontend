import { ApiClient } from "@api/http-common";
import { TDataNode, TGeography } from "@types";

function Sitemap() {}

function extractGeographySlugs(config: TDataNode<TGeography>): string[] {
  const children_slugs: string[] = config.children.flatMap((node): string[] => extractGeographySlugs(node));
  return [config.node.slug].concat(children_slugs);
}

async function fetchGeographies(): Promise<TDataNode<TGeography>[]> {
  const client = new ApiClient();
  const { data: data } = await client.getConfig();
  return data.geographies;
}

async function getGeographyIds(): Promise<string[]> {
  const geographyData: TDataNode<TGeography>[] = await fetchGeographies();
  return geographyData.flatMap((item: TDataNode<TGeography>) => extractGeographySlugs(item));
}

async function getGeographyPages(res: any, hostname: string): Promise<string[]> {
  const slug_list: string[] = await getGeographyIds();
  return slug_list.map((geo_slug: string) => `${hostname ?? ""}/geographies/${geo_slug}`);
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain");
  res.write((await getGeographyPages(res, process.env.HOSTNAME)).join("\n"));
  res.end();

  return {
    props: {},
  };
}

export default Sitemap;
