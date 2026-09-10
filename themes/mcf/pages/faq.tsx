import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { PLATFORM_FAQS, TOPICS_FAQS } from "@/constants/faqs";
import { APP_FAQS } from "@/mcf/constants/faqs";

const FAQ: React.FC = () => (
  <Layout
    title="FAQ"
    description="Find quick tips for how you can use this resource to explore national-level climate change projects from across the world."
    theme="mcf"
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
