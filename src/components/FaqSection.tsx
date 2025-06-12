import { Fragment, useEffect } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";
import { VerticalSpacing } from "@/components/utility/VerticalSpacing";

interface IProps {
  title: string;
  faqs: {
    id?: string;
    title: string;
    content: JSX.Element;
    headContent?: JSX.Element;
  }[];
  accordionMaxHeight?: string;
  sectionId?: string;
}

export const FaqSection = ({ title, faqs, accordionMaxHeight = "464px", sectionId = "" }: IProps) => {
  useEffect(() => {
    // Only run if this component has an ID (meaning it's the target component)
    if (!sectionId) return;

    const hash = window.location.hash.substring(1);

    if (hash === sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }, [sectionId]);

  return (
    <SingleCol>
      <Heading level={1} extraClasses="custom-header" id={sectionId}>
        {title}
      </Heading>
      <VerticalSpacing size="md" />
      <div className="text-content mb-14">
        {faqs.map((faq, index) => (
          <Fragment key={faq.title}>
            <Accordian title={faq.title} headContent={faq.headContent ?? null} open={index === 0} fixedHeight={accordionMaxHeight}>
              {faq.content}
            </Accordian>
            <hr />
          </Fragment>
        ))}
      </div>
    </SingleCol>
  );
};

export default FaqSection;
