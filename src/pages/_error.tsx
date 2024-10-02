import Layout from "../components/layouts/Main";
import { SiteWidth } from "@components/panels/SiteWidth";

import { ExternalLink } from "@components/ExternalLink";
import { Heading } from "@components/typography/Heading";

function Error({ statusCode }) {
  return (
    <Layout title={statusCode}>
      <section>
        <SiteWidth extraClasses="text-content my-12">
          <Heading level={1}>{statusCode === 404 ? "Sorry, we can't find that page" : "Sorry, an error has occurred loading this page"}</Heading>
          <p>
            Please <ExternalLink url="mailto:support@climatepolicyradar.org">contact us</ExternalLink> if you would like to report the issue.
          </p>
        </SiteWidth>
      </section>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
