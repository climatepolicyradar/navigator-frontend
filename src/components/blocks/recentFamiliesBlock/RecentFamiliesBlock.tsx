import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { useText } from "@/hooks/useText";
import { GeographyV2, TCategorySummary, TSearchLabel } from "@/types";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

interface IProps {
  categorySummaries: TCategorySummary[];
  onAccordionClick?: (id: string) => void;
  geography: GeographyV2;
  geographyLabel: TSearchLabel | null;
}

export const RecentFamiliesBlock = ({ categorySummaries, onAccordionClick, geography, geographyLabel }: IProps) => {
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
            geography={geography}
            geographyLabel={geographyLabel}
          />
        ))}
      </div>
    </Section>
  );
};
