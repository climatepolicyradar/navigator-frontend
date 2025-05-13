import { Fragment } from "react";

import Layout from "@/components/layouts/Main";
import { SiteWidth } from "@/components/panels/SiteWidth";
import { SingleCol } from "@/components/panels/SingleCol";
import { SubNav } from "@/components/nav/SubNav";

import { BreadCrumbs } from "@/components/breadcrumbs/Breadcrumbs";
import { AccordianItem } from "@/cclw/components/AccordianItem";

import { Heading } from "@/components/typography/Heading";

import { FAQS } from "@/cclw/constants/faqs";
import { CONCEPTS_FAQS } from "@/constants/conceptsFaqs";
import { getFeatureFlags } from "@/utils/featureFlags";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

interface IProps {
  featureFlags: Record<string, string | boolean>;
}

const FAQ: InferGetServerSidePropsType<typeof getServerSideProps> = ({ featureFlags = {} }: IProps) => {
  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use this resource to explore national-level climate change laws and policies from across the world."
    >
      <SubNav>
        <BreadCrumbs label={"Frequently asked questions"} />
      </SubNav>
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
                  <AccordianItem id={faq.id} title={faq.title} startOpen={i === 0}>
                    {faq.content}
                  </AccordianItem>
                  <hr />
                </Fragment>
              ))}
            </div>
          </SingleCol>

          {featureFlags["concepts-v1"] === true && (
            <SingleCol>
              <div className="text-content mb-12">
                <Heading level={2}>Concepts FAQs</Heading>
                {CONCEPTS_FAQS.map((faq, i) => (
                  <Fragment key={faq.title}>
                    <AccordianItem id={faq.id} title={faq.title} headContent={faq.headContent ?? null} startOpen={i === 0}>
                      {faq.content}
                    </AccordianItem>
                    <hr />
                  </Fragment>
                ))}
              </div>
            </SingleCol>
          )}
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
