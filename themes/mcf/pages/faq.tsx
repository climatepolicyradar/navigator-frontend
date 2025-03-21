import { Fragment } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { SingleCol } from "@/components/panels/SingleCol";
import { SubNav } from "@/components/nav/SubNav";
import { Heading } from "@/components/typography/Heading";

import { FAQS, PLATFORMFAQS } from "@/mcf/constants/faqs";
import { VerticalSpacing } from "@/components/utility/VerticalSpacing";

const ACCORDIANMAXHEIGHT = "464px";

const FAQ = () => {
  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use this resource to explore national-level climate change projects from across the world."
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
                  <Accordian title={faq.title} startOpen={i === 0} fixedHeight={ACCORDIANMAXHEIGHT}>
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
                  <Accordian title={faq.title} startOpen={i === 0} fixedHeight={ACCORDIANMAXHEIGHT}>
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
