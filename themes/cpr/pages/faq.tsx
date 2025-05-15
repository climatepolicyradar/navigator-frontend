import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { SubNav } from "@/components/nav/SubNav";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { FAQS, PLATFORM_FAQS } from "@/cpr/constants/faqs";
import { getFeatureFlags } from "@/utils/featureFlags";

interface IProps {
  featureFlags: Record<string, string | boolean>;
}

const FAQ: InferGetServerSidePropsType<typeof getServerSideProps> = ({ featureFlags = {} }: IProps) => {
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
          {featureFlags["concepts-v1"] === true && <FaqSection title="Concepts FAQs" faqs={CONCEPTS_FAQS} />}
        </SiteWidth>
      </section>
      <script id="feature-flags" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featureFlags) }} />
    </Layout>
  );
};

export default FAQ;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const featureFlags = await getFeatureFlags(context.req.cookies);

  return {
    props: {
      featureFlags: featureFlags || {},
    },
  };
};
