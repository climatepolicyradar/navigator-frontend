import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { useText } from "@/hooks/useText";
import { TCategorySummary, TSearchLabel } from "@/types";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

interface IProps {
  categorySummaries: TCategorySummary[];
  onAccordionClick?: (id: string) => void;
  geographyLabel: TSearchLabel;
}

export const RecentFamiliesBlock = ({ categorySummaries, onAccordionClick, geographyLabel }: IProps) => {
  const { getAppText } = useText();
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
    <Section block="recents" title={"Recent " + getAppText("familyPlural")} wide>
      <div className="col-start-1 -col-end-1">
        {categorySummaries.map((category) => (
          <RecentFamiliesCategory
            key={category.title}
            categorySummary={category}
            showAccordion={!hideAccordion}
            isExpanded={expandedCategory === category.title}
            onAccordionClick={() => onAccordionInteract(category.title, category.id)}
            geographyLabel={geographyLabel}
          />
        ))}
      </div>
    </Section>
  );
};
