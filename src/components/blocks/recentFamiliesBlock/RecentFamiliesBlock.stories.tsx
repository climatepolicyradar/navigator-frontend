import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CATEGORY_SUMMARY_STUB } from "@/stubs/categorySummaryStub";
import { createLabel } from "@/utils/links/getGeoSearchLink";

import { RecentFamiliesBlock } from "./RecentFamiliesBlock";

const meta = {
  title: "Blocks/RecentFamiliesBlock",
  component: RecentFamiliesBlock,
  argTypes: {},
} satisfies Meta<typeof RecentFamiliesBlock>;
type TStory = StoryObj<typeof RecentFamiliesBlock>;

export default meta;

const GEOGRAPHY_PATH = [createLabel("country::GBR"), createLabel("region::ECS")];

export const MultipleCategories: TStory = {
  args: {
    categorySummaries: CATEGORY_SUMMARY_STUB,
    geographyPath: GEOGRAPHY_PATH,
  },
};

export const SingleCategory: TStory = {
  args: {
    categorySummaries: [CATEGORY_SUMMARY_STUB[0]],
    geographyPath: GEOGRAPHY_PATH,
  },
};
