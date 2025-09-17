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
    modal: {
      ...TUTORIALS[0].modal,
      defaultOpen: true,
    },
    order: TUTORIALS[0].order,
  },
};

export const Litigation: TStory = {
  args: {
    modal: TUTORIALS[1].modal,
    order: TUTORIALS[1].order,
  },
};
