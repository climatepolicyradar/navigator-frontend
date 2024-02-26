import { Fragment } from "react";
import Layout from "@components/layouts/Main";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import { AccordianItem } from "@cclw/components/AccordianItem";
import { FAQS } from "@cclw/constants/faqs";

const FAQ = () => {
  return (
    <Layout
      title="FAQ"
      description="Find quick tips for how you can use this resource to explore national-level climate change laws and policies from across the world."
    >
      <section>
        <div className="container px-4">
          <BreadCrumbs label={"Frequently asked questions"} />
          <div className="text-content mb-12">
            <h1 className="my-8">How to use this resource</h1>
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
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] lg:w-2/3"
            ></iframe>
          </div>

          <div className="text-content px-4 container mb-12">
            <h2 className="my-6">FAQs</h2>
            {FAQS.map((faq, i) => (
              <Fragment key={faq.title}>
                <AccordianItem id={faq.id} title={faq.title} startOpen={i === 0}>
                  {faq.content}
                </AccordianItem>
                <hr />
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default FAQ;
