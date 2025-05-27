import { useEffect, useState } from "react";

import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SubNav } from "@/components/nav/SubNav";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { FAQS, PLATFORM_FAQS } from "@/cpr/constants/faqs";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";

const FAQ: React.FC = () => {
  /*
  The FAQs page is read in not by using Next.JS, but by our CPR specific page reading logic.
  This means that we cannot fetch the feature flags directly by using the page context.
  This function provides a means of working around this so we can conditionally display the
  concept FAQs.

  TODO: Remove this once we have hard launched concepts in product.
  */
  const [featureFlags, setFeatureFlags] = useState({});
  async function getFeatureFlag() {
    const allCookies = getAllCookies();
    const parsedFeatureFlags = await getFeatureFlags(allCookies);
    setFeatureFlags(parsedFeatureFlags);
  }

  // TODO: Remove this once we have hard launched concepts in product.
  useEffect(() => {
    getFeatureFlag();
  }, []);

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
          {featureFlags["concepts-v1"] && <FaqSection title="Concepts FAQs" faqs={CONCEPTS_FAQS} />}
        </SiteWidth>
      </section>
    </Layout>
  );
};

export default FAQ;
