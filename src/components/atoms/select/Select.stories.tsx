import { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Select } from "./Select";

const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

const meta = {
  title: "Atoms/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>;
type TStory = StoryObj<typeof Select>;

export default meta;

export const Default: TStory = {
  args: {
    options: OPTIONS,
  },
};

export const WithDefaultValue: TStory = {
  args: {
    options: OPTIONS,
    defaultValue: "b",
  },
};

export const Empty: TStory = {
  args: {
    options: [],
  },
};

export const WithPlaceholder: TStory = {
  args: {
    options: OPTIONS,
    placeholder: "Placeholder example",
  },
};
