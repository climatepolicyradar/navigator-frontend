import { Meta, StoryObj } from "@storybook/react";

import { LATEST_FEATURE } from "@/constants/newFeatures";

import { NewFeatureBanner } from "./NewFeatureBanner";

const meta = {
  title: "Molecules/New Featurees/NewFeatureBanner",
  component: NewFeatureBanner,
  argTypes: {},
} satisfies Meta<typeof NewFeatureBanner>;
type TStory = StoryObj<typeof NewFeatureBanner>;

export default meta;

export const Default: TStory = {
  args: {
    newFeature: LATEST_FEATURE,
  },
};
