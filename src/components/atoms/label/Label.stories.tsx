import { Meta, StoryObj } from "@storybook/nextjs";

import { Label } from "./Label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Label>;
type TStory = StoryObj<typeof Label>;

export default meta;

export const Default: TStory = {
  args: {
    children: "Net-zero target",
  },
};
