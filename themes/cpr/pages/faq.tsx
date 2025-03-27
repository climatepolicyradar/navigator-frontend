import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import Layout from "@components/layouts/Main";
import { SiteWidth } from "@components/panels/SiteWidth";
import { SubNav } from "@components/nav/SubNav";

import { CONCEPTS_FAQS } from "@constants/conceptsFaqs";
import FaqSection from "@components/typography/FaqSection";

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
          <FaqSection title="FAQs" faqs={CONCEPTS_FAQS} />
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default FAQ;
