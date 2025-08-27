import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { TCategorySummary } from "@/helpers/getFamilyCategorySummary";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

interface IProps {
  categorySummaries: TCategorySummary[];
}

export const RecentFamiliesBlock = ({ categorySummaries }: IProps) => {
  const [expandedCategories, setExpandedCategories] = useState([categorySummaries[0].title]);

  const hideAccordion = categorySummaries.length === 1 && categorySummaries[0].title === "All";

  // TODO once powered by search queries, only one should be open at a time
  const onAccordionInteract = (interactedCategory: string) => {
    setExpandedCategories((currentCategories) =>
      currentCategories.includes(interactedCategory)
        ? currentCategories.filter((cat) => cat !== interactedCategory)
        : [...currentCategories, interactedCategory]
    );
  };

  return (
    <Section id="section-recents" title="Recent documents">
      {categorySummaries.map((category) => (
        <RecentFamiliesCategory
          key={category.title}
          categorySummary={category}
          showAccordion={!hideAccordion}
          isExpanded={expandedCategories.includes(category.title)}
          onAccordionClick={() => onAccordionInteract(category.title)}
        />
      ))}
    </Section>
  );
};
