import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Checkbox>;
type TStory = StoryObj<typeof Checkbox>;

export default meta;

export const Default: TStory = {
  args: {
    label: "Checkbox",
  },
};

export const Checked: TStory = {
  args: {
    label: "Checkbox",
    checked: true,
  },
};

export const Indeterminate: TStory = {
  args: {
    label: "Checkbox",
    indeterminate: true,
  },
};

export const Disabled: TStory = {
  args: {
    label: "Checkbox",
    checked: true,
    disabled: true,
  },
};
