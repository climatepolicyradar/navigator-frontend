import { Fragment } from "react";
import { AccordianItem } from "@cclw/components/AccordianItem";
import { FAQS } from "@cclw/constants/faqs";

const FAQ = () => {
  return (
    <section>
      <div className="text-content px-4 container mb-12">
        <h1 className="my-8">How to use this resource</h1>
        <p>You can use this resource to:</p>
        <ul>
          <li>Search 3500+ climate law and policy documents from every country</li>
          <li>See exact matches and related phrases highlighted in the text</li>
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
    </section>
  );
};

export default FAQ;
