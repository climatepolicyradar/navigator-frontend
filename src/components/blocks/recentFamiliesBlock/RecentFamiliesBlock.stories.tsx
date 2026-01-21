import { Meta, StoryObj } from "@storybook/nextjs";

import { GeographiesContext } from "@/context/GeographiesContext";
import { CATEGORY_SUMMARY_STUB } from "@/stubs/categorySummarytStub";
import { GEOGRAPHY_V2_STUB } from "@/stubs/geographyV2Stub";
import { GeographyV2 } from "@/types";

import { RecentFamiliesBlock } from "./RecentFamiliesBlock";

const meta = {
  title: "Blocks/RecentFamiliesBlock",
  component: RecentFamiliesBlock,
  argTypes: {},
} satisfies Meta<typeof RecentFamiliesBlock>;
type TStory = StoryObj<typeof RecentFamiliesBlock>;

export default meta;

const GEOGRAPHIES: GeographyV2[] = [GEOGRAPHY_V2_STUB, ...GEOGRAPHY_V2_STUB.has_subconcept];

const useGeographiesContext = ({ ...props }: React.ComponentProps<typeof RecentFamiliesBlock>) => (
  <GeographiesContext.Provider value={GEOGRAPHIES}>
    <RecentFamiliesBlock {...props} />
  </GeographiesContext.Provider>
);

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
