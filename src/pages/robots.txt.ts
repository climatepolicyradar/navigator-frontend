import { GetServerSidePropsContext } from "next";

import { ROBOTS_DISALLOW_ROUTES } from "@/constants/robots";
import { getAppUrlForJSONLD } from "@/utils/json-ld/helpers";

// The Sitemap directive takes an absolute url, and a crawler discards a relative one
// silently, so an app with no APP_URL set advertises no sitemap rather than a broken one.
const crawlableRobotsTxt = (): string => {
  const origin = getAppUrlForJSONLD();
  const disallows = ROBOTS_DISALLOW_ROUTES.map((route) => `Disallow: ${route}`).join("\n");
  const sitemap = origin ? `\n\nSitemap: ${origin}/sitemap.xml` : "";

  return `User-agent: *\nAllow: /\n${disallows}${sitemap}`;
};

const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;

function Robots() {}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(process.env.ROBOTS === "true" ? crawlableRobotsTxt() : uncrawlableRobotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default Robots;
