import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { FAQS, PLATFORM_FAQS } from "@/cpr/constants/faqs";

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
          <FaqSection title="FAQs" faqs={FAQS} />
          <FaqSection title="Platform FAQs" faqs={PLATFORM_FAQS} />
          <FaqSection title="Concepts FAQs" faqs={CONCEPTS_FAQS} />
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default FAQ;
