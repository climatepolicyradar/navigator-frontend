import { useContext } from "react";

import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { FAQS, PLATFORM_FAQS } from "@/mcf/constants/faqs";
import { isKnowledgeGraphEnabled } from "@/utils/features";

const FAQ: React.FC = () => {
  const { featureFlags, themeConfig } = useContext(ThemePageFeaturesContext);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

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
          <FaqSection title="FAQs" faqs={FAQS} />
          <FaqSection title="Platform FAQs" faqs={PLATFORM_FAQS} />
          {knowledgeGraphEnabled && <FaqSection title="Topics FAQs" faqs={CONCEPTS_FAQS} sectionId={"topics-faqs"} />}
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default FAQ;
