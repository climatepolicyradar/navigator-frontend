import { NextPageContext } from "next";

import { ExternalLink } from "@/components/ExternalLink";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

import Layout from "../components/layouts/Main";

function Error({ statusCode }: { statusCode: number }) {
  return (
    <Layout title={statusCode.toString()}>
      <section>
        <SiteWidth extraClasses="text-content my-12">
          <Heading level={1}>{statusCode === 404 ? "Sorry, we can't find that page" : "Sorry, an error has occurred loading this page"}</Heading>
          <p>
            Please{" "}
            <ExternalLink url="mailto:support@climatepolicyradar.org" className="underline text-blue-600 hover:text-blue-800">
              contact us
            </ExternalLink>{" "}
            if you would like to report the issue.
          </p>
        </SiteWidth>
      </section>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
