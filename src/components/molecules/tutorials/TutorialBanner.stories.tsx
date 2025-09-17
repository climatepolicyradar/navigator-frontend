import { Meta, StoryObj } from "@storybook/nextjs";

import { TUTORIALS } from "@/constants/tutorials";
import { TutorialContext } from "@/context/TutorialContext";

import { TutorialBanner, IProps } from "./TutorialBanner";

const meta = {
  title: "Molecules/Tutorials/TutorialBanner",
  component: TutorialBanner,
  argTypes: {},
} satisfies Meta<typeof TutorialBanner>;
type TStory = StoryObj<typeof TutorialBanner>;

export default meta;

const useTutorialContext = ({ ...props }: IProps) => {
  const value = {
    displayTutorial: null,
    // eslint-disable-next-line no-console
    setDisplayTutorial: (order: number) => console.info("setDisplayTutorial", order),
    previousTutorial: -1,
    // eslint-disable-next-line no-console
    setPreviousTutorial: (order: number) => console.info("setPreviousTutorial", order),
  };

  return (
    <TutorialContext.Provider value={value}>
      <TutorialBanner {...props} />
    </TutorialContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    order: TUTORIALS[0].order,
    banner: TUTORIALS[0].banner,
  },
  render: useTutorialContext,
};
