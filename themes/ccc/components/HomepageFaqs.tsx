import { FaqSection } from "@/components/FaqSection";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";

import { HOMEPAGE_FAQS } from "../constants/faqs";

export const HomepageFaqs = () => (
  <FiveColumns className="pt-15 gap-y-6">
    <p className="text-3xl font-semibold text-text-primary col-start-1 -col-end-1 cols5-4:col-start-2 cols5-4:col-end-4 cols5-5:col-start-1">
      Frequently Asked Questions
    </p>
    <div className="w-full text-text-secondary -col-end-1 col-start-1 cols5-4:col-start-4">
      <FaqSection faqs={HOMEPAGE_FAQS} showMore={true} openFirstOnLoad={false} bare />
    </div>
  </FiveColumns>
);
