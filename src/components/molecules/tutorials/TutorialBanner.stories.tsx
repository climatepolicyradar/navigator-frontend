import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TUTORIALS } from "@/constants/tutorials";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialName } from "@/types";

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
    setDisplayTutorial: (name: TTutorialName) => console.info("setDisplayTutorial", name),
    completedTutorials: [],
    // eslint-disable-next-line no-console
    addCompletedTutorial: (name: TTutorialName) => console.info("addCompletedTutorial", name),
  };

  return (
    <TutorialContext.Provider value={value}>
      <TutorialBanner {...props} />
    </TutorialContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    name: "knowledgeGraph",
    banner: TUTORIALS.knowledgeGraph.banner,
  },
  render: useTutorialContext,
};
