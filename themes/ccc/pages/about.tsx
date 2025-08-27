import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const About = () => {
  return (
    <Layout
      title="About"
      description="Climate Case Chart is a database of climate litigation cases and their documents collated by the Sabin Center for Climate Change Law."
    >
      <SubNav>
        <BreadCrumbs label={"About us"} />
      </SubNav>
      <section className="pt-8">
        <SiteWidth>
          <SingleCol>
            <div>
              <Heading level={1} extraClasses="custom-header mb-4">
                About
              </Heading>
              <p className="text-content mb-6">
                This website provides the world's most comprehensive database of climate change litigation. It brings together two previously separate
                resources (the U.S. Climate Change Litigation database and the Global Climate Change Litigation database) into a single, unified
                platform.
              </p>
              <p className="text-content mb-6">
                Michael B. Gerrard and J. Cullen Howe first created the U.S. Climate Litigation Chart in 2007 when Gerrard was a partner and Howe an
                environmental law specialist at the law firm Arnold & Porter. In 2017, the U.S. chart was relaunched as an interactive and searchable
                database.
              </p>
              <p className="text-content mb-6">
                The Global Climate Change Litigation database was created in 2011 and is updated regularly. The database also includes climate
                litigation cases brought before international or regional courts or tribunals.
              </p>
              <p className="text-content mb-6">
                Today, these two resources are combined in one searchable database, giving researchers, policymakers, advocates, and the public a
                broad view of climate change litigation worldwide.
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default About;
