import { Icon } from "@components/atoms/icon/Icon";
import { Meta, StoryObj } from "@storybook/react/*";
import { LuMoveUpRight } from "react-icons/lu";
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
type Story = StoryObj<typeof Button>;

export default meta;

export const Medium: Story = {
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

export const Small: Story = {
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

export const Large: Story = {
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

export const Rounded: Story = {
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

export const Faded: Story = {
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

export const Outlined: Story = {
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

export const Ghost: Story = {
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

export const Disabled: Story = {
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

export const IconAndText: Story = {
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
    content: { control: false },
  },
  render: ({ children, ...props }) => (
    <div className="flex flex-row gap-6">
      <Button {...props}>
        <Icon name="download" height="16" width="16" />
        Download as PDF
      </Button>
      <Button {...props}>
        View source document
        <LuMoveUpRight className="ml-2" height="16" width="16" />
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    children: <Icon name="search2" height="16" width="16" />,
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

export const Close: Story = {
  args: {
    content: "icon",
    children: <Icon name="close" />,
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
