import { Fragment } from "react";

import { Accordian } from "@/components/accordian/Accordian";
import { SingleCol } from "@/components/panels/SingleCol";
import { Heading } from "@/components/typography/Heading";
import { VerticalSpacing } from "@/components/utility/VerticalSpacing";

type TProps = {
  title: string;
  faqs: {
    id?: string;
    title: string;
    content: JSX.Element;
    headContent?: JSX.Element;
  }[];
  accordionMaxHeight?: string;
};

export const FaqSection = ({ title, faqs, accordionMaxHeight = "464px" }: TProps) => {
  return (
    <SingleCol>
      <Heading level={1} extraClasses="custom-header">
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
