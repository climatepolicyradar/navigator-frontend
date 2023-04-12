import { AccordianItem } from "@cclw/components/AccordianItem";
import { FAQS } from "@cclw/constants/faqs";
import { Fragment } from "react";

const FAQ = () => {
  return (
    <section>
      <div className="text-content px-4 container mb-12">
        <h1 className="my-8">How to use this resource</h1>
        <p>Find information to help you get started with our resource.</p>

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
