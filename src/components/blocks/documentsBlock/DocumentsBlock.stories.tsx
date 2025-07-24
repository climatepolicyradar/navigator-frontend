import { Meta, StoryObj } from "@storybook/react";

import { TFamilyPage } from "@/types";

import { DocumentsBlock } from "./DocumentsBlock";

const meta = {
  title: "Blocks/DocumentsBlock",
  component: DocumentsBlock,
  argTypes: {},
} satisfies Meta<typeof DocumentsBlock>;
type TStory = StoryObj<typeof DocumentsBlock>;

export default meta;

export const Default: TStory = {
  args: {
    documents: [],
    family: {} as TFamilyPage,
    status: "success",
  },
};
