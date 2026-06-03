import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Download, MoveUpRight, Search, X } from "lucide-react";

import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
type TStory = StoryObj<typeof Button>;

export default meta;

export const Medium: TStory = {
  args: {
    children: "Button",
    color: "brand",
    content: "text",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const Small: TStory = {
  args: {
    children: "Small",
    color: "brand",
    content: "text",
    disabled: false,
    size: "small",
    rounded: false,
    variant: "solid",
  },
};

export const Large: TStory = {
  args: {
    children: "Large",
    color: "brand",
    content: "text",
    disabled: false,
    size: "large",
    rounded: false,
    variant: "solid",
  },
};

export const Rounded: TStory = {
  args: {
    children: "Rounded",
    color: "brand",
    content: "text",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "solid",
  },
};

export const Faded: TStory = {
  args: {
    children: "Faded",
    color: "brand",
    content: "text",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "faded",
  },
};

export const Outlined: TStory = {
  args: {
    children: "Outlined",
    color: "mono",
    content: "text",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "outlined",
  },
};

export const Ghost: TStory = {
  args: {
    children: "Ghost",
    color: "mono",
    content: "text",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "ghost",
  },
};

export const Disabled: TStory = {
  args: {
    children: "Disabled",
    color: "brand",
    content: "text",
    disabled: true,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const IconAndText: TStory = {
  args: {
    color: "brand",
    content: "both",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
  argTypes: {
    children: { control: false },
  },
  render: ({ ...props }) => (
    <div className="flex flex-row gap-6">
      <Button {...props}>
        <Download width="16" height="16" />
        Download as PDF
      </Button>
      <Button {...props}>
        View source document
        <MoveUpRight className="ml-2" height="16" width="16" />
      </Button>
    </div>
  ),
};

export const IconOnly: TStory = {
  args: {
    children: <Search height="16" width="16" />,
    color: "brand",
    content: "icon",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "faded",
  },
  argTypes: {
    children: { control: false },
  },
};

export const Close: TStory = {
  args: {
    content: "icon",
    children: <X />,
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "ghost",
  },
  argTypes: {
    children: { control: false },
  },
};
