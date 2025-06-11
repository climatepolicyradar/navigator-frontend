import { Meta, StoryObj } from "@storybook/react";

import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";

import { NewFeatureBanner } from "./NewFeatureBanner";

const meta = {
  title: "Molecules/New Featurees/NewFeatureBanner",
  component: NewFeatureBanner,
  argTypes: {},
} satisfies Meta<typeof NewFeatureBanner>;
type TStory = StoryObj<typeof NewFeatureBanner>;

export default meta;

const useNewFeatureContext = ({ ...props }) => {
  const value = {
    displayNewFeature: null,
    // eslint-disable-next-line no-console
    setDisplayNewFeature: (order: number) => console.info("setDisplayNewFeature", order),
    previousNewFeature: -1,
    // eslint-disable-next-line no-console
    setPreviousNewFeature: (order: number) => console.info("setPreviousNewFeature", order),
  };

  return (
    <NewFeatureContext.Provider value={value}>
      <NewFeatureBanner newFeature={props.newFeature} />
    </NewFeatureContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    newFeature: NEW_FEATURES[0],
  },
  render: useNewFeatureContext,
};
