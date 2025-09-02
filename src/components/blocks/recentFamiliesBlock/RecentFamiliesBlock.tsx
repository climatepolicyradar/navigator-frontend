import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { TCategorySummary } from "@/helpers/getFamilyCategorySummary";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

interface IProps {
  categorySummaries: TCategorySummary[];
  geographySlug: string;
}

export const RecentFamiliesBlock = ({ categorySummaries, geographySlug }: IProps) => {
  const [expandedCategory, setExpandedCategory] = useState(categorySummaries[0].title);

  const hideAccordion = categorySummaries.length === 1 && categorySummaries[0].title === "All";

  // TODO once powered by search queries, only one should be open at a time
  const onAccordionInteract = (interactedCategory: string) => {
    setExpandedCategory((currentCategory) => (currentCategory === interactedCategory ? "" : interactedCategory));
  };

  return (
    <Section id="section-recents" title="Recent documents">
      {categorySummaries.map((category) => (
        <RecentFamiliesCategory
          key={category.title}
          categorySummary={category}
          showAccordion={!hideAccordion}
          isExpanded={expandedCategory === category.title}
          onAccordionClick={() => onAccordionInteract(category.title)}
          geographySlug={geographySlug}
        />
      ))}
    </Section>
  );
};
