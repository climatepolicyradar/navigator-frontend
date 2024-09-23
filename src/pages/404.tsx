import Layout from "../components/layouts/Main";
import { SiteWidth } from "@components/panels/SiteWidth";

import { ExternalLink } from "@components/ExternalLink";

export default function NotFound() {
  return (
    <Layout title={"Page not found"}>
      <section>
        <SiteWidth extraClasses="text-content px-4 mb-12">
          <h1 className="my-8">Sorry, we can't find that page</h1>
          <p>
            Please <ExternalLink url="mailto:support@climatepolicyradar.org">contact us</ExternalLink> if you would like to report the issue.
          </p>
        </SiteWidth>
      </section>
    </Layout>
  );
}
