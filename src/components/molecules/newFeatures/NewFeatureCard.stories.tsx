import { Meta, StoryObj } from "@storybook/nextjs";

import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";

import { NewFeatureCard } from "./NewFeatureCard";

const meta = {
  title: "Molecules/New Featurees/NewFeatureCard",
  component: NewFeatureCard,
  argTypes: {},
} satisfies Meta<typeof NewFeatureCard>;
type TStory = StoryObj<typeof NewFeatureCard>;

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
      <NewFeatureCard newFeature={props.newFeature} />
    </NewFeatureContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    newFeature: NEW_FEATURES[0],
  },
  render: useNewFeatureContext,
};
