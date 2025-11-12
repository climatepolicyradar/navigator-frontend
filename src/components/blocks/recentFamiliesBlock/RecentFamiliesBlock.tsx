import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { useText } from "@/hooks/useText";
import { GeographyV2, TCategorySummary } from "@/types";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

export interface IProps {
  categorySummaries: TCategorySummary[];
  onAccordionClick?: (id: string) => void;
  geography: GeographyV2;
}

export const RecentFamiliesBlock = ({ categorySummaries, onAccordionClick, geography }: IProps) => {
  const { getText } = useText();
  const [expandedCategory, setExpandedCategory] = useState(categorySummaries[0].title);

  const hideAccordion = categorySummaries.length === 1 && categorySummaries[0].title === "All";

  const onAccordionInteract = (interactedCategory: string, id: string) => {
    setExpandedCategory((currentCategory) => {
      const isOpening = interactedCategory !== currentCategory;

      if (isOpening) onAccordionClick(id);
      return isOpening ? interactedCategory : "";
    });
  };

  return (
    <Section block="recents" title={getText("recentFamiliesBlockTitle")} wide>
      <div className="col-start-1 -col-end-1">
        {categorySummaries.map((category) => (
          <RecentFamiliesCategory
            key={category.title}
            categorySummary={category}
            showAccordion={!hideAccordion}
            isExpanded={expandedCategory === category.title}
            onAccordionClick={() => onAccordionInteract(category.title, category.id)}
            geography={geography}
          />
        ))}
      </div>
    </Section>
  );
};
