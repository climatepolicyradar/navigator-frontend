import { Meta, StoryObj } from "@storybook/react/*";
import { SlideOut } from "./SlideOut";

const meta = {
  title: "Atoms/SlideOut",
  component: SlideOut,
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof SlideOut>;
type Story = StoryObj<typeof SlideOut>;

export default meta;

export const Default: Story = {
  args: {
    children: "SlideOut children",
  },
};
