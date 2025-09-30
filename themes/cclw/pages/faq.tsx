import { Fragment, useContext } from "react";

import { AccordionItem } from "@/cclw/components/AccordionItem";
import { FAQS } from "@/cclw/constants/faqs";
import FaqSection from "@/components/FaqSection";
import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import Layout from "@/components/layouts/Main";
import { SingleCol } from "@/components/panels/SingleCol";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { Heading } from "@/components/typography/Heading";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { ThemePageFeaturesContext } from "@/context/ThemePageFeaturesContext";
import { isKnowledgeGraphEnabled } from "@/utils/features";

const FAQ: React.FC = () => {
  const { featureFlags, themeConfig } = useContext(ThemePageFeaturesContext);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  return (
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
                <li>Search the full text of over 5000 laws, policies and UNFCCC submissions from every country.</li>
                <li>See exact matches and related phrases highlighted in the text.</li>
                <li>Find documents from all languages translated to English to increase accessibility.</li>
              </ul>
              <p>Watch the video below to learn how to use this resource</p>
              <iframe
                height="315"
                src="https://www.youtube-nocookie.com/embed/QvM2RybWhMM"
                title="Learn how to use Climate Laws of the World"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>

            <div className="text-content mb-12">
              <Heading level={2}>FAQs</Heading>
              {FAQS.map((faq, i) => (
                <Fragment key={faq.title}>
                  <AccordionItem id={faq.id} title={faq.title} startOpen={i === 0}>
                    {faq.content}
                  </AccordionItem>
                  <hr />
                </Fragment>
              ))}
            </div>
          </SingleCol>

          {knowledgeGraphEnabled && <FaqSection title="Topics FAQs" faqs={CONCEPTS_FAQS} sectionId={"topics-faqs"} />}
        </SiteWidth>
      </section>
    </Layout>
  );
};
export default FAQ;
