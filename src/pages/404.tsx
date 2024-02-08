import { ExternalLink } from "@components/ExternalLink";
import Layout from "../components/layouts/Main";

export default function NotFound() {
  return (
    <Layout title={"Page not found"}>
      <section>
        <div className="text-content px-4 container mb-12">
          <h1 className="my-8">Sorry, we can't find that page</h1>
          <p>
            Please <ExternalLink url="mailto:support@climatepolicyradar.org">contact us</ExternalLink> if you would like to report the issue.
          </p>
        </div>
      </section>
    </Layout>
  );
}
