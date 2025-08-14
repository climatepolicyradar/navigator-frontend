import { useState } from "react";

import { Section } from "@/components/molecules/section/Section";
import { categoryMap, TCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { TDocumentCategory } from "@/types";

import { RecentFamiliesCategory } from "./RecentFamiliesCategory";

interface IProps {
  documentCategories: TDocumentCategory[];
}

const TEST_CATEGORY_SUMMARY = {
  count: 21,
  families: [
    {
      family_date: "2025-08-13T12:59:10.003Z",
      family_name: "United States of America National Adaptation Plan. NAP1",
      family_slug: "x",
    },
    {
      family_date: "2025-08-13T12:59:10.003Z",
      family_name: "United States of America Nationally Determined Contribution. NDC3.0",
      family_slug: "x",
    },
    {
      family_date: "2025-08-13T12:59:10.003Z",
      family_name: "Submission of the United States - Elements for the Consideration of Outputs Component of the First Global Stocktake",
      family_slug: "x",
    },
    {
      family_date: "2025-08-13T12:59:10.003Z",
      family_name: "United States of America National Adaptation Plan. NAP1",
      family_slug: "x",
    },
  ],
  title: "Litigation",
  unit: ["Litigation document", "Litigation documents"],
} as unknown as TCategorySummary;

/**
 * TODO
 * - Set up data props and move test data to Storybook story
 * - Render one RecentFamiliesCategory per themeConfig.documentCategories
 * - Don't render category headings (no accordion) when documentCategories is ["All"]
 */

export const RecentFamiliesBlock = ({ documentCategories }: IProps) => {
  const [expandedCategories, setExpandedCategories] = useState(["Climate Finance Projects"]);

  const hideAccordion = documentCategories.length === 1 && documentCategories[0] === "All";

  const onAccordionInteract = (interactedCategory: string) => {
    setExpandedCategories((currentCategories) =>
      currentCategories.includes(interactedCategory)
        ? currentCategories.filter((cat) => cat !== interactedCategory)
        : [...currentCategories, interactedCategory]
    );
  };

  return (
    <Section id="section-recents" title="Recent documents">
      {Object.entries(categoryMap)
        .slice(1)
        .map(([category, summary]) => (
          <RecentFamiliesCategory
            key={summary.summaryCategory}
            categorySummary={{ count: 21, families: TEST_CATEGORY_SUMMARY.families, title: category, unit: summary.unit }}
            showAccordion={!hideAccordion}
            isExpanded={expandedCategories.includes(category)}
            onAccordionClick={() => onAccordionInteract(category)}
          />
        ))}
    </Section>
  );
};
