import { Meta, StoryObj } from "@storybook/nextjs";

import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";

import { NewFeatureBanner, IProps } from "./NewFeatureBanner";

const meta = {
  title: "Molecules/New Features/NewFeatureBanner",
  component: NewFeatureBanner,
  argTypes: {},
} satisfies Meta<typeof NewFeatureBanner>;
type TStory = StoryObj<typeof NewFeatureBanner>;

export default meta;

const useNewFeatureContext = ({ ...props }: IProps) => {
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
      <NewFeatureBanner {...props} />
    </NewFeatureContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    order: NEW_FEATURES[0].order,
    banner: NEW_FEATURES[0].banner,
  },
  render: useNewFeatureContext,
};
