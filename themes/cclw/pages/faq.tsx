import { APP_FAQS } from "@/cclw/constants/faqs";
import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { PLATFORM_FAQS, TOPICS_FAQS } from "@/constants/faqs";

const FAQ: React.FC = () => (
  <Layout
    title="FAQ"
    description="Find quick tips for how you can use this resource to explore national-level climate change laws and policies from across the world."
    theme="cclw"
  >
    <BreadCrumbs label={"Frequently asked questions"} />
    <section>
      <SiteWidth>
        <SingleCol>
          <div className="text-content mb-12">
            <Heading level={1} extraClasses="my-5">
              How to use this resource
            </Heading>
            <p>You can use this resource to:</p>
            <ul>
              <li>Search the full text of over 9000 laws, policies and UNFCCC submissions from every country.</li>
              <li>See exact matches and related phrases highlighted in the text.</li>
              <li>Find documents from all languages translated to English to increase accessibility.</li>
            </ul>
          </div>
        </SingleCol>

        <FaqSection title="FAQs" faqs={APP_FAQS} sectionId="faqs" />
        <FaqSection title="Platform FAQs" faqs={PLATFORM_FAQS} sectionId="platform-faqs" />
        <FaqSection title="Topics FAQs" faqs={TOPICS_FAQS} sectionId="topics-faqs" />
      </SiteWidth>
    </section>
  </Layout>
);

export default FAQ;
