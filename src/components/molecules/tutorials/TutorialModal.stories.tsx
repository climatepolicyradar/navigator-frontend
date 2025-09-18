import { Meta, StoryObj } from "@storybook/nextjs";

import { TUTORIALS } from "@/constants/tutorials";

import { TutorialModal } from "./TutorialModal";

const meta = {
  title: "Molecules/Tutorials/TutorialModal",
  component: TutorialModal,
  argTypes: {},
} satisfies Meta<typeof TutorialModal>;
type TStory = StoryObj<typeof TutorialModal>;

export default meta;

export const KnowledgeGraph: TStory = {
  args: {
    name: "knowledgeGraph",
    modal: {
      ...TUTORIALS.knowledgeGraph.modal,
      defaultOpen: true,
    },
  },
};

export const Litigation: TStory = {
  args: {
    name: "climateLitigationDatabase",
    modal: TUTORIALS.climateLitigationDatabase.modal,
  },
};
