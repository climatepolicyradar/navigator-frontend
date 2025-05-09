import { Meta, StoryObj } from "@storybook/react/*";
import { Button } from "../button/Button";
import { Popover } from "./Popover";

const meta = {
  title: "Atoms/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  argTypes: {
    children: { control: "text" },
    onOpenChange: { control: false },
    trigger: { control: false },
  },
} satisfies Meta<typeof Popover>;
type Story = StoryObj<typeof Popover>;

export default meta;

export const Generic: Story = {
  args: {
    children: "Hello, I am a popover!",
    openOnHover: false,
    trigger: <Button>Trigger</Button>,
  },
};
