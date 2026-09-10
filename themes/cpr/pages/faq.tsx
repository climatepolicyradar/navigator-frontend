import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { PLATFORM_FAQS, TOPICS_FAQS } from "@/constants/faqs";
import { APP_FAQS } from "@/cpr/constants/faqs";

const FAQ: React.FC = () => (
  <Layout
    title="FAQ"
    description="Find quick tips for how you can use Climate Policy Radar to explore climate laws, policies, and projects from across the world."
    theme="cpr"
  >
    <BreadCrumbs label={"Frequently asked questions"} />
    <section className="pt-8">
      <SiteWidth>
        <FaqSection title="FAQs" faqs={APP_FAQS} sectionId="faqs" />
        <FaqSection title="Platform FAQs" faqs={PLATFORM_FAQS} sectionId="platform-faqs" />
        <FaqSection title="Topics FAQs" faqs={TOPICS_FAQS} sectionId="topics-faqs" />
      </SiteWidth>
    </section>
  </Layout>
);

export default FAQ;
