import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TARGETS_STUB } from "@/stubs/targetsStub";

import { TargetsBlock } from "./TargetsBlock";

const meta = {
  title: "Blocks/TargetsBlock",
  component: TargetsBlock,
  argTypes: {},
} satisfies Meta<typeof TargetsBlock>;
type TStory = StoryObj<typeof TargetsBlock>;

export default meta;

export const Default: TStory = {
  args: {
    targets: TARGETS_STUB,
  },
};
