import { Fragment } from "react";
import { AccordianItem } from "@cclw/components/AccordianItem";
import Instructions from "@cclw/components/Instructions";
import { FAQS } from "@cclw/constants/faqs";

const FAQ = () => {
  return (
    <section>
      <div className="text-content px-4 container mb-12">
        <h1 className="my-8">How to use this resource</h1>
        <p>Find information to help you get started with our resource.</p>
      </div>

      <div className="gradient-container py-8 mb-12 text-white">
        <Instructions isFAQ />
      </div>

      <div className="text-content px-4 container mb-12">
        <h2 className="my-6">FAQs</h2>

        {FAQS.map((faq, i) => (
          <Fragment key={faq.title}>
            <AccordianItem title={faq.title} startOpen={i === 0}>
              {faq.content}
            </AccordianItem>
            <hr />
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
