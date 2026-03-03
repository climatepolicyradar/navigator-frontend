import { GetServerSidePropsContext } from "next";

import { ROBOTS_DISALLOW_ROUTES } from "@/constants/robots";

const crawlableRobotsTxt = `User-agent: *
Allow: /
${ROBOTS_DISALLOW_ROUTES.map((route) => `Disallow: ${route}`).join("\n")}`;

const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;

function Robots() {}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(process.env.ROBOTS === "true" ? crawlableRobotsTxt : uncrawlableRobotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default Robots;
