import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CATEGORY_SUMMARY_STUB } from "@/stubs/categorySummaryStub";
import { GeographyV2 } from "@/types";

import { RecentFamiliesBlock } from "./RecentFamiliesBlock";

const meta = {
  title: "Blocks/RecentFamiliesBlock",
  component: RecentFamiliesBlock,
  argTypes: {},
} satisfies Meta<typeof RecentFamiliesBlock>;
type TStory = StoryObj<typeof RecentFamiliesBlock>;

export default meta;

const useGeographiesContext = ({ ...props }: React.ComponentProps<typeof RecentFamiliesBlock>) => <RecentFamiliesBlock {...props} />;

export const MultipleCategories: TStory = {
  args: {
    categorySummaries: CATEGORY_SUMMARY_STUB,
    geography: { slug: "united-kingdom" } as GeographyV2,
  },
  render: useGeographiesContext,
};

export const SingleCategory: TStory = {
  args: {
    categorySummaries: [CATEGORY_SUMMARY_STUB[0]],
    geography: { slug: "united-kingdom" } as GeographyV2,
  },
  render: useGeographiesContext,
};
