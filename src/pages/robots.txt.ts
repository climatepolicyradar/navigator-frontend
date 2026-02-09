import { GetServerSidePropsContext } from "next";

const uncrawlableRoutes = ["/_search"];

const crawlableRobotsTxt = `User-agent: *
Allow: /
${uncrawlableRoutes.map((route) => `Disallow: ${route}`).join("\n")}`;

const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;

function Robots() {}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  res.setHeader("Content-Type", "text/plan");
  res.write(process.env.ROBOTS === "true" ? crawlableRobotsTxt : uncrawlableRobotsTxt);
  res.end();

  return {
    props: {},
  };
}

export default Robots;
