import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TUTORIALS } from "@/constants/tutorials";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialName } from "@/types";

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
    setDisplayTutorial: (name: TTutorialName) => console.info("setDisplayTutorial", name),
    completedTutorials: [],
    // eslint-disable-next-line no-console
    addCompletedTutorial: (name: TTutorialName) => console.info("addCompletedTutorial", name),
  };

  return (
    <TutorialContext.Provider value={value}>
      <TutorialCard {...props} />
    </TutorialContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    name: "knowledgeGraph",
    card: TUTORIALS.knowledgeGraph.card,
  },
  render: useTutorialContext,
};
