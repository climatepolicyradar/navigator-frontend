import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TTutorialContext, TutorialContext } from "@/context/TutorialContext";
import { TUTORIAL_STUB } from "@/stubs/tutorialStub";
import { TTutorialName, TUTORIAL_NAMES } from "@/types";

import { TutorialBanner } from "./TutorialBanner";

const meta = {
  title: "Molecules/Tutorials/TutorialBanner",
  component: TutorialBanner,
  argTypes: {},
} satisfies Meta<typeof TutorialBanner>;
type TStory = StoryObj<typeof TutorialBanner>;

export default meta;

const useTutorialContext = ({ ...props }: React.ComponentProps<typeof TutorialBanner>) => {
  const value: TTutorialContext = {
    displayTutorial: null,
    setDisplayTutorial: (name: TTutorialName) => console.info("setDisplayTutorial", name),
    completedTutorials: [],
    addCompletedTutorial: (name: TTutorialName) => console.info("addCompletedTutorial", name),
    removeCompletedTutorial: () => {},
  };

  return (
    <TutorialContext.Provider value={value}>
      <TutorialBanner {...props} />
    </TutorialContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    name: TUTORIAL_NAMES[0],
    banner: TUTORIAL_STUB.banner,
  },
  render: useTutorialContext,
};
