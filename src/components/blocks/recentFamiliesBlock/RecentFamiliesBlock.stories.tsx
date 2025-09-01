import { Meta, StoryObj } from "@storybook/react";

import { getFamilyCategorySummary, TCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { GEOGRAPHY_SUMMARY_STUB } from "@/stubs/geographySummaryStub";
import { TDocumentCategory } from "@/types";

import { RecentFamiliesBlock } from "./RecentFamiliesBlock";

const meta = {
  title: "Blocks/RecentFamiliesBlock",
  component: RecentFamiliesBlock,
  argTypes: {},
} satisfies Meta<typeof RecentFamiliesBlock>;
type TStory = StoryObj<typeof RecentFamiliesBlock>;

export default meta;

// Equivalent to themeConfig.documentCategories
const DOCUMENT_CATEGORIES: TDocumentCategory[] = [
  "All",
  "UNFCCC Submissions",
  "Laws",
  "Policies",
  "Climate Finance Projects",
  "Offshore Wind Reports",
  "Litigation",
];

const categorySummaries: TCategorySummary[] = DOCUMENT_CATEGORIES.map((category) => getFamilyCategorySummary(GEOGRAPHY_SUMMARY_STUB, category));

export const MultipleCategories: TStory = {
  args: {
    categorySummaries,
  },
};

export const SingleCategory: TStory = {
  args: {
    categorySummaries: [categorySummaries[0]],
  },
};
