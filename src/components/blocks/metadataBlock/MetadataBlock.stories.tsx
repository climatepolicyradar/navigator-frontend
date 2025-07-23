import { Meta, StoryObj } from "@storybook/react";

import { MetadataBlock } from "./MetadataBlock";

const meta = {
  title: "Blocks/MetadataBlock",
  component: MetadataBlock,
  argTypes: {},
} satisfies Meta<typeof MetadataBlock>;

type TStory = StoryObj<typeof MetadataBlock>;

export default meta;

export const Default: TStory = {
  args: {},
};
