import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LabelButton } from "./LabelButton";

const meta = {
  title: "Atoms/LabelButton",
  component: LabelButton,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof LabelButton>;
type TStory = StoryObj<typeof LabelButton>;

export default meta;

export const Default: TStory = {
  args: {
    children: "Net-zero target",
  },
};
