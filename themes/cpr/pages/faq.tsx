import { Fragment } from "react";

import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { SubNav } from "@/components/nav/SubNav";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { Accordian } from "@/components/accordian/Accordian";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";
import { VerticalSpacing } from "@/components/utility/VerticalSpacing";
import { FAQS, PLATFORMFAQS } from "@/cpr/constants/faqs";

const ACCORDIAN_MAX_HEIGHT = "464px";

const FAQ = () => {
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
                  <Accordian title={faq.title} startOpen={i === 0} fixedHeight={ACCORDIAN_MAX_HEIGHT}>
                    {faq.content}
                  </Accordian>
                  <hr />
                </Fragment>
              ))}
            </div>
          </SingleCol>

          <SingleCol>
            <Heading level={1} extraClasses="custom-header">
              Platform FAQs
            </Heading>
            <VerticalSpacing size="md" />
            <div className="text-content mb-14">
              {PLATFORMFAQS.map((faq, i) => (
                <Fragment key={faq.title}>
                  <Accordian title={faq.title} startOpen={i === 0} fixedHeight={ACCORDIAN_MAX_HEIGHT}>
                    {faq.content}
                  </Accordian>
                  <hr />
                </Fragment>
              ))}
            </div>
          </SingleCol>

          <FaqSection title="Concepts FAQs" faqs={CONCEPTS_FAQS} />
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default FAQ;
