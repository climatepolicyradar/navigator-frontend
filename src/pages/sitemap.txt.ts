import { ApiClient } from "@api/http-common";
import { TGeographyConfig } from "@types";

function Sitemap() {}

function extractGeographyIds(config: TGeographyConfig): number[] {
  const children_ids: number[] = config.children.flatMap((node): number[] => extractGeographyIds(node));
  return [config.node.id].concat(children_ids);
}

function extractGeographySlugs(config: TGeographyConfig): string[] {
  const children_slugs: string[] = config.children.flatMap((node): string[] => extractGeographySlugs(node));
  return [config.node.slug].concat(children_slugs);
}

async function fetchGeographies(): Promise<TGeographyConfig[]> {
  const client = new ApiClient();
  const { data: data } = await client.get(`/config`, null);
  return data.geographies;
}

async function getGeographyIds(): Promise<string[]> {
  const geographyData: TGeographyConfig[] = await fetchGeographies();
  return geographyData.flatMap((item: TGeographyConfig) => extractGeographySlugs(item));
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
