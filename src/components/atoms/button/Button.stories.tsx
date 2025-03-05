import Close from "@components/buttons/Close";
import { Icon } from "@components/icon/Icon";
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
    icon: false,
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

export const IconLeading: Story = {
  args: {
    children: (
      <>
        <Icon name="download" height="16" width="16" />
        Download as PDF
      </>
    ),
    color: "brand",
    content: "both",
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
        View source document
        <LuMoveUpRight className="ml-2" height="16" width="16" />
      </>
    ),
    color: "mono",
    content: "both",
    disabled: false,
    size: "medium",
    rounded: true,
    variant: "outlined",
  },
};

/**
 * Render all existing instances of button components.
 * This story will be removed once buttons have been reworked and consolidated.
 */

type ButtonUsage = {
  component: string;
  filepath: string;
  usage: React.ReactNode;
};

const onClick = () => {};
const buttonUsage: ButtonUsage[] = [
  {
    component: "Close",
    filepath: "src/components/drawer/Drawer.tsx",
    usage: <Close onClick={onClick} size="14" />,
  },
  {
    component: "Close",
    filepath: "themes/cpr/components/LandingSearchForm.tsx",
    usage: <Close onClick={onClick} size="16" />,
  },
  {
    component: "Close",
    filepath: "src/components/modals/Popup.tsx",
    usage: <Close onClick={onClick} size="20" />,
  },
];

export const ExistingButtonUsage: Story = {
  argTypes: {
    children: { control: false },
    color: { control: false },
    disabled: { control: false },
    rounded: { control: false },
    size: { control: false },
    variant: { control: false },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-10 p-8">
      <p className="font-bold text-xl">Usage</p>
      <p className="font-bold text-xl">Component</p>
      <p className="font-bold text-xl">Filepath</p>
      {buttonUsage.map(({ component, filepath, usage }) => (
        <>
          <div>
            <div className="inline-block">{usage}</div>
          </div>
          <span>{component}</span>
          <span>{filepath}</span>
        </>
      ))}
    </div>
  ),
};
