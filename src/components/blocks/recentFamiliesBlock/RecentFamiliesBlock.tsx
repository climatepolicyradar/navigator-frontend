import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { TCategorySummary } from "@/helpers/getFamilyCategorySummary";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

export interface IProps {
  categorySummaries: TCategorySummary[];
  onAccordionClick?: (id: string) => void;
}

export const RecentFamiliesBlock = ({ categorySummaries, onAccordionClick }: IProps) => {
  const [expandedCategories, setExpandedCategories] = useState([categorySummaries[0].title]);

  const hideAccordion = categorySummaries.length === 1 && categorySummaries[0].title === "All";

  // TODO once powered by search queries, only one should be open at a time
  const onAccordionInteract = (interactedCategory: string, id: string) => {
    setExpandedCategories((currentCategories) =>
      currentCategories.includes(interactedCategory)
        ? currentCategories.filter((cat) => cat !== interactedCategory)
        : [...currentCategories, interactedCategory]
    );
    onAccordionClick?.(id);
  };

  return (
    <Section id="section-recents" title="Recent documents">
      {categorySummaries.map((category) => (
        <RecentFamiliesCategory
          key={category.title}
          categorySummary={category}
          showAccordion={!hideAccordion}
          isExpanded={expandedCategories.includes(category.title)}
          onAccordionClick={() => onAccordionInteract(category.title, category.id)}
        />
      ))}
    </Section>
  );
};
