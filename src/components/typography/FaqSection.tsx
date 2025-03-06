import { Fragment } from "react";

import { Accordian } from "@components/accordian/Accordian";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import Layout from "@components/layouts/Main";
import { SiteWidth } from "@components/panels/SiteWidth";
import { SingleCol } from "@components/panels/SingleCol";
import { SubNav } from "@components/nav/SubNav";
import { Heading } from "@components/typography/Heading";

import { VerticalSpacing } from "@components/utility/VerticalSpacing";

const ACCORDIAN_MAX_HEIGHT = "464px";

export const FaqSection = () => {
  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use Climate Policy Radar to explore climate laws, policies, and projects from across the world."
    >
      <SubNav>
        <BreadCrumbs label={"Frequently asked questions"} />
      </SubNav>
      <section className="pt-8">
        <SiteWidth>
          <SingleCol>
            <Heading level={1} extraClasses="custom-header">
              FAQs
            </Heading>
            <VerticalSpacing size="md" />
            <div className="text-content mb-14">
              {FAQS.map((faq, i) => (
                <Fragment key={faq.title}>
                  <Accordian title={faq.title} headContent={faq.headContent ?? null} startOpen={i === 0} fixedHeight={ACCORDIAN_MAX_HEIGHT}>
                    {faq.content}
                  </Accordian>
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

export default FAQ;
