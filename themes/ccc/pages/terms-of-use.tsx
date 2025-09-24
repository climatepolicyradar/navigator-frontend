import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const TermsOfUse = () => {
  return (
    <Layout title="Terms of use">
      <BreadCrumbs label={"Terms of use"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="my-5">
                Terms of use
              </Heading>
              <p className="mt-8">Coming soon.</p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default TermsOfUse;
