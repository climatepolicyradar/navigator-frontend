import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;
type TStory = StoryObj<typeof Checkbox>;

export default meta;

export const Default: TStory = {
  args: {
    children: "Checkbox",
  },
};

export const Checked: TStory = {
  args: {
    checked: true,
    children: "Checkbox",
  },
};

export const Indeterminate: TStory = {
  args: {
    children: "Checkbox",
    indeterminate: true,
  },
};

export const Disabled: TStory = {
  args: {
    checked: true,
    children: "Checkbox",
    disabled: true,
  },
};
