import { Meta, StoryObj } from "@storybook/nextjs";

import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    className: { control: "text" },
  },
} satisfies Meta<typeof Badge>;
type TStory = StoryObj<typeof Badge>;

export default meta;

export const Medium: TStory = {
  args: {
    children: "Beta",
    className: "",
    size: "medium",
  },
};

export const Small: TStory = {
  args: {
    children: "Beta",
    className: "",
    size: "small",
  },
};
