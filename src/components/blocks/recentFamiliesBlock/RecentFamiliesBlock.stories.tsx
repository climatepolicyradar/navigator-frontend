import { Meta, StoryObj } from "@storybook/nextjs";

import { GeographiesContext } from "@/context/GeographiesContext";
import { getFamilyCategorySummary, TCategorySummary } from "@/helpers/getFamilyCategorySummary";
import { GEOGRAPHY_SUMMARY_STUB } from "@/stubs/geographySummaryStub";
import { GEOGRAPHY_V2_STUB } from "@/stubs/geographyV2Stub";
import { GeographyV2, TDocumentCategory } from "@/types";

import { RecentFamiliesBlock, IProps } from "./RecentFamiliesBlock";

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

const GEOGRAPHIES: GeographyV2[] = [GEOGRAPHY_V2_STUB, ...GEOGRAPHY_V2_STUB.has_subconcept];

const categorySummaries: TCategorySummary[] = DOCUMENT_CATEGORIES.map((category) => getFamilyCategorySummary(GEOGRAPHY_SUMMARY_STUB, category));

const useGeographiesContext = ({ ...props }: IProps) => (
  <GeographiesContext.Provider value={GEOGRAPHIES}>
    <RecentFamiliesBlock {...props} />
  </GeographiesContext.Provider>
);

export const MultipleCategories: TStory = {
  args: {
    categorySummaries,
  },
  render: useGeographiesContext,
};

export const SingleCategory: TStory = {
  args: {
    categorySummaries: [categorySummaries[0]],
  },
  render: useGeographiesContext,
};
