import { Meta, StoryObj } from "@storybook/react/*";
import { Button } from "./NewButton";
import { DownloadIcon } from "@components/svg/Icons";
import { LuMoveUpRight } from "react-icons/lu";

const meta = {
  title: "New/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
type Story = StoryObj<typeof Button>;

export default meta;

export const Small: Story = {
  args: {
    children: "Small",
    color: "brand",
    disabled: false,
    size: "small",
    rounded: false,
    variant: "solid",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    color: "brand",
    disabled: false,
    size: "large",
    rounded: false,
    variant: "solid",
  },
};

export const Rounded: Story = {
  args: {
    children: "Rounded",
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "solid",
  },
};

export const Faded: Story = {
  args: {
    children: "Faded",
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "faded",
  },
};

export const Outlined: Story = {
  args: {
    children: "Outlined",
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "outlined",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "ghost",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    color: "brand",
    disabled: true,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const IconLeading: Story = {
  args: {
    children: (
      <>
        <DownloadIcon height="16" width="16" />
        <span className="ml-2">Download as PDF</span>
      </>
    ),
    color: "brand",
    disabled: false,
    size: "medium",
    rounded: false,
    variant: "solid",
  },
};

export const IconTrailing: Story = {
  args: {
    children: (
      <>
        <span>View source document</span>
        <LuMoveUpRight className="ml-2" height="16" width="16" />
      </>
    ),
    color: "mono",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "outlined",
  },
};
