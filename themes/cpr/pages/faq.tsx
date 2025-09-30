import { useContext } from "react";

import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { FAQS, PLATFORM_FAQS } from "@/cpr/constants/faqs";
import { isKnowledgeGraphEnabled } from "@/utils/features";

const FAQ: React.FC = () => {
  const { featureFlags, themeConfig } = useContext(ThemePageFeaturesContext);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use Climate Policy Radar to explore climate laws, policies, and projects from across the world."
      theme="cpr"
    >
      <BreadCrumbs label={"Frequently asked questions"} />
      <section className="pt-8">
        <SiteWidth>
          <FaqSection title="FAQs" faqs={FAQS} />
          <FaqSection title="Platform FAQs" faqs={PLATFORM_FAQS} />
          {knowledgeGraphEnabled && <FaqSection title="Topics FAQs" sectionId={"topics-faqs"} faqs={CONCEPTS_FAQS} />}
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default FAQ;
