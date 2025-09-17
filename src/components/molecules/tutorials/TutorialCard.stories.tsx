import { Meta, StoryObj } from "@storybook/nextjs";

import { TUTORIALS } from "@/constants/tutorials";
import { TutorialContext } from "@/context/TutorialContext";

import { TutorialCard, IProps } from "./TutorialCard";

const meta = {
  title: "Molecules/Tutorials/TutorialCard",
  component: TutorialCard,
  argTypes: {},
} satisfies Meta<typeof TutorialCard>;
type TStory = StoryObj<typeof TutorialCard>;

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
      <TutorialCard {...props} />
    </TutorialContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    card: TUTORIALS[0].card,
    order: TUTORIALS[0].order,
  },
  render: useTutorialContext,
};
