import { Fragment } from "react";

import { AccordionItem } from "@/cclw/components/AccordionItem";
import { METHODOLOGY } from "@/cclw/constants/methodologyItems";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";

const Methodology = () => {
  return (
    <Layout
      title="Methodology"
      description="Find the definitions, scope and principles we use to collect and categorise the laws and policies contained in the Climate Change Laws of the World dataset."
      theme="cclw"
    >
      <BreadCrumbs label={"Methodology"} />
      <section>
        <SiteWidth>
          <SingleCol>
            <div className="text-content mb-12">
              <Heading level={1} extraClasses="my-5">
                Methodology
              </Heading>
              <Heading level={2} id="introduction">
                Introduction
              </Heading>
              <p className="italic">This page was last updated on 19 August 2024.</p>
              <p>
                This page outlines the definitions, scope and principles used to collect and categorise the <b>laws and policies</b> contained in the
                Climate Change Laws of the World dataset. This dataset originates from a collaboration between the Grantham Research Institute at LSE
                and GLOBE International on a series of Climate Legislation Studies. The dataset is currently maintained by LSE, in partnership with
                Climate Policy Radar.
              </p>
              <p>
                In addition to the Climate Change Laws of the World dataset, this database includes documents from UNFCCC portals. These documents are
                offered alongside national level climate change laws and policies to help users in gaining a comprehensive understanding of national
                level climate action. For details of the documents included, please visit our <LinkWithQuery href="/faq">FAQs</LinkWithQuery>. To
                understand more about how new document types may be added in future, visit the{" "}
                <ExternalLink url="https://github.com/climatepolicyradar/methodology/blob/main/METHODOLOGY.md">
                  Climate Policy Radar methodology page
                </ExternalLink>
                .
              </p>
              <p>
                Classifications described below have been assigned manually. LSE, Climate Policy Radar, and our partners are currently working to
                develop classifications powered by AI. Sign up to our newsletter to receive updates.
              </p>

              {METHODOLOGY.map((item, i) => (
                <Fragment key={item.title}>
                  <AccordionItem title={item.title}>{item.content}</AccordionItem>
                  <hr />
                </Fragment>
              ))}
            </div>
          </SingleCol>
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default Methodology;
