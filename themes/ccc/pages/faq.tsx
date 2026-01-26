import { useContext } from "react";

import { FAQS, PLATFORM_FAQS } from "@/ccc/constants/faqs";
import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { FeatureFlagsContext } from "@/context/FeatureFlagsContext";
import { useFeatures } from "@/hooks/useFeatures";

const FAQ: React.FC = () => {
  const featureFlags = useContext(FeatureFlagsContext);
  const { features } = useFeatures(featureFlags);

  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use this resource to explore national-level climate change projects from across the world."
      theme="ccc"
    >
      <BreadCrumbs label={"Frequently asked questions"} />
      <section className="pt-8">
        <SiteWidth>
          <FaqSection title="Frequently asked questions" faqs={FAQS} sectionId="faqs" />
          <FaqSection title="Platform FAQs" faqs={PLATFORM_FAQS} sectionId="platform-faqs" />
          {features.knowledgeGraph && <FaqSection title="Topics FAQs" faqs={CONCEPTS_FAQS} sectionId="topics-faqs" />}
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default FAQ;
