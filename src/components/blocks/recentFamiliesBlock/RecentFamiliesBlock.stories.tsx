import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CATEGORY_SUMMARY_STUB } from "@/stubs/categorySummaryStub";
import { TSearchLabel } from "@/types";

import { RecentFamiliesBlock } from "./RecentFamiliesBlock";

const meta = {
  title: "Blocks/RecentFamiliesBlock",
  component: RecentFamiliesBlock,
  argTypes: {},
} satisfies Meta<typeof RecentFamiliesBlock>;
type TStory = StoryObj<typeof RecentFamiliesBlock>;

export default meta;

const REGION_LABEL: TSearchLabel = { id: "region::ECS", type: "region", value: "Europe & Central Asia", labels: [] };

const GEOGRAPHY_LABEL: TSearchLabel = {
  id: "country::GBR",
  type: "country",
  value: "United Kingdom",
  labels: [{ type: "subconcept_of", value: REGION_LABEL, timestamp: null, passages_id: null, count: null }],
};

export const MultipleCategories: TStory = {
  args: {
    categorySummaries: CATEGORY_SUMMARY_STUB,
    geographyLabel: GEOGRAPHY_LABEL,
  },
};

export const SingleCategory: TStory = {
  args: {
    categorySummaries: [CATEGORY_SUMMARY_STUB[0]],
    geographyLabel: GEOGRAPHY_LABEL,
  },
};
