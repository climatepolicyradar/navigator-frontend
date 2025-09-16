import { Acknowledgements } from "@/ccc/components/Acknowledgements";
import { ExternalLink } from "@/components/ExternalLink";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const About = () => {
  return (
    <Layout title="About" description="Find out more about the Sabin Center for Climate Change Law's Climate Litigation Database.">
      <BreadCrumbs label={"About us"} />
      <section className="pt-8 color-text-primary">
        <SiteWidth>
          <SingleCol>
            <div>
              <Heading level={1} extraClasses="custom-header mb-4">
                About
              </Heading>
              <p className="text-content mb-6">
                The Climate Litigation Database is the most comprehensive resource tracking climate change litigation worldwide. It contains more than
                3,000 cases that address climate change law, policy, or science.
              </p>
              <p className="text-content mb-6">
                This revamped platform, developed in partnership with{" "}
                <ExternalLink url="https://www.climatepolicyradar.org/">Climate Policy Radar</ExternalLink>, uses advanced machine learning and
                natural language processing to improve search and analysis. Building on more than 15 years of work, it brings together the Sabin
                Center's previously separate U.S. and Global databases into a single, unified resource.
              </p>
              <Heading level={2} extraClasses="custom-header mb-4">
                Litigation Newsletter and Updates
              </Heading>
              <p className="text-content mb-6">
                The Climate Litigation Newsletter is published twice a month and features:
                <ul>
                  <li>Updates on newly added cases and recent developments in existing cases</li>
                  <li>Announcements of upcoming events and recordings of past events</li>
                  <li>Highlights of recent scholarship and publications</li>
                  <li>Spotlight on legal experts</li>
                </ul>
                You can subscribe <ExternalLink url="https://mailchi.mp/law/sabin-center-litigation-newsletter">here</ExternalLink> and view past
                newsletters <ExternalLink url="https://climate.law.columbia.edu/content/climate-litigation-newsletter">here</ExternalLink>. Case
                updates published since September 2021 are available{" "}
                <ExternalLink url="https://climate.law.columbia.edu/node/1890">here</ExternalLink>. A compilation of earlier monthly U.S. climate
                litigation updates (August 2008 - January 2025) can be accessed{" "}
                <ExternalLink url="https://climatecasechart.com/wp-content/uploads/2025/01/climate-chart-email-update-list-reverse-chron.-order-2025-01.pdf">
                  here
                </ExternalLink>
                .
              </p>
              <Heading level={2} extraClasses="custom-header mb-4">
                Peer Review Network of Climate Litigation
              </Heading>
              <p className="text-content mb-6">
                As part of its continual effort to update and maintain the Climate Litigation Database, the Sabin Center launched the{" "}
                <ExternalLink url="https://climate.law.columbia.edu/content/global-network-peer-reviewers-climate-litigation">
                  Peer Review Network of Global Climate Litigation
                </ExternalLink>{" "}
                (“the Network”) in December 2021. As of June 2025, the Network includes 175 practitioners and scholars who serve as national
                rapporteurs for 198 jurisdictions, as well as for international and regional courts, tribunals, quasi-judicial bodies, and other
                adjudicatory bodies. Through their expertise and contributions, the Network helps ensure the database remains comprehensive, accurate,
                and up to date.
              </p>
              <Acknowledgements />
              <Heading level={2} extraClasses="custom-header mb-4">
                Contact
              </Heading>
              <p className="text-content mb-6">
                We welcome updates and corrections. Please email us at{" "}
                <ExternalLink url="mailto:manager@climatecasechart.com">manager@climatecasechart.com</ExternalLink> or use{" "}
                <ExternalLink url="https://form.jotform.com/252302964707357">this online form</ExternalLink> to submit information about new or
                existing cases.
              </p>
              <Heading level={2} extraClasses="custom-header mb-4">
                About the Sabin Center for Climate Change Law
              </Heading>
              <p className="text-content mb-6">
                Since its creation in 2009, the{" "}
                <ExternalLink url="https://climate.law.columbia.edu/">Sabin Center for Climate Change Law</ExternalLink> at Columbia Law School has
                been known as a center of expertise, providing timely information and resources on key topics and promoting advances in the
                interrelated fields of climate change law, environmental regulation, energy regulation and natural resources law. The core mission of
                the Sabin Center is to develop and promulgate legal techniques to combat the climate crisis and advance climate justice, and to train
                the next generation of leaders in the field. The Center is both a partner to and a resource for those engaged in climate change work,
                and promotes government and private sector accountability through the compilation and dissemination of information for academic and
                practitioner communities. The Sabin Center is an affiliated center of the{" "}
                <ExternalLink url="https://www.climate.columbia.edu/">Columbia Climate School</ExternalLink>, and frequently collaborates with their
                scientists on cutting edge interdisciplinary research.
              </p>
              <Heading level={2} extraClasses="custom-header mb-4">
                About Climate Policy Radar
              </Heading>
              <p className="text-content mb-6">
                <ExternalLink url="https://climatepolicyradar.org/">Climate Policy Radar</ExternalLink> is a non-profit organisation building open
                databases and research tools so people can discover and understand complex information, in particular long-text documents, on climate,
                nature and development. Our data and tools help governments, researchers, international organisations, civil society, and the private
                sector to understand and advance effective climate policies and deploy climate finance. Harnessing data science and AI, and pioneering
                the application of natural language processing to this domain, our work renders previously unstructured, siloed data more readable and
                accessible.
              </p>
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default About;
