import { ExternalLink } from "@/components/ExternalLink";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

import Layout from "../components/layouts/Main";

export default function NotFound() {
  return (
    <Layout title={"Page not found"}>
      <section>
        <SiteWidth extraClasses="text-content my-12">
          <Heading level={1}>Sorry, we can't find that page</Heading>
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
