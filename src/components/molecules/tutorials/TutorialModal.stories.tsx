import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DEFAULT_FEATURES } from "@/constants/features";
import { TUTORIALS } from "@/constants/tutorials";
import { TTutorialContext, TutorialContext } from "@/context/TutorialContext";
import { TUTORIAL_STUB } from "@/stubs/tutorialStub";
import { TTutorialName, TUTORIAL_NAMES } from "@/types";

import { TutorialModal } from "./TutorialModal";

const meta = {
  title: "Molecules/Tutorials/TutorialModal",
  component: TutorialModal,
  argTypes: {},
} satisfies Meta<typeof TutorialModal>;
type TStory = StoryObj<typeof TutorialModal>;

export default meta;

const useTutorialContext = ({ ...props }: React.ComponentProps<typeof TutorialModal>) => {
  const value: TTutorialContext = {
    displayTutorial: props.name,
    setDisplayTutorial: (name: TTutorialName | null) => console.info("setDisplayTutorial", name),
    completedTutorials: [],
    addCompletedTutorial: (name: TTutorialName) => console.info("addCompletedTutorial", name),
    removeCompletedTutorial: () => {},
  };

  return (
    <TutorialContext.Provider value={value}>
      <TutorialModal {...props} />
    </TutorialContext.Provider>
  );
};

export const KnowledgeGraph: TStory = {
  args: {
    name: TUTORIAL_NAMES[0],
    modal: {
      ...TUTORIAL_STUB.modal,
      defaultOpen: true,
    },
    features: DEFAULT_FEATURES,
  },
  render: useTutorialContext,
};

export const Litigation: TStory = {
  args: {
    name: "climateLitigationDatabase",
    modal: TUTORIALS.climateLitigationDatabase.modal,
    features: DEFAULT_FEATURES,
  },
  render: useTutorialContext,
};
